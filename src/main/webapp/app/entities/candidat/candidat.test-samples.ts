import dayjs from 'dayjs/esm';

import { ICandidat, NewCandidat } from './candidat.model';

export const sampleWithRequiredData: ICandidat = {
  id: 74876,
  nom: 'Intelligent integrate Saint-Sé',
  prenom: 'Pizza Small Avon',
  dateNaissance: dayjs('2023-03-14'),
  tel: '0578214418',
};

export const sampleWithPartialData: ICandidat = {
  id: 63688,
  nom: 'program neural',
  prenom: 'Belarussian scale systematic',
  dateNaissance: dayjs('2023-03-15'),
  tel: '0991511054',
  numeroInscription: 'pixel plug-and-play c',
};

export const sampleWithFullData: ICandidat = {
  id: 22806,
  nom: 'Grands Checking override',
  prenom: 'Toys bandwidth',
  dateNaissance: dayjs('2023-03-15'),
  tel: '0125621275',
  numeroInscription: 'New Corse',
};

export const sampleWithNewData: NewCandidat = {
  nom: 'Auto',
  prenom: 'b Computers Centre',
  dateNaissance: dayjs('2023-03-14'),
  tel: '04728536790',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
