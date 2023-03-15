import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { OrientationCandidatComponent } from '../list/orientation-candidat.component';
import { OrientationCandidatDetailComponent } from '../detail/orientation-candidat-detail.component';
import { OrientationCandidatUpdateComponent } from '../update/orientation-candidat-update.component';
import { OrientationCandidatRoutingResolveService } from './orientation-candidat-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const orientationCandidatRoute: Routes = [
  {
    path: '',
    component: OrientationCandidatComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OrientationCandidatDetailComponent,
    resolve: {
      orientationCandidat: OrientationCandidatRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OrientationCandidatUpdateComponent,
    resolve: {
      orientationCandidat: OrientationCandidatRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OrientationCandidatUpdateComponent,
    resolve: {
      orientationCandidat: OrientationCandidatRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(orientationCandidatRoute)],
  exports: [RouterModule],
})
export class OrientationCandidatRoutingModule {}
