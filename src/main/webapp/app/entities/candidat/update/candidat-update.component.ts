import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { CandidatFormService, CandidatFormGroup } from './candidat-form.service';
import { ICandidat } from '../candidat.model';
import { CandidatService } from '../service/candidat.service';

@Component({
  selector: 'jhi-candidat-update',
  templateUrl: './candidat-update.component.html',
})
export class CandidatUpdateComponent implements OnInit {
  isSaving = false;
  candidat: ICandidat | null = null;

  editForm: CandidatFormGroup = this.candidatFormService.createCandidatFormGroup();

  constructor(
    protected candidatService: CandidatService,
    protected candidatFormService: CandidatFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ candidat }) => {
      this.candidat = candidat;
      if (candidat) {
        this.updateForm(candidat);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const candidat = this.candidatFormService.getCandidat(this.editForm);
    if (candidat.id !== null) {
      this.subscribeToSaveResponse(this.candidatService.update(candidat));
    } else {
      this.subscribeToSaveResponse(this.candidatService.create(candidat));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICandidat>>): void {
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

  protected updateForm(candidat: ICandidat): void {
    this.candidat = candidat;
    this.candidatFormService.resetForm(this.editForm, candidat);
  }
}
