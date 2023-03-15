import dayjs from 'dayjs/esm';

import { Etat } from 'app/entities/enumerations/etat.model';

import { IHistoriqueOffre, NewHistoriqueOffre } from './historique-offre.model';

export const sampleWithRequiredData: IHistoriqueOffre = {
  id: 57313,
  dateHistorique: dayjs('2023-03-14'),
};

export const sampleWithPartialData: IHistoriqueOffre = {
  id: 93175,
  dateHistorique: dayjs('2023-03-15'),
};

export const sampleWithFullData: IHistoriqueOffre = {
  id: 49314,
  dateHistorique: dayjs('2023-03-14'),
  etat: Etat['ETAT1'],
};

export const sampleWithNewData: NewHistoriqueOffre = {
  dateHistorique: dayjs('2023-03-14'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
