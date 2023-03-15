import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IOrientationCandidat } from '../orientation-candidat.model';
import { OrientationCandidatService } from '../service/orientation-candidat.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './orientation-candidat-delete-dialog.component.html',
})
export class OrientationCandidatDeleteDialogComponent {
  orientationCandidat?: IOrientationCandidat;

  constructor(protected orientationCandidatService: OrientationCandidatService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.orientationCandidatService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
