import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CandidatExamenComponent } from '../list/candidat-examen.component';
import { CandidatExamenDetailComponent } from '../detail/candidat-examen-detail.component';
import { CandidatExamenUpdateComponent } from '../update/candidat-examen-update.component';
import { CandidatExamenRoutingResolveService } from './candidat-examen-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const candidatExamenRoute: Routes = [
  {
    path: '',
    component: CandidatExamenComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CandidatExamenDetailComponent,
    resolve: {
      candidatExamen: CandidatExamenRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CandidatExamenUpdateComponent,
    resolve: {
      candidatExamen: CandidatExamenRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CandidatExamenUpdateComponent,
    resolve: {
      candidatExamen: CandidatExamenRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(candidatExamenRoute)],
  exports: [RouterModule],
})
export class CandidatExamenRoutingModule {}
