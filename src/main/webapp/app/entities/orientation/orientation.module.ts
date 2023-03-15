import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { OrientationComponent } from './list/orientation.component';
import { OrientationDetailComponent } from './detail/orientation-detail.component';
import { OrientationUpdateComponent } from './update/orientation-update.component';
import { OrientationDeleteDialogComponent } from './delete/orientation-delete-dialog.component';
import { OrientationRoutingModule } from './route/orientation-routing.module';

@NgModule({
  imports: [SharedModule, OrientationRoutingModule],
  declarations: [OrientationComponent, OrientationDetailComponent, OrientationUpdateComponent, OrientationDeleteDialogComponent],
})
export class OrientationModule {}
