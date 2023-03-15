import { IOrientation, NewOrientation } from './orientation.model';

export const sampleWithRequiredData: IOrientation = {
  id: 36106,
};

export const sampleWithPartialData: IOrientation = {
  id: 37220,
  libelle: 'Health Limousin Personal',
};

export const sampleWithFullData: IOrientation = {
  id: 91602,
  libelle: 'ivory Corse c',
};

export const sampleWithNewData: NewOrientation = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
