import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AccordService } from '../service/accord.service';

import { AccordComponent } from './accord.component';

describe('Accord Management Component', () => {
  let comp: AccordComponent;
  let fixture: ComponentFixture<AccordComponent>;
  let service: AccordService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'accord', component: AccordComponent }]), HttpClientTestingModule],
      declarations: [AccordComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(AccordComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AccordComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AccordService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.accords?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to accordService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getAccordIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getAccordIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
