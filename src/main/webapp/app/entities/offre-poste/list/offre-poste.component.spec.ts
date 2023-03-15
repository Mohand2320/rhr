import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { OffrePosteService } from '../service/offre-poste.service';

import { OffrePosteComponent } from './offre-poste.component';

describe('OffrePoste Management Component', () => {
  let comp: OffrePosteComponent;
  let fixture: ComponentFixture<OffrePosteComponent>;
  let service: OffrePosteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'offre-poste', component: OffrePosteComponent }]), HttpClientTestingModule],
      declarations: [OffrePosteComponent],
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
      .overrideTemplate(OffrePosteComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OffrePosteComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(OffrePosteService);

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
    expect(comp.offrePostes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to offrePosteService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getOffrePosteIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getOffrePosteIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
