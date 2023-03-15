import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPrevision, NewPrevision } from '../prevision.model';

export type PartialUpdatePrevision = Partial<IPrevision> & Pick<IPrevision, 'id'>;

type RestOf<T extends IPrevision | NewPrevision> = Omit<T, 'dateAjout'> & {
  dateAjout?: string | null;
};

export type RestPrevision = RestOf<IPrevision>;

export type NewRestPrevision = RestOf<NewPrevision>;

export type PartialUpdateRestPrevision = RestOf<PartialUpdatePrevision>;

export type EntityResponseType = HttpResponse<IPrevision>;
export type EntityArrayResponseType = HttpResponse<IPrevision[]>;

@Injectable({ providedIn: 'root' })
export class PrevisionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/previsions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(prevision: NewPrevision): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(prevision);
    return this.http
      .post<RestPrevision>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(prevision: IPrevision): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(prevision);
    return this.http
      .put<RestPrevision>(`${this.resourceUrl}/${this.getPrevisionIdentifier(prevision)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(prevision: PartialUpdatePrevision): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(prevision);
    return this.http
      .patch<RestPrevision>(`${this.resourceUrl}/${this.getPrevisionIdentifier(prevision)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestPrevision>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPrevision[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPrevisionIdentifier(prevision: Pick<IPrevision, 'id'>): number {
    return prevision.id;
  }

  comparePrevision(o1: Pick<IPrevision, 'id'> | null, o2: Pick<IPrevision, 'id'> | null): boolean {
    return o1 && o2 ? this.getPrevisionIdentifier(o1) === this.getPrevisionIdentifier(o2) : o1 === o2;
  }

  addPrevisionToCollectionIfMissing<Type extends Pick<IPrevision, 'id'>>(
    previsionCollection: Type[],
    ...previsionsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const previsions: Type[] = previsionsToCheck.filter(isPresent);
    if (previsions.length > 0) {
      const previsionCollectionIdentifiers = previsionCollection.map(previsionItem => this.getPrevisionIdentifier(previsionItem)!);
      const previsionsToAdd = previsions.filter(previsionItem => {
        const previsionIdentifier = this.getPrevisionIdentifier(previsionItem);
        if (previsionCollectionIdentifiers.includes(previsionIdentifier)) {
          return false;
        }
        previsionCollectionIdentifiers.push(previsionIdentifier);
        return true;
      });
      return [...previsionsToAdd, ...previsionCollection];
    }
    return previsionCollection;
  }

  protected convertDateFromClient<T extends IPrevision | NewPrevision | PartialUpdatePrevision>(prevision: T): RestOf<T> {
    return {
      ...prevision,
      dateAjout: prevision.dateAjout?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restPrevision: RestPrevision): IPrevision {
    return {
      ...restPrevision,
      dateAjout: restPrevision.dateAjout ? dayjs(restPrevision.dateAjout) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestPrevision>): HttpResponse<IPrevision> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestPrevision[]>): HttpResponse<IPrevision[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
