import dayjs from 'dayjs/esm';

import { TypeDemande } from 'app/entities/enumerations/type-demande.model';
import { Etat } from 'app/entities/enumerations/etat.model';

import { IDemande, NewDemande } from './demande.model';

export const sampleWithRequiredData: IDemande = {
  id: 19730,
  ref: 'digital Papouasie-Nouvelle-Guinée functionalities',
};

export const sampleWithPartialData: IDemande = {
  id: 67217,
  ref: 'Hryvnia vertical',
  dateDepot: dayjs('2023-03-14'),
};

export const sampleWithFullData: IDemande = {
  id: 37459,
  ref: 'bus Shoes',
  typeDemande: TypeDemande['TYPE2'],
  dateDepot: dayjs('2023-03-14'),
  etat: Etat['ETAT2'],
};

export const sampleWithNewData: NewDemande = {
  ref: 'Executif Cedi Specialiste',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
