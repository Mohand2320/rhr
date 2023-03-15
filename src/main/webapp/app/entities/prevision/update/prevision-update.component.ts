import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { PrevisionFormService, PrevisionFormGroup } from './prevision-form.service';
import { IPrevision } from '../prevision.model';
import { PrevisionService } from '../service/prevision.service';
import { IAgence } from 'app/entities/agence/agence.model';
import { AgenceService } from 'app/entities/agence/service/agence.service';

@Component({
  selector: 'jhi-prevision-update',
  templateUrl: './prevision-update.component.html',
})
export class PrevisionUpdateComponent implements OnInit {
  isSaving = false;
  prevision: IPrevision | null = null;

  agencesSharedCollection: IAgence[] = [];

  editForm: PrevisionFormGroup = this.previsionFormService.createPrevisionFormGroup();

  constructor(
    protected previsionService: PrevisionService,
    protected previsionFormService: PrevisionFormService,
    protected agenceService: AgenceService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareAgence = (o1: IAgence | null, o2: IAgence | null): boolean => this.agenceService.compareAgence(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ prevision }) => {
      this.prevision = prevision;
      if (prevision) {
        this.updateForm(prevision);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const prevision = this.previsionFormService.getPrevision(this.editForm);
    if (prevision.id !== null) {
      this.subscribeToSaveResponse(this.previsionService.update(prevision));
    } else {
      this.subscribeToSaveResponse(this.previsionService.create(prevision));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPrevision>>): void {
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

  protected updateForm(prevision: IPrevision): void {
    this.prevision = prevision;
    this.previsionFormService.resetForm(this.editForm, prevision);

    this.agencesSharedCollection = this.agenceService.addAgenceToCollectionIfMissing<IAgence>(
      this.agencesSharedCollection,
      prevision.agence
    );
  }

  protected loadRelationshipsOptions(): void {
    this.agenceService
      .query()
      .pipe(map((res: HttpResponse<IAgence[]>) => res.body ?? []))
      .pipe(map((agences: IAgence[]) => this.agenceService.addAgenceToCollectionIfMissing<IAgence>(agences, this.prevision?.agence)))
      .subscribe((agences: IAgence[]) => (this.agencesSharedCollection = agences));
  }
}
