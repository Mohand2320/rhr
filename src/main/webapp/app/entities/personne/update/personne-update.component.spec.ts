import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PersonneFormService } from './personne-form.service';
import { PersonneService } from '../service/personne.service';
import { IPersonne } from '../personne.model';

import { PersonneUpdateComponent } from './personne-update.component';

describe('Personne Management Update Component', () => {
  let comp: PersonneUpdateComponent;
  let fixture: ComponentFixture<PersonneUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let personneFormService: PersonneFormService;
  let personneService: PersonneService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PersonneUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(PersonneUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PersonneUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    personneFormService = TestBed.inject(PersonneFormService);
    personneService = TestBed.inject(PersonneService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const personne: IPersonne = { id: 456 };

      activatedRoute.data = of({ personne });
      comp.ngOnInit();

      expect(comp.personne).toEqual(personne);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPersonne>>();
      const personne = { id: 123 };
      jest.spyOn(personneFormService, 'getPersonne').mockReturnValue(personne);
      jest.spyOn(personneService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ personne });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: personne }));
      saveSubject.complete();

      // THEN
      expect(personneFormService.getPersonne).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(personneService.update).toHaveBeenCalledWith(expect.objectContaining(personne));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPersonne>>();
      const personne = { id: 123 };
      jest.spyOn(personneFormService, 'getPersonne').mockReturnValue({ id: null });
      jest.spyOn(personneService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ personne: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: personne }));
      saveSubject.complete();

      // THEN
      expect(personneFormService.getPersonne).toHaveBeenCalled();
      expect(personneService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPersonne>>();
      const personne = { id: 123 };
      jest.spyOn(personneService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ personne });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(personneService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
