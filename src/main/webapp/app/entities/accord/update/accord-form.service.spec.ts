import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../accord.test-samples';

import { AccordFormService } from './accord-form.service';

describe('Accord Form Service', () => {
  let service: AccordFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccordFormService);
  });

  describe('Service methods', () => {
    describe('createAccordFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAccordFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            validateur: expect.any(Object),
            numeroAccord: expect.any(Object),
            dateArrivee: expect.any(Object),
          })
        );
      });

      it('passing IAccord should create a new form with FormGroup', () => {
        const formGroup = service.createAccordFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            validateur: expect.any(Object),
            numeroAccord: expect.any(Object),
            dateArrivee: expect.any(Object),
          })
        );
      });
    });

    describe('getAccord', () => {
      it('should return NewAccord for default Accord initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createAccordFormGroup(sampleWithNewData);

        const accord = service.getAccord(formGroup) as any;

        expect(accord).toMatchObject(sampleWithNewData);
      });

      it('should return NewAccord for empty Accord initial value', () => {
        const formGroup = service.createAccordFormGroup();

        const accord = service.getAccord(formGroup) as any;

        expect(accord).toMatchObject({});
      });

      it('should return IAccord', () => {
        const formGroup = service.createAccordFormGroup(sampleWithRequiredData);

        const accord = service.getAccord(formGroup) as any;

        expect(accord).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAccord should not enable id FormControl', () => {
        const formGroup = service.createAccordFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAccord should disable id FormControl', () => {
        const formGroup = service.createAccordFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
