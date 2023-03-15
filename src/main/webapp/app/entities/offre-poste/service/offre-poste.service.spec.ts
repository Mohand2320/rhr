import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IOffrePoste } from '../offre-poste.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../offre-poste.test-samples';

import { OffrePosteService } from './offre-poste.service';

const requireRestSample: IOffrePoste = {
  ...sampleWithRequiredData,
};

describe('OffrePoste Service', () => {
  let service: OffrePosteService;
  let httpMock: HttpTestingController;
  let expectedResult: IOffrePoste | IOffrePoste[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(OffrePosteService);
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

    it('should create a OffrePoste', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const offrePoste = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(offrePoste).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a OffrePoste', () => {
      const offrePoste = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(offrePoste).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a OffrePoste', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of OffrePoste', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a OffrePoste', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addOffrePosteToCollectionIfMissing', () => {
      it('should add a OffrePoste to an empty array', () => {
        const offrePoste: IOffrePoste = sampleWithRequiredData;
        expectedResult = service.addOffrePosteToCollectionIfMissing([], offrePoste);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(offrePoste);
      });

      it('should not add a OffrePoste to an array that contains it', () => {
        const offrePoste: IOffrePoste = sampleWithRequiredData;
        const offrePosteCollection: IOffrePoste[] = [
          {
            ...offrePoste,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addOffrePosteToCollectionIfMissing(offrePosteCollection, offrePoste);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a OffrePoste to an array that doesn't contain it", () => {
        const offrePoste: IOffrePoste = sampleWithRequiredData;
        const offrePosteCollection: IOffrePoste[] = [sampleWithPartialData];
        expectedResult = service.addOffrePosteToCollectionIfMissing(offrePosteCollection, offrePoste);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(offrePoste);
      });

      it('should add only unique OffrePoste to an array', () => {
        const offrePosteArray: IOffrePoste[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const offrePosteCollection: IOffrePoste[] = [sampleWithRequiredData];
        expectedResult = service.addOffrePosteToCollectionIfMissing(offrePosteCollection, ...offrePosteArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const offrePoste: IOffrePoste = sampleWithRequiredData;
        const offrePoste2: IOffrePoste = sampleWithPartialData;
        expectedResult = service.addOffrePosteToCollectionIfMissing([], offrePoste, offrePoste2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(offrePoste);
        expect(expectedResult).toContain(offrePoste2);
      });

      it('should accept null and undefined values', () => {
        const offrePoste: IOffrePoste = sampleWithRequiredData;
        expectedResult = service.addOffrePosteToCollectionIfMissing([], null, offrePoste, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(offrePoste);
      });

      it('should return initial array if no OffrePoste is added', () => {
        const offrePosteCollection: IOffrePoste[] = [sampleWithRequiredData];
        expectedResult = service.addOffrePosteToCollectionIfMissing(offrePosteCollection, undefined, null);
        expect(expectedResult).toEqual(offrePosteCollection);
      });
    });

    describe('compareOffrePoste', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareOffrePoste(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareOffrePoste(entity1, entity2);
        const compareResult2 = service.compareOffrePoste(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareOffrePoste(entity1, entity2);
        const compareResult2 = service.compareOffrePoste(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareOffrePoste(entity1, entity2);
        const compareResult2 = service.compareOffrePoste(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
