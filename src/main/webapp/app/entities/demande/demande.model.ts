import dayjs from 'dayjs/esm';
import { IAccord } from 'app/entities/accord/accord.model';
import { TypeDemande } from 'app/entities/enumerations/type-demande.model';
import { Etat } from 'app/entities/enumerations/etat.model';

export interface IDemande {
  id: number;
  ref?: string | null;
  typeDemande?: TypeDemande | null;
  dateDepot?: dayjs.Dayjs | null;
  etat?: Etat | null;
  auteur?: Pick<IAccord, 'id'> | null;
}

export type NewDemande = Omit<IDemande, 'id'> & { id: null };
