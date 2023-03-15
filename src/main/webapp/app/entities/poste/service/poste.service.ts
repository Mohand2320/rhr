import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPoste, NewPoste } from '../poste.model';

export type PartialUpdatePoste = Partial<IPoste> & Pick<IPoste, 'id'>;

export type EntityResponseType = HttpResponse<IPoste>;
export type EntityArrayResponseType = HttpResponse<IPoste[]>;

@Injectable({ providedIn: 'root' })
export class PosteService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/postes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(poste: NewPoste): Observable<EntityResponseType> {
    return this.http.post<IPoste>(this.resourceUrl, poste, { observe: 'response' });
  }

  update(poste: IPoste): Observable<EntityResponseType> {
    return this.http.put<IPoste>(`${this.resourceUrl}/${this.getPosteIdentifier(poste)}`, poste, { observe: 'response' });
  }

  partialUpdate(poste: PartialUpdatePoste): Observable<EntityResponseType> {
    return this.http.patch<IPoste>(`${this.resourceUrl}/${this.getPosteIdentifier(poste)}`, poste, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPoste>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPoste[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPosteIdentifier(poste: Pick<IPoste, 'id'>): number {
    return poste.id;
  }

  comparePoste(o1: Pick<IPoste, 'id'> | null, o2: Pick<IPoste, 'id'> | null): boolean {
    return o1 && o2 ? this.getPosteIdentifier(o1) === this.getPosteIdentifier(o2) : o1 === o2;
  }

  addPosteToCollectionIfMissing<Type extends Pick<IPoste, 'id'>>(
    posteCollection: Type[],
    ...postesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const postes: Type[] = postesToCheck.filter(isPresent);
    if (postes.length > 0) {
      const posteCollectionIdentifiers = posteCollection.map(posteItem => this.getPosteIdentifier(posteItem)!);
      const postesToAdd = postes.filter(posteItem => {
        const posteIdentifier = this.getPosteIdentifier(posteItem);
        if (posteCollectionIdentifiers.includes(posteIdentifier)) {
          return false;
        }
        posteCollectionIdentifiers.push(posteIdentifier);
        return true;
      });
      return [...postesToAdd, ...posteCollection];
    }
    return posteCollection;
  }
}
