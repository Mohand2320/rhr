import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../orientation-candidat.test-samples';

import { OrientationCandidatFormService } from './orientation-candidat-form.service';

describe('OrientationCandidat Form Service', () => {
  let service: OrientationCandidatFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrientationCandidatFormService);
  });

  describe('Service methods', () => {
    describe('createOrientationCandidatFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createOrientationCandidatFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dateOrientation: expect.any(Object),
            candidats: expect.any(Object),
            orientations: expect.any(Object),
          })
        );
      });

      it('passing IOrientationCandidat should create a new form with FormGroup', () => {
        const formGroup = service.createOrientationCandidatFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dateOrientation: expect.any(Object),
            candidats: expect.any(Object),
            orientations: expect.any(Object),
          })
        );
      });
    });

    describe('getOrientationCandidat', () => {
      it('should return NewOrientationCandidat for default OrientationCandidat initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createOrientationCandidatFormGroup(sampleWithNewData);

        const orientationCandidat = service.getOrientationCandidat(formGroup) as any;

        expect(orientationCandidat).toMatchObject(sampleWithNewData);
      });

      it('should return NewOrientationCandidat for empty OrientationCandidat initial value', () => {
        const formGroup = service.createOrientationCandidatFormGroup();

        const orientationCandidat = service.getOrientationCandidat(formGroup) as any;

        expect(orientationCandidat).toMatchObject({});
      });

      it('should return IOrientationCandidat', () => {
        const formGroup = service.createOrientationCandidatFormGroup(sampleWithRequiredData);

        const orientationCandidat = service.getOrientationCandidat(formGroup) as any;

        expect(orientationCandidat).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IOrientationCandidat should not enable id FormControl', () => {
        const formGroup = service.createOrientationCandidatFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewOrientationCandidat should disable id FormControl', () => {
        const formGroup = service.createOrientationCandidatFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
