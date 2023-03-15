import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../candidat.test-samples';

import { CandidatFormService } from './candidat-form.service';

describe('Candidat Form Service', () => {
  let service: CandidatFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CandidatFormService);
  });

  describe('Service methods', () => {
    describe('createCandidatFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCandidatFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nom: expect.any(Object),
            prenom: expect.any(Object),
            dateNaissance: expect.any(Object),
            tel: expect.any(Object),
            numeroInscription: expect.any(Object),
            examen: expect.any(Object),
            orientations: expect.any(Object),
          })
        );
      });

      it('passing ICandidat should create a new form with FormGroup', () => {
        const formGroup = service.createCandidatFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nom: expect.any(Object),
            prenom: expect.any(Object),
            dateNaissance: expect.any(Object),
            tel: expect.any(Object),
            numeroInscription: expect.any(Object),
            examen: expect.any(Object),
            orientations: expect.any(Object),
          })
        );
      });
    });

    describe('getCandidat', () => {
      it('should return NewCandidat for default Candidat initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCandidatFormGroup(sampleWithNewData);

        const candidat = service.getCandidat(formGroup) as any;

        expect(candidat).toMatchObject(sampleWithNewData);
      });

      it('should return NewCandidat for empty Candidat initial value', () => {
        const formGroup = service.createCandidatFormGroup();

        const candidat = service.getCandidat(formGroup) as any;

        expect(candidat).toMatchObject({});
      });

      it('should return ICandidat', () => {
        const formGroup = service.createCandidatFormGroup(sampleWithRequiredData);

        const candidat = service.getCandidat(formGroup) as any;

        expect(candidat).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICandidat should not enable id FormControl', () => {
        const formGroup = service.createCandidatFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCandidat should disable id FormControl', () => {
        const formGroup = service.createCandidatFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});