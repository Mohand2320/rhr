import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../prevision-poste.test-samples';

import { PrevisionPosteFormService } from './prevision-poste-form.service';

describe('PrevisionPoste Form Service', () => {
  let service: PrevisionPosteFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrevisionPosteFormService);
  });

  describe('Service methods', () => {
    describe('createPrevisionPosteFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPrevisionPosteFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dateAjout: expect.any(Object),
            previsions: expect.any(Object),
            postes: expect.any(Object),
          })
        );
      });

      it('passing IPrevisionPoste should create a new form with FormGroup', () => {
        const formGroup = service.createPrevisionPosteFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dateAjout: expect.any(Object),
            previsions: expect.any(Object),
            postes: expect.any(Object),
          })
        );
      });
    });

    describe('getPrevisionPoste', () => {
      it('should return NewPrevisionPoste for default PrevisionPoste initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createPrevisionPosteFormGroup(sampleWithNewData);

        const previsionPoste = service.getPrevisionPoste(formGroup) as any;

        expect(previsionPoste).toMatchObject(sampleWithNewData);
      });

      it('should return NewPrevisionPoste for empty PrevisionPoste initial value', () => {
        const formGroup = service.createPrevisionPosteFormGroup();

        const previsionPoste = service.getPrevisionPoste(formGroup) as any;

        expect(previsionPoste).toMatchObject({});
      });

      it('should return IPrevisionPoste', () => {
        const formGroup = service.createPrevisionPosteFormGroup(sampleWithRequiredData);

        const previsionPoste = service.getPrevisionPoste(formGroup) as any;

        expect(previsionPoste).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPrevisionPoste should not enable id FormControl', () => {
        const formGroup = service.createPrevisionPosteFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPrevisionPoste should disable id FormControl', () => {
        const formGroup = service.createPrevisionPosteFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
