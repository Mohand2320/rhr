import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { OrientationCandidatService } from '../service/orientation-candidat.service';

import { OrientationCandidatComponent } from './orientation-candidat.component';

describe('OrientationCandidat Management Component', () => {
  let comp: OrientationCandidatComponent;
  let fixture: ComponentFixture<OrientationCandidatComponent>;
  let service: OrientationCandidatService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'orientation-candidat', component: OrientationCandidatComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [OrientationCandidatComponent],
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
      .overrideTemplate(OrientationCandidatComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OrientationCandidatComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(OrientationCandidatService);

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
    expect(comp.orientationCandidats?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to orientationCandidatService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getOrientationCandidatIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getOrientationCandidatIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
