import dayjs from 'dayjs/esm';
import { ICandidatExamen } from 'app/entities/candidat-examen/candidat-examen.model';
import { IOrientationCandidat } from 'app/entities/orientation-candidat/orientation-candidat.model';

export interface ICandidat {
  id: number;
  nom?: string | null;
  prenom?: string | null;
  dateNaissance?: dayjs.Dayjs | null;
  tel?: string | null;
  numeroInscription?: string | null;
  examen?: Pick<ICandidatExamen, 'id'>[] | null;
  orientations?: Pick<IOrientationCandidat, 'id'>[] | null;
}

export type NewCandidat = Omit<ICandidat, 'id'> & { id: null };
