import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPrevision } from '../prevision.model';
import { PrevisionService } from '../service/prevision.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './prevision-delete-dialog.component.html',
})
export class PrevisionDeleteDialogComponent {
  prevision?: IPrevision;

  constructor(protected previsionService: PrevisionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.previsionService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
