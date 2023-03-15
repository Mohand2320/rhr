import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPrevision, NewPrevision } from '../prevision.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPrevision for edit and NewPrevisionFormGroupInput for create.
 */
type PrevisionFormGroupInput = IPrevision | PartialWithRequiredKeyOf<NewPrevision>;

type PrevisionFormDefaults = Pick<NewPrevision, 'id' | 'postes'>;

type PrevisionFormGroupContent = {
  id: FormControl<IPrevision['id'] | NewPrevision['id']>;
  dateAjout: FormControl<IPrevision['dateAjout']>;
  agence: FormControl<IPrevision['agence']>;
  postes: FormControl<IPrevision['postes']>;
};

export type PrevisionFormGroup = FormGroup<PrevisionFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PrevisionFormService {
  createPrevisionFormGroup(prevision: PrevisionFormGroupInput = { id: null }): PrevisionFormGroup {
    const previsionRawValue = {
      ...this.getFormDefaults(),
      ...prevision,
    };
    return new FormGroup<PrevisionFormGroupContent>({
      id: new FormControl(
        { value: previsionRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      dateAjout: new FormControl(previsionRawValue.dateAjout, {
        validators: [Validators.required],
      }),
      agence: new FormControl(previsionRawValue.agence),
      postes: new FormControl(previsionRawValue.postes ?? []),
    });
  }

  getPrevision(form: PrevisionFormGroup): IPrevision | NewPrevision {
    return form.getRawValue() as IPrevision | NewPrevision;
  }

  resetForm(form: PrevisionFormGroup, prevision: PrevisionFormGroupInput): void {
    const previsionRawValue = { ...this.getFormDefaults(), ...prevision };
    form.reset(
      {
        ...previsionRawValue,
        id: { value: previsionRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PrevisionFormDefaults {
    return {
      id: null,
      postes: [],
    };
  }
}
