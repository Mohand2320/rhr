import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IExamen, NewExamen } from '../examen.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IExamen for edit and NewExamenFormGroupInput for create.
 */
type ExamenFormGroupInput = IExamen | PartialWithRequiredKeyOf<NewExamen>;

type ExamenFormDefaults = Pick<NewExamen, 'id' | 'candidats'>;

type ExamenFormGroupContent = {
  id: FormControl<IExamen['id'] | NewExamen['id']>;
  datePrevue: FormControl<IExamen['datePrevue']>;
  dateExamen: FormControl<IExamen['dateExamen']>;
  etat: FormControl<IExamen['etat']>;
  lieuExamen: FormControl<IExamen['lieuExamen']>;
  miniDossier: FormControl<IExamen['miniDossier']>;
  offrePoste: FormControl<IExamen['offrePoste']>;
  candidats: FormControl<IExamen['candidats']>;
};

export type ExamenFormGroup = FormGroup<ExamenFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ExamenFormService {
  createExamenFormGroup(examen: ExamenFormGroupInput = { id: null }): ExamenFormGroup {
    const examenRawValue = {
      ...this.getFormDefaults(),
      ...examen,
    };
    return new FormGroup<ExamenFormGroupContent>({
      id: new FormControl(
        { value: examenRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      datePrevue: new FormControl(examenRawValue.datePrevue, {
        validators: [Validators.required],
      }),
      dateExamen: new FormControl(examenRawValue.dateExamen, {
        validators: [Validators.required],
      }),
      etat: new FormControl(examenRawValue.etat),
      lieuExamen: new FormControl(examenRawValue.lieuExamen),
      miniDossier: new FormControl(examenRawValue.miniDossier),
      offrePoste: new FormControl(examenRawValue.offrePoste),
      candidats: new FormControl(examenRawValue.candidats ?? []),
    });
  }

  getExamen(form: ExamenFormGroup): IExamen | NewExamen {
    return form.getRawValue() as IExamen | NewExamen;
  }

  resetForm(form: ExamenFormGroup, examen: ExamenFormGroupInput): void {
    const examenRawValue = { ...this.getFormDefaults(), ...examen };
    form.reset(
      {
        ...examenRawValue,
        id: { value: examenRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ExamenFormDefaults {
    return {
      id: null,
      candidats: [],
    };
  }
}
