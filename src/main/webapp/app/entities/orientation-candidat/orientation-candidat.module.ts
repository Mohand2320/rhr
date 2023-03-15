import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { OrientationCandidatComponent } from './list/orientation-candidat.component';
import { OrientationCandidatDetailComponent } from './detail/orientation-candidat-detail.component';
import { OrientationCandidatUpdateComponent } from './update/orientation-candidat-update.component';
import { OrientationCandidatDeleteDialogComponent } from './delete/orientation-candidat-delete-dialog.component';
import { OrientationCandidatRoutingModule } from './route/orientation-candidat-routing.module';

@NgModule({
  imports: [SharedModule, OrientationCandidatRoutingModule],
  declarations: [
    OrientationCandidatComponent,
    OrientationCandidatDetailComponent,
    OrientationCandidatUpdateComponent,
    OrientationCandidatDeleteDialogComponent,
  ],
})
export class OrientationCandidatModule {}
