import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { StructureDetailComponent } from './structure-detail.component';

describe('Structure Management Detail Component', () => {
  let comp: StructureDetailComponent;
  let fixture: ComponentFixture<StructureDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StructureDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ structure: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(StructureDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(StructureDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load structure on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.structure).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
