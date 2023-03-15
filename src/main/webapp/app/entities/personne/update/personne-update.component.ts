import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { PersonneFormService, PersonneFormGroup } from './personne-form.service';
import { IPersonne } from '../personne.model';
import { PersonneService } from '../service/personne.service';

@Component({
  selector: 'jhi-personne-update',
  templateUrl: './personne-update.component.html',
})
export class PersonneUpdateComponent implements OnInit {
  isSaving = false;
  personne: IPersonne | null = null;

  editForm: PersonneFormGroup = this.personneFormService.createPersonneFormGroup();

  constructor(
    protected personneService: PersonneService,
    protected personneFormService: PersonneFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ personne }) => {
      this.personne = personne;
      if (personne) {
        this.updateForm(personne);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const personne = this.personneFormService.getPersonne(this.editForm);
    if (personne.id !== null) {
      this.subscribeToSaveResponse(this.personneService.update(personne));
    } else {
      this.subscribeToSaveResponse(this.personneService.create(personne));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPersonne>>): void {
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

  protected updateForm(personne: IPersonne): void {
    this.personne = personne;
    this.personneFormService.resetForm(this.editForm, personne);
  }
}
