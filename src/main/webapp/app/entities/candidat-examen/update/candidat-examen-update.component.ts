import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CandidatExamenFormService, CandidatExamenFormGroup } from './candidat-examen-form.service';
import { ICandidatExamen } from '../candidat-examen.model';
import { CandidatExamenService } from '../service/candidat-examen.service';
import { ICandidat } from 'app/entities/candidat/candidat.model';
import { CandidatService } from 'app/entities/candidat/service/candidat.service';
import { IExamen } from 'app/entities/examen/examen.model';
import { ExamenService } from 'app/entities/examen/service/examen.service';
import { Situation } from 'app/entities/enumerations/situation.model';

@Component({
  selector: 'jhi-candidat-examen-update',
  templateUrl: './candidat-examen-update.component.html',
})
export class CandidatExamenUpdateComponent implements OnInit {
  isSaving = false;
  candidatExamen: ICandidatExamen | null = null;
  situationValues = Object.keys(Situation);

  candidatsSharedCollection: ICandidat[] = [];
  examenSharedCollection: IExamen[] = [];

  editForm: CandidatExamenFormGroup = this.candidatExamenFormService.createCandidatExamenFormGroup();

  constructor(
    protected candidatExamenService: CandidatExamenService,
    protected candidatExamenFormService: CandidatExamenFormService,
    protected candidatService: CandidatService,
    protected examenService: ExamenService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCandidat = (o1: ICandidat | null, o2: ICandidat | null): boolean => this.candidatService.compareCandidat(o1, o2);

  compareExamen = (o1: IExamen | null, o2: IExamen | null): boolean => this.examenService.compareExamen(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ candidatExamen }) => {
      this.candidatExamen = candidatExamen;
      if (candidatExamen) {
        this.updateForm(candidatExamen);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const candidatExamen = this.candidatExamenFormService.getCandidatExamen(this.editForm);
    if (candidatExamen.id !== null) {
      this.subscribeToSaveResponse(this.candidatExamenService.update(candidatExamen));
    } else {
      this.subscribeToSaveResponse(this.candidatExamenService.create(candidatExamen));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICandidatExamen>>): void {
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

  protected updateForm(candidatExamen: ICandidatExamen): void {
    this.candidatExamen = candidatExamen;
    this.candidatExamenFormService.resetForm(this.editForm, candidatExamen);

    this.candidatsSharedCollection = this.candidatService.addCandidatToCollectionIfMissing<ICandidat>(
      this.candidatsSharedCollection,
      ...(candidatExamen.candidats ?? [])
    );
    this.examenSharedCollection = this.examenService.addExamenToCollectionIfMissing<IExamen>(
      this.examenSharedCollection,
      ...(candidatExamen.examen ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.candidatService
      .query()
      .pipe(map((res: HttpResponse<ICandidat[]>) => res.body ?? []))
      .pipe(
        map((candidats: ICandidat[]) =>
          this.candidatService.addCandidatToCollectionIfMissing<ICandidat>(candidats, ...(this.candidatExamen?.candidats ?? []))
        )
      )
      .subscribe((candidats: ICandidat[]) => (this.candidatsSharedCollection = candidats));

    this.examenService
      .query()
      .pipe(map((res: HttpResponse<IExamen[]>) => res.body ?? []))
      .pipe(
        map((examen: IExamen[]) =>
          this.examenService.addExamenToCollectionIfMissing<IExamen>(examen, ...(this.candidatExamen?.examen ?? []))
        )
      )
      .subscribe((examen: IExamen[]) => (this.examenSharedCollection = examen));
  }
}
