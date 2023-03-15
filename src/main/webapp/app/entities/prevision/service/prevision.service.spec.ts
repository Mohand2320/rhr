import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IPrevision } from '../prevision.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../prevision.test-samples';

import { PrevisionService, RestPrevision } from './prevision.service';

const requireRestSample: RestPrevision = {
  ...sampleWithRequiredData,
  dateAjout: sampleWithRequiredData.dateAjout?.format(DATE_FORMAT),
};

describe('Prevision Service', () => {
  let service: PrevisionService;
  let httpMock: HttpTestingController;
  let expectedResult: IPrevision | IPrevision[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PrevisionService);
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

    it('should create a Prevision', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const prevision = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(prevision).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Prevision', () => {
      const prevision = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(prevision).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Prevision', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Prevision', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Prevision', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPrevisionToCollectionIfMissing', () => {
      it('should add a Prevision to an empty array', () => {
        const prevision: IPrevision = sampleWithRequiredData;
        expectedResult = service.addPrevisionToCollectionIfMissing([], prevision);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(prevision);
      });

      it('should not add a Prevision to an array that contains it', () => {
        const prevision: IPrevision = sampleWithRequiredData;
        const previsionCollection: IPrevision[] = [
          {
            ...prevision,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPrevisionToCollectionIfMissing(previsionCollection, prevision);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Prevision to an array that doesn't contain it", () => {
        const prevision: IPrevision = sampleWithRequiredData;
        const previsionCollection: IPrevision[] = [sampleWithPartialData];
        expectedResult = service.addPrevisionToCollectionIfMissing(previsionCollection, prevision);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(prevision);
      });

      it('should add only unique Prevision to an array', () => {
        const previsionArray: IPrevision[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const previsionCollection: IPrevision[] = [sampleWithRequiredData];
        expectedResult = service.addPrevisionToCollectionIfMissing(previsionCollection, ...previsionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const prevision: IPrevision = sampleWithRequiredData;
        const prevision2: IPrevision = sampleWithPartialData;
        expectedResult = service.addPrevisionToCollectionIfMissing([], prevision, prevision2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(prevision);
        expect(expectedResult).toContain(prevision2);
      });

      it('should accept null and undefined values', () => {
        const prevision: IPrevision = sampleWithRequiredData;
        expectedResult = service.addPrevisionToCollectionIfMissing([], null, prevision, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(prevision);
      });

      it('should return initial array if no Prevision is added', () => {
        const previsionCollection: IPrevision[] = [sampleWithRequiredData];
        expectedResult = service.addPrevisionToCollectionIfMissing(previsionCollection, undefined, null);
        expect(expectedResult).toEqual(previsionCollection);
      });
    });

    describe('comparePrevision', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePrevision(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePrevision(entity1, entity2);
        const compareResult2 = service.comparePrevision(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePrevision(entity1, entity2);
        const compareResult2 = service.comparePrevision(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePrevision(entity1, entity2);
        const compareResult2 = service.comparePrevision(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
