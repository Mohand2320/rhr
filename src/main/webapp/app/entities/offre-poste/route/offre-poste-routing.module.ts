import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { OffrePosteComponent } from '../list/offre-poste.component';
import { OffrePosteDetailComponent } from '../detail/offre-poste-detail.component';
import { OffrePosteUpdateComponent } from '../update/offre-poste-update.component';
import { OffrePosteRoutingResolveService } from './offre-poste-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const offrePosteRoute: Routes = [
  {
    path: '',
    component: OffrePosteComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OffrePosteDetailComponent,
    resolve: {
      offrePoste: OffrePosteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OffrePosteUpdateComponent,
    resolve: {
      offrePoste: OffrePosteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OffrePosteUpdateComponent,
    resolve: {
      offrePoste: OffrePosteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(offrePosteRoute)],
  exports: [RouterModule],
})
export class OffrePosteRoutingModule {}
