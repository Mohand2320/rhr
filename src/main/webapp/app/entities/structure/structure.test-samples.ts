import { IStructure, NewStructure } from './structure.model';

export const sampleWithRequiredData: IStructure = {
  id: 50985,
  nom: 'Account FTP',
};

export const sampleWithPartialData: IStructure = {
  id: 22270,
  nom: 'withdrawal Cheese Rosiers',
};

export const sampleWithFullData: IStructure = {
  id: 37798,
  nom: 'optical port',
};

export const sampleWithNewData: NewStructure = {
  nom: 'Bourgogne engineer application',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
