import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IOffre, NewOffre } from '../offre.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IOffre for edit and NewOffreFormGroupInput for create.
 */
type OffreFormGroupInput = IOffre | PartialWithRequiredKeyOf<NewOffre>;

type OffreFormDefaults = Pick<NewOffre, 'id'>;

type OffreFormGroupContent = {
  id: FormControl<IOffre['id'] | NewOffre['id']>;
  numeroOffre: FormControl<IOffre['numeroOffre']>;
  dateOffre: FormControl<IOffre['dateOffre']>;
  dateDepot: FormControl<IOffre['dateDepot']>;
  etatOffre: FormControl<IOffre['etatOffre']>;
  typeOffre: FormControl<IOffre['typeOffre']>;
  singnataire: FormControl<IOffre['singnataire']>;
  demande: FormControl<IOffre['demande']>;
  historiqueOffre: FormControl<IOffre['historiqueOffre']>;
  agence: FormControl<IOffre['agence']>;
};

export type OffreFormGroup = FormGroup<OffreFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class OffreFormService {
  createOffreFormGroup(offre: OffreFormGroupInput = { id: null }): OffreFormGroup {
    const offreRawValue = {
      ...this.getFormDefaults(),
      ...offre,
    };
    return new FormGroup<OffreFormGroupContent>({
      id: new FormControl(
        { value: offreRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      numeroOffre: new FormControl(offreRawValue.numeroOffre, {
        validators: [Validators.required, Validators.maxLength(30)],
      }),
      dateOffre: new FormControl(offreRawValue.dateOffre, {
        validators: [Validators.required],
      }),
      dateDepot: new FormControl(offreRawValue.dateDepot, {
        validators: [Validators.required],
      }),
      etatOffre: new FormControl(offreRawValue.etatOffre),
      typeOffre: new FormControl(offreRawValue.typeOffre),
      singnataire: new FormControl(offreRawValue.singnataire),
      demande: new FormControl(offreRawValue.demande),
      historiqueOffre: new FormControl(offreRawValue.historiqueOffre),
      agence: new FormControl(offreRawValue.agence),
    });
  }

  getOffre(form: OffreFormGroup): IOffre | NewOffre {
    return form.getRawValue() as IOffre | NewOffre;
  }

  resetForm(form: OffreFormGroup, offre: OffreFormGroupInput): void {
    const offreRawValue = { ...this.getFormDefaults(), ...offre };
    form.reset(
      {
        ...offreRawValue,
        id: { value: offreRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): OffreFormDefaults {
    return {
      id: null,
    };
  }
}
