import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { HistoriqueOffreService } from '../service/historique-offre.service';

import { HistoriqueOffreComponent } from './historique-offre.component';

describe('HistoriqueOffre Management Component', () => {
  let comp: HistoriqueOffreComponent;
  let fixture: ComponentFixture<HistoriqueOffreComponent>;
  let service: HistoriqueOffreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'historique-offre', component: HistoriqueOffreComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [HistoriqueOffreComponent],
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
      .overrideTemplate(HistoriqueOffreComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(HistoriqueOffreComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(HistoriqueOffreService);

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
    expect(comp.historiqueOffres?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to historiqueOffreService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getHistoriqueOffreIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getHistoriqueOffreIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
