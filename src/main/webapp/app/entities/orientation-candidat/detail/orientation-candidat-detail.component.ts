import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOrientationCandidat } from '../orientation-candidat.model';

@Component({
  selector: 'jhi-orientation-candidat-detail',
  templateUrl: './orientation-candidat-detail.component.html',
})
export class OrientationCandidatDetailComponent implements OnInit {
  orientationCandidat: IOrientationCandidat | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ orientationCandidat }) => {
      this.orientationCandidat = orientationCandidat;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
