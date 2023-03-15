import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { OffrePosteFormService } from './offre-poste-form.service';
import { OffrePosteService } from '../service/offre-poste.service';
import { IOffrePoste } from '../offre-poste.model';
import { IOrientation } from 'app/entities/orientation/orientation.model';
import { OrientationService } from 'app/entities/orientation/service/orientation.service';

import { OffrePosteUpdateComponent } from './offre-poste-update.component';

describe('OffrePoste Management Update Component', () => {
  let comp: OffrePosteUpdateComponent;
  let fixture: ComponentFixture<OffrePosteUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let offrePosteFormService: OffrePosteFormService;
  let offrePosteService: OffrePosteService;
  let orientationService: OrientationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [OffrePosteUpdateComponent],
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
      .overrideTemplate(OffrePosteUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OffrePosteUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    offrePosteFormService = TestBed.inject(OffrePosteFormService);
    offrePosteService = TestBed.inject(OffrePosteService);
    orientationService = TestBed.inject(OrientationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Orientation query and add missing value', () => {
      const offrePoste: IOffrePoste = { id: 456 };
      const orientation: IOrientation = { id: 33048 };
      offrePoste.orientation = orientation;

      const orientationCollection: IOrientation[] = [{ id: 62822 }];
      jest.spyOn(orientationService, 'query').mockReturnValue(of(new HttpResponse({ body: orientationCollection })));
      const additionalOrientations = [orientation];
      const expectedCollection: IOrientation[] = [...additionalOrientations, ...orientationCollection];
      jest.spyOn(orientationService, 'addOrientationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ offrePoste });
      comp.ngOnInit();

      expect(orientationService.query).toHaveBeenCalled();
      expect(orientationService.addOrientationToCollectionIfMissing).toHaveBeenCalledWith(
        orientationCollection,
        ...additionalOrientations.map(expect.objectContaining)
      );
      expect(comp.orientationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const offrePoste: IOffrePoste = { id: 456 };
      const orientation: IOrientation = { id: 57585 };
      offrePoste.orientation = orientation;

      activatedRoute.data = of({ offrePoste });
      comp.ngOnInit();

      expect(comp.orientationsSharedCollection).toContain(orientation);
      expect(comp.offrePoste).toEqual(offrePoste);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOffrePoste>>();
      const offrePoste = { id: 123 };
      jest.spyOn(offrePosteFormService, 'getOffrePoste').mockReturnValue(offrePoste);
      jest.spyOn(offrePosteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ offrePoste });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: offrePoste }));
      saveSubject.complete();

      // THEN
      expect(offrePosteFormService.getOffrePoste).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(offrePosteService.update).toHaveBeenCalledWith(expect.objectContaining(offrePoste));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOffrePoste>>();
      const offrePoste = { id: 123 };
      jest.spyOn(offrePosteFormService, 'getOffrePoste').mockReturnValue({ id: null });
      jest.spyOn(offrePosteService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ offrePoste: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: offrePoste }));
      saveSubject.complete();

      // THEN
      expect(offrePosteFormService.getOffrePoste).toHaveBeenCalled();
      expect(offrePosteService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOffrePoste>>();
      const offrePoste = { id: 123 };
      jest.spyOn(offrePosteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ offrePoste });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(offrePosteService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareOrientation', () => {
      it('Should forward to orientationService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(orientationService, 'compareOrientation');
        comp.compareOrientation(entity, entity2);
        expect(orientationService.compareOrientation).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
