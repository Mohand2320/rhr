import dayjs from 'dayjs/esm';

import { Etat } from 'app/entities/enumerations/etat.model';

import { IExamen, NewExamen } from './examen.model';

export const sampleWithRequiredData: IExamen = {
  id: 47763,
  datePrevue: dayjs('2023-03-15'),
  dateExamen: dayjs('2023-03-15'),
};

export const sampleWithPartialData: IExamen = {
  id: 71119,
  datePrevue: dayjs('2023-03-14'),
  dateExamen: dayjs('2023-03-15'),
  etat: Etat['ETAT2'],
};

export const sampleWithFullData: IExamen = {
  id: 37755,
  datePrevue: dayjs('2023-03-14'),
  dateExamen: dayjs('2023-03-14'),
  etat: Etat['ETAT2'],
  lieuExamen: 'Fidji',
  miniDossier: 'Steel Architecte',
};

export const sampleWithNewData: NewExamen = {
  datePrevue: dayjs('2023-03-15'),
  dateExamen: dayjs('2023-03-14'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
