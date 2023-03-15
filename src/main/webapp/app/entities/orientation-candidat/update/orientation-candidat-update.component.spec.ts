import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { OrientationCandidatFormService } from './orientation-candidat-form.service';
import { OrientationCandidatService } from '../service/orientation-candidat.service';
import { IOrientationCandidat } from '../orientation-candidat.model';
import { ICandidat } from 'app/entities/candidat/candidat.model';
import { CandidatService } from 'app/entities/candidat/service/candidat.service';
import { IOrientation } from 'app/entities/orientation/orientation.model';
import { OrientationService } from 'app/entities/orientation/service/orientation.service';

import { OrientationCandidatUpdateComponent } from './orientation-candidat-update.component';

describe('OrientationCandidat Management Update Component', () => {
  let comp: OrientationCandidatUpdateComponent;
  let fixture: ComponentFixture<OrientationCandidatUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let orientationCandidatFormService: OrientationCandidatFormService;
  let orientationCandidatService: OrientationCandidatService;
  let candidatService: CandidatService;
  let orientationService: OrientationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [OrientationCandidatUpdateComponent],
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
      .overrideTemplate(OrientationCandidatUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OrientationCandidatUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    orientationCandidatFormService = TestBed.inject(OrientationCandidatFormService);
    orientationCandidatService = TestBed.inject(OrientationCandidatService);
    candidatService = TestBed.inject(CandidatService);
    orientationService = TestBed.inject(OrientationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Candidat query and add missing value', () => {
      const orientationCandidat: IOrientationCandidat = { id: 456 };
      const candidats: ICandidat[] = [{ id: 15833 }];
      orientationCandidat.candidats = candidats;

      const candidatCollection: ICandidat[] = [{ id: 29847 }];
      jest.spyOn(candidatService, 'query').mockReturnValue(of(new HttpResponse({ body: candidatCollection })));
      const additionalCandidats = [...candidats];
      const expectedCollection: ICandidat[] = [...additionalCandidats, ...candidatCollection];
      jest.spyOn(candidatService, 'addCandidatToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ orientationCandidat });
      comp.ngOnInit();

      expect(candidatService.query).toHaveBeenCalled();
      expect(candidatService.addCandidatToCollectionIfMissing).toHaveBeenCalledWith(
        candidatCollection,
        ...additionalCandidats.map(expect.objectContaining)
      );
      expect(comp.candidatsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Orientation query and add missing value', () => {
      const orientationCandidat: IOrientationCandidat = { id: 456 };
      const orientations: IOrientation[] = [{ id: 58754 }];
      orientationCandidat.orientations = orientations;

      const orientationCollection: IOrientation[] = [{ id: 55580 }];
      jest.spyOn(orientationService, 'query').mockReturnValue(of(new HttpResponse({ body: orientationCollection })));
      const additionalOrientations = [...orientations];
      const expectedCollection: IOrientation[] = [...additionalOrientations, ...orientationCollection];
      jest.spyOn(orientationService, 'addOrientationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ orientationCandidat });
      comp.ngOnInit();

      expect(orientationService.query).toHaveBeenCalled();
      expect(orientationService.addOrientationToCollectionIfMissing).toHaveBeenCalledWith(
        orientationCollection,
        ...additionalOrientations.map(expect.objectContaining)
      );
      expect(comp.orientationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const orientationCandidat: IOrientationCandidat = { id: 456 };
      const candidat: ICandidat = { id: 61310 };
      orientationCandidat.candidats = [candidat];
      const orientation: IOrientation = { id: 93613 };
      orientationCandidat.orientations = [orientation];

      activatedRoute.data = of({ orientationCandidat });
      comp.ngOnInit();

      expect(comp.candidatsSharedCollection).toContain(candidat);
      expect(comp.orientationsSharedCollection).toContain(orientation);
      expect(comp.orientationCandidat).toEqual(orientationCandidat);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOrientationCandidat>>();
      const orientationCandidat = { id: 123 };
      jest.spyOn(orientationCandidatFormService, 'getOrientationCandidat').mockReturnValue(orientationCandidat);
      jest.spyOn(orientationCandidatService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ orientationCandidat });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: orientationCandidat }));
      saveSubject.complete();

      // THEN
      expect(orientationCandidatFormService.getOrientationCandidat).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(orientationCandidatService.update).toHaveBeenCalledWith(expect.objectContaining(orientationCandidat));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOrientationCandidat>>();
      const orientationCandidat = { id: 123 };
      jest.spyOn(orientationCandidatFormService, 'getOrientationCandidat').mockReturnValue({ id: null });
      jest.spyOn(orientationCandidatService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ orientationCandidat: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: orientationCandidat }));
      saveSubject.complete();

      // THEN
      expect(orientationCandidatFormService.getOrientationCandidat).toHaveBeenCalled();
      expect(orientationCandidatService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOrientationCandidat>>();
      const orientationCandidat = { id: 123 };
      jest.spyOn(orientationCandidatService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ orientationCandidat });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(orientationCandidatService.update).toHaveBeenCalled();
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
