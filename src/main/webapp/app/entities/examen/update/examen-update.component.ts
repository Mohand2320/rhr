import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ExamenFormService, ExamenFormGroup } from './examen-form.service';
import { IExamen } from '../examen.model';
import { ExamenService } from '../service/examen.service';
import { IOffrePoste } from 'app/entities/offre-poste/offre-poste.model';
import { OffrePosteService } from 'app/entities/offre-poste/service/offre-poste.service';
import { Etat } from 'app/entities/enumerations/etat.model';

@Component({
  selector: 'jhi-examen-update',
  templateUrl: './examen-update.component.html',
})
export class ExamenUpdateComponent implements OnInit {
  isSaving = false;
  examen: IExamen | null = null;
  etatValues = Object.keys(Etat);

  offrePostesSharedCollection: IOffrePoste[] = [];

  editForm: ExamenFormGroup = this.examenFormService.createExamenFormGroup();

  constructor(
    protected examenService: ExamenService,
    protected examenFormService: ExamenFormService,
    protected offrePosteService: OffrePosteService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareOffrePoste = (o1: IOffrePoste | null, o2: IOffrePoste | null): boolean => this.offrePosteService.compareOffrePoste(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ examen }) => {
      this.examen = examen;
      if (examen) {
        this.updateForm(examen);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const examen = this.examenFormService.getExamen(this.editForm);
    if (examen.id !== null) {
      this.subscribeToSaveResponse(this.examenService.update(examen));
    } else {
      this.subscribeToSaveResponse(this.examenService.create(examen));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IExamen>>): void {
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

  protected updateForm(examen: IExamen): void {
    this.examen = examen;
    this.examenFormService.resetForm(this.editForm, examen);

    this.offrePostesSharedCollection = this.offrePosteService.addOffrePosteToCollectionIfMissing<IOffrePoste>(
      this.offrePostesSharedCollection,
      examen.offrePoste
    );
  }

  protected loadRelationshipsOptions(): void {
    this.offrePosteService
      .query()
      .pipe(map((res: HttpResponse<IOffrePoste[]>) => res.body ?? []))
      .pipe(
        map((offrePostes: IOffrePoste[]) =>
          this.offrePosteService.addOffrePosteToCollectionIfMissing<IOffrePoste>(offrePostes, this.examen?.offrePoste)
        )
      )
      .subscribe((offrePostes: IOffrePoste[]) => (this.offrePostesSharedCollection = offrePostes));
  }
}
