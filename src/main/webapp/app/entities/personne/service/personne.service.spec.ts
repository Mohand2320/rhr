import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IPersonne } from '../personne.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../personne.test-samples';

import { PersonneService, RestPersonne } from './personne.service';

const requireRestSample: RestPersonne = {
  ...sampleWithRequiredData,
  dateNaissance: sampleWithRequiredData.dateNaissance?.format(DATE_FORMAT),
  dateOrientation: sampleWithRequiredData.dateOrientation?.format(DATE_FORMAT),
};

describe('Personne Service', () => {
  let service: PersonneService;
  let httpMock: HttpTestingController;
  let expectedResult: IPersonne | IPersonne[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PersonneService);
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

    it('should create a Personne', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const personne = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(personne).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Personne', () => {
      const personne = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(personne).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Personne', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Personne', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Personne', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPersonneToCollectionIfMissing', () => {
      it('should add a Personne to an empty array', () => {
        const personne: IPersonne = sampleWithRequiredData;
        expectedResult = service.addPersonneToCollectionIfMissing([], personne);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(personne);
      });

      it('should not add a Personne to an array that contains it', () => {
        const personne: IPersonne = sampleWithRequiredData;
        const personneCollection: IPersonne[] = [
          {
            ...personne,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPersonneToCollectionIfMissing(personneCollection, personne);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Personne to an array that doesn't contain it", () => {
        const personne: IPersonne = sampleWithRequiredData;
        const personneCollection: IPersonne[] = [sampleWithPartialData];
        expectedResult = service.addPersonneToCollectionIfMissing(personneCollection, personne);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(personne);
      });

      it('should add only unique Personne to an array', () => {
        const personneArray: IPersonne[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const personneCollection: IPersonne[] = [sampleWithRequiredData];
        expectedResult = service.addPersonneToCollectionIfMissing(personneCollection, ...personneArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const personne: IPersonne = sampleWithRequiredData;
        const personne2: IPersonne = sampleWithPartialData;
        expectedResult = service.addPersonneToCollectionIfMissing([], personne, personne2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(personne);
        expect(expectedResult).toContain(personne2);
      });

      it('should accept null and undefined values', () => {
        const personne: IPersonne = sampleWithRequiredData;
        expectedResult = service.addPersonneToCollectionIfMissing([], null, personne, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(personne);
      });

      it('should return initial array if no Personne is added', () => {
        const personneCollection: IPersonne[] = [sampleWithRequiredData];
        expectedResult = service.addPersonneToCollectionIfMissing(personneCollection, undefined, null);
        expect(expectedResult).toEqual(personneCollection);
      });
    });

    describe('comparePersonne', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePersonne(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePersonne(entity1, entity2);
        const compareResult2 = service.comparePersonne(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePersonne(entity1, entity2);
        const compareResult2 = service.comparePersonne(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePersonne(entity1, entity2);
        const compareResult2 = service.comparePersonne(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
