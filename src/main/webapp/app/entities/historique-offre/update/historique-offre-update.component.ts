import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { HistoriqueOffreFormService, HistoriqueOffreFormGroup } from './historique-offre-form.service';
import { IHistoriqueOffre } from '../historique-offre.model';
import { HistoriqueOffreService } from '../service/historique-offre.service';
import { Etat } from 'app/entities/enumerations/etat.model';

@Component({
  selector: 'jhi-historique-offre-update',
  templateUrl: './historique-offre-update.component.html',
})
export class HistoriqueOffreUpdateComponent implements OnInit {
  isSaving = false;
  historiqueOffre: IHistoriqueOffre | null = null;
  etatValues = Object.keys(Etat);

  editForm: HistoriqueOffreFormGroup = this.historiqueOffreFormService.createHistoriqueOffreFormGroup();

  constructor(
    protected historiqueOffreService: HistoriqueOffreService,
    protected historiqueOffreFormService: HistoriqueOffreFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ historiqueOffre }) => {
      this.historiqueOffre = historiqueOffre;
      if (historiqueOffre) {
        this.updateForm(historiqueOffre);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const historiqueOffre = this.historiqueOffreFormService.getHistoriqueOffre(this.editForm);
    if (historiqueOffre.id !== null) {
      this.subscribeToSaveResponse(this.historiqueOffreService.update(historiqueOffre));
    } else {
      this.subscribeToSaveResponse(this.historiqueOffreService.create(historiqueOffre));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IHistoriqueOffre>>): void {
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

  protected updateForm(historiqueOffre: IHistoriqueOffre): void {
    this.historiqueOffre = historiqueOffre;
    this.historiqueOffreFormService.resetForm(this.editForm, historiqueOffre);
  }
}
