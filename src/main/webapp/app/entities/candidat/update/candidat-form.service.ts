import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICandidat, NewCandidat } from '../candidat.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICandidat for edit and NewCandidatFormGroupInput for create.
 */
type CandidatFormGroupInput = ICandidat | PartialWithRequiredKeyOf<NewCandidat>;

type CandidatFormDefaults = Pick<NewCandidat, 'id' | 'examen' | 'orientations'>;

type CandidatFormGroupContent = {
  id: FormControl<ICandidat['id'] | NewCandidat['id']>;
  nom: FormControl<ICandidat['nom']>;
  prenom: FormControl<ICandidat['prenom']>;
  dateNaissance: FormControl<ICandidat['dateNaissance']>;
  tel: FormControl<ICandidat['tel']>;
  numeroInscription: FormControl<ICandidat['numeroInscription']>;
  examen: FormControl<ICandidat['examen']>;
  orientations: FormControl<ICandidat['orientations']>;
};

export type CandidatFormGroup = FormGroup<CandidatFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CandidatFormService {
  createCandidatFormGroup(candidat: CandidatFormGroupInput = { id: null }): CandidatFormGroup {
    const candidatRawValue = {
      ...this.getFormDefaults(),
      ...candidat,
    };
    return new FormGroup<CandidatFormGroupContent>({
      id: new FormControl(
        { value: candidatRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      nom: new FormControl(candidatRawValue.nom, {
        validators: [Validators.required, Validators.maxLength(30)],
      }),
      prenom: new FormControl(candidatRawValue.prenom, {
        validators: [Validators.required, Validators.maxLength(30)],
      }),
      dateNaissance: new FormControl(candidatRawValue.dateNaissance, {
        validators: [Validators.required],
      }),
      tel: new FormControl(candidatRawValue.tel, {
        validators: [Validators.required, Validators.pattern('^(00|[+])[1-9][0-9]{8,14}$|^0[1-9][0-9]{8,9}$')],
      }),
      numeroInscription: new FormControl(candidatRawValue.numeroInscription),
      examen: new FormControl(candidatRawValue.examen ?? []),
      orientations: new FormControl(candidatRawValue.orientations ?? []),
    });
  }

  getCandidat(form: CandidatFormGroup): ICandidat | NewCandidat {
    return form.getRawValue() as ICandidat | NewCandidat;
  }

  resetForm(form: CandidatFormGroup, candidat: CandidatFormGroupInput): void {
    const candidatRawValue = { ...this.getFormDefaults(), ...candidat };
    form.reset(
      {
        ...candidatRawValue,
        id: { value: candidatRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CandidatFormDefaults {
    return {
      id: null,
      examen: [],
      orientations: [],
    };
  }
}
