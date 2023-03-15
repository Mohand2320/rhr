import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICandidatExamen } from '../candidat-examen.model';
import { CandidatExamenService } from '../service/candidat-examen.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './candidat-examen-delete-dialog.component.html',
})
export class CandidatExamenDeleteDialogComponent {
  candidatExamen?: ICandidatExamen;

  constructor(protected candidatExamenService: CandidatExamenService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.candidatExamenService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
