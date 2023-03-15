import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CandidatDetailComponent } from './candidat-detail.component';

describe('Candidat Management Detail Component', () => {
  let comp: CandidatDetailComponent;
  let fixture: ComponentFixture<CandidatDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CandidatDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ candidat: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CandidatDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CandidatDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load candidat on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.candidat).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
