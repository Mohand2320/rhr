import { ICandidat } from 'app/entities/candidat/candidat.model';
import { IExamen } from 'app/entities/examen/examen.model';
import { Situation } from 'app/entities/enumerations/situation.model';

export interface ICandidatExamen {
  id: number;
  present?: boolean | null;
  admis?: boolean | null;
  reserve?: boolean | null;
  situation?: Situation | null;
  candidats?: Pick<ICandidat, 'id'>[] | null;
  examen?: Pick<IExamen, 'id'>[] | null;
}

export type NewCandidatExamen = Omit<ICandidatExamen, 'id'> & { id: null };
