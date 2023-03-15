import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CandidatComponent } from '../list/candidat.component';
import { CandidatDetailComponent } from '../detail/candidat-detail.component';
import { CandidatUpdateComponent } from '../update/candidat-update.component';
import { CandidatRoutingResolveService } from './candidat-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const candidatRoute: Routes = [
  {
    path: '',
    component: CandidatComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CandidatDetailComponent,
    resolve: {
      candidat: CandidatRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CandidatUpdateComponent,
    resolve: {
      candidat: CandidatRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CandidatUpdateComponent,
    resolve: {
      candidat: CandidatRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(candidatRoute)],
  exports: [RouterModule],
})
export class CandidatRoutingModule {}
