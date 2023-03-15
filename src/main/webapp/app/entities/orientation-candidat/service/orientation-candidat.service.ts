import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOrientationCandidat, NewOrientationCandidat } from '../orientation-candidat.model';

export type PartialUpdateOrientationCandidat = Partial<IOrientationCandidat> & Pick<IOrientationCandidat, 'id'>;

type RestOf<T extends IOrientationCandidat | NewOrientationCandidat> = Omit<T, 'dateOrientation'> & {
  dateOrientation?: string | null;
};

export type RestOrientationCandidat = RestOf<IOrientationCandidat>;

export type NewRestOrientationCandidat = RestOf<NewOrientationCandidat>;

export type PartialUpdateRestOrientationCandidat = RestOf<PartialUpdateOrientationCandidat>;

export type EntityResponseType = HttpResponse<IOrientationCandidat>;
export type EntityArrayResponseType = HttpResponse<IOrientationCandidat[]>;

@Injectable({ providedIn: 'root' })
export class OrientationCandidatService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/orientation-candidats');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(orientationCandidat: NewOrientationCandidat): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(orientationCandidat);
    return this.http
      .post<RestOrientationCandidat>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(orientationCandidat: IOrientationCandidat): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(orientationCandidat);
    return this.http
      .put<RestOrientationCandidat>(`${this.resourceUrl}/${this.getOrientationCandidatIdentifier(orientationCandidat)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(orientationCandidat: PartialUpdateOrientationCandidat): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(orientationCandidat);
    return this.http
      .patch<RestOrientationCandidat>(`${this.resourceUrl}/${this.getOrientationCandidatIdentifier(orientationCandidat)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestOrientationCandidat>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestOrientationCandidat[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getOrientationCandidatIdentifier(orientationCandidat: Pick<IOrientationCandidat, 'id'>): number {
    return orientationCandidat.id;
  }

  compareOrientationCandidat(o1: Pick<IOrientationCandidat, 'id'> | null, o2: Pick<IOrientationCandidat, 'id'> | null): boolean {
    return o1 && o2 ? this.getOrientationCandidatIdentifier(o1) === this.getOrientationCandidatIdentifier(o2) : o1 === o2;
  }

  addOrientationCandidatToCollectionIfMissing<Type extends Pick<IOrientationCandidat, 'id'>>(
    orientationCandidatCollection: Type[],
    ...orientationCandidatsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const orientationCandidats: Type[] = orientationCandidatsToCheck.filter(isPresent);
    if (orientationCandidats.length > 0) {
      const orientationCandidatCollectionIdentifiers = orientationCandidatCollection.map(
        orientationCandidatItem => this.getOrientationCandidatIdentifier(orientationCandidatItem)!
      );
      const orientationCandidatsToAdd = orientationCandidats.filter(orientationCandidatItem => {
        const orientationCandidatIdentifier = this.getOrientationCandidatIdentifier(orientationCandidatItem);
        if (orientationCandidatCollectionIdentifiers.includes(orientationCandidatIdentifier)) {
          return false;
        }
        orientationCandidatCollectionIdentifiers.push(orientationCandidatIdentifier);
        return true;
      });
      return [...orientationCandidatsToAdd, ...orientationCandidatCollection];
    }
    return orientationCandidatCollection;
  }

  protected convertDateFromClient<T extends IOrientationCandidat | NewOrientationCandidat | PartialUpdateOrientationCandidat>(
    orientationCandidat: T
  ): RestOf<T> {
    return {
      ...orientationCandidat,
      dateOrientation: orientationCandidat.dateOrientation?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restOrientationCandidat: RestOrientationCandidat): IOrientationCandidat {
    return {
      ...restOrientationCandidat,
      dateOrientation: restOrientationCandidat.dateOrientation ? dayjs(restOrientationCandidat.dateOrientation) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestOrientationCandidat>): HttpResponse<IOrientationCandidat> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestOrientationCandidat[]>): HttpResponse<IOrientationCandidat[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
