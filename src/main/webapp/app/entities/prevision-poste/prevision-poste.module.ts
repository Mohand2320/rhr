import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PrevisionPosteComponent } from './list/prevision-poste.component';
import { PrevisionPosteDetailComponent } from './detail/prevision-poste-detail.component';
import { PrevisionPosteUpdateComponent } from './update/prevision-poste-update.component';
import { PrevisionPosteDeleteDialogComponent } from './delete/prevision-poste-delete-dialog.component';
import { PrevisionPosteRoutingModule } from './route/prevision-poste-routing.module';

@NgModule({
  imports: [SharedModule, PrevisionPosteRoutingModule],
  declarations: [
    PrevisionPosteComponent,
    PrevisionPosteDetailComponent,
    PrevisionPosteUpdateComponent,
    PrevisionPosteDeleteDialogComponent,
  ],
})
export class PrevisionPosteModule {}
