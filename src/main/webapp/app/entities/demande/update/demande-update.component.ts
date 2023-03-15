import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { DemandeFormService, DemandeFormGroup } from './demande-form.service';
import { IDemande } from '../demande.model';
import { DemandeService } from '../service/demande.service';
import { IAccord } from 'app/entities/accord/accord.model';
import { AccordService } from 'app/entities/accord/service/accord.service';
import { TypeDemande } from 'app/entities/enumerations/type-demande.model';
import { Etat } from 'app/entities/enumerations/etat.model';

@Component({
  selector: 'jhi-demande-update',
  templateUrl: './demande-update.component.html',
})
export class DemandeUpdateComponent implements OnInit {
  isSaving = false;
  demande: IDemande | null = null;
  typeDemandeValues = Object.keys(TypeDemande);
  etatValues = Object.keys(Etat);

  accordsSharedCollection: IAccord[] = [];

  editForm: DemandeFormGroup = this.demandeFormService.createDemandeFormGroup();

  constructor(
    protected demandeService: DemandeService,
    protected demandeFormService: DemandeFormService,
    protected accordService: AccordService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareAccord = (o1: IAccord | null, o2: IAccord | null): boolean => this.accordService.compareAccord(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ demande }) => {
      this.demande = demande;
      if (demande) {
        this.updateForm(demande);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const demande = this.demandeFormService.getDemande(this.editForm);
    if (demande.id !== null) {
      this.subscribeToSaveResponse(this.demandeService.update(demande));
    } else {
      this.subscribeToSaveResponse(this.demandeService.create(demande));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDemande>>): void {
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

  protected updateForm(demande: IDemande): void {
    this.demande = demande;
    this.demandeFormService.resetForm(this.editForm, demande);

    this.accordsSharedCollection = this.accordService.addAccordToCollectionIfMissing<IAccord>(this.accordsSharedCollection, demande.auteur);
  }

  protected loadRelationshipsOptions(): void {
    this.accordService
      .query()
      .pipe(map((res: HttpResponse<IAccord[]>) => res.body ?? []))
      .pipe(map((accords: IAccord[]) => this.accordService.addAccordToCollectionIfMissing<IAccord>(accords, this.demande?.auteur)))
      .subscribe((accords: IAccord[]) => (this.accordsSharedCollection = accords));
  }
}
