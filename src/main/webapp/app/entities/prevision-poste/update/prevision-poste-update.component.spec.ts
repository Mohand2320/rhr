import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PrevisionPosteFormService } from './prevision-poste-form.service';
import { PrevisionPosteService } from '../service/prevision-poste.service';
import { IPrevisionPoste } from '../prevision-poste.model';
import { IPrevision } from 'app/entities/prevision/prevision.model';
import { PrevisionService } from 'app/entities/prevision/service/prevision.service';
import { IPoste } from 'app/entities/poste/poste.model';
import { PosteService } from 'app/entities/poste/service/poste.service';

import { PrevisionPosteUpdateComponent } from './prevision-poste-update.component';

describe('PrevisionPoste Management Update Component', () => {
  let comp: PrevisionPosteUpdateComponent;
  let fixture: ComponentFixture<PrevisionPosteUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let previsionPosteFormService: PrevisionPosteFormService;
  let previsionPosteService: PrevisionPosteService;
  let previsionService: PrevisionService;
  let posteService: PosteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PrevisionPosteUpdateComponent],
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
      .overrideTemplate(PrevisionPosteUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PrevisionPosteUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    previsionPosteFormService = TestBed.inject(PrevisionPosteFormService);
    previsionPosteService = TestBed.inject(PrevisionPosteService);
    previsionService = TestBed.inject(PrevisionService);
    posteService = TestBed.inject(PosteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Prevision query and add missing value', () => {
      const previsionPoste: IPrevisionPoste = { id: 456 };
      const previsions: IPrevision[] = [{ id: 46695 }];
      previsionPoste.previsions = previsions;

      const previsionCollection: IPrevision[] = [{ id: 92097 }];
      jest.spyOn(previsionService, 'query').mockReturnValue(of(new HttpResponse({ body: previsionCollection })));
      const additionalPrevisions = [...previsions];
      const expectedCollection: IPrevision[] = [...additionalPrevisions, ...previsionCollection];
      jest.spyOn(previsionService, 'addPrevisionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ previsionPoste });
      comp.ngOnInit();

      expect(previsionService.query).toHaveBeenCalled();
      expect(previsionService.addPrevisionToCollectionIfMissing).toHaveBeenCalledWith(
        previsionCollection,
        ...additionalPrevisions.map(expect.objectContaining)
      );
      expect(comp.previsionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Poste query and add missing value', () => {
      const previsionPoste: IPrevisionPoste = { id: 456 };
      const postes: IPoste[] = [{ id: 88214 }];
      previsionPoste.postes = postes;

      const posteCollection: IPoste[] = [{ id: 51785 }];
      jest.spyOn(posteService, 'query').mockReturnValue(of(new HttpResponse({ body: posteCollection })));
      const additionalPostes = [...postes];
      const expectedCollection: IPoste[] = [...additionalPostes, ...posteCollection];
      jest.spyOn(posteService, 'addPosteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ previsionPoste });
      comp.ngOnInit();

      expect(posteService.query).toHaveBeenCalled();
      expect(posteService.addPosteToCollectionIfMissing).toHaveBeenCalledWith(
        posteCollection,
        ...additionalPostes.map(expect.objectContaining)
      );
      expect(comp.postesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const previsionPoste: IPrevisionPoste = { id: 456 };
      const prevision: IPrevision = { id: 93244 };
      previsionPoste.previsions = [prevision];
      const poste: IPoste = { id: 87782 };
      previsionPoste.postes = [poste];

      activatedRoute.data = of({ previsionPoste });
      comp.ngOnInit();

      expect(comp.previsionsSharedCollection).toContain(prevision);
      expect(comp.postesSharedCollection).toContain(poste);
      expect(comp.previsionPoste).toEqual(previsionPoste);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPrevisionPoste>>();
      const previsionPoste = { id: 123 };
      jest.spyOn(previsionPosteFormService, 'getPrevisionPoste').mockReturnValue(previsionPoste);
      jest.spyOn(previsionPosteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ previsionPoste });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: previsionPoste }));
      saveSubject.complete();

      // THEN
      expect(previsionPosteFormService.getPrevisionPoste).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(previsionPosteService.update).toHaveBeenCalledWith(expect.objectContaining(previsionPoste));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPrevisionPoste>>();
      const previsionPoste = { id: 123 };
      jest.spyOn(previsionPosteFormService, 'getPrevisionPoste').mockReturnValue({ id: null });
      jest.spyOn(previsionPosteService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ previsionPoste: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: previsionPoste }));
      saveSubject.complete();

      // THEN
      expect(previsionPosteFormService.getPrevisionPoste).toHaveBeenCalled();
      expect(previsionPosteService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPrevisionPoste>>();
      const previsionPoste = { id: 123 };
      jest.spyOn(previsionPosteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ previsionPoste });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(previsionPosteService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('comparePrevision', () => {
      it('Should forward to previsionService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(previsionService, 'comparePrevision');
        comp.comparePrevision(entity, entity2);
        expect(previsionService.comparePrevision).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('comparePoste', () => {
      it('Should forward to posteService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(posteService, 'comparePoste');
        comp.comparePoste(entity, entity2);
        expect(posteService.comparePoste).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
