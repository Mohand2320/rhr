import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../poste.test-samples';

import { PosteFormService } from './poste-form.service';

describe('Poste Form Service', () => {
  let service: PosteFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PosteFormService);
  });

  describe('Service methods', () => {
    describe('createPosteFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPosteFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nomPoste: expect.any(Object),
            numeroPoste: expect.any(Object),
            diponible: expect.any(Object),
            typePoste: expect.any(Object),
            previsions: expect.any(Object),
          })
        );
      });

      it('passing IPoste should create a new form with FormGroup', () => {
        const formGroup = service.createPosteFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nomPoste: expect.any(Object),
            numeroPoste: expect.any(Object),
            diponible: expect.any(Object),
            typePoste: expect.any(Object),
            previsions: expect.any(Object),
          })
        );
      });
    });

    describe('getPoste', () => {
      it('should return NewPoste for default Poste initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createPosteFormGroup(sampleWithNewData);

        const poste = service.getPoste(formGroup) as any;

        expect(poste).toMatchObject(sampleWithNewData);
      });

      it('should return NewPoste for empty Poste initial value', () => {
        const formGroup = service.createPosteFormGroup();

        const poste = service.getPoste(formGroup) as any;

        expect(poste).toMatchObject({});
      });

      it('should return IPoste', () => {
        const formGroup = service.createPosteFormGroup(sampleWithRequiredData);

        const poste = service.getPoste(formGroup) as any;

        expect(poste).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPoste should not enable id FormControl', () => {
        const formGroup = service.createPosteFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPoste should disable id FormControl', () => {
        const formGroup = service.createPosteFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
