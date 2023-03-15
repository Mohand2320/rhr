import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ExamenFormService } from './examen-form.service';
import { ExamenService } from '../service/examen.service';
import { IExamen } from '../examen.model';
import { IOffrePoste } from 'app/entities/offre-poste/offre-poste.model';
import { OffrePosteService } from 'app/entities/offre-poste/service/offre-poste.service';

import { ExamenUpdateComponent } from './examen-update.component';

describe('Examen Management Update Component', () => {
  let comp: ExamenUpdateComponent;
  let fixture: ComponentFixture<ExamenUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let examenFormService: ExamenFormService;
  let examenService: ExamenService;
  let offrePosteService: OffrePosteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ExamenUpdateComponent],
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
      .overrideTemplate(ExamenUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ExamenUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    examenFormService = TestBed.inject(ExamenFormService);
    examenService = TestBed.inject(ExamenService);
    offrePosteService = TestBed.inject(OffrePosteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call OffrePoste query and add missing value', () => {
      const examen: IExamen = { id: 456 };
      const offrePoste: IOffrePoste = { id: 13336 };
      examen.offrePoste = offrePoste;

      const offrePosteCollection: IOffrePoste[] = [{ id: 77747 }];
      jest.spyOn(offrePosteService, 'query').mockReturnValue(of(new HttpResponse({ body: offrePosteCollection })));
      const additionalOffrePostes = [offrePoste];
      const expectedCollection: IOffrePoste[] = [...additionalOffrePostes, ...offrePosteCollection];
      jest.spyOn(offrePosteService, 'addOffrePosteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ examen });
      comp.ngOnInit();

      expect(offrePosteService.query).toHaveBeenCalled();
      expect(offrePosteService.addOffrePosteToCollectionIfMissing).toHaveBeenCalledWith(
        offrePosteCollection,
        ...additionalOffrePostes.map(expect.objectContaining)
      );
      expect(comp.offrePostesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const examen: IExamen = { id: 456 };
      const offrePoste: IOffrePoste = { id: 74576 };
      examen.offrePoste = offrePoste;

      activatedRoute.data = of({ examen });
      comp.ngOnInit();

      expect(comp.offrePostesSharedCollection).toContain(offrePoste);
      expect(comp.examen).toEqual(examen);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IExamen>>();
      const examen = { id: 123 };
      jest.spyOn(examenFormService, 'getExamen').mockReturnValue(examen);
      jest.spyOn(examenService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ examen });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: examen }));
      saveSubject.complete();

      // THEN
      expect(examenFormService.getExamen).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(examenService.update).toHaveBeenCalledWith(expect.objectContaining(examen));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IExamen>>();
      const examen = { id: 123 };
      jest.spyOn(examenFormService, 'getExamen').mockReturnValue({ id: null });
      jest.spyOn(examenService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ examen: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: examen }));
      saveSubject.complete();

      // THEN
      expect(examenFormService.getExamen).toHaveBeenCalled();
      expect(examenService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IExamen>>();
      const examen = { id: 123 };
      jest.spyOn(examenService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ examen });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(examenService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareOffrePoste', () => {
      it('Should forward to offrePosteService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(offrePosteService, 'compareOffrePoste');
        comp.compareOffrePoste(entity, entity2);
        expect(offrePosteService.compareOffrePoste).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
