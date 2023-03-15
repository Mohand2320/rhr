import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../structure.test-samples';

import { StructureFormService } from './structure-form.service';

describe('Structure Form Service', () => {
  let service: StructureFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StructureFormService);
  });

  describe('Service methods', () => {
    describe('createStructureFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createStructureFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nom: expect.any(Object),
            demande: expect.any(Object),
            offre: expect.any(Object),
          })
        );
      });

      it('passing IStructure should create a new form with FormGroup', () => {
        const formGroup = service.createStructureFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nom: expect.any(Object),
            demande: expect.any(Object),
            offre: expect.any(Object),
          })
        );
      });
    });

    describe('getStructure', () => {
      it('should return NewStructure for default Structure initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createStructureFormGroup(sampleWithNewData);

        const structure = service.getStructure(formGroup) as any;

        expect(structure).toMatchObject(sampleWithNewData);
      });

      it('should return NewStructure for empty Structure initial value', () => {
        const formGroup = service.createStructureFormGroup();

        const structure = service.getStructure(formGroup) as any;

        expect(structure).toMatchObject({});
      });

      it('should return IStructure', () => {
        const formGroup = service.createStructureFormGroup(sampleWithRequiredData);

        const structure = service.getStructure(formGroup) as any;

        expect(structure).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IStructure should not enable id FormControl', () => {
        const formGroup = service.createStructureFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewStructure should disable id FormControl', () => {
        const formGroup = service.createStructureFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
