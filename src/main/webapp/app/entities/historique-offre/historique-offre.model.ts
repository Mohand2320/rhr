import dayjs from 'dayjs/esm';
import { Etat } from 'app/entities/enumerations/etat.model';

export interface IHistoriqueOffre {
  id: number;
  dateHistorique?: dayjs.Dayjs | null;
  etat?: Etat | null;
}

export type NewHistoriqueOffre = Omit<IHistoriqueOffre, 'id'> & { id: null };
