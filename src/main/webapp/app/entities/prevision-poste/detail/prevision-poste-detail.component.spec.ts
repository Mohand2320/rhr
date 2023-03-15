import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PrevisionPosteDetailComponent } from './prevision-poste-detail.component';

describe('PrevisionPoste Management Detail Component', () => {
  let comp: PrevisionPosteDetailComponent;
  let fixture: ComponentFixture<PrevisionPosteDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrevisionPosteDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ previsionPoste: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PrevisionPosteDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PrevisionPosteDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load previsionPoste on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.previsionPoste).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
