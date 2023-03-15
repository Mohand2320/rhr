import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { AccordFormService, AccordFormGroup } from './accord-form.service';
import { IAccord } from '../accord.model';
import { AccordService } from '../service/accord.service';

@Component({
  selector: 'jhi-accord-update',
  templateUrl: './accord-update.component.html',
})
export class AccordUpdateComponent implements OnInit {
  isSaving = false;
  accord: IAccord | null = null;

  editForm: AccordFormGroup = this.accordFormService.createAccordFormGroup();

  constructor(
    protected accordService: AccordService,
    protected accordFormService: AccordFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ accord }) => {
      this.accord = accord;
      if (accord) {
        this.updateForm(accord);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const accord = this.accordFormService.getAccord(this.editForm);
    if (accord.id !== null) {
      this.subscribeToSaveResponse(this.accordService.update(accord));
    } else {
      this.subscribeToSaveResponse(this.accordService.create(accord));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAccord>>): void {
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

  protected updateForm(accord: IAccord): void {
    this.accord = accord;
    this.accordFormService.resetForm(this.editForm, accord);
  }
}
