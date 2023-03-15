import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IOrientationCandidat } from '../orientation-candidat.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../orientation-candidat.test-samples';

import { OrientationCandidatService, RestOrientationCandidat } from './orientation-candidat.service';

const requireRestSample: RestOrientationCandidat = {
  ...sampleWithRequiredData,
  dateOrientation: sampleWithRequiredData.dateOrientation?.format(DATE_FORMAT),
};

describe('OrientationCandidat Service', () => {
  let service: OrientationCandidatService;
  let httpMock: HttpTestingController;
  let expectedResult: IOrientationCandidat | IOrientationCandidat[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(OrientationCandidatService);
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

    it('should create a OrientationCandidat', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const orientationCandidat = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(orientationCandidat).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a OrientationCandidat', () => {
      const orientationCandidat = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(orientationCandidat).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a OrientationCandidat', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of OrientationCandidat', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a OrientationCandidat', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addOrientationCandidatToCollectionIfMissing', () => {
      it('should add a OrientationCandidat to an empty array', () => {
        const orientationCandidat: IOrientationCandidat = sampleWithRequiredData;
        expectedResult = service.addOrientationCandidatToCollectionIfMissing([], orientationCandidat);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(orientationCandidat);
      });

      it('should not add a OrientationCandidat to an array that contains it', () => {
        const orientationCandidat: IOrientationCandidat = sampleWithRequiredData;
        const orientationCandidatCollection: IOrientationCandidat[] = [
          {
            ...orientationCandidat,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addOrientationCandidatToCollectionIfMissing(orientationCandidatCollection, orientationCandidat);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a OrientationCandidat to an array that doesn't contain it", () => {
        const orientationCandidat: IOrientationCandidat = sampleWithRequiredData;
        const orientationCandidatCollection: IOrientationCandidat[] = [sampleWithPartialData];
        expectedResult = service.addOrientationCandidatToCollectionIfMissing(orientationCandidatCollection, orientationCandidat);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(orientationCandidat);
      });

      it('should add only unique OrientationCandidat to an array', () => {
        const orientationCandidatArray: IOrientationCandidat[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const orientationCandidatCollection: IOrientationCandidat[] = [sampleWithRequiredData];
        expectedResult = service.addOrientationCandidatToCollectionIfMissing(orientationCandidatCollection, ...orientationCandidatArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const orientationCandidat: IOrientationCandidat = sampleWithRequiredData;
        const orientationCandidat2: IOrientationCandidat = sampleWithPartialData;
        expectedResult = service.addOrientationCandidatToCollectionIfMissing([], orientationCandidat, orientationCandidat2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(orientationCandidat);
        expect(expectedResult).toContain(orientationCandidat2);
      });

      it('should accept null and undefined values', () => {
        const orientationCandidat: IOrientationCandidat = sampleWithRequiredData;
        expectedResult = service.addOrientationCandidatToCollectionIfMissing([], null, orientationCandidat, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(orientationCandidat);
      });

      it('should return initial array if no OrientationCandidat is added', () => {
        const orientationCandidatCollection: IOrientationCandidat[] = [sampleWithRequiredData];
        expectedResult = service.addOrientationCandidatToCollectionIfMissing(orientationCandidatCollection, undefined, null);
        expect(expectedResult).toEqual(orientationCandidatCollection);
      });
    });

    describe('compareOrientationCandidat', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareOrientationCandidat(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareOrientationCandidat(entity1, entity2);
        const compareResult2 = service.compareOrientationCandidat(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareOrientationCandidat(entity1, entity2);
        const compareResult2 = service.compareOrientationCandidat(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareOrientationCandidat(entity1, entity2);
        const compareResult2 = service.compareOrientationCandidat(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
