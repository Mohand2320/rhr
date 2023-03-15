import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IOrientation } from '../orientation.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../orientation.test-samples';

import { OrientationService } from './orientation.service';

const requireRestSample: IOrientation = {
  ...sampleWithRequiredData,
};

describe('Orientation Service', () => {
  let service: OrientationService;
  let httpMock: HttpTestingController;
  let expectedResult: IOrientation | IOrientation[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(OrientationService);
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

    it('should create a Orientation', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const orientation = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(orientation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Orientation', () => {
      const orientation = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(orientation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Orientation', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Orientation', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Orientation', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addOrientationToCollectionIfMissing', () => {
      it('should add a Orientation to an empty array', () => {
        const orientation: IOrientation = sampleWithRequiredData;
        expectedResult = service.addOrientationToCollectionIfMissing([], orientation);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(orientation);
      });

      it('should not add a Orientation to an array that contains it', () => {
        const orientation: IOrientation = sampleWithRequiredData;
        const orientationCollection: IOrientation[] = [
          {
            ...orientation,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addOrientationToCollectionIfMissing(orientationCollection, orientation);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Orientation to an array that doesn't contain it", () => {
        const orientation: IOrientation = sampleWithRequiredData;
        const orientationCollection: IOrientation[] = [sampleWithPartialData];
        expectedResult = service.addOrientationToCollectionIfMissing(orientationCollection, orientation);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(orientation);
      });

      it('should add only unique Orientation to an array', () => {
        const orientationArray: IOrientation[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const orientationCollection: IOrientation[] = [sampleWithRequiredData];
        expectedResult = service.addOrientationToCollectionIfMissing(orientationCollection, ...orientationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const orientation: IOrientation = sampleWithRequiredData;
        const orientation2: IOrientation = sampleWithPartialData;
        expectedResult = service.addOrientationToCollectionIfMissing([], orientation, orientation2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(orientation);
        expect(expectedResult).toContain(orientation2);
      });

      it('should accept null and undefined values', () => {
        const orientation: IOrientation = sampleWithRequiredData;
        expectedResult = service.addOrientationToCollectionIfMissing([], null, orientation, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(orientation);
      });

      it('should return initial array if no Orientation is added', () => {
        const orientationCollection: IOrientation[] = [sampleWithRequiredData];
        expectedResult = service.addOrientationToCollectionIfMissing(orientationCollection, undefined, null);
        expect(expectedResult).toEqual(orientationCollection);
      });
    });

    describe('compareOrientation', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareOrientation(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareOrientation(entity1, entity2);
        const compareResult2 = service.compareOrientation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareOrientation(entity1, entity2);
        const compareResult2 = service.compareOrientation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareOrientation(entity1, entity2);
        const compareResult2 = service.compareOrientation(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
