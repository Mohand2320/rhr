import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IHistoriqueOffre, NewHistoriqueOffre } from '../historique-offre.model';

export type PartialUpdateHistoriqueOffre = Partial<IHistoriqueOffre> & Pick<IHistoriqueOffre, 'id'>;

type RestOf<T extends IHistoriqueOffre | NewHistoriqueOffre> = Omit<T, 'dateHistorique'> & {
  dateHistorique?: string | null;
};

export type RestHistoriqueOffre = RestOf<IHistoriqueOffre>;

export type NewRestHistoriqueOffre = RestOf<NewHistoriqueOffre>;

export type PartialUpdateRestHistoriqueOffre = RestOf<PartialUpdateHistoriqueOffre>;

export type EntityResponseType = HttpResponse<IHistoriqueOffre>;
export type EntityArrayResponseType = HttpResponse<IHistoriqueOffre[]>;

@Injectable({ providedIn: 'root' })
export class HistoriqueOffreService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/historique-offres');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(historiqueOffre: NewHistoriqueOffre): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(historiqueOffre);
    return this.http
      .post<RestHistoriqueOffre>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(historiqueOffre: IHistoriqueOffre): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(historiqueOffre);
    return this.http
      .put<RestHistoriqueOffre>(`${this.resourceUrl}/${this.getHistoriqueOffreIdentifier(historiqueOffre)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(historiqueOffre: PartialUpdateHistoriqueOffre): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(historiqueOffre);
    return this.http
      .patch<RestHistoriqueOffre>(`${this.resourceUrl}/${this.getHistoriqueOffreIdentifier(historiqueOffre)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestHistoriqueOffre>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestHistoriqueOffre[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getHistoriqueOffreIdentifier(historiqueOffre: Pick<IHistoriqueOffre, 'id'>): number {
    return historiqueOffre.id;
  }

  compareHistoriqueOffre(o1: Pick<IHistoriqueOffre, 'id'> | null, o2: Pick<IHistoriqueOffre, 'id'> | null): boolean {
    return o1 && o2 ? this.getHistoriqueOffreIdentifier(o1) === this.getHistoriqueOffreIdentifier(o2) : o1 === o2;
  }

  addHistoriqueOffreToCollectionIfMissing<Type extends Pick<IHistoriqueOffre, 'id'>>(
    historiqueOffreCollection: Type[],
    ...historiqueOffresToCheck: (Type | null | undefined)[]
  ): Type[] {
    const historiqueOffres: Type[] = historiqueOffresToCheck.filter(isPresent);
    if (historiqueOffres.length > 0) {
      const historiqueOffreCollectionIdentifiers = historiqueOffreCollection.map(
        historiqueOffreItem => this.getHistoriqueOffreIdentifier(historiqueOffreItem)!
      );
      const historiqueOffresToAdd = historiqueOffres.filter(historiqueOffreItem => {
        const historiqueOffreIdentifier = this.getHistoriqueOffreIdentifier(historiqueOffreItem);
        if (historiqueOffreCollectionIdentifiers.includes(historiqueOffreIdentifier)) {
          return false;
        }
        historiqueOffreCollectionIdentifiers.push(historiqueOffreIdentifier);
        return true;
      });
      return [...historiqueOffresToAdd, ...historiqueOffreCollection];
    }
    return historiqueOffreCollection;
  }

  protected convertDateFromClient<T extends IHistoriqueOffre | NewHistoriqueOffre | PartialUpdateHistoriqueOffre>(
    historiqueOffre: T
  ): RestOf<T> {
    return {
      ...historiqueOffre,
      dateHistorique: historiqueOffre.dateHistorique?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restHistoriqueOffre: RestHistoriqueOffre): IHistoriqueOffre {
    return {
      ...restHistoriqueOffre,
      dateHistorique: restHistoriqueOffre.dateHistorique ? dayjs(restHistoriqueOffre.dateHistorique) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestHistoriqueOffre>): HttpResponse<IHistoriqueOffre> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestHistoriqueOffre[]>): HttpResponse<IHistoriqueOffre[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
