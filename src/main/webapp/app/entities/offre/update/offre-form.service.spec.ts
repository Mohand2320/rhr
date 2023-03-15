import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../offre.test-samples';

import { OffreFormService } from './offre-form.service';

describe('Offre Form Service', () => {
  let service: OffreFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OffreFormService);
  });

  describe('Service methods', () => {
    describe('createOffreFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createOffreFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            numeroOffre: expect.any(Object),
            dateOffre: expect.any(Object),
            dateDepot: expect.any(Object),
            etatOffre: expect.any(Object),
            typeOffre: expect.any(Object),
            singnataire: expect.any(Object),
            demande: expect.any(Object),
            historiqueOffre: expect.any(Object),
            agence: expect.any(Object),
          })
        );
      });

      it('passing IOffre should create a new form with FormGroup', () => {
        const formGroup = service.createOffreFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            numeroOffre: expect.any(Object),
            dateOffre: expect.any(Object),
            dateDepot: expect.any(Object),
            etatOffre: expect.any(Object),
            typeOffre: expect.any(Object),
            singnataire: expect.any(Object),
            demande: expect.any(Object),
            historiqueOffre: expect.any(Object),
            agence: expect.any(Object),
          })
        );
      });
    });

    describe('getOffre', () => {
      it('should return NewOffre for default Offre initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createOffreFormGroup(sampleWithNewData);

        const offre = service.getOffre(formGroup) as any;

        expect(offre).toMatchObject(sampleWithNewData);
      });

      it('should return NewOffre for empty Offre initial value', () => {
        const formGroup = service.createOffreFormGroup();

        const offre = service.getOffre(formGroup) as any;

        expect(offre).toMatchObject({});
      });

      it('should return IOffre', () => {
        const formGroup = service.createOffreFormGroup(sampleWithRequiredData);

        const offre = service.getOffre(formGroup) as any;

        expect(offre).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IOffre should not enable id FormControl', () => {
        const formGroup = service.createOffreFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewOffre should disable id FormControl', () => {
        const formGroup = service.createOffreFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});