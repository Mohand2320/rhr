import { IAgence } from 'app/entities/agence/agence.model';
import { IOrientationCandidat } from 'app/entities/orientation-candidat/orientation-candidat.model';

export interface IOrientation {
  id: number;
  libelle?: string | null;
  agence?: Pick<IAgence, 'id'> | null;
  candidats?: Pick<IOrientationCandidat, 'id'>[] | null;
}

export type NewOrientation = Omit<IOrientation, 'id'> & { id: null };
