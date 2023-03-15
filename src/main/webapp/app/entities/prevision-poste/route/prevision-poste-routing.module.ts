import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PrevisionPosteComponent } from '../list/prevision-poste.component';
import { PrevisionPosteDetailComponent } from '../detail/prevision-poste-detail.component';
import { PrevisionPosteUpdateComponent } from '../update/prevision-poste-update.component';
import { PrevisionPosteRoutingResolveService } from './prevision-poste-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const previsionPosteRoute: Routes = [
  {
    path: '',
    component: PrevisionPosteComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PrevisionPosteDetailComponent,
    resolve: {
      previsionPoste: PrevisionPosteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PrevisionPosteUpdateComponent,
    resolve: {
      previsionPoste: PrevisionPosteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PrevisionPosteUpdateComponent,
    resolve: {
      previsionPoste: PrevisionPosteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(previsionPosteRoute)],
  exports: [RouterModule],
})
export class PrevisionPosteRoutingModule {}
