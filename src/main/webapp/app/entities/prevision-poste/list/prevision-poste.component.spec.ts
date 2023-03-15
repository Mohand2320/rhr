import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PrevisionPosteService } from '../service/prevision-poste.service';

import { PrevisionPosteComponent } from './prevision-poste.component';

describe('PrevisionPoste Management Component', () => {
  let comp: PrevisionPosteComponent;
  let fixture: ComponentFixture<PrevisionPosteComponent>;
  let service: PrevisionPosteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'prevision-poste', component: PrevisionPosteComponent }]), HttpClientTestingModule],
      declarations: [PrevisionPosteComponent],
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
      .overrideTemplate(PrevisionPosteComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PrevisionPosteComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PrevisionPosteService);

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
    expect(comp.previsionPostes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to previsionPosteService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getPrevisionPosteIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getPrevisionPosteIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
