import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { OrientationFormService, OrientationFormGroup } from './orientation-form.service';
import { IOrientation } from '../orientation.model';
import { OrientationService } from '../service/orientation.service';
import { IAgence } from 'app/entities/agence/agence.model';
import { AgenceService } from 'app/entities/agence/service/agence.service';

@Component({
  selector: 'jhi-orientation-update',
  templateUrl: './orientation-update.component.html',
})
export class OrientationUpdateComponent implements OnInit {
  isSaving = false;
  orientation: IOrientation | null = null;

  agencesSharedCollection: IAgence[] = [];

  editForm: OrientationFormGroup = this.orientationFormService.createOrientationFormGroup();

  constructor(
    protected orientationService: OrientationService,
    protected orientationFormService: OrientationFormService,
    protected agenceService: AgenceService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareAgence = (o1: IAgence | null, o2: IAgence | null): boolean => this.agenceService.compareAgence(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ orientation }) => {
      this.orientation = orientation;
      if (orientation) {
        this.updateForm(orientation);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const orientation = this.orientationFormService.getOrientation(this.editForm);
    if (orientation.id !== null) {
      this.subscribeToSaveResponse(this.orientationService.update(orientation));
    } else {
      this.subscribeToSaveResponse(this.orientationService.create(orientation));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrientation>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(orientation: IOrientation): void {
    this.orientation = orientation;
    this.orientationFormService.resetForm(this.editForm, orientation);

    this.agencesSharedCollection = this.agenceService.addAgenceToCollectionIfMissing<IAgence>(
      this.agencesSharedCollection,
      orientation.agence
    );
  }

  protected loadRelationshipsOptions(): void {
    this.agenceService
      .query()
      .pipe(map((res: HttpResponse<IAgence[]>) => res.body ?? []))
      .pipe(map((agences: IAgence[]) => this.agenceService.addAgenceToCollectionIfMissing<IAgence>(agences, this.orientation?.agence)))
      .subscribe((agences: IAgence[]) => (this.agencesSharedCollection = agences));
  }
}
