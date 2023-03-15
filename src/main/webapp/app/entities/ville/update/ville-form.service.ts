import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IVille, NewVille } from '../ville.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IVille for edit and NewVilleFormGroupInput for create.
 */
type VilleFormGroupInput = IVille | PartialWithRequiredKeyOf<NewVille>;

type VilleFormDefaults = Pick<NewVille, 'id'>;

type VilleFormGroupContent = {
  id: FormControl<IVille['id'] | NewVille['id']>;
  libelle: FormControl<IVille['libelle']>;
};

export type VilleFormGroup = FormGroup<VilleFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class VilleFormService {
  createVilleFormGroup(ville: VilleFormGroupInput = { id: null }): VilleFormGroup {
    const villeRawValue = {
      ...this.getFormDefaults(),
      ...ville,
    };
    return new FormGroup<VilleFormGroupContent>({
      id: new FormControl(
        { value: villeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      libelle: new FormControl(villeRawValue.libelle, {
        validators: [Validators.maxLength(30)],
      }),
    });
  }

  getVille(form: VilleFormGroup): IVille | NewVille {
    return form.getRawValue() as IVille | NewVille;
  }

  resetForm(form: VilleFormGroup, ville: VilleFormGroupInput): void {
    const villeRawValue = { ...this.getFormDefaults(), ...ville };
    form.reset(
      {
        ...villeRawValue,
        id: { value: villeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): VilleFormDefaults {
    return {
      id: null,
    };
  }
}
