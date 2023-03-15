import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../offre-poste.test-samples';

import { OffrePosteFormService } from './offre-poste-form.service';

describe('OffrePoste Form Service', () => {
  let service: OffrePosteFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OffrePosteFormService);
  });

  describe('Service methods', () => {
    describe('createOffrePosteFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createOffrePosteFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nbr: expect.any(Object),
            exigence: expect.any(Object),
            orientation: expect.any(Object),
          })
        );
      });

      it('passing IOffrePoste should create a new form with FormGroup', () => {
        const formGroup = service.createOffrePosteFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nbr: expect.any(Object),
            exigence: expect.any(Object),
            orientation: expect.any(Object),
          })
        );
      });
    });

    describe('getOffrePoste', () => {
      it('should return NewOffrePoste for default OffrePoste initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createOffrePosteFormGroup(sampleWithNewData);

        const offrePoste = service.getOffrePoste(formGroup) as any;

        expect(offrePoste).toMatchObject(sampleWithNewData);
      });

      it('should return NewOffrePoste for empty OffrePoste initial value', () => {
        const formGroup = service.createOffrePosteFormGroup();

        const offrePoste = service.getOffrePoste(formGroup) as any;

        expect(offrePoste).toMatchObject({});
      });

      it('should return IOffrePoste', () => {
        const formGroup = service.createOffrePosteFormGroup(sampleWithRequiredData);

        const offrePoste = service.getOffrePoste(formGroup) as any;

        expect(offrePoste).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IOffrePoste should not enable id FormControl', () => {
        const formGroup = service.createOffrePosteFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewOffrePoste should disable id FormControl', () => {
        const formGroup = service.createOffrePosteFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
