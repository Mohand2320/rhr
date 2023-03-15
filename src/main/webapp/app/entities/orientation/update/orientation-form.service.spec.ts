import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../orientation.test-samples';

import { OrientationFormService } from './orientation-form.service';

describe('Orientation Form Service', () => {
  let service: OrientationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrientationFormService);
  });

  describe('Service methods', () => {
    describe('createOrientationFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createOrientationFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            libelle: expect.any(Object),
            agence: expect.any(Object),
            candidats: expect.any(Object),
          })
        );
      });

      it('passing IOrientation should create a new form with FormGroup', () => {
        const formGroup = service.createOrientationFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            libelle: expect.any(Object),
            agence: expect.any(Object),
            candidats: expect.any(Object),
          })
        );
      });
    });

    describe('getOrientation', () => {
      it('should return NewOrientation for default Orientation initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createOrientationFormGroup(sampleWithNewData);

        const orientation = service.getOrientation(formGroup) as any;

        expect(orientation).toMatchObject(sampleWithNewData);
      });

      it('should return NewOrientation for empty Orientation initial value', () => {
        const formGroup = service.createOrientationFormGroup();

        const orientation = service.getOrientation(formGroup) as any;

        expect(orientation).toMatchObject({});
      });

      it('should return IOrientation', () => {
        const formGroup = service.createOrientationFormGroup(sampleWithRequiredData);

        const orientation = service.getOrientation(formGroup) as any;

        expect(orientation).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IOrientation should not enable id FormControl', () => {
        const formGroup = service.createOrientationFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewOrientation should disable id FormControl', () => {
        const formGroup = service.createOrientationFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
