import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPoste } from '../poste.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../poste.test-samples';

import { PosteService } from './poste.service';

const requireRestSample: IPoste = {
  ...sampleWithRequiredData,
};

describe('Poste Service', () => {
  let service: PosteService;
  let httpMock: HttpTestingController;
  let expectedResult: IPoste | IPoste[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PosteService);
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

    it('should create a Poste', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const poste = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(poste).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Poste', () => {
      const poste = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(poste).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Poste', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Poste', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Poste', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPosteToCollectionIfMissing', () => {
      it('should add a Poste to an empty array', () => {
        const poste: IPoste = sampleWithRequiredData;
        expectedResult = service.addPosteToCollectionIfMissing([], poste);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(poste);
      });

      it('should not add a Poste to an array that contains it', () => {
        const poste: IPoste = sampleWithRequiredData;
        const posteCollection: IPoste[] = [
          {
            ...poste,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPosteToCollectionIfMissing(posteCollection, poste);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Poste to an array that doesn't contain it", () => {
        const poste: IPoste = sampleWithRequiredData;
        const posteCollection: IPoste[] = [sampleWithPartialData];
        expectedResult = service.addPosteToCollectionIfMissing(posteCollection, poste);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(poste);
      });

      it('should add only unique Poste to an array', () => {
        const posteArray: IPoste[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const posteCollection: IPoste[] = [sampleWithRequiredData];
        expectedResult = service.addPosteToCollectionIfMissing(posteCollection, ...posteArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const poste: IPoste = sampleWithRequiredData;
        const poste2: IPoste = sampleWithPartialData;
        expectedResult = service.addPosteToCollectionIfMissing([], poste, poste2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(poste);
        expect(expectedResult).toContain(poste2);
      });

      it('should accept null and undefined values', () => {
        const poste: IPoste = sampleWithRequiredData;
        expectedResult = service.addPosteToCollectionIfMissing([], null, poste, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(poste);
      });

      it('should return initial array if no Poste is added', () => {
        const posteCollection: IPoste[] = [sampleWithRequiredData];
        expectedResult = service.addPosteToCollectionIfMissing(posteCollection, undefined, null);
        expect(expectedResult).toEqual(posteCollection);
      });
    });

    describe('comparePoste', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePoste(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePoste(entity1, entity2);
        const compareResult2 = service.comparePoste(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePoste(entity1, entity2);
        const compareResult2 = service.comparePoste(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePoste(entity1, entity2);
        const compareResult2 = service.comparePoste(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
