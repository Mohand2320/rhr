import dayjs from 'dayjs/esm';

import { Etat } from 'app/entities/enumerations/etat.model';
import { TypeOffre } from 'app/entities/enumerations/type-offre.model';

import { IOffre, NewOffre } from './offre.model';

export const sampleWithRequiredData: IOffre = {
  id: 43353,
  numeroOffre: 'c Customizable',
  dateOffre: dayjs('2023-03-14'),
  dateDepot: dayjs('2023-03-15'),
};

export const sampleWithPartialData: IOffre = {
  id: 60477,
  numeroOffre: 'Home',
  dateOffre: dayjs('2023-03-14'),
  dateDepot: dayjs('2023-03-15'),
  etatOffre: Etat['ETAT1'],
  typeOffre: TypeOffre['TYPE2'],
};

export const sampleWithFullData: IOffre = {
  id: 70273,
  numeroOffre: 'teal',
  dateOffre: dayjs('2023-03-15'),
  dateDepot: dayjs('2023-03-14'),
  etatOffre: Etat['ETAT1'],
  typeOffre: TypeOffre['TYPE1'],
  singnataire: 'Franche-Comté monitor Account',
};

export const sampleWithNewData: NewOffre = {
  numeroOffre: 'invoice c',
  dateOffre: dayjs('2023-03-14'),
  dateDepot: dayjs('2023-03-14'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
