import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPrevisionPoste, NewPrevisionPoste } from '../prevision-poste.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPrevisionPoste for edit and NewPrevisionPosteFormGroupInput for create.
 */
type PrevisionPosteFormGroupInput = IPrevisionPoste | PartialWithRequiredKeyOf<NewPrevisionPoste>;

type PrevisionPosteFormDefaults = Pick<NewPrevisionPoste, 'id' | 'previsions' | 'postes'>;

type PrevisionPosteFormGroupContent = {
  id: FormControl<IPrevisionPoste['id'] | NewPrevisionPoste['id']>;
  dateAjout: FormControl<IPrevisionPoste['dateAjout']>;
  previsions: FormControl<IPrevisionPoste['previsions']>;
  postes: FormControl<IPrevisionPoste['postes']>;
};

export type PrevisionPosteFormGroup = FormGroup<PrevisionPosteFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PrevisionPosteFormService {
  createPrevisionPosteFormGroup(previsionPoste: PrevisionPosteFormGroupInput = { id: null }): PrevisionPosteFormGroup {
    const previsionPosteRawValue = {
      ...this.getFormDefaults(),
      ...previsionPoste,
    };
    return new FormGroup<PrevisionPosteFormGroupContent>({
      id: new FormControl(
        { value: previsionPosteRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      dateAjout: new FormControl(previsionPosteRawValue.dateAjout),
      previsions: new FormControl(previsionPosteRawValue.previsions ?? []),
      postes: new FormControl(previsionPosteRawValue.postes ?? []),
    });
  }

  getPrevisionPoste(form: PrevisionPosteFormGroup): IPrevisionPoste | NewPrevisionPoste {
    return form.getRawValue() as IPrevisionPoste | NewPrevisionPoste;
  }

  resetForm(form: PrevisionPosteFormGroup, previsionPoste: PrevisionPosteFormGroupInput): void {
    const previsionPosteRawValue = { ...this.getFormDefaults(), ...previsionPoste };
    form.reset(
      {
        ...previsionPosteRawValue,
        id: { value: previsionPosteRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PrevisionPosteFormDefaults {
    return {
      id: null,
      previsions: [],
      postes: [],
    };
  }
}
