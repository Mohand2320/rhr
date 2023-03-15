import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IAgence, NewAgence } from '../agence.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAgence for edit and NewAgenceFormGroupInput for create.
 */
type AgenceFormGroupInput = IAgence | PartialWithRequiredKeyOf<NewAgence>;

type AgenceFormDefaults = Pick<NewAgence, 'id'>;

type AgenceFormGroupContent = {
  id: FormControl<IAgence['id'] | NewAgence['id']>;
  libelle: FormControl<IAgence['libelle']>;
  tel: FormControl<IAgence['tel']>;
  ville: FormControl<IAgence['ville']>;
  agence: FormControl<IAgence['agence']>;
};

export type AgenceFormGroup = FormGroup<AgenceFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AgenceFormService {
  createAgenceFormGroup(agence: AgenceFormGroupInput = { id: null }): AgenceFormGroup {
    const agenceRawValue = {
      ...this.getFormDefaults(),
      ...agence,
    };
    return new FormGroup<AgenceFormGroupContent>({
      id: new FormControl(
        { value: agenceRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      libelle: new FormControl(agenceRawValue.libelle, {
        validators: [Validators.required, Validators.maxLength(30)],
      }),
      tel: new FormControl(agenceRawValue.tel, {
        validators: [Validators.pattern('^(00|[+])[1-9][0-9]{8,14}$|^0[1-9][0-9]{8,9}$')],
      }),
      ville: new FormControl(agenceRawValue.ville),
      agence: new FormControl(agenceRawValue.agence),
    });
  }

  getAgence(form: AgenceFormGroup): IAgence | NewAgence {
    return form.getRawValue() as IAgence | NewAgence;
  }

  resetForm(form: AgenceFormGroup, agence: AgenceFormGroupInput): void {
    const agenceRawValue = { ...this.getFormDefaults(), ...agence };
    form.reset(
      {
        ...agenceRawValue,
        id: { value: agenceRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): AgenceFormDefaults {
    return {
      id: null,
    };
  }
}
