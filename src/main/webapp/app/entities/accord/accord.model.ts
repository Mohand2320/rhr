import dayjs from 'dayjs/esm';

export interface IAccord {
  id: number;
  validateur?: string | null;
  numeroAccord?: string | null;
  dateArrivee?: dayjs.Dayjs | null;
}

export type NewAccord = Omit<IAccord, 'id'> & { id: null };
