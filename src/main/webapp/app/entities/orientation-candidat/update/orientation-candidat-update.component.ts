import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { OrientationCandidatFormService, OrientationCandidatFormGroup } from './orientation-candidat-form.service';
import { IOrientationCandidat } from '../orientation-candidat.model';
import { OrientationCandidatService } from '../service/orientation-candidat.service';
import { ICandidat } from 'app/entities/candidat/candidat.model';
import { CandidatService } from 'app/entities/candidat/service/candidat.service';
import { IOrientation } from 'app/entities/orientation/orientation.model';
import { OrientationService } from 'app/entities/orientation/service/orientation.service';

@Component({
  selector: 'jhi-orientation-candidat-update',
  templateUrl: './orientation-candidat-update.component.html',
})
export class OrientationCandidatUpdateComponent implements OnInit {
  isSaving = false;
  orientationCandidat: IOrientationCandidat | null = null;

  candidatsSharedCollection: ICandidat[] = [];
  orientationsSharedCollection: IOrientation[] = [];

  editForm: OrientationCandidatFormGroup = this.orientationCandidatFormService.createOrientationCandidatFormGroup();

  constructor(
    protected orientationCandidatService: OrientationCandidatService,
    protected orientationCandidatFormService: OrientationCandidatFormService,
    protected candidatService: CandidatService,
    protected orientationService: OrientationService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCandidat = (o1: ICandidat | null, o2: ICandidat | null): boolean => this.candidatService.compareCandidat(o1, o2);

  compareOrientation = (o1: IOrientation | null, o2: IOrientation | null): boolean => this.orientationService.compareOrientation(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ orientationCandidat }) => {
      this.orientationCandidat = orientationCandidat;
      if (orientationCandidat) {
        this.updateForm(orientationCandidat);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const orientationCandidat = this.orientationCandidatFormService.getOrientationCandidat(this.editForm);
    if (orientationCandidat.id !== null) {
      this.subscribeToSaveResponse(this.orientationCandidatService.update(orientationCandidat));
    } else {
      this.subscribeToSaveResponse(this.orientationCandidatService.create(orientationCandidat));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrientationCandidat>>): void {
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

  protected updateForm(orientationCandidat: IOrientationCandidat): void {
    this.orientationCandidat = orientationCandidat;
    this.orientationCandidatFormService.resetForm(this.editForm, orientationCandidat);

    this.candidatsSharedCollection = this.candidatService.addCandidatToCollectionIfMissing<ICandidat>(
      this.candidatsSharedCollection,
      ...(orientationCandidat.candidats ?? [])
    );
    this.orientationsSharedCollection = this.orientationService.addOrientationToCollectionIfMissing<IOrientation>(
      this.orientationsSharedCollection,
      ...(orientationCandidat.orientations ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.candidatService
      .query()
      .pipe(map((res: HttpResponse<ICandidat[]>) => res.body ?? []))
      .pipe(
        map((candidats: ICandidat[]) =>
          this.candidatService.addCandidatToCollectionIfMissing<ICandidat>(candidats, ...(this.orientationCandidat?.candidats ?? []))
        )
      )
      .subscribe((candidats: ICandidat[]) => (this.candidatsSharedCollection = candidats));

    this.orientationService
      .query()
      .pipe(map((res: HttpResponse<IOrientation[]>) => res.body ?? []))
      .pipe(
        map((orientations: IOrientation[]) =>
          this.orientationService.addOrientationToCollectionIfMissing<IOrientation>(
            orientations,
            ...(this.orientationCandidat?.orientations ?? [])
          )
        )
      )
      .subscribe((orientations: IOrientation[]) => (this.orientationsSharedCollection = orientations));
  }
}
