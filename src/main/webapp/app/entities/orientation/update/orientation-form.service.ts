import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IOrientation, NewOrientation } from '../orientation.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IOrientation for edit and NewOrientationFormGroupInput for create.
 */
type OrientationFormGroupInput = IOrientation | PartialWithRequiredKeyOf<NewOrientation>;

type OrientationFormDefaults = Pick<NewOrientation, 'id' | 'candidats'>;

type OrientationFormGroupContent = {
  id: FormControl<IOrientation['id'] | NewOrientation['id']>;
  libelle: FormControl<IOrientation['libelle']>;
  agence: FormControl<IOrientation['agence']>;
  candidats: FormControl<IOrientation['candidats']>;
};

export type OrientationFormGroup = FormGroup<OrientationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class OrientationFormService {
  createOrientationFormGroup(orientation: OrientationFormGroupInput = { id: null }): OrientationFormGroup {
    const orientationRawValue = {
      ...this.getFormDefaults(),
      ...orientation,
    };
    return new FormGroup<OrientationFormGroupContent>({
      id: new FormControl(
        { value: orientationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      libelle: new FormControl(orientationRawValue.libelle, {
        validators: [Validators.maxLength(30)],
      }),
      agence: new FormControl(orientationRawValue.agence),
      candidats: new FormControl(orientationRawValue.candidats ?? []),
    });
  }

  getOrientation(form: OrientationFormGroup): IOrientation | NewOrientation {
    return form.getRawValue() as IOrientation | NewOrientation;
  }

  resetForm(form: OrientationFormGroup, orientation: OrientationFormGroupInput): void {
    const orientationRawValue = { ...this.getFormDefaults(), ...orientation };
    form.reset(
      {
        ...orientationRawValue,
        id: { value: orientationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): OrientationFormDefaults {
    return {
      id: null,
      candidats: [],
    };
  }
}
