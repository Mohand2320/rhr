import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../historique-offre.test-samples';

import { HistoriqueOffreFormService } from './historique-offre-form.service';

describe('HistoriqueOffre Form Service', () => {
  let service: HistoriqueOffreFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoriqueOffreFormService);
  });

  describe('Service methods', () => {
    describe('createHistoriqueOffreFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createHistoriqueOffreFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dateHistorique: expect.any(Object),
            etat: expect.any(Object),
          })
        );
      });

      it('passing IHistoriqueOffre should create a new form with FormGroup', () => {
        const formGroup = service.createHistoriqueOffreFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dateHistorique: expect.any(Object),
            etat: expect.any(Object),
          })
        );
      });
    });

    describe('getHistoriqueOffre', () => {
      it('should return NewHistoriqueOffre for default HistoriqueOffre initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createHistoriqueOffreFormGroup(sampleWithNewData);

        const historiqueOffre = service.getHistoriqueOffre(formGroup) as any;

        expect(historiqueOffre).toMatchObject(sampleWithNewData);
      });

      it('should return NewHistoriqueOffre for empty HistoriqueOffre initial value', () => {
        const formGroup = service.createHistoriqueOffreFormGroup();

        const historiqueOffre = service.getHistoriqueOffre(formGroup) as any;

        expect(historiqueOffre).toMatchObject({});
      });

      it('should return IHistoriqueOffre', () => {
        const formGroup = service.createHistoriqueOffreFormGroup(sampleWithRequiredData);

        const historiqueOffre = service.getHistoriqueOffre(formGroup) as any;

        expect(historiqueOffre).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IHistoriqueOffre should not enable id FormControl', () => {
        const formGroup = service.createHistoriqueOffreFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewHistoriqueOffre should disable id FormControl', () => {
        const formGroup = service.createHistoriqueOffreFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
