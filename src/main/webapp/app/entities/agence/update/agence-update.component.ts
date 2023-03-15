import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { AgenceFormService, AgenceFormGroup } from './agence-form.service';
import { IAgence } from '../agence.model';
import { AgenceService } from '../service/agence.service';
import { IVille } from 'app/entities/ville/ville.model';
import { VilleService } from 'app/entities/ville/service/ville.service';

@Component({
  selector: 'jhi-agence-update',
  templateUrl: './agence-update.component.html',
})
export class AgenceUpdateComponent implements OnInit {
  isSaving = false;
  agence: IAgence | null = null;

  villesSharedCollection: IVille[] = [];
  agencesSharedCollection: IAgence[] = [];

  editForm: AgenceFormGroup = this.agenceFormService.createAgenceFormGroup();

  constructor(
    protected agenceService: AgenceService,
    protected agenceFormService: AgenceFormService,
    protected villeService: VilleService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareVille = (o1: IVille | null, o2: IVille | null): boolean => this.villeService.compareVille(o1, o2);

  compareAgence = (o1: IAgence | null, o2: IAgence | null): boolean => this.agenceService.compareAgence(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ agence }) => {
      this.agence = agence;
      if (agence) {
        this.updateForm(agence);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const agence = this.agenceFormService.getAgence(this.editForm);
    if (agence.id !== null) {
      this.subscribeToSaveResponse(this.agenceService.update(agence));
    } else {
      this.subscribeToSaveResponse(this.agenceService.create(agence));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAgence>>): void {
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

  protected updateForm(agence: IAgence): void {
    this.agence = agence;
    this.agenceFormService.resetForm(this.editForm, agence);

    this.villesSharedCollection = this.villeService.addVilleToCollectionIfMissing<IVille>(this.villesSharedCollection, agence.ville);
    this.agencesSharedCollection = this.agenceService.addAgenceToCollectionIfMissing<IAgence>(this.agencesSharedCollection, agence.agence);
  }

  protected loadRelationshipsOptions(): void {
    this.villeService
      .query()
      .pipe(map((res: HttpResponse<IVille[]>) => res.body ?? []))
      .pipe(map((villes: IVille[]) => this.villeService.addVilleToCollectionIfMissing<IVille>(villes, this.agence?.ville)))
      .subscribe((villes: IVille[]) => (this.villesSharedCollection = villes));

    this.agenceService
      .query()
      .pipe(map((res: HttpResponse<IAgence[]>) => res.body ?? []))
      .pipe(map((agences: IAgence[]) => this.agenceService.addAgenceToCollectionIfMissing<IAgence>(agences, this.agence?.agence)))
      .subscribe((agences: IAgence[]) => (this.agencesSharedCollection = agences));
  }
}
