import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOffrePoste } from '../offre-poste.model';

@Component({
  selector: 'jhi-offre-poste-detail',
  templateUrl: './offre-poste-detail.component.html',
})
export class OffrePosteDetailComponent implements OnInit {
  offrePoste: IOffrePoste | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ offrePoste }) => {
      this.offrePoste = offrePoste;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
