import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { StructureFormService, StructureFormGroup } from './structure-form.service';
import { IStructure } from '../structure.model';
import { StructureService } from '../service/structure.service';
import { IDemande } from 'app/entities/demande/demande.model';
import { DemandeService } from 'app/entities/demande/service/demande.service';
import { IOffre } from 'app/entities/offre/offre.model';
import { OffreService } from 'app/entities/offre/service/offre.service';

@Component({
  selector: 'jhi-structure-update',
  templateUrl: './structure-update.component.html',
})
export class StructureUpdateComponent implements OnInit {
  isSaving = false;
  structure: IStructure | null = null;

  demandesSharedCollection: IDemande[] = [];
  offresSharedCollection: IOffre[] = [];

  editForm: StructureFormGroup = this.structureFormService.createStructureFormGroup();

  constructor(
    protected structureService: StructureService,
    protected structureFormService: StructureFormService,
    protected demandeService: DemandeService,
    protected offreService: OffreService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareDemande = (o1: IDemande | null, o2: IDemande | null): boolean => this.demandeService.compareDemande(o1, o2);

  compareOffre = (o1: IOffre | null, o2: IOffre | null): boolean => this.offreService.compareOffre(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ structure }) => {
      this.structure = structure;
      if (structure) {
        this.updateForm(structure);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const structure = this.structureFormService.getStructure(this.editForm);
    if (structure.id !== null) {
      this.subscribeToSaveResponse(this.structureService.update(structure));
    } else {
      this.subscribeToSaveResponse(this.structureService.create(structure));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IStructure>>): void {
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

  protected updateForm(structure: IStructure): void {
    this.structure = structure;
    this.structureFormService.resetForm(this.editForm, structure);

    this.demandesSharedCollection = this.demandeService.addDemandeToCollectionIfMissing<IDemande>(
      this.demandesSharedCollection,
      structure.demande
    );
    this.offresSharedCollection = this.offreService.addOffreToCollectionIfMissing<IOffre>(this.offresSharedCollection, structure.offre);
  }

  protected loadRelationshipsOptions(): void {
    this.demandeService
      .query()
      .pipe(map((res: HttpResponse<IDemande[]>) => res.body ?? []))
      .pipe(map((demandes: IDemande[]) => this.demandeService.addDemandeToCollectionIfMissing<IDemande>(demandes, this.structure?.demande)))
      .subscribe((demandes: IDemande[]) => (this.demandesSharedCollection = demandes));

    this.offreService
      .query()
      .pipe(map((res: HttpResponse<IOffre[]>) => res.body ?? []))
      .pipe(map((offres: IOffre[]) => this.offreService.addOffreToCollectionIfMissing<IOffre>(offres, this.structure?.offre)))
      .subscribe((offres: IOffre[]) => (this.offresSharedCollection = offres));
  }
}
