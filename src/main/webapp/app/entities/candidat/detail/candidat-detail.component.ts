import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICandidat } from '../candidat.model';

@Component({
  selector: 'jhi-candidat-detail',
  templateUrl: './candidat-detail.component.html',
})
export class CandidatDetailComponent implements OnInit {
  candidat: ICandidat | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ candidat }) => {
      this.candidat = candidat;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
