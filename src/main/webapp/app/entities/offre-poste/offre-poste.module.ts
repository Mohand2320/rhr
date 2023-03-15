import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { OffrePosteComponent } from './list/offre-poste.component';
import { OffrePosteDetailComponent } from './detail/offre-poste-detail.component';
import { OffrePosteUpdateComponent } from './update/offre-poste-update.component';
import { OffrePosteDeleteDialogComponent } from './delete/offre-poste-delete-dialog.component';
import { OffrePosteRoutingModule } from './route/offre-poste-routing.module';

@NgModule({
  imports: [SharedModule, OffrePosteRoutingModule],
  declarations: [OffrePosteComponent, OffrePosteDetailComponent, OffrePosteUpdateComponent, OffrePosteDeleteDialogComponent],
})
export class OffrePosteModule {}
