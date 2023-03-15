import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPoste, NewPoste } from '../poste.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPoste for edit and NewPosteFormGroupInput for create.
 */
type PosteFormGroupInput = IPoste | PartialWithRequiredKeyOf<NewPoste>;

type PosteFormDefaults = Pick<NewPoste, 'id' | 'diponible' | 'previsions'>;

type PosteFormGroupContent = {
  id: FormControl<IPoste['id'] | NewPoste['id']>;
  nomPoste: FormControl<IPoste['nomPoste']>;
  numeroPoste: FormControl<IPoste['numeroPoste']>;
  diponible: FormControl<IPoste['diponible']>;
  typePoste: FormControl<IPoste['typePoste']>;
  previsions: FormControl<IPoste['previsions']>;
};

export type PosteFormGroup = FormGroup<PosteFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PosteFormService {
  createPosteFormGroup(poste: PosteFormGroupInput = { id: null }): PosteFormGroup {
    const posteRawValue = {
      ...this.getFormDefaults(),
      ...poste,
    };
    return new FormGroup<PosteFormGroupContent>({
      id: new FormControl(
        { value: posteRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      nomPoste: new FormControl(posteRawValue.nomPoste, {
        validators: [Validators.required, Validators.maxLength(30)],
      }),
      numeroPoste: new FormControl(posteRawValue.numeroPoste, {
        validators: [Validators.maxLength(30)],
      }),
      diponible: new FormControl(posteRawValue.diponible),
      typePoste: new FormControl(posteRawValue.typePoste),
      previsions: new FormControl(posteRawValue.previsions ?? []),
    });
  }

  getPoste(form: PosteFormGroup): IPoste | NewPoste {
    return form.getRawValue() as IPoste | NewPoste;
  }

  resetForm(form: PosteFormGroup, poste: PosteFormGroupInput): void {
    const posteRawValue = { ...this.getFormDefaults(), ...poste };
    form.reset(
      {
        ...posteRawValue,
        id: { value: posteRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PosteFormDefaults {
    return {
      id: null,
      diponible: false,
      previsions: [],
    };
  }
}
