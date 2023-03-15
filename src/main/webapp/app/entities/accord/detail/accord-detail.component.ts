import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAccord } from '../accord.model';

@Component({
  selector: 'jhi-accord-detail',
  templateUrl: './accord-detail.component.html',
})
export class AccordDetailComponent implements OnInit {
  accord: IAccord | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ accord }) => {
      this.accord = accord;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
