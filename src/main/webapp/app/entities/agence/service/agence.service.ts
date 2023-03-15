import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAgence, NewAgence } from '../agence.model';

export type PartialUpdateAgence = Partial<IAgence> & Pick<IAgence, 'id'>;

export type EntityResponseType = HttpResponse<IAgence>;
export type EntityArrayResponseType = HttpResponse<IAgence[]>;

@Injectable({ providedIn: 'root' })
export class AgenceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/agences');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(agence: NewAgence): Observable<EntityResponseType> {
    return this.http.post<IAgence>(this.resourceUrl, agence, { observe: 'response' });
  }

  update(agence: IAgence): Observable<EntityResponseType> {
    return this.http.put<IAgence>(`${this.resourceUrl}/${this.getAgenceIdentifier(agence)}`, agence, { observe: 'response' });
  }

  partialUpdate(agence: PartialUpdateAgence): Observable<EntityResponseType> {
    return this.http.patch<IAgence>(`${this.resourceUrl}/${this.getAgenceIdentifier(agence)}`, agence, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAgence>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAgence[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAgenceIdentifier(agence: Pick<IAgence, 'id'>): number {
    return agence.id;
  }

  compareAgence(o1: Pick<IAgence, 'id'> | null, o2: Pick<IAgence, 'id'> | null): boolean {
    return o1 && o2 ? this.getAgenceIdentifier(o1) === this.getAgenceIdentifier(o2) : o1 === o2;
  }

  addAgenceToCollectionIfMissing<Type extends Pick<IAgence, 'id'>>(
    agenceCollection: Type[],
    ...agencesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const agences: Type[] = agencesToCheck.filter(isPresent);
    if (agences.length > 0) {
      const agenceCollectionIdentifiers = agenceCollection.map(agenceItem => this.getAgenceIdentifier(agenceItem)!);
      const agencesToAdd = agences.filter(agenceItem => {
        const agenceIdentifier = this.getAgenceIdentifier(agenceItem);
        if (agenceCollectionIdentifiers.includes(agenceIdentifier)) {
          return false;
        }
        agenceCollectionIdentifiers.push(agenceIdentifier);
        return true;
      });
      return [...agencesToAdd, ...agenceCollection];
    }
    return agenceCollection;
  }
}
