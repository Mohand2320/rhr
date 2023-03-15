import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICandidatExamen } from '../candidat-examen.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../candidat-examen.test-samples';

import { CandidatExamenService } from './candidat-examen.service';

const requireRestSample: ICandidatExamen = {
  ...sampleWithRequiredData,
};

describe('CandidatExamen Service', () => {
  let service: CandidatExamenService;
  let httpMock: HttpTestingController;
  let expectedResult: ICandidatExamen | ICandidatExamen[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CandidatExamenService);
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

    it('should create a CandidatExamen', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const candidatExamen = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(candidatExamen).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CandidatExamen', () => {
      const candidatExamen = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(candidatExamen).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CandidatExamen', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CandidatExamen', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a CandidatExamen', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCandidatExamenToCollectionIfMissing', () => {
      it('should add a CandidatExamen to an empty array', () => {
        const candidatExamen: ICandidatExamen = sampleWithRequiredData;
        expectedResult = service.addCandidatExamenToCollectionIfMissing([], candidatExamen);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(candidatExamen);
      });

      it('should not add a CandidatExamen to an array that contains it', () => {
        const candidatExamen: ICandidatExamen = sampleWithRequiredData;
        const candidatExamenCollection: ICandidatExamen[] = [
          {
            ...candidatExamen,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCandidatExamenToCollectionIfMissing(candidatExamenCollection, candidatExamen);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CandidatExamen to an array that doesn't contain it", () => {
        const candidatExamen: ICandidatExamen = sampleWithRequiredData;
        const candidatExamenCollection: ICandidatExamen[] = [sampleWithPartialData];
        expectedResult = service.addCandidatExamenToCollectionIfMissing(candidatExamenCollection, candidatExamen);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(candidatExamen);
      });

      it('should add only unique CandidatExamen to an array', () => {
        const candidatExamenArray: ICandidatExamen[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const candidatExamenCollection: ICandidatExamen[] = [sampleWithRequiredData];
        expectedResult = service.addCandidatExamenToCollectionIfMissing(candidatExamenCollection, ...candidatExamenArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const candidatExamen: ICandidatExamen = sampleWithRequiredData;
        const candidatExamen2: ICandidatExamen = sampleWithPartialData;
        expectedResult = service.addCandidatExamenToCollectionIfMissing([], candidatExamen, candidatExamen2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(candidatExamen);
        expect(expectedResult).toContain(candidatExamen2);
      });

      it('should accept null and undefined values', () => {
        const candidatExamen: ICandidatExamen = sampleWithRequiredData;
        expectedResult = service.addCandidatExamenToCollectionIfMissing([], null, candidatExamen, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(candidatExamen);
      });

      it('should return initial array if no CandidatExamen is added', () => {
        const candidatExamenCollection: ICandidatExamen[] = [sampleWithRequiredData];
        expectedResult = service.addCandidatExamenToCollectionIfMissing(candidatExamenCollection, undefined, null);
        expect(expectedResult).toEqual(candidatExamenCollection);
      });
    });

    describe('compareCandidatExamen', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCandidatExamen(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCandidatExamen(entity1, entity2);
        const compareResult2 = service.compareCandidatExamen(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCandidatExamen(entity1, entity2);
        const compareResult2 = service.compareCandidatExamen(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCandidatExamen(entity1, entity2);
        const compareResult2 = service.compareCandidatExamen(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
