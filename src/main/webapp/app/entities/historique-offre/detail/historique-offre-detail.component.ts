import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IHistoriqueOffre } from '../historique-offre.model';

@Component({
  selector: 'jhi-historique-offre-detail',
  templateUrl: './historique-offre-detail.component.html',
})
export class HistoriqueOffreDetailComponent implements OnInit {
  historiqueOffre: IHistoriqueOffre | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ historiqueOffre }) => {
      this.historiqueOffre = historiqueOffre;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
