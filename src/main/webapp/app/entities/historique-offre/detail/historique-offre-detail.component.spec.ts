import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { HistoriqueOffreDetailComponent } from './historique-offre-detail.component';

describe('HistoriqueOffre Management Detail Component', () => {
  let comp: HistoriqueOffreDetailComponent;
  let fixture: ComponentFixture<HistoriqueOffreDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoriqueOffreDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ historiqueOffre: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(HistoriqueOffreDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(HistoriqueOffreDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load historiqueOffre on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.historiqueOffre).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
