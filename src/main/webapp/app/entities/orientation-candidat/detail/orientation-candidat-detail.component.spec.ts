import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OrientationCandidatDetailComponent } from './orientation-candidat-detail.component';

describe('OrientationCandidat Management Detail Component', () => {
  let comp: OrientationCandidatDetailComponent;
  let fixture: ComponentFixture<OrientationCandidatDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrientationCandidatDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ orientationCandidat: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(OrientationCandidatDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(OrientationCandidatDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load orientationCandidat on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.orientationCandidat).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
