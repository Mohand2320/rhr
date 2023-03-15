import dayjs from 'dayjs/esm';

import { IPrevisionPoste, NewPrevisionPoste } from './prevision-poste.model';

export const sampleWithRequiredData: IPrevisionPoste = {
  id: 79634,
};

export const sampleWithPartialData: IPrevisionPoste = {
  id: 41775,
};

export const sampleWithFullData: IPrevisionPoste = {
  id: 82532,
  dateAjout: dayjs('2023-03-14'),
};

export const sampleWithNewData: NewPrevisionPoste = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
