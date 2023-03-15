import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OffrePosteDetailComponent } from './offre-poste-detail.component';

describe('OffrePoste Management Detail Component', () => {
  let comp: OffrePosteDetailComponent;
  let fixture: ComponentFixture<OffrePosteDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OffrePosteDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ offrePoste: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(OffrePosteDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(OffrePosteDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load offrePoste on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.offrePoste).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
