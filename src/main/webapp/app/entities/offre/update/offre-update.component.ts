import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { OffreFormService, OffreFormGroup } from './offre-form.service';
import { IOffre } from '../offre.model';
import { OffreService } from '../service/offre.service';
import { IDemande } from 'app/entities/demande/demande.model';
import { DemandeService } from 'app/entities/demande/service/demande.service';
import { IHistoriqueOffre } from 'app/entities/historique-offre/historique-offre.model';
import { HistoriqueOffreService } from 'app/entities/historique-offre/service/historique-offre.service';
import { IAgence } from 'app/entities/agence/agence.model';
import { AgenceService } from 'app/entities/agence/service/agence.service';
import { Etat } from 'app/entities/enumerations/etat.model';
import { TypeOffre } from 'app/entities/enumerations/type-offre.model';

@Component({
  selector: 'jhi-offre-update',
  templateUrl: './offre-update.component.html',
})
export class OffreUpdateComponent implements OnInit {
  isSaving = false;
  offre: IOffre | null = null;
  etatValues = Object.keys(Etat);
  typeOffreValues = Object.keys(TypeOffre);

  demandesSharedCollection: IDemande[] = [];
  historiqueOffresSharedCollection: IHistoriqueOffre[] = [];
  agencesSharedCollection: IAgence[] = [];

  editForm: OffreFormGroup = this.offreFormService.createOffreFormGroup();

  constructor(
    protected offreService: OffreService,
    protected offreFormService: OffreFormService,
    protected demandeService: DemandeService,
    protected historiqueOffreService: HistoriqueOffreService,
    protected agenceService: AgenceService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareDemande = (o1: IDemande | null, o2: IDemande | null): boolean => this.demandeService.compareDemande(o1, o2);

  compareHistoriqueOffre = (o1: IHistoriqueOffre | null, o2: IHistoriqueOffre | null): boolean =>
    this.historiqueOffreService.compareHistoriqueOffre(o1, o2);

  compareAgence = (o1: IAgence | null, o2: IAgence | null): boolean => this.agenceService.compareAgence(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ offre }) => {
      this.offre = offre;
      if (offre) {
        this.updateForm(offre);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const offre = this.offreFormService.getOffre(this.editForm);
    if (offre.id !== null) {
      this.subscribeToSaveResponse(this.offreService.update(offre));
    } else {
      this.subscribeToSaveResponse(this.offreService.create(offre));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOffre>>): void {
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

  protected updateForm(offre: IOffre): void {
    this.offre = offre;
    this.offreFormService.resetForm(this.editForm, offre);

    this.demandesSharedCollection = this.demandeService.addDemandeToCollectionIfMissing<IDemande>(
      this.demandesSharedCollection,
      offre.demande
    );
    this.historiqueOffresSharedCollection = this.historiqueOffreService.addHistoriqueOffreToCollectionIfMissing<IHistoriqueOffre>(
      this.historiqueOffresSharedCollection,
      offre.historiqueOffre
    );
    this.agencesSharedCollection = this.agenceService.addAgenceToCollectionIfMissing<IAgence>(this.agencesSharedCollection, offre.agence);
  }

  protected loadRelationshipsOptions(): void {
    this.demandeService
      .query()
      .pipe(map((res: HttpResponse<IDemande[]>) => res.body ?? []))
      .pipe(map((demandes: IDemande[]) => this.demandeService.addDemandeToCollectionIfMissing<IDemande>(demandes, this.offre?.demande)))
      .subscribe((demandes: IDemande[]) => (this.demandesSharedCollection = demandes));

    this.historiqueOffreService
      .query()
      .pipe(map((res: HttpResponse<IHistoriqueOffre[]>) => res.body ?? []))
      .pipe(
        map((historiqueOffres: IHistoriqueOffre[]) =>
          this.historiqueOffreService.addHistoriqueOffreToCollectionIfMissing<IHistoriqueOffre>(
            historiqueOffres,
            this.offre?.historiqueOffre
          )
        )
      )
      .subscribe((historiqueOffres: IHistoriqueOffre[]) => (this.historiqueOffresSharedCollection = historiqueOffres));

    this.agenceService
      .query()
      .pipe(map((res: HttpResponse<IAgence[]>) => res.body ?? []))
      .pipe(map((agences: IAgence[]) => this.agenceService.addAgenceToCollectionIfMissing<IAgence>(agences, this.offre?.agence)))
      .subscribe((agences: IAgence[]) => (this.agencesSharedCollection = agences));
  }
}
