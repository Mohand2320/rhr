import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { OrientationComponent } from '../list/orientation.component';
import { OrientationDetailComponent } from '../detail/orientation-detail.component';
import { OrientationUpdateComponent } from '../update/orientation-update.component';
import { OrientationRoutingResolveService } from './orientation-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const orientationRoute: Routes = [
  {
    path: '',
    component: OrientationComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OrientationDetailComponent,
    resolve: {
      orientation: OrientationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OrientationUpdateComponent,
    resolve: {
      orientation: OrientationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OrientationUpdateComponent,
    resolve: {
      orientation: OrientationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(orientationRoute)],
  exports: [RouterModule],
})
export class OrientationRoutingModule {}
