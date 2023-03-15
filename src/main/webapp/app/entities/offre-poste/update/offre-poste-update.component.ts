import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { OffrePosteFormService, OffrePosteFormGroup } from './offre-poste-form.service';
import { IOffrePoste } from '../offre-poste.model';
import { OffrePosteService } from '../service/offre-poste.service';
import { IOrientation } from 'app/entities/orientation/orientation.model';
import { OrientationService } from 'app/entities/orientation/service/orientation.service';

@Component({
  selector: 'jhi-offre-poste-update',
  templateUrl: './offre-poste-update.component.html',
})
export class OffrePosteUpdateComponent implements OnInit {
  isSaving = false;
  offrePoste: IOffrePoste | null = null;

  orientationsSharedCollection: IOrientation[] = [];

  editForm: OffrePosteFormGroup = this.offrePosteFormService.createOffrePosteFormGroup();

  constructor(
    protected offrePosteService: OffrePosteService,
    protected offrePosteFormService: OffrePosteFormService,
    protected orientationService: OrientationService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareOrientation = (o1: IOrientation | null, o2: IOrientation | null): boolean => this.orientationService.compareOrientation(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ offrePoste }) => {
      this.offrePoste = offrePoste;
      if (offrePoste) {
        this.updateForm(offrePoste);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const offrePoste = this.offrePosteFormService.getOffrePoste(this.editForm);
    if (offrePoste.id !== null) {
      this.subscribeToSaveResponse(this.offrePosteService.update(offrePoste));
    } else {
      this.subscribeToSaveResponse(this.offrePosteService.create(offrePoste));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOffrePoste>>): void {
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

  protected updateForm(offrePoste: IOffrePoste): void {
    this.offrePoste = offrePoste;
    this.offrePosteFormService.resetForm(this.editForm, offrePoste);

    this.orientationsSharedCollection = this.orientationService.addOrientationToCollectionIfMissing<IOrientation>(
      this.orientationsSharedCollection,
      offrePoste.orientation
    );
  }

  protected loadRelationshipsOptions(): void {
    this.orientationService
      .query()
      .pipe(map((res: HttpResponse<IOrientation[]>) => res.body ?? []))
      .pipe(
        map((orientations: IOrientation[]) =>
          this.orientationService.addOrientationToCollectionIfMissing<IOrientation>(orientations, this.offrePoste?.orientation)
        )
      )
      .subscribe((orientations: IOrientation[]) => (this.orientationsSharedCollection = orientations));
  }
}
