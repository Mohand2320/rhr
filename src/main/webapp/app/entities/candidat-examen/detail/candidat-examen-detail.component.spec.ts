import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CandidatExamenDetailComponent } from './candidat-examen-detail.component';

describe('CandidatExamen Management Detail Component', () => {
  let comp: CandidatExamenDetailComponent;
  let fixture: ComponentFixture<CandidatExamenDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CandidatExamenDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ candidatExamen: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CandidatExamenDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CandidatExamenDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load candidatExamen on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.candidatExamen).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
