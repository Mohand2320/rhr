import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICandidatExamen, NewCandidatExamen } from '../candidat-examen.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICandidatExamen for edit and NewCandidatExamenFormGroupInput for create.
 */
type CandidatExamenFormGroupInput = ICandidatExamen | PartialWithRequiredKeyOf<NewCandidatExamen>;

type CandidatExamenFormDefaults = Pick<NewCandidatExamen, 'id' | 'present' | 'admis' | 'reserve' | 'candidats' | 'examen'>;

type CandidatExamenFormGroupContent = {
  id: FormControl<ICandidatExamen['id'] | NewCandidatExamen['id']>;
  present: FormControl<ICandidatExamen['present']>;
  admis: FormControl<ICandidatExamen['admis']>;
  reserve: FormControl<ICandidatExamen['reserve']>;
  situation: FormControl<ICandidatExamen['situation']>;
  candidats: FormControl<ICandidatExamen['candidats']>;
  examen: FormControl<ICandidatExamen['examen']>;
};

export type CandidatExamenFormGroup = FormGroup<CandidatExamenFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CandidatExamenFormService {
  createCandidatExamenFormGroup(candidatExamen: CandidatExamenFormGroupInput = { id: null }): CandidatExamenFormGroup {
    const candidatExamenRawValue = {
      ...this.getFormDefaults(),
      ...candidatExamen,
    };
    return new FormGroup<CandidatExamenFormGroupContent>({
      id: new FormControl(
        { value: candidatExamenRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      present: new FormControl(candidatExamenRawValue.present),
      admis: new FormControl(candidatExamenRawValue.admis),
      reserve: new FormControl(candidatExamenRawValue.reserve),
      situation: new FormControl(candidatExamenRawValue.situation),
      candidats: new FormControl(candidatExamenRawValue.candidats ?? []),
      examen: new FormControl(candidatExamenRawValue.examen ?? []),
    });
  }

  getCandidatExamen(form: CandidatExamenFormGroup): ICandidatExamen | NewCandidatExamen {
    return form.getRawValue() as ICandidatExamen | NewCandidatExamen;
  }

  resetForm(form: CandidatExamenFormGroup, candidatExamen: CandidatExamenFormGroupInput): void {
    const candidatExamenRawValue = { ...this.getFormDefaults(), ...candidatExamen };
    form.reset(
      {
        ...candidatExamenRawValue,
        id: { value: candidatExamenRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CandidatExamenFormDefaults {
    return {
      id: null,
      present: false,
      admis: false,
      reserve: false,
      candidats: [],
      examen: [],
    };
  }
}
