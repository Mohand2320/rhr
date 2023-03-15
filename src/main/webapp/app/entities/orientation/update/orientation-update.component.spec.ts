import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { OrientationFormService } from './orientation-form.service';
import { OrientationService } from '../service/orientation.service';
import { IOrientation } from '../orientation.model';
import { IAgence } from 'app/entities/agence/agence.model';
import { AgenceService } from 'app/entities/agence/service/agence.service';

import { OrientationUpdateComponent } from './orientation-update.component';

describe('Orientation Management Update Component', () => {
  let comp: OrientationUpdateComponent;
  let fixture: ComponentFixture<OrientationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let orientationFormService: OrientationFormService;
  let orientationService: OrientationService;
  let agenceService: AgenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [OrientationUpdateComponent],
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
      .overrideTemplate(OrientationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OrientationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    orientationFormService = TestBed.inject(OrientationFormService);
    orientationService = TestBed.inject(OrientationService);
    agenceService = TestBed.inject(AgenceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Agence query and add missing value', () => {
      const orientation: IOrientation = { id: 456 };
      const agence: IAgence = { id: 5314 };
      orientation.agence = agence;

      const agenceCollection: IAgence[] = [{ id: 3569 }];
      jest.spyOn(agenceService, 'query').mockReturnValue(of(new HttpResponse({ body: agenceCollection })));
      const additionalAgences = [agence];
      const expectedCollection: IAgence[] = [...additionalAgences, ...agenceCollection];
      jest.spyOn(agenceService, 'addAgenceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ orientation });
      comp.ngOnInit();

      expect(agenceService.query).toHaveBeenCalled();
      expect(agenceService.addAgenceToCollectionIfMissing).toHaveBeenCalledWith(
        agenceCollection,
        ...additionalAgences.map(expect.objectContaining)
      );
      expect(comp.agencesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const orientation: IOrientation = { id: 456 };
      const agence: IAgence = { id: 3464 };
      orientation.agence = agence;

      activatedRoute.data = of({ orientation });
      comp.ngOnInit();

      expect(comp.agencesSharedCollection).toContain(agence);
      expect(comp.orientation).toEqual(orientation);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOrientation>>();
      const orientation = { id: 123 };
      jest.spyOn(orientationFormService, 'getOrientation').mockReturnValue(orientation);
      jest.spyOn(orientationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ orientation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: orientation }));
      saveSubject.complete();

      // THEN
      expect(orientationFormService.getOrientation).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(orientationService.update).toHaveBeenCalledWith(expect.objectContaining(orientation));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOrientation>>();
      const orientation = { id: 123 };
      jest.spyOn(orientationFormService, 'getOrientation').mockReturnValue({ id: null });
      jest.spyOn(orientationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ orientation: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: orientation }));
      saveSubject.complete();

      // THEN
      expect(orientationFormService.getOrientation).toHaveBeenCalled();
      expect(orientationService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOrientation>>();
      const orientation = { id: 123 };
      jest.spyOn(orientationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ orientation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(orientationService.update).toHaveBeenCalled();
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
