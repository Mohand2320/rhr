import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { HistoriqueOffreComponent } from '../list/historique-offre.component';
import { HistoriqueOffreDetailComponent } from '../detail/historique-offre-detail.component';
import { HistoriqueOffreUpdateComponent } from '../update/historique-offre-update.component';
import { HistoriqueOffreRoutingResolveService } from './historique-offre-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const historiqueOffreRoute: Routes = [
  {
    path: '',
    component: HistoriqueOffreComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: HistoriqueOffreDetailComponent,
    resolve: {
      historiqueOffre: HistoriqueOffreRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: HistoriqueOffreUpdateComponent,
    resolve: {
      historiqueOffre: HistoriqueOffreRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: HistoriqueOffreUpdateComponent,
    resolve: {
      historiqueOffre: HistoriqueOffreRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(historiqueOffreRoute)],
  exports: [RouterModule],
})
export class HistoriqueOffreRoutingModule {}
