import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPersonne, NewPersonne } from '../personne.model';

export type PartialUpdatePersonne = Partial<IPersonne> & Pick<IPersonne, 'id'>;

type RestOf<T extends IPersonne | NewPersonne> = Omit<T, 'dateNaissance' | 'dateOrientation'> & {
  dateNaissance?: string | null;
  dateOrientation?: string | null;
};

export type RestPersonne = RestOf<IPersonne>;

export type NewRestPersonne = RestOf<NewPersonne>;

export type PartialUpdateRestPersonne = RestOf<PartialUpdatePersonne>;

export type EntityResponseType = HttpResponse<IPersonne>;
export type EntityArrayResponseType = HttpResponse<IPersonne[]>;

@Injectable({ providedIn: 'root' })
export class PersonneService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/personnes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(personne: NewPersonne): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(personne);
    return this.http
      .post<RestPersonne>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(personne: IPersonne): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(personne);
    return this.http
      .put<RestPersonne>(`${this.resourceUrl}/${this.getPersonneIdentifier(personne)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(personne: PartialUpdatePersonne): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(personne);
    return this.http
      .patch<RestPersonne>(`${this.resourceUrl}/${this.getPersonneIdentifier(personne)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestPersonne>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPersonne[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPersonneIdentifier(personne: Pick<IPersonne, 'id'>): number {
    return personne.id;
  }

  comparePersonne(o1: Pick<IPersonne, 'id'> | null, o2: Pick<IPersonne, 'id'> | null): boolean {
    return o1 && o2 ? this.getPersonneIdentifier(o1) === this.getPersonneIdentifier(o2) : o1 === o2;
  }

  addPersonneToCollectionIfMissing<Type extends Pick<IPersonne, 'id'>>(
    personneCollection: Type[],
    ...personnesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const personnes: Type[] = personnesToCheck.filter(isPresent);
    if (personnes.length > 0) {
      const personneCollectionIdentifiers = personneCollection.map(personneItem => this.getPersonneIdentifier(personneItem)!);
      const personnesToAdd = personnes.filter(personneItem => {
        const personneIdentifier = this.getPersonneIdentifier(personneItem);
        if (personneCollectionIdentifiers.includes(personneIdentifier)) {
          return false;
        }
        personneCollectionIdentifiers.push(personneIdentifier);
        return true;
      });
      return [...personnesToAdd, ...personneCollection];
    }
    return personneCollection;
  }

  protected convertDateFromClient<T extends IPersonne | NewPersonne | PartialUpdatePersonne>(personne: T): RestOf<T> {
    return {
      ...personne,
      dateNaissance: personne.dateNaissance?.format(DATE_FORMAT) ?? null,
      dateOrientation: personne.dateOrientation?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restPersonne: RestPersonne): IPersonne {
    return {
      ...restPersonne,
      dateNaissance: restPersonne.dateNaissance ? dayjs(restPersonne.dateNaissance) : undefined,
      dateOrientation: restPersonne.dateOrientation ? dayjs(restPersonne.dateOrientation) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestPersonne>): HttpResponse<IPersonne> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestPersonne[]>): HttpResponse<IPersonne[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
