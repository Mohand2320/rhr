import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AccordComponent } from './list/accord.component';
import { AccordDetailComponent } from './detail/accord-detail.component';
import { AccordUpdateComponent } from './update/accord-update.component';
import { AccordDeleteDialogComponent } from './delete/accord-delete-dialog.component';
import { AccordRoutingModule } from './route/accord-routing.module';

@NgModule({
  imports: [SharedModule, AccordRoutingModule],
  declarations: [AccordComponent, AccordDetailComponent, AccordUpdateComponent, AccordDeleteDialogComponent],
})
export class AccordModule {}
