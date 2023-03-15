import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOrientation } from '../orientation.model';

@Component({
  selector: 'jhi-orientation-detail',
  templateUrl: './orientation-detail.component.html',
})
export class OrientationDetailComponent implements OnInit {
  orientation: IOrientation | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ orientation }) => {
      this.orientation = orientation;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
