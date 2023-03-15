import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CandidatExamenService } from '../service/candidat-examen.service';

import { CandidatExamenComponent } from './candidat-examen.component';

describe('CandidatExamen Management Component', () => {
  let comp: CandidatExamenComponent;
  let fixture: ComponentFixture<CandidatExamenComponent>;
  let service: CandidatExamenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'candidat-examen', component: CandidatExamenComponent }]), HttpClientTestingModule],
      declarations: [CandidatExamenComponent],
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
      .overrideTemplate(CandidatExamenComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CandidatExamenComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CandidatExamenService);

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
    expect(comp.candidatExamen?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to candidatExamenService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getCandidatExamenIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getCandidatExamenIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
