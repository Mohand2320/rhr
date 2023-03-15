import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CandidatExamenComponent } from './list/candidat-examen.component';
import { CandidatExamenDetailComponent } from './detail/candidat-examen-detail.component';
import { CandidatExamenUpdateComponent } from './update/candidat-examen-update.component';
import { CandidatExamenDeleteDialogComponent } from './delete/candidat-examen-delete-dialog.component';
import { CandidatExamenRoutingModule } from './route/candidat-examen-routing.module';

@NgModule({
  imports: [SharedModule, CandidatExamenRoutingModule],
  declarations: [
    CandidatExamenComponent,
    CandidatExamenDetailComponent,
    CandidatExamenUpdateComponent,
    CandidatExamenDeleteDialogComponent,
  ],
})
export class CandidatExamenModule {}
