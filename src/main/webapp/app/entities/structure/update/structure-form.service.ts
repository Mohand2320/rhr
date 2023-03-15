import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IStructure, NewStructure } from '../structure.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IStructure for edit and NewStructureFormGroupInput for create.
 */
type StructureFormGroupInput = IStructure | PartialWithRequiredKeyOf<NewStructure>;

type StructureFormDefaults = Pick<NewStructure, 'id'>;

type StructureFormGroupContent = {
  id: FormControl<IStructure['id'] | NewStructure['id']>;
  nom: FormControl<IStructure['nom']>;
  demande: FormControl<IStructure['demande']>;
  offre: FormControl<IStructure['offre']>;
};

export type StructureFormGroup = FormGroup<StructureFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class StructureFormService {
  createStructureFormGroup(structure: StructureFormGroupInput = { id: null }): StructureFormGroup {
    const structureRawValue = {
      ...this.getFormDefaults(),
      ...structure,
    };
    return new FormGroup<StructureFormGroupContent>({
      id: new FormControl(
        { value: structureRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      nom: new FormControl(structureRawValue.nom, {
        validators: [Validators.required, Validators.maxLength(30)],
      }),
      demande: new FormControl(structureRawValue.demande),
      offre: new FormControl(structureRawValue.offre),
    });
  }

  getStructure(form: StructureFormGroup): IStructure | NewStructure {
    return form.getRawValue() as IStructure | NewStructure;
  }

  resetForm(form: StructureFormGroup, structure: StructureFormGroupInput): void {
    const structureRawValue = { ...this.getFormDefaults(), ...structure };
    form.reset(
      {
        ...structureRawValue,
        id: { value: structureRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): StructureFormDefaults {
    return {
      id: null,
    };
  }
}
