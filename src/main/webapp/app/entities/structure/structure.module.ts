import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { StructureComponent } from './list/structure.component';
import { StructureDetailComponent } from './detail/structure-detail.component';
import { StructureUpdateComponent } from './update/structure-update.component';
import { StructureDeleteDialogComponent } from './delete/structure-delete-dialog.component';
import { StructureRoutingModule } from './route/structure-routing.module';

@NgModule({
  imports: [SharedModule, StructureRoutingModule],
  declarations: [StructureComponent, StructureDetailComponent, StructureUpdateComponent, StructureDeleteDialogComponent],
})
export class StructureModule {}
