import dayjs from 'dayjs/esm';
import { IPrevision } from 'app/entities/prevision/prevision.model';
import { IPoste } from 'app/entities/poste/poste.model';

export interface IPrevisionPoste {
  id: number;
  dateAjout?: dayjs.Dayjs | null;
  previsions?: Pick<IPrevision, 'id'>[] | null;
  postes?: Pick<IPoste, 'id'>[] | null;
}

export type NewPrevisionPoste = Omit<IPrevisionPoste, 'id'> & { id: null };
