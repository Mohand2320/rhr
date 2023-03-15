import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOffre, NewOffre } from '../offre.model';

export type PartialUpdateOffre = Partial<IOffre> & Pick<IOffre, 'id'>;

type RestOf<T extends IOffre | NewOffre> = Omit<T, 'dateOffre' | 'dateDepot'> & {
  dateOffre?: string | null;
  dateDepot?: string | null;
};

export type RestOffre = RestOf<IOffre>;

export type NewRestOffre = RestOf<NewOffre>;

export type PartialUpdateRestOffre = RestOf<PartialUpdateOffre>;

export type EntityResponseType = HttpResponse<IOffre>;
export type EntityArrayResponseType = HttpResponse<IOffre[]>;

@Injectable({ providedIn: 'root' })
export class OffreService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/offres');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(offre: NewOffre): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(offre);
    return this.http.post<RestOffre>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(offre: IOffre): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(offre);
    return this.http
      .put<RestOffre>(`${this.resourceUrl}/${this.getOffreIdentifier(offre)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(offre: PartialUpdateOffre): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(offre);
    return this.http
      .patch<RestOffre>(`${this.resourceUrl}/${this.getOffreIdentifier(offre)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestOffre>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestOffre[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getOffreIdentifier(offre: Pick<IOffre, 'id'>): number {
    return offre.id;
  }

  compareOffre(o1: Pick<IOffre, 'id'> | null, o2: Pick<IOffre, 'id'> | null): boolean {
    return o1 && o2 ? this.getOffreIdentifier(o1) === this.getOffreIdentifier(o2) : o1 === o2;
  }

  addOffreToCollectionIfMissing<Type extends Pick<IOffre, 'id'>>(
    offreCollection: Type[],
    ...offresToCheck: (Type | null | undefined)[]
  ): Type[] {
    const offres: Type[] = offresToCheck.filter(isPresent);
    if (offres.length > 0) {
      const offreCollectionIdentifiers = offreCollection.map(offreItem => this.getOffreIdentifier(offreItem)!);
      const offresToAdd = offres.filter(offreItem => {
        const offreIdentifier = this.getOffreIdentifier(offreItem);
        if (offreCollectionIdentifiers.includes(offreIdentifier)) {
          return false;
        }
        offreCollectionIdentifiers.push(offreIdentifier);
        return true;
      });
      return [...offresToAdd, ...offreCollection];
    }
    return offreCollection;
  }

  protected convertDateFromClient<T extends IOffre | NewOffre | PartialUpdateOffre>(offre: T): RestOf<T> {
    return {
      ...offre,
      dateOffre: offre.dateOffre?.format(DATE_FORMAT) ?? null,
      dateDepot: offre.dateDepot?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restOffre: RestOffre): IOffre {
    return {
      ...restOffre,
      dateOffre: restOffre.dateOffre ? dayjs(restOffre.dateOffre) : undefined,
      dateDepot: restOffre.dateDepot ? dayjs(restOffre.dateDepot) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestOffre>): HttpResponse<IOffre> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestOffre[]>): HttpResponse<IOffre[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
