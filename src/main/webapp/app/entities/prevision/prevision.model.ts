import dayjs from 'dayjs/esm';
import { IAgence } from 'app/entities/agence/agence.model';
import { IPrevisionPoste } from 'app/entities/prevision-poste/prevision-poste.model';

export interface IPrevision {
  id: number;
  dateAjout?: dayjs.Dayjs | null;
  agence?: Pick<IAgence, 'id'> | null;
  postes?: Pick<IPrevisionPoste, 'id'>[] | null;
}

export type NewPrevision = Omit<IPrevision, 'id'> & { id: null };
