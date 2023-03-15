import dayjs from 'dayjs/esm';

import { IPrevision, NewPrevision } from './prevision.model';

export const sampleWithRequiredData: IPrevision = {
  id: 64806,
  dateAjout: dayjs('2023-03-14'),
};

export const sampleWithPartialData: IPrevision = {
  id: 56594,
  dateAjout: dayjs('2023-03-15'),
};

export const sampleWithFullData: IPrevision = {
  id: 53001,
  dateAjout: dayjs('2023-03-15'),
};

export const sampleWithNewData: NewPrevision = {
  dateAjout: dayjs('2023-03-14'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
