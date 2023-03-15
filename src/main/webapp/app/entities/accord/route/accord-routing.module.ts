import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AccordComponent } from '../list/accord.component';
import { AccordDetailComponent } from '../detail/accord-detail.component';
import { AccordUpdateComponent } from '../update/accord-update.component';
import { AccordRoutingResolveService } from './accord-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const accordRoute: Routes = [
  {
    path: '',
    component: AccordComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AccordDetailComponent,
    resolve: {
      accord: AccordRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AccordUpdateComponent,
    resolve: {
      accord: AccordRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AccordUpdateComponent,
    resolve: {
      accord: AccordRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(accordRoute)],
  exports: [RouterModule],
})
export class AccordRoutingModule {}
