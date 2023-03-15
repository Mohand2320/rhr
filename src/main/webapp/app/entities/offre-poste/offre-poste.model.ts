import { IOrientation } from 'app/entities/orientation/orientation.model';

export interface IOffrePoste {
  id: number;
  nbr?: number | null;
  exigence?: string | null;
  orientation?: Pick<IOrientation, 'id'> | null;
}

export type NewOffrePoste = Omit<IOffrePoste, 'id'> & { id: null };
