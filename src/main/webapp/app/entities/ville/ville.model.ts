export interface IVille {
  id: number;
  libelle?: string | null;
}

export type NewVille = Omit<IVille, 'id'> & { id: null };
