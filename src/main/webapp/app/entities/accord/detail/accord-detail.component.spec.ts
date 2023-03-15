import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AccordDetailComponent } from './accord-detail.component';

describe('Accord Management Detail Component', () => {
  let comp: AccordDetailComponent;
  let fixture: ComponentFixture<AccordDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccordDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ accord: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AccordDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AccordDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load accord on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.accord).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
