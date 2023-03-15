import { IDemande } from 'app/entities/demande/demande.model';
import { IOffre } from 'app/entities/offre/offre.model';

export interface IStructure {
  id: number;
  nom?: string | null;
  demande?: Pick<IDemande, 'id'> | null;
  offre?: Pick<IOffre, 'id'> | null;
}

export type NewStructure = Omit<IStructure, 'id'> & { id: null };
