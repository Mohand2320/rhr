import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IStructure, NewStructure } from '../structure.model';

export type PartialUpdateStructure = Partial<IStructure> & Pick<IStructure, 'id'>;

export type EntityResponseType = HttpResponse<IStructure>;
export type EntityArrayResponseType = HttpResponse<IStructure[]>;

@Injectable({ providedIn: 'root' })
export class StructureService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/structures');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(structure: NewStructure): Observable<EntityResponseType> {
    return this.http.post<IStructure>(this.resourceUrl, structure, { observe: 'response' });
  }

  update(structure: IStructure): Observable<EntityResponseType> {
    return this.http.put<IStructure>(`${this.resourceUrl}/${this.getStructureIdentifier(structure)}`, structure, { observe: 'response' });
  }

  partialUpdate(structure: PartialUpdateStructure): Observable<EntityResponseType> {
    return this.http.patch<IStructure>(`${this.resourceUrl}/${this.getStructureIdentifier(structure)}`, structure, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IStructure>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IStructure[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getStructureIdentifier(structure: Pick<IStructure, 'id'>): number {
    return structure.id;
  }

  compareStructure(o1: Pick<IStructure, 'id'> | null, o2: Pick<IStructure, 'id'> | null): boolean {
    return o1 && o2 ? this.getStructureIdentifier(o1) === this.getStructureIdentifier(o2) : o1 === o2;
  }

  addStructureToCollectionIfMissing<Type extends Pick<IStructure, 'id'>>(
    structureCollection: Type[],
    ...structuresToCheck: (Type | null | undefined)[]
  ): Type[] {
    const structures: Type[] = structuresToCheck.filter(isPresent);
    if (structures.length > 0) {
      const structureCollectionIdentifiers = structureCollection.map(structureItem => this.getStructureIdentifier(structureItem)!);
      const structuresToAdd = structures.filter(structureItem => {
        const structureIdentifier = this.getStructureIdentifier(structureItem);
        if (structureCollectionIdentifiers.includes(structureIdentifier)) {
          return false;
        }
        structureCollectionIdentifiers.push(structureIdentifier);
        return true;
      });
      return [...structuresToAdd, ...structureCollection];
    }
    return structureCollection;
  }
}
