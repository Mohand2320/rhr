import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AgenceService } from '../service/agence.service';

import { AgenceComponent } from './agence.component';

describe('Agence Management Component', () => {
  let comp: AgenceComponent;
  let fixture: ComponentFixture<AgenceComponent>;
  let service: AgenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'agence', component: AgenceComponent }]), HttpClientTestingModule],
      declarations: [AgenceComponent],
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
      .overrideTemplate(AgenceComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AgenceComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AgenceService);

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
    expect(comp.agences?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to agenceService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getAgenceIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getAgenceIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
