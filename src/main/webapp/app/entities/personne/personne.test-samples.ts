import dayjs from 'dayjs/esm';

import { IPersonne, NewPersonne } from './personne.model';

export const sampleWithRequiredData: IPersonne = {
  id: 7936,
  nom: 'Outdoors Multi-lateral',
  prenom: 'RSS Toys engine',
  dateNaissance: dayjs('2023-03-14'),
};

export const sampleWithPartialData: IPersonne = {
  id: 85243,
  nom: 'navigate ivory',
  prenom: 'Intelligent Home',
  dateNaissance: dayjs('2023-03-15'),
  tel: '00917414627',
  numeroInscription: 'Ruble',
};

export const sampleWithFullData: IPersonne = {
  id: 53071,
  nom: 'system',
  prenom: 'Fantastic',
  dateNaissance: dayjs('2023-03-14'),
  tel: '09853037602',
  numeroInscription: 'plum',
  dateOrientation: dayjs('2023-03-15'),
};

export const sampleWithNewData: NewPersonne = {
  nom: 'Loan a Account',
  prenom: 'RSS Movies b',
  dateNaissance: dayjs('2023-03-15'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
