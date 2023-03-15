import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IPrevisionPoste } from '../prevision-poste.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../prevision-poste.test-samples';

import { PrevisionPosteService, RestPrevisionPoste } from './prevision-poste.service';

const requireRestSample: RestPrevisionPoste = {
  ...sampleWithRequiredData,
  dateAjout: sampleWithRequiredData.dateAjout?.format(DATE_FORMAT),
};

describe('PrevisionPoste Service', () => {
  let service: PrevisionPosteService;
  let httpMock: HttpTestingController;
  let expectedResult: IPrevisionPoste | IPrevisionPoste[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PrevisionPosteService);
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

    it('should create a PrevisionPoste', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const previsionPoste = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(previsionPoste).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PrevisionPoste', () => {
      const previsionPoste = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(previsionPoste).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PrevisionPoste', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PrevisionPoste', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a PrevisionPoste', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPrevisionPosteToCollectionIfMissing', () => {
      it('should add a PrevisionPoste to an empty array', () => {
        const previsionPoste: IPrevisionPoste = sampleWithRequiredData;
        expectedResult = service.addPrevisionPosteToCollectionIfMissing([], previsionPoste);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(previsionPoste);
      });

      it('should not add a PrevisionPoste to an array that contains it', () => {
        const previsionPoste: IPrevisionPoste = sampleWithRequiredData;
        const previsionPosteCollection: IPrevisionPoste[] = [
          {
            ...previsionPoste,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPrevisionPosteToCollectionIfMissing(previsionPosteCollection, previsionPoste);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PrevisionPoste to an array that doesn't contain it", () => {
        const previsionPoste: IPrevisionPoste = sampleWithRequiredData;
        const previsionPosteCollection: IPrevisionPoste[] = [sampleWithPartialData];
        expectedResult = service.addPrevisionPosteToCollectionIfMissing(previsionPosteCollection, previsionPoste);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(previsionPoste);
      });

      it('should add only unique PrevisionPoste to an array', () => {
        const previsionPosteArray: IPrevisionPoste[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const previsionPosteCollection: IPrevisionPoste[] = [sampleWithRequiredData];
        expectedResult = service.addPrevisionPosteToCollectionIfMissing(previsionPosteCollection, ...previsionPosteArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const previsionPoste: IPrevisionPoste = sampleWithRequiredData;
        const previsionPoste2: IPrevisionPoste = sampleWithPartialData;
        expectedResult = service.addPrevisionPosteToCollectionIfMissing([], previsionPoste, previsionPoste2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(previsionPoste);
        expect(expectedResult).toContain(previsionPoste2);
      });

      it('should accept null and undefined values', () => {
        const previsionPoste: IPrevisionPoste = sampleWithRequiredData;
        expectedResult = service.addPrevisionPosteToCollectionIfMissing([], null, previsionPoste, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(previsionPoste);
      });

      it('should return initial array if no PrevisionPoste is added', () => {
        const previsionPosteCollection: IPrevisionPoste[] = [sampleWithRequiredData];
        expectedResult = service.addPrevisionPosteToCollectionIfMissing(previsionPosteCollection, undefined, null);
        expect(expectedResult).toEqual(previsionPosteCollection);
      });
    });

    describe('comparePrevisionPoste', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePrevisionPoste(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePrevisionPoste(entity1, entity2);
        const compareResult2 = service.comparePrevisionPoste(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePrevisionPoste(entity1, entity2);
        const compareResult2 = service.comparePrevisionPoste(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePrevisionPoste(entity1, entity2);
        const compareResult2 = service.comparePrevisionPoste(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
