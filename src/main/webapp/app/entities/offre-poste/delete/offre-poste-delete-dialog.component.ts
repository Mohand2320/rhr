import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IOffrePoste } from '../offre-poste.model';
import { OffrePosteService } from '../service/offre-poste.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './offre-poste-delete-dialog.component.html',
})
export class OffrePosteDeleteDialogComponent {
  offrePoste?: IOffrePoste;

  constructor(protected offrePosteService: OffrePosteService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.offrePosteService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
