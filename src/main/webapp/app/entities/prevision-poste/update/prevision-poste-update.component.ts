import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { PrevisionPosteFormService, PrevisionPosteFormGroup } from './prevision-poste-form.service';
import { IPrevisionPoste } from '../prevision-poste.model';
import { PrevisionPosteService } from '../service/prevision-poste.service';
import { IPrevision } from 'app/entities/prevision/prevision.model';
import { PrevisionService } from 'app/entities/prevision/service/prevision.service';
import { IPoste } from 'app/entities/poste/poste.model';
import { PosteService } from 'app/entities/poste/service/poste.service';

@Component({
  selector: 'jhi-prevision-poste-update',
  templateUrl: './prevision-poste-update.component.html',
})
export class PrevisionPosteUpdateComponent implements OnInit {
  isSaving = false;
  previsionPoste: IPrevisionPoste | null = null;

  previsionsSharedCollection: IPrevision[] = [];
  postesSharedCollection: IPoste[] = [];

  editForm: PrevisionPosteFormGroup = this.previsionPosteFormService.createPrevisionPosteFormGroup();

  constructor(
    protected previsionPosteService: PrevisionPosteService,
    protected previsionPosteFormService: PrevisionPosteFormService,
    protected previsionService: PrevisionService,
    protected posteService: PosteService,
    protected activatedRoute: ActivatedRoute
  ) {}

  comparePrevision = (o1: IPrevision | null, o2: IPrevision | null): boolean => this.previsionService.comparePrevision(o1, o2);

  comparePoste = (o1: IPoste | null, o2: IPoste | null): boolean => this.posteService.comparePoste(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ previsionPoste }) => {
      this.previsionPoste = previsionPoste;
      if (previsionPoste) {
        this.updateForm(previsionPoste);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const previsionPoste = this.previsionPosteFormService.getPrevisionPoste(this.editForm);
    if (previsionPoste.id !== null) {
      this.subscribeToSaveResponse(this.previsionPosteService.update(previsionPoste));
    } else {
      this.subscribeToSaveResponse(this.previsionPosteService.create(previsionPoste));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPrevisionPoste>>): void {
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

  protected updateForm(previsionPoste: IPrevisionPoste): void {
    this.previsionPoste = previsionPoste;
    this.previsionPosteFormService.resetForm(this.editForm, previsionPoste);

    this.previsionsSharedCollection = this.previsionService.addPrevisionToCollectionIfMissing<IPrevision>(
      this.previsionsSharedCollection,
      ...(previsionPoste.previsions ?? [])
    );
    this.postesSharedCollection = this.posteService.addPosteToCollectionIfMissing<IPoste>(
      this.postesSharedCollection,
      ...(previsionPoste.postes ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.previsionService
      .query()
      .pipe(map((res: HttpResponse<IPrevision[]>) => res.body ?? []))
      .pipe(
        map((previsions: IPrevision[]) =>
          this.previsionService.addPrevisionToCollectionIfMissing<IPrevision>(previsions, ...(this.previsionPoste?.previsions ?? []))
        )
      )
      .subscribe((previsions: IPrevision[]) => (this.previsionsSharedCollection = previsions));

    this.posteService
      .query()
      .pipe(map((res: HttpResponse<IPoste[]>) => res.body ?? []))
      .pipe(
        map((postes: IPoste[]) => this.posteService.addPosteToCollectionIfMissing<IPoste>(postes, ...(this.previsionPoste?.postes ?? [])))
      )
      .subscribe((postes: IPoste[]) => (this.postesSharedCollection = postes));
  }
}
