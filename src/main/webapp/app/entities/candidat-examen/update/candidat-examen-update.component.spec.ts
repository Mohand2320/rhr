import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CandidatExamenFormService } from './candidat-examen-form.service';
import { CandidatExamenService } from '../service/candidat-examen.service';
import { ICandidatExamen } from '../candidat-examen.model';
import { ICandidat } from 'app/entities/candidat/candidat.model';
import { CandidatService } from 'app/entities/candidat/service/candidat.service';
import { IExamen } from 'app/entities/examen/examen.model';
import { ExamenService } from 'app/entities/examen/service/examen.service';

import { CandidatExamenUpdateComponent } from './candidat-examen-update.component';

describe('CandidatExamen Management Update Component', () => {
  let comp: CandidatExamenUpdateComponent;
  let fixture: ComponentFixture<CandidatExamenUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let candidatExamenFormService: CandidatExamenFormService;
  let candidatExamenService: CandidatExamenService;
  let candidatService: CandidatService;
  let examenService: ExamenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CandidatExamenUpdateComponent],
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
      .overrideTemplate(CandidatExamenUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CandidatExamenUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    candidatExamenFormService = TestBed.inject(CandidatExamenFormService);
    candidatExamenService = TestBed.inject(CandidatExamenService);
    candidatService = TestBed.inject(CandidatService);
    examenService = TestBed.inject(ExamenService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Candidat query and add missing value', () => {
      const candidatExamen: ICandidatExamen = { id: 456 };
      const candidats: ICandidat[] = [{ id: 2248 }];
      candidatExamen.candidats = candidats;

      const candidatCollection: ICandidat[] = [{ id: 5268 }];
      jest.spyOn(candidatService, 'query').mockReturnValue(of(new HttpResponse({ body: candidatCollection })));
      const additionalCandidats = [...candidats];
      const expectedCollection: ICandidat[] = [...additionalCandidats, ...candidatCollection];
      jest.spyOn(candidatService, 'addCandidatToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ candidatExamen });
      comp.ngOnInit();

      expect(candidatService.query).toHaveBeenCalled();
      expect(candidatService.addCandidatToCollectionIfMissing).toHaveBeenCalledWith(
        candidatCollection,
        ...additionalCandidats.map(expect.objectContaining)
      );
      expect(comp.candidatsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Examen query and add missing value', () => {
      const candidatExamen: ICandidatExamen = { id: 456 };
      const examen: IExamen[] = [{ id: 14020 }];
      candidatExamen.examen = examen;

      const examenCollection: IExamen[] = [{ id: 45328 }];
      jest.spyOn(examenService, 'query').mockReturnValue(of(new HttpResponse({ body: examenCollection })));
      const additionalExamen = [...examen];
      const expectedCollection: IExamen[] = [...additionalExamen, ...examenCollection];
      jest.spyOn(examenService, 'addExamenToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ candidatExamen });
      comp.ngOnInit();

      expect(examenService.query).toHaveBeenCalled();
      expect(examenService.addExamenToCollectionIfMissing).toHaveBeenCalledWith(
        examenCollection,
        ...additionalExamen.map(expect.objectContaining)
      );
      expect(comp.examenSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const candidatExamen: ICandidatExamen = { id: 456 };
      const candidat: ICandidat = { id: 33934 };
      candidatExamen.candidats = [candidat];
      const examen: IExamen = { id: 78885 };
      candidatExamen.examen = [examen];

      activatedRoute.data = of({ candidatExamen });
      comp.ngOnInit();

      expect(comp.candidatsSharedCollection).toContain(candidat);
      expect(comp.examenSharedCollection).toContain(examen);
      expect(comp.candidatExamen).toEqual(candidatExamen);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICandidatExamen>>();
      const candidatExamen = { id: 123 };
      jest.spyOn(candidatExamenFormService, 'getCandidatExamen').mockReturnValue(candidatExamen);
      jest.spyOn(candidatExamenService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ candidatExamen });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: candidatExamen }));
      saveSubject.complete();

      // THEN
      expect(candidatExamenFormService.getCandidatExamen).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(candidatExamenService.update).toHaveBeenCalledWith(expect.objectContaining(candidatExamen));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICandidatExamen>>();
      const candidatExamen = { id: 123 };
      jest.spyOn(candidatExamenFormService, 'getCandidatExamen').mockReturnValue({ id: null });
      jest.spyOn(candidatExamenService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ candidatExamen: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: candidatExamen }));
      saveSubject.complete();

      // THEN
      expect(candidatExamenFormService.getCandidatExamen).toHaveBeenCalled();
      expect(candidatExamenService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICandidatExamen>>();
      const candidatExamen = { id: 123 };
      jest.spyOn(candidatExamenService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ candidatExamen });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(candidatExamenService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCandidat', () => {
      it('Should forward to candidatService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(candidatService, 'compareCandidat');
        comp.compareCandidat(entity, entity2);
        expect(candidatService.compareCandidat).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareExamen', () => {
      it('Should forward to examenService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(examenService, 'compareExamen');
        comp.compareExamen(entity, entity2);
        expect(examenService.compareExamen).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
