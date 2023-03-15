import { IVille } from 'app/entities/ville/ville.model';

export interface IAgence {
  id: number;
  libelle?: string | null;
  tel?: string | null;
  ville?: Pick<IVille, 'id'> | null;
  agence?: Pick<IAgence, 'id'> | null;
}

export type NewAgence = Omit<IAgence, 'id'> & { id: null };
