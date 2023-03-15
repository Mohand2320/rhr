import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IAccord, NewAccord } from '../accord.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAccord for edit and NewAccordFormGroupInput for create.
 */
type AccordFormGroupInput = IAccord | PartialWithRequiredKeyOf<NewAccord>;

type AccordFormDefaults = Pick<NewAccord, 'id'>;

type AccordFormGroupContent = {
  id: FormControl<IAccord['id'] | NewAccord['id']>;
  validateur: FormControl<IAccord['validateur']>;
  numeroAccord: FormControl<IAccord['numeroAccord']>;
  dateArrivee: FormControl<IAccord['dateArrivee']>;
};

export type AccordFormGroup = FormGroup<AccordFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AccordFormService {
  createAccordFormGroup(accord: AccordFormGroupInput = { id: null }): AccordFormGroup {
    const accordRawValue = {
      ...this.getFormDefaults(),
      ...accord,
    };
    return new FormGroup<AccordFormGroupContent>({
      id: new FormControl(
        { value: accordRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      validateur: new FormControl(accordRawValue.validateur, {
        validators: [Validators.required, Validators.maxLength(30)],
      }),
      numeroAccord: new FormControl(accordRawValue.numeroAccord, {
        validators: [Validators.required, Validators.maxLength(30)],
      }),
      dateArrivee: new FormControl(accordRawValue.dateArrivee),
    });
  }

  getAccord(form: AccordFormGroup): IAccord | NewAccord {
    return form.getRawValue() as IAccord | NewAccord;
  }

  resetForm(form: AccordFormGroup, accord: AccordFormGroupInput): void {
    const accordRawValue = { ...this.getFormDefaults(), ...accord };
    form.reset(
      {
        ...accordRawValue,
        id: { value: accordRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): AccordFormDefaults {
    return {
      id: null,
    };
  }
}
