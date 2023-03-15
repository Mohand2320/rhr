import dayjs from 'dayjs/esm';

import { IOrientationCandidat, NewOrientationCandidat } from './orientation-candidat.model';

export const sampleWithRequiredData: IOrientationCandidat = {
  id: 35975,
};

export const sampleWithPartialData: IOrientationCandidat = {
  id: 9111,
  dateOrientation: dayjs('2023-03-14'),
};

export const sampleWithFullData: IOrientationCandidat = {
  id: 25611,
  dateOrientation: dayjs('2023-03-15'),
};

export const sampleWithNewData: NewOrientationCandidat = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
