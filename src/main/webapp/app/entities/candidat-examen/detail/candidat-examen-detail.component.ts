import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICandidatExamen } from '../candidat-examen.model';

@Component({
  selector: 'jhi-candidat-examen-detail',
  templateUrl: './candidat-examen-detail.component.html',
})
export class CandidatExamenDetailComponent implements OnInit {
  candidatExamen: ICandidatExamen | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ candidatExamen }) => {
      this.candidatExamen = candidatExamen;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
