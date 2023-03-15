import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DemandeFormService } from './demande-form.service';
import { DemandeService } from '../service/demande.service';
import { IDemande } from '../demande.model';
import { IAccord } from 'app/entities/accord/accord.model';
import { AccordService } from 'app/entities/accord/service/accord.service';

import { DemandeUpdateComponent } from './demande-update.component';

describe('Demande Management Update Component', () => {
  let comp: DemandeUpdateComponent;
  let fixture: ComponentFixture<DemandeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let demandeFormService: DemandeFormService;
  let demandeService: DemandeService;
  let accordService: AccordService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DemandeUpdateComponent],
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
      .overrideTemplate(DemandeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DemandeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    demandeFormService = TestBed.inject(DemandeFormService);
    demandeService = TestBed.inject(DemandeService);
    accordService = TestBed.inject(AccordService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Accord query and add missing value', () => {
      const demande: IDemande = { id: 456 };
      const auteur: IAccord = { id: 36872 };
      demande.auteur = auteur;

      const accordCollection: IAccord[] = [{ id: 30242 }];
      jest.spyOn(accordService, 'query').mockReturnValue(of(new HttpResponse({ body: accordCollection })));
      const additionalAccords = [auteur];
      const expectedCollection: IAccord[] = [...additionalAccords, ...accordCollection];
      jest.spyOn(accordService, 'addAccordToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ demande });
      comp.ngOnInit();

      expect(accordService.query).toHaveBeenCalled();
      expect(accordService.addAccordToCollectionIfMissing).toHaveBeenCalledWith(
        accordCollection,
        ...additionalAccords.map(expect.objectContaining)
      );
      expect(comp.accordsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const demande: IDemande = { id: 456 };
      const auteur: IAccord = { id: 76521 };
      demande.auteur = auteur;

      activatedRoute.data = of({ demande });
      comp.ngOnInit();

      expect(comp.accordsSharedCollection).toContain(auteur);
      expect(comp.demande).toEqual(demande);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDemande>>();
      const demande = { id: 123 };
      jest.spyOn(demandeFormService, 'getDemande').mockReturnValue(demande);
      jest.spyOn(demandeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ demande });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: demande }));
      saveSubject.complete();

      // THEN
      expect(demandeFormService.getDemande).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(demandeService.update).toHaveBeenCalledWith(expect.objectContaining(demande));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDemande>>();
      const demande = { id: 123 };
      jest.spyOn(demandeFormService, 'getDemande').mockReturnValue({ id: null });
      jest.spyOn(demandeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ demande: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: demande }));
      saveSubject.complete();

      // THEN
      expect(demandeFormService.getDemande).toHaveBeenCalled();
      expect(demandeService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDemande>>();
      const demande = { id: 123 };
      jest.spyOn(demandeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ demande });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(demandeService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareAccord', () => {
      it('Should forward to accordService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(accordService, 'compareAccord');
        comp.compareAccord(entity, entity2);
        expect(accordService.compareAccord).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
