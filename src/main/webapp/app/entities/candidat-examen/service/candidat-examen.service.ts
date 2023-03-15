import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICandidatExamen, NewCandidatExamen } from '../candidat-examen.model';

export type PartialUpdateCandidatExamen = Partial<ICandidatExamen> & Pick<ICandidatExamen, 'id'>;

export type EntityResponseType = HttpResponse<ICandidatExamen>;
export type EntityArrayResponseType = HttpResponse<ICandidatExamen[]>;

@Injectable({ providedIn: 'root' })
export class CandidatExamenService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/candidat-examen');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(candidatExamen: NewCandidatExamen): Observable<EntityResponseType> {
    return this.http.post<ICandidatExamen>(this.resourceUrl, candidatExamen, { observe: 'response' });
  }

  update(candidatExamen: ICandidatExamen): Observable<EntityResponseType> {
    return this.http.put<ICandidatExamen>(`${this.resourceUrl}/${this.getCandidatExamenIdentifier(candidatExamen)}`, candidatExamen, {
      observe: 'response',
    });
  }

  partialUpdate(candidatExamen: PartialUpdateCandidatExamen): Observable<EntityResponseType> {
    return this.http.patch<ICandidatExamen>(`${this.resourceUrl}/${this.getCandidatExamenIdentifier(candidatExamen)}`, candidatExamen, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICandidatExamen>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICandidatExamen[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCandidatExamenIdentifier(candidatExamen: Pick<ICandidatExamen, 'id'>): number {
    return candidatExamen.id;
  }

  compareCandidatExamen(o1: Pick<ICandidatExamen, 'id'> | null, o2: Pick<ICandidatExamen, 'id'> | null): boolean {
    return o1 && o2 ? this.getCandidatExamenIdentifier(o1) === this.getCandidatExamenIdentifier(o2) : o1 === o2;
  }

  addCandidatExamenToCollectionIfMissing<Type extends Pick<ICandidatExamen, 'id'>>(
    candidatExamenCollection: Type[],
    ...candidatExamenToCheck: (Type | null | undefined)[]
  ): Type[] {
    const candidatExamen: Type[] = candidatExamenToCheck.filter(isPresent);
    if (candidatExamen.length > 0) {
      const candidatExamenCollectionIdentifiers = candidatExamenCollection.map(
        candidatExamenItem => this.getCandidatExamenIdentifier(candidatExamenItem)!
      );
      const candidatExamenToAdd = candidatExamen.filter(candidatExamenItem => {
        const candidatExamenIdentifier = this.getCandidatExamenIdentifier(candidatExamenItem);
        if (candidatExamenCollectionIdentifiers.includes(candidatExamenIdentifier)) {
          return false;
        }
        candidatExamenCollectionIdentifiers.push(candidatExamenIdentifier);
        return true;
      });
      return [...candidatExamenToAdd, ...candidatExamenCollection];
    }
    return candidatExamenCollection;
  }
}
