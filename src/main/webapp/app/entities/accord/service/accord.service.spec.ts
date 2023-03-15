import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IAccord } from '../accord.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../accord.test-samples';

import { AccordService, RestAccord } from './accord.service';

const requireRestSample: RestAccord = {
  ...sampleWithRequiredData,
  dateArrivee: sampleWithRequiredData.dateArrivee?.format(DATE_FORMAT),
};

describe('Accord Service', () => {
  let service: AccordService;
  let httpMock: HttpTestingController;
  let expectedResult: IAccord | IAccord[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AccordService);
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

    it('should create a Accord', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const accord = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(accord).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Accord', () => {
      const accord = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(accord).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Accord', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Accord', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Accord', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAccordToCollectionIfMissing', () => {
      it('should add a Accord to an empty array', () => {
        const accord: IAccord = sampleWithRequiredData;
        expectedResult = service.addAccordToCollectionIfMissing([], accord);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(accord);
      });

      it('should not add a Accord to an array that contains it', () => {
        const accord: IAccord = sampleWithRequiredData;
        const accordCollection: IAccord[] = [
          {
            ...accord,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAccordToCollectionIfMissing(accordCollection, accord);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Accord to an array that doesn't contain it", () => {
        const accord: IAccord = sampleWithRequiredData;
        const accordCollection: IAccord[] = [sampleWithPartialData];
        expectedResult = service.addAccordToCollectionIfMissing(accordCollection, accord);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(accord);
      });

      it('should add only unique Accord to an array', () => {
        const accordArray: IAccord[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const accordCollection: IAccord[] = [sampleWithRequiredData];
        expectedResult = service.addAccordToCollectionIfMissing(accordCollection, ...accordArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const accord: IAccord = sampleWithRequiredData;
        const accord2: IAccord = sampleWithPartialData;
        expectedResult = service.addAccordToCollectionIfMissing([], accord, accord2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(accord);
        expect(expectedResult).toContain(accord2);
      });

      it('should accept null and undefined values', () => {
        const accord: IAccord = sampleWithRequiredData;
        expectedResult = service.addAccordToCollectionIfMissing([], null, accord, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(accord);
      });

      it('should return initial array if no Accord is added', () => {
        const accordCollection: IAccord[] = [sampleWithRequiredData];
        expectedResult = service.addAccordToCollectionIfMissing(accordCollection, undefined, null);
        expect(expectedResult).toEqual(accordCollection);
      });
    });

    describe('compareAccord', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAccord(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareAccord(entity1, entity2);
        const compareResult2 = service.compareAccord(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareAccord(entity1, entity2);
        const compareResult2 = service.compareAccord(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareAccord(entity1, entity2);
        const compareResult2 = service.compareAccord(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
