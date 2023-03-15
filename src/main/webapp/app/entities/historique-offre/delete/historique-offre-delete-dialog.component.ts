import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IHistoriqueOffre } from '../historique-offre.model';
import { HistoriqueOffreService } from '../service/historique-offre.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './historique-offre-delete-dialog.component.html',
})
export class HistoriqueOffreDeleteDialogComponent {
  historiqueOffre?: IHistoriqueOffre;

  constructor(protected historiqueOffreService: HistoriqueOffreService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.historiqueOffreService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
