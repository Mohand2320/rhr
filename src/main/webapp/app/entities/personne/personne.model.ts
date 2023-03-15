import dayjs from 'dayjs/esm';

export interface IPersonne {
  id: number;
  nom?: string | null;
  prenom?: string | null;
  dateNaissance?: dayjs.Dayjs | null;
  tel?: string | null;
  numeroInscription?: string | null;
  dateOrientation?: dayjs.Dayjs | null;
}

export type NewPersonne = Omit<IPersonne, 'id'> & { id: null };
