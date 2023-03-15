import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAccord, NewAccord } from '../accord.model';

export type PartialUpdateAccord = Partial<IAccord> & Pick<IAccord, 'id'>;

type RestOf<T extends IAccord | NewAccord> = Omit<T, 'dateArrivee'> & {
  dateArrivee?: string | null;
};

export type RestAccord = RestOf<IAccord>;

export type NewRestAccord = RestOf<NewAccord>;

export type PartialUpdateRestAccord = RestOf<PartialUpdateAccord>;

export type EntityResponseType = HttpResponse<IAccord>;
export type EntityArrayResponseType = HttpResponse<IAccord[]>;

@Injectable({ providedIn: 'root' })
export class AccordService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/accords');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(accord: NewAccord): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(accord);
    return this.http
      .post<RestAccord>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(accord: IAccord): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(accord);
    return this.http
      .put<RestAccord>(`${this.resourceUrl}/${this.getAccordIdentifier(accord)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(accord: PartialUpdateAccord): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(accord);
    return this.http
      .patch<RestAccord>(`${this.resourceUrl}/${this.getAccordIdentifier(accord)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestAccord>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestAccord[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAccordIdentifier(accord: Pick<IAccord, 'id'>): number {
    return accord.id;
  }

  compareAccord(o1: Pick<IAccord, 'id'> | null, o2: Pick<IAccord, 'id'> | null): boolean {
    return o1 && o2 ? this.getAccordIdentifier(o1) === this.getAccordIdentifier(o2) : o1 === o2;
  }

  addAccordToCollectionIfMissing<Type extends Pick<IAccord, 'id'>>(
    accordCollection: Type[],
    ...accordsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const accords: Type[] = accordsToCheck.filter(isPresent);
    if (accords.length > 0) {
      const accordCollectionIdentifiers = accordCollection.map(accordItem => this.getAccordIdentifier(accordItem)!);
      const accordsToAdd = accords.filter(accordItem => {
        const accordIdentifier = this.getAccordIdentifier(accordItem);
        if (accordCollectionIdentifiers.includes(accordIdentifier)) {
          return false;
        }
        accordCollectionIdentifiers.push(accordIdentifier);
        return true;
      });
      return [...accordsToAdd, ...accordCollection];
    }
    return accordCollection;
  }

  protected convertDateFromClient<T extends IAccord | NewAccord | PartialUpdateAccord>(accord: T): RestOf<T> {
    return {
      ...accord,
      dateArrivee: accord.dateArrivee?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restAccord: RestAccord): IAccord {
    return {
      ...restAccord,
      dateArrivee: restAccord.dateArrivee ? dayjs(restAccord.dateArrivee) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestAccord>): HttpResponse<IAccord> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestAccord[]>): HttpResponse<IAccord[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
