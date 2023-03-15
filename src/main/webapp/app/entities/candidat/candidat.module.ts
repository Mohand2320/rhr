import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CandidatComponent } from './list/candidat.component';
import { CandidatDetailComponent } from './detail/candidat-detail.component';
import { CandidatUpdateComponent } from './update/candidat-update.component';
import { CandidatDeleteDialogComponent } from './delete/candidat-delete-dialog.component';
import { CandidatRoutingModule } from './route/candidat-routing.module';

@NgModule({
  imports: [SharedModule, CandidatRoutingModule],
  declarations: [CandidatComponent, CandidatDetailComponent, CandidatUpdateComponent, CandidatDeleteDialogComponent],
})
export class CandidatModule {}
