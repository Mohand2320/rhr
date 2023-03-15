import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOffrePoste, NewOffrePoste } from '../offre-poste.model';

export type PartialUpdateOffrePoste = Partial<IOffrePoste> & Pick<IOffrePoste, 'id'>;

export type EntityResponseType = HttpResponse<IOffrePoste>;
export type EntityArrayResponseType = HttpResponse<IOffrePoste[]>;

@Injectable({ providedIn: 'root' })
export class OffrePosteService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/offre-postes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(offrePoste: NewOffrePoste): Observable<EntityResponseType> {
    return this.http.post<IOffrePoste>(this.resourceUrl, offrePoste, { observe: 'response' });
  }

  update(offrePoste: IOffrePoste): Observable<EntityResponseType> {
    return this.http.put<IOffrePoste>(`${this.resourceUrl}/${this.getOffrePosteIdentifier(offrePoste)}`, offrePoste, {
      observe: 'response',
    });
  }

  partialUpdate(offrePoste: PartialUpdateOffrePoste): Observable<EntityResponseType> {
    return this.http.patch<IOffrePoste>(`${this.resourceUrl}/${this.getOffrePosteIdentifier(offrePoste)}`, offrePoste, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IOffrePoste>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IOffrePoste[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getOffrePosteIdentifier(offrePoste: Pick<IOffrePoste, 'id'>): number {
    return offrePoste.id;
  }

  compareOffrePoste(o1: Pick<IOffrePoste, 'id'> | null, o2: Pick<IOffrePoste, 'id'> | null): boolean {
    return o1 && o2 ? this.getOffrePosteIdentifier(o1) === this.getOffrePosteIdentifier(o2) : o1 === o2;
  }

  addOffrePosteToCollectionIfMissing<Type extends Pick<IOffrePoste, 'id'>>(
    offrePosteCollection: Type[],
    ...offrePostesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const offrePostes: Type[] = offrePostesToCheck.filter(isPresent);
    if (offrePostes.length > 0) {
      const offrePosteCollectionIdentifiers = offrePosteCollection.map(offrePosteItem => this.getOffrePosteIdentifier(offrePosteItem)!);
      const offrePostesToAdd = offrePostes.filter(offrePosteItem => {
        const offrePosteIdentifier = this.getOffrePosteIdentifier(offrePosteItem);
        if (offrePosteCollectionIdentifiers.includes(offrePosteIdentifier)) {
          return false;
        }
        offrePosteCollectionIdentifiers.push(offrePosteIdentifier);
        return true;
      });
      return [...offrePostesToAdd, ...offrePosteCollection];
    }
    return offrePosteCollection;
  }
}
