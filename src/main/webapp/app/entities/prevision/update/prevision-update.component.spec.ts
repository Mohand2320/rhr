import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PrevisionFormService } from './prevision-form.service';
import { PrevisionService } from '../service/prevision.service';
import { IPrevision } from '../prevision.model';
import { IAgence } from 'app/entities/agence/agence.model';
import { AgenceService } from 'app/entities/agence/service/agence.service';

import { PrevisionUpdateComponent } from './prevision-update.component';

describe('Prevision Management Update Component', () => {
  let comp: PrevisionUpdateComponent;
  let fixture: ComponentFixture<PrevisionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let previsionFormService: PrevisionFormService;
  let previsionService: PrevisionService;
  let agenceService: AgenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PrevisionUpdateComponent],
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
      .overrideTemplate(PrevisionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PrevisionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    previsionFormService = TestBed.inject(PrevisionFormService);
    previsionService = TestBed.inject(PrevisionService);
    agenceService = TestBed.inject(AgenceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Agence query and add missing value', () => {
      const prevision: IPrevision = { id: 456 };
      const agence: IAgence = { id: 77242 };
      prevision.agence = agence;

      const agenceCollection: IAgence[] = [{ id: 75539 }];
      jest.spyOn(agenceService, 'query').mockReturnValue(of(new HttpResponse({ body: agenceCollection })));
      const additionalAgences = [agence];
      const expectedCollection: IAgence[] = [...additionalAgences, ...agenceCollection];
      jest.spyOn(agenceService, 'addAgenceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ prevision });
      comp.ngOnInit();

      expect(agenceService.query).toHaveBeenCalled();
      expect(agenceService.addAgenceToCollectionIfMissing).toHaveBeenCalledWith(
        agenceCollection,
        ...additionalAgences.map(expect.objectContaining)
      );
      expect(comp.agencesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const prevision: IPrevision = { id: 456 };
      const agence: IAgence = { id: 56724 };
      prevision.agence = agence;

      activatedRoute.data = of({ prevision });
      comp.ngOnInit();

      expect(comp.agencesSharedCollection).toContain(agence);
      expect(comp.prevision).toEqual(prevision);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPrevision>>();
      const prevision = { id: 123 };
      jest.spyOn(previsionFormService, 'getPrevision').mockReturnValue(prevision);
      jest.spyOn(previsionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ prevision });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: prevision }));
      saveSubject.complete();

      // THEN
      expect(previsionFormService.getPrevision).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(previsionService.update).toHaveBeenCalledWith(expect.objectContaining(prevision));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPrevision>>();
      const prevision = { id: 123 };
      jest.spyOn(previsionFormService, 'getPrevision').mockReturnValue({ id: null });
      jest.spyOn(previsionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ prevision: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: prevision }));
      saveSubject.complete();

      // THEN
      expect(previsionFormService.getPrevision).toHaveBeenCalled();
      expect(previsionService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPrevision>>();
      const prevision = { id: 123 };
      jest.spyOn(previsionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ prevision });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(previsionService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareAgence', () => {
      it('Should forward to agenceService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(agenceService, 'compareAgence');
        comp.compareAgence(entity, entity2);
        expect(agenceService.compareAgence).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
