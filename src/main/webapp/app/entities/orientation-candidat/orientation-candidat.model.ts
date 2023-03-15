import dayjs from 'dayjs/esm';
import { ICandidat } from 'app/entities/candidat/candidat.model';
import { IOrientation } from 'app/entities/orientation/orientation.model';

export interface IOrientationCandidat {
  id: number;
  dateOrientation?: dayjs.Dayjs | null;
  candidats?: Pick<ICandidat, 'id'>[] | null;
  orientations?: Pick<IOrientation, 'id'>[] | null;
}

export type NewOrientationCandidat = Omit<IOrientationCandidat, 'id'> & { id: null };
