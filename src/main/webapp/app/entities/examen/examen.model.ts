import dayjs from 'dayjs/esm';
import { IOffrePoste } from 'app/entities/offre-poste/offre-poste.model';
import { ICandidatExamen } from 'app/entities/candidat-examen/candidat-examen.model';
import { Etat } from 'app/entities/enumerations/etat.model';

export interface IExamen {
  id: number;
  datePrevue?: dayjs.Dayjs | null;
  dateExamen?: dayjs.Dayjs | null;
  etat?: Etat | null;
  lieuExamen?: string | null;
  miniDossier?: string | null;
  offrePoste?: Pick<IOffrePoste, 'id'> | null;
  candidats?: Pick<ICandidatExamen, 'id'>[] | null;
}

export type NewExamen = Omit<IExamen, 'id'> & { id: null };
