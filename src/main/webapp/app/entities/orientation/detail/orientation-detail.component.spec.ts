import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OrientationDetailComponent } from './orientation-detail.component';

describe('Orientation Management Detail Component', () => {
  let comp: OrientationDetailComponent;
  let fixture: ComponentFixture<OrientationDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrientationDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ orientation: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(OrientationDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(OrientationDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load orientation on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.orientation).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
