import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PrevisionService } from '../service/prevision.service';

import { PrevisionComponent } from './prevision.component';

describe('Prevision Management Component', () => {
  let comp: PrevisionComponent;
  let fixture: ComponentFixture<PrevisionComponent>;
  let service: PrevisionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'prevision', component: PrevisionComponent }]), HttpClientTestingModule],
      declarations: [PrevisionComponent],
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
      .overrideTemplate(PrevisionComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PrevisionComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PrevisionService);

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
    expect(comp.previsions?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to previsionService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getPrevisionIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getPrevisionIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
