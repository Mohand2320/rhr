import { TypePoste } from 'app/entities/enumerations/type-poste.model';

import { IPoste, NewPoste } from './poste.model';

export const sampleWithRequiredData: IPoste = {
  id: 61403,
  nomPoste: 'capacitor',
};

export const sampleWithPartialData: IPoste = {
  id: 39006,
  nomPoste: 'leading',
};

export const sampleWithFullData: IPoste = {
  id: 8073,
  nomPoste: 'HDD',
  numeroPoste: 'deposit a',
  diponible: true,
  typePoste: TypePoste['TYPEPOSTE2'],
};

export const sampleWithNewData: NewPoste = {
  nomPoste: 'Consultant lavender',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
