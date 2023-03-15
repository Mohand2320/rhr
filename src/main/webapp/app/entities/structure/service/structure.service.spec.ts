import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IStructure } from '../structure.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../structure.test-samples';

import { StructureService } from './structure.service';

const requireRestSample: IStructure = {
  ...sampleWithRequiredData,
};

describe('Structure Service', () => {
  let service: StructureService;
  let httpMock: HttpTestingController;
  let expectedResult: IStructure | IStructure[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(StructureService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Structure', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const structure = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(structure).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Structure', () => {
      const structure = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(structure).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Structure', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Structure', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Structure', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addStructureToCollectionIfMissing', () => {
      it('should add a Structure to an empty array', () => {
        const structure: IStructure = sampleWithRequiredData;
        expectedResult = service.addStructureToCollectionIfMissing([], structure);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(structure);
      });

      it('should not add a Structure to an array that contains it', () => {
        const structure: IStructure = sampleWithRequiredData;
        const structureCollection: IStructure[] = [
          {
            ...structure,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addStructureToCollectionIfMissing(structureCollection, structure);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Structure to an array that doesn't contain it", () => {
        const structure: IStructure = sampleWithRequiredData;
        const structureCollection: IStructure[] = [sampleWithPartialData];
        expectedResult = service.addStructureToCollectionIfMissing(structureCollection, structure);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(structure);
      });

      it('should add only unique Structure to an array', () => {
        const structureArray: IStructure[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const structureCollection: IStructure[] = [sampleWithRequiredData];
        expectedResult = service.addStructureToCollectionIfMissing(structureCollection, ...structureArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const structure: IStructure = sampleWithRequiredData;
        const structure2: IStructure = sampleWithPartialData;
        expectedResult = service.addStructureToCollectionIfMissing([], structure, structure2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(structure);
        expect(expectedResult).toContain(structure2);
      });

      it('should accept null and undefined values', () => {
        const structure: IStructure = sampleWithRequiredData;
        expectedResult = service.addStructureToCollectionIfMissing([], null, structure, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(structure);
      });

      it('should return initial array if no Structure is added', () => {
        const structureCollection: IStructure[] = [sampleWithRequiredData];
        expectedResult = service.addStructureToCollectionIfMissing(structureCollection, undefined, null);
        expect(expectedResult).toEqual(structureCollection);
      });
    });

    describe('compareStructure', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareStructure(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareStructure(entity1, entity2);
        const compareResult2 = service.compareStructure(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareStructure(entity1, entity2);
        const compareResult2 = service.compareStructure(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareStructure(entity1, entity2);
        const compareResult2 = service.compareStructure(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
