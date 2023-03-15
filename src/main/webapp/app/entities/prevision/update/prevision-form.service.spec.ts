import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../prevision.test-samples';

import { PrevisionFormService } from './prevision-form.service';

describe('Prevision Form Service', () => {
  let service: PrevisionFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrevisionFormService);
  });

  describe('Service methods', () => {
    describe('createPrevisionFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPrevisionFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dateAjout: expect.any(Object),
            agence: expect.any(Object),
            postes: expect.any(Object),
          })
        );
      });

      it('passing IPrevision should create a new form with FormGroup', () => {
        const formGroup = service.createPrevisionFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dateAjout: expect.any(Object),
            agence: expect.any(Object),
            postes: expect.any(Object),
          })
        );
      });
    });

    describe('getPrevision', () => {
      it('should return NewPrevision for default Prevision initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createPrevisionFormGroup(sampleWithNewData);

        const prevision = service.getPrevision(formGroup) as any;

        expect(prevision).toMatchObject(sampleWithNewData);
      });

      it('should return NewPrevision for empty Prevision initial value', () => {
        const formGroup = service.createPrevisionFormGroup();

        const prevision = service.getPrevision(formGroup) as any;

        expect(prevision).toMatchObject({});
      });

      it('should return IPrevision', () => {
        const formGroup = service.createPrevisionFormGroup(sampleWithRequiredData);

        const prevision = service.getPrevision(formGroup) as any;

        expect(prevision).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPrevision should not enable id FormControl', () => {
        const formGroup = service.createPrevisionFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPrevision should disable id FormControl', () => {
        const formGroup = service.createPrevisionFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
