import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PersonneService } from '../service/personne.service';

import { PersonneComponent } from './personne.component';

describe('Personne Management Component', () => {
  let comp: PersonneComponent;
  let fixture: ComponentFixture<PersonneComponent>;
  let service: PersonneService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'personne', component: PersonneComponent }]), HttpClientTestingModule],
      declarations: [PersonneComponent],
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
      .overrideTemplate(PersonneComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PersonneComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PersonneService);

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
    expect(comp.personnes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to personneService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getPersonneIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getPersonneIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
