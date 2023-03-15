import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IStructure } from '../structure.model';

@Component({
  selector: 'jhi-structure-detail',
  templateUrl: './structure-detail.component.html',
})
export class StructureDetailComponent implements OnInit {
  structure: IStructure | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ structure }) => {
      this.structure = structure;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
