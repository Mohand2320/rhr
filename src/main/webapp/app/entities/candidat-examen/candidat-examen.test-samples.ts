import { Situation } from 'app/entities/enumerations/situation.model';

import { ICandidatExamen, NewCandidatExamen } from './candidat-examen.model';

export const sampleWithRequiredData: ICandidatExamen = {
  id: 7860,
};

export const sampleWithPartialData: ICandidatExamen = {
  id: 93263,
  present: false,
};

export const sampleWithFullData: ICandidatExamen = {
  id: 13901,
  present: true,
  admis: false,
  reserve: true,
  situation: Situation['SITUATION1'],
};

export const sampleWithNewData: NewCandidatExamen = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
