import { IPrevisionPoste } from 'app/entities/prevision-poste/prevision-poste.model';
import { TypePoste } from 'app/entities/enumerations/type-poste.model';

export interface IPoste {
  id: number;
  nomPoste?: string | null;
  numeroPoste?: string | null;
  diponible?: boolean | null;
  typePoste?: TypePoste | null;
  previsions?: Pick<IPrevisionPoste, 'id'>[] | null;
}

export type NewPoste = Omit<IPoste, 'id'> & { id: null };
