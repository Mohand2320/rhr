import dayjs from 'dayjs/esm';

import { IAccord, NewAccord } from './accord.model';

export const sampleWithRequiredData: IAccord = {
  id: 80838,
  validateur: 'Chat-qui-Pêche',
  numeroAccord: 'B2C',
};

export const sampleWithPartialData: IAccord = {
  id: 43749,
  validateur: 'Stagiaire Lorraine Gorgeous',
  numeroAccord: 'best-of-breed Berkshire',
};

export const sampleWithFullData: IAccord = {
  id: 31901,
  validateur: 'Savings sky real-time',
  numeroAccord: 'a',
  dateArrivee: dayjs('2023-03-14'),
};

export const sampleWithNewData: NewAccord = {
  validateur: 'infomediaries Cotton',
  numeroAccord: 'algorithm vortals',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
