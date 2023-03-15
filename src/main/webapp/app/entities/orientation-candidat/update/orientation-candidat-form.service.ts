import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IOrientationCandidat, NewOrientationCandidat } from '../orientation-candidat.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IOrientationCandidat for edit and NewOrientationCandidatFormGroupInput for create.
 */
type OrientationCandidatFormGroupInput = IOrientationCandidat | PartialWithRequiredKeyOf<NewOrientationCandidat>;

type OrientationCandidatFormDefaults = Pick<NewOrientationCandidat, 'id' | 'candidats' | 'orientations'>;

type OrientationCandidatFormGroupContent = {
  id: FormControl<IOrientationCandidat['id'] | NewOrientationCandidat['id']>;
  dateOrientation: FormControl<IOrientationCandidat['dateOrientation']>;
  candidats: FormControl<IOrientationCandidat['candidats']>;
  orientations: FormControl<IOrientationCandidat['orientations']>;
};

export type OrientationCandidatFormGroup = FormGroup<OrientationCandidatFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class OrientationCandidatFormService {
  createOrientationCandidatFormGroup(orientationCandidat: OrientationCandidatFormGroupInput = { id: null }): OrientationCandidatFormGroup {
    const orientationCandidatRawValue = {
      ...this.getFormDefaults(),
      ...orientationCandidat,
    };
    return new FormGroup<OrientationCandidatFormGroupContent>({
      id: new FormControl(
        { value: orientationCandidatRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      dateOrientation: new FormControl(orientationCandidatRawValue.dateOrientation),
      candidats: new FormControl(orientationCandidatRawValue.candidats ?? []),
      orientations: new FormControl(orientationCandidatRawValue.orientations ?? []),
    });
  }

  getOrientationCandidat(form: OrientationCandidatFormGroup): IOrientationCandidat | NewOrientationCandidat {
    return form.getRawValue() as IOrientationCandidat | NewOrientationCandidat;
  }

  resetForm(form: OrientationCandidatFormGroup, orientationCandidat: OrientationCandidatFormGroupInput): void {
    const orientationCandidatRawValue = { ...this.getFormDefaults(), ...orientationCandidat };
    form.reset(
      {
        ...orientationCandidatRawValue,
        id: { value: orientationCandidatRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): OrientationCandidatFormDefaults {
    return {
      id: null,
      candidats: [],
      orientations: [],
    };
  }
}
