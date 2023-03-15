import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPrevisionPoste } from '../prevision-poste.model';

@Component({
  selector: 'jhi-prevision-poste-detail',
  templateUrl: './prevision-poste-detail.component.html',
})
export class PrevisionPosteDetailComponent implements OnInit {
  previsionPoste: IPrevisionPoste | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ previsionPoste }) => {
      this.previsionPoste = previsionPoste;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
