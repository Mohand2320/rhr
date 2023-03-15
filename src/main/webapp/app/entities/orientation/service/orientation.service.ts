import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOrientation, NewOrientation } from '../orientation.model';

export type PartialUpdateOrientation = Partial<IOrientation> & Pick<IOrientation, 'id'>;

export type EntityResponseType = HttpResponse<IOrientation>;
export type EntityArrayResponseType = HttpResponse<IOrientation[]>;

@Injectable({ providedIn: 'root' })
export class OrientationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/orientations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(orientation: NewOrientation): Observable<EntityResponseType> {
    return this.http.post<IOrientation>(this.resourceUrl, orientation, { observe: 'response' });
  }

  update(orientation: IOrientation): Observable<EntityResponseType> {
    return this.http.put<IOrientation>(`${this.resourceUrl}/${this.getOrientationIdentifier(orientation)}`, orientation, {
      observe: 'response',
    });
  }

  partialUpdate(orientation: PartialUpdateOrientation): Observable<EntityResponseType> {
    return this.http.patch<IOrientation>(`${this.resourceUrl}/${this.getOrientationIdentifier(orientation)}`, orientation, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IOrientation>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IOrientation[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getOrientationIdentifier(orientation: Pick<IOrientation, 'id'>): number {
    return orientation.id;
  }

  compareOrientation(o1: Pick<IOrientation, 'id'> | null, o2: Pick<IOrientation, 'id'> | null): boolean {
    return o1 && o2 ? this.getOrientationIdentifier(o1) === this.getOrientationIdentifier(o2) : o1 === o2;
  }

  addOrientationToCollectionIfMissing<Type extends Pick<IOrientation, 'id'>>(
    orientationCollection: Type[],
    ...orientationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const orientations: Type[] = orientationsToCheck.filter(isPresent);
    if (orientations.length > 0) {
      const orientationCollectionIdentifiers = orientationCollection.map(
        orientationItem => this.getOrientationIdentifier(orientationItem)!
      );
      const orientationsToAdd = orientations.filter(orientationItem => {
        const orientationIdentifier = this.getOrientationIdentifier(orientationItem);
        if (orientationCollectionIdentifiers.includes(orientationIdentifier)) {
          return false;
        }
        orientationCollectionIdentifiers.push(orientationIdentifier);
        return true;
      });
      return [...orientationsToAdd, ...orientationCollection];
    }
    return orientationCollection;
  }
}
