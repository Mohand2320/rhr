import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IHistoriqueOffre, NewHistoriqueOffre } from '../historique-offre.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IHistoriqueOffre for edit and NewHistoriqueOffreFormGroupInput for create.
 */
type HistoriqueOffreFormGroupInput = IHistoriqueOffre | PartialWithRequiredKeyOf<NewHistoriqueOffre>;

type HistoriqueOffreFormDefaults = Pick<NewHistoriqueOffre, 'id'>;

type HistoriqueOffreFormGroupContent = {
  id: FormControl<IHistoriqueOffre['id'] | NewHistoriqueOffre['id']>;
  dateHistorique: FormControl<IHistoriqueOffre['dateHistorique']>;
  etat: FormControl<IHistoriqueOffre['etat']>;
};

export type HistoriqueOffreFormGroup = FormGroup<HistoriqueOffreFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class HistoriqueOffreFormService {
  createHistoriqueOffreFormGroup(historiqueOffre: HistoriqueOffreFormGroupInput = { id: null }): HistoriqueOffreFormGroup {
    const historiqueOffreRawValue = {
      ...this.getFormDefaults(),
      ...historiqueOffre,
    };
    return new FormGroup<HistoriqueOffreFormGroupContent>({
      id: new FormControl(
        { value: historiqueOffreRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      dateHistorique: new FormControl(historiqueOffreRawValue.dateHistorique, {
        validators: [Validators.required],
      }),
      etat: new FormControl(historiqueOffreRawValue.etat),
    });
  }

  getHistoriqueOffre(form: HistoriqueOffreFormGroup): IHistoriqueOffre | NewHistoriqueOffre {
    return form.getRawValue() as IHistoriqueOffre | NewHistoriqueOffre;
  }

  resetForm(form: HistoriqueOffreFormGroup, historiqueOffre: HistoriqueOffreFormGroupInput): void {
    const historiqueOffreRawValue = { ...this.getFormDefaults(), ...historiqueOffre };
    form.reset(
      {
        ...historiqueOffreRawValue,
        id: { value: historiqueOffreRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): HistoriqueOffreFormDefaults {
    return {
      id: null,
    };
  }
}
