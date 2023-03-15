import { IAgence, NewAgence } from './agence.model';

export const sampleWithRequiredData: IAgence = {
  id: 3474,
  libelle: 'Concrete Stagiaire Francs-Bour',
};

export const sampleWithPartialData: IAgence = {
  id: 92924,
  libelle: 'Sénégal Pizza Borders',
};

export const sampleWithFullData: IAgence = {
  id: 40517,
  libelle: 'Technicien des infrastructures',
  tel: '0202388167',
};

export const sampleWithNewData: NewAgence = {
  libelle: 'index',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
