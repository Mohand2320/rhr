import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IOffrePoste, NewOffrePoste } from '../offre-poste.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IOffrePoste for edit and NewOffrePosteFormGroupInput for create.
 */
type OffrePosteFormGroupInput = IOffrePoste | PartialWithRequiredKeyOf<NewOffrePoste>;

type OffrePosteFormDefaults = Pick<NewOffrePoste, 'id'>;

type OffrePosteFormGroupContent = {
  id: FormControl<IOffrePoste['id'] | NewOffrePoste['id']>;
  nbr: FormControl<IOffrePoste['nbr']>;
  exigence: FormControl<IOffrePoste['exigence']>;
  orientation: FormControl<IOffrePoste['orientation']>;
};

export type OffrePosteFormGroup = FormGroup<OffrePosteFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class OffrePosteFormService {
  createOffrePosteFormGroup(offrePoste: OffrePosteFormGroupInput = { id: null }): OffrePosteFormGroup {
    const offrePosteRawValue = {
      ...this.getFormDefaults(),
      ...offrePoste,
    };
    return new FormGroup<OffrePosteFormGroupContent>({
      id: new FormControl(
        { value: offrePosteRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      nbr: new FormControl(offrePosteRawValue.nbr, {
        validators: [Validators.required],
      }),
      exigence: new FormControl(offrePosteRawValue.exigence),
      orientation: new FormControl(offrePosteRawValue.orientation),
    });
  }

  getOffrePoste(form: OffrePosteFormGroup): IOffrePoste | NewOffrePoste {
    return form.getRawValue() as IOffrePoste | NewOffrePoste;
  }

  resetForm(form: OffrePosteFormGroup, offrePoste: OffrePosteFormGroupInput): void {
    const offrePosteRawValue = { ...this.getFormDefaults(), ...offrePoste };
    form.reset(
      {
        ...offrePosteRawValue,
        id: { value: offrePosteRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): OffrePosteFormDefaults {
    return {
      id: null,
    };
  }
}
