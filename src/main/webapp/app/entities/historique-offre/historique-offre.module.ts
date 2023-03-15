import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { HistoriqueOffreComponent } from './list/historique-offre.component';
import { HistoriqueOffreDetailComponent } from './detail/historique-offre-detail.component';
import { HistoriqueOffreUpdateComponent } from './update/historique-offre-update.component';
import { HistoriqueOffreDeleteDialogComponent } from './delete/historique-offre-delete-dialog.component';
import { HistoriqueOffreRoutingModule } from './route/historique-offre-routing.module';

@NgModule({
  imports: [SharedModule, HistoriqueOffreRoutingModule],
  declarations: [
    HistoriqueOffreComponent,
    HistoriqueOffreDetailComponent,
    HistoriqueOffreUpdateComponent,
    HistoriqueOffreDeleteDialogComponent,
  ],
})
export class HistoriqueOffreModule {}
