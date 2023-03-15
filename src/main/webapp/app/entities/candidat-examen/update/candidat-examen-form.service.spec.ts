import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../candidat-examen.test-samples';

import { CandidatExamenFormService } from './candidat-examen-form.service';

describe('CandidatExamen Form Service', () => {
  let service: CandidatExamenFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CandidatExamenFormService);
  });

  describe('Service methods', () => {
    describe('createCandidatExamenFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCandidatExamenFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            present: expect.any(Object),
            admis: expect.any(Object),
            reserve: expect.any(Object),
            situation: expect.any(Object),
            candidats: expect.any(Object),
            examen: expect.any(Object),
          })
        );
      });

      it('passing ICandidatExamen should create a new form with FormGroup', () => {
        const formGroup = service.createCandidatExamenFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            present: expect.any(Object),
            admis: expect.any(Object),
            reserve: expect.any(Object),
            situation: expect.any(Object),
            candidats: expect.any(Object),
            examen: expect.any(Object),
          })
        );
      });
    });

    describe('getCandidatExamen', () => {
      it('should return NewCandidatExamen for default CandidatExamen initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCandidatExamenFormGroup(sampleWithNewData);

        const candidatExamen = service.getCandidatExamen(formGroup) as any;

        expect(candidatExamen).toMatchObject(sampleWithNewData);
      });

      it('should return NewCandidatExamen for empty CandidatExamen initial value', () => {
        const formGroup = service.createCandidatExamenFormGroup();

        const candidatExamen = service.getCandidatExamen(formGroup) as any;

        expect(candidatExamen).toMatchObject({});
      });

      it('should return ICandidatExamen', () => {
        const formGroup = service.createCandidatExamenFormGroup(sampleWithRequiredData);

        const candidatExamen = service.getCandidatExamen(formGroup) as any;

        expect(candidatExamen).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICandidatExamen should not enable id FormControl', () => {
        const formGroup = service.createCandidatExamenFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCandidatExamen should disable id FormControl', () => {
        const formGroup = service.createCandidatExamenFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
