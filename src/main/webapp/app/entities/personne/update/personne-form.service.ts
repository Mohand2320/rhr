import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPersonne, NewPersonne } from '../personne.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPersonne for edit and NewPersonneFormGroupInput for create.
 */
type PersonneFormGroupInput = IPersonne | PartialWithRequiredKeyOf<NewPersonne>;

type PersonneFormDefaults = Pick<NewPersonne, 'id'>;

type PersonneFormGroupContent = {
  id: FormControl<IPersonne['id'] | NewPersonne['id']>;
  nom: FormControl<IPersonne['nom']>;
  prenom: FormControl<IPersonne['prenom']>;
  dateNaissance: FormControl<IPersonne['dateNaissance']>;
  tel: FormControl<IPersonne['tel']>;
  numeroInscription: FormControl<IPersonne['numeroInscription']>;
  dateOrientation: FormControl<IPersonne['dateOrientation']>;
};

export type PersonneFormGroup = FormGroup<PersonneFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PersonneFormService {
  createPersonneFormGroup(personne: PersonneFormGroupInput = { id: null }): PersonneFormGroup {
    const personneRawValue = {
      ...this.getFormDefaults(),
      ...personne,
    };
    return new FormGroup<PersonneFormGroupContent>({
      id: new FormControl(
        { value: personneRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      nom: new FormControl(personneRawValue.nom, {
        validators: [Validators.required, Validators.maxLength(30)],
      }),
      prenom: new FormControl(personneRawValue.prenom, {
        validators: [Validators.required, Validators.maxLength(30)],
      }),
      dateNaissance: new FormControl(personneRawValue.dateNaissance, {
        validators: [Validators.required],
      }),
      tel: new FormControl(personneRawValue.tel, {
        validators: [Validators.pattern('^(00|[+])[1-9][0-9]{8,14}$|^0[1-9][0-9]{8,9}$')],
      }),
      numeroInscription: new FormControl(personneRawValue.numeroInscription),
      dateOrientation: new FormControl(personneRawValue.dateOrientation),
    });
  }

  getPersonne(form: PersonneFormGroup): IPersonne | NewPersonne {
    return form.getRawValue() as IPersonne | NewPersonne;
  }

  resetForm(form: PersonneFormGroup, personne: PersonneFormGroupInput): void {
    const personneRawValue = { ...this.getFormDefaults(), ...personne };
    form.reset(
      {
        ...personneRawValue,
        id: { value: personneRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PersonneFormDefaults {
    return {
      id: null,
    };
  }
}
