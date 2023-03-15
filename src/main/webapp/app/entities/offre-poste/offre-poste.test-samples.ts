import { IOffrePoste, NewOffrePoste } from './offre-poste.model';

export const sampleWithRequiredData: IOffrePoste = {
  id: 92321,
  nbr: 92667,
};

export const sampleWithPartialData: IOffrePoste = {
  id: 51187,
  nbr: 24403,
};

export const sampleWithFullData: IOffrePoste = {
  id: 27355,
  nbr: 73270,
  exigence: 'system Books relationships',
};

export const sampleWithNewData: NewOffrePoste = {
  nbr: 1173,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
