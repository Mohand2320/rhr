import dayjs from 'dayjs/esm';
import { IDemande } from 'app/entities/demande/demande.model';
import { IHistoriqueOffre } from 'app/entities/historique-offre/historique-offre.model';
import { IAgence } from 'app/entities/agence/agence.model';
import { Etat } from 'app/entities/enumerations/etat.model';
import { TypeOffre } from 'app/entities/enumerations/type-offre.model';

export interface IOffre {
  id: number;
  numeroOffre?: string | null;
  dateOffre?: dayjs.Dayjs | null;
  dateDepot?: dayjs.Dayjs | null;
  etatOffre?: Etat | null;
  typeOffre?: TypeOffre | null;
  singnataire?: string | null;
  demande?: Pick<IDemande, 'id'> | null;
  historiqueOffre?: Pick<IHistoriqueOffre, 'id'> | null;
  agence?: Pick<IAgence, 'id'> | null;
}

export type NewOffre = Omit<IOffre, 'id'> & { id: null };
