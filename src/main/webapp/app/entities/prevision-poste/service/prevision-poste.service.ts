import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPrevisionPoste, NewPrevisionPoste } from '../prevision-poste.model';

export type PartialUpdatePrevisionPoste = Partial<IPrevisionPoste> & Pick<IPrevisionPoste, 'id'>;

type RestOf<T extends IPrevisionPoste | NewPrevisionPoste> = Omit<T, 'dateAjout'> & {
  dateAjout?: string | null;
};

export type RestPrevisionPoste = RestOf<IPrevisionPoste>;

export type NewRestPrevisionPoste = RestOf<NewPrevisionPoste>;

export type PartialUpdateRestPrevisionPoste = RestOf<PartialUpdatePrevisionPoste>;

export type EntityResponseType = HttpResponse<IPrevisionPoste>;
export type EntityArrayResponseType = HttpResponse<IPrevisionPoste[]>;

@Injectable({ providedIn: 'root' })
export class PrevisionPosteService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/prevision-postes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(previsionPoste: NewPrevisionPoste): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(previsionPoste);
    return this.http
      .post<RestPrevisionPoste>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(previsionPoste: IPrevisionPoste): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(previsionPoste);
    return this.http
      .put<RestPrevisionPoste>(`${this.resourceUrl}/${this.getPrevisionPosteIdentifier(previsionPoste)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(previsionPoste: PartialUpdatePrevisionPoste): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(previsionPoste);
    return this.http
      .patch<RestPrevisionPoste>(`${this.resourceUrl}/${this.getPrevisionPosteIdentifier(previsionPoste)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestPrevisionPoste>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPrevisionPoste[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPrevisionPosteIdentifier(previsionPoste: Pick<IPrevisionPoste, 'id'>): number {
    return previsionPoste.id;
  }

  comparePrevisionPoste(o1: Pick<IPrevisionPoste, 'id'> | null, o2: Pick<IPrevisionPoste, 'id'> | null): boolean {
    return o1 && o2 ? this.getPrevisionPosteIdentifier(o1) === this.getPrevisionPosteIdentifier(o2) : o1 === o2;
  }

  addPrevisionPosteToCollectionIfMissing<Type extends Pick<IPrevisionPoste, 'id'>>(
    previsionPosteCollection: Type[],
    ...previsionPostesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const previsionPostes: Type[] = previsionPostesToCheck.filter(isPresent);
    if (previsionPostes.length > 0) {
      const previsionPosteCollectionIdentifiers = previsionPosteCollection.map(
        previsionPosteItem => this.getPrevisionPosteIdentifier(previsionPosteItem)!
      );
      const previsionPostesToAdd = previsionPostes.filter(previsionPosteItem => {
        const previsionPosteIdentifier = this.getPrevisionPosteIdentifier(previsionPosteItem);
        if (previsionPosteCollectionIdentifiers.includes(previsionPosteIdentifier)) {
          return false;
        }
        previsionPosteCollectionIdentifiers.push(previsionPosteIdentifier);
        return true;
      });
      return [...previsionPostesToAdd, ...previsionPosteCollection];
    }
    return previsionPosteCollection;
  }

  protected convertDateFromClient<T extends IPrevisionPoste | NewPrevisionPoste | PartialUpdatePrevisionPoste>(
    previsionPoste: T
  ): RestOf<T> {
    return {
      ...previsionPoste,
      dateAjout: previsionPoste.dateAjout?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restPrevisionPoste: RestPrevisionPoste): IPrevisionPoste {
    return {
      ...restPrevisionPoste,
      dateAjout: restPrevisionPoste.dateAjout ? dayjs(restPrevisionPoste.dateAjout) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestPrevisionPoste>): HttpResponse<IPrevisionPoste> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestPrevisionPoste[]>): HttpResponse<IPrevisionPoste[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
