import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AgenceFormService } from './agence-form.service';
import { AgenceService } from '../service/agence.service';
import { IAgence } from '../agence.model';
import { IVille } from 'app/entities/ville/ville.model';
import { VilleService } from 'app/entities/ville/service/ville.service';

import { AgenceUpdateComponent } from './agence-update.component';

describe('Agence Management Update Component', () => {
  let comp: AgenceUpdateComponent;
  let fixture: ComponentFixture<AgenceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let agenceFormService: AgenceFormService;
  let agenceService: AgenceService;
  let villeService: VilleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AgenceUpdateComponent],
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
      .overrideTemplate(AgenceUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AgenceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    agenceFormService = TestBed.inject(AgenceFormService);
    agenceService = TestBed.inject(AgenceService);
    villeService = TestBed.inject(VilleService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Ville query and add missing value', () => {
      const agence: IAgence = { id: 456 };
      const ville: IVille = { id: 4067 };
      agence.ville = ville;

      const villeCollection: IVille[] = [{ id: 1378 }];
      jest.spyOn(villeService, 'query').mockReturnValue(of(new HttpResponse({ body: villeCollection })));
      const additionalVilles = [ville];
      const expectedCollection: IVille[] = [...additionalVilles, ...villeCollection];
      jest.spyOn(villeService, 'addVilleToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ agence });
      comp.ngOnInit();

      expect(villeService.query).toHaveBeenCalled();
      expect(villeService.addVilleToCollectionIfMissing).toHaveBeenCalledWith(
        villeCollection,
        ...additionalVilles.map(expect.objectContaining)
      );
      expect(comp.villesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Agence query and add missing value', () => {
      const agence: IAgence = { id: 456 };
      const agence: IAgence = { id: 10214 };
      agence.agence = agence;

      const agenceCollection: IAgence[] = [{ id: 14434 }];
      jest.spyOn(agenceService, 'query').mockReturnValue(of(new HttpResponse({ body: agenceCollection })));
      const additionalAgences = [agence];
      const expectedCollection: IAgence[] = [...additionalAgences, ...agenceCollection];
      jest.spyOn(agenceService, 'addAgenceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ agence });
      comp.ngOnInit();

      expect(agenceService.query).toHaveBeenCalled();
      expect(agenceService.addAgenceToCollectionIfMissing).toHaveBeenCalledWith(
        agenceCollection,
        ...additionalAgences.map(expect.objectContaining)
      );
      expect(comp.agencesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const agence: IAgence = { id: 456 };
      const ville: IVille = { id: 88096 };
      agence.ville = ville;
      const agence: IAgence = { id: 60102 };
      agence.agence = agence;

      activatedRoute.data = of({ agence });
      comp.ngOnInit();

      expect(comp.villesSharedCollection).toContain(ville);
      expect(comp.agencesSharedCollection).toContain(agence);
      expect(comp.agence).toEqual(agence);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAgence>>();
      const agence = { id: 123 };
      jest.spyOn(agenceFormService, 'getAgence').mockReturnValue(agence);
      jest.spyOn(agenceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ agence });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: agence }));
      saveSubject.complete();

      // THEN
      expect(agenceFormService.getAgence).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(agenceService.update).toHaveBeenCalledWith(expect.objectContaining(agence));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAgence>>();
      const agence = { id: 123 };
      jest.spyOn(agenceFormService, 'getAgence').mockReturnValue({ id: null });
      jest.spyOn(agenceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ agence: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: agence }));
      saveSubject.complete();

      // THEN
      expect(agenceFormService.getAgence).toHaveBeenCalled();
      expect(agenceService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAgence>>();
      const agence = { id: 123 };
      jest.spyOn(agenceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ agence });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(agenceService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareVille', () => {
      it('Should forward to villeService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(villeService, 'compareVille');
        comp.compareVille(entity, entity2);
        expect(villeService.compareVille).toHaveBeenCalledWith(entity, entity2);
      });
    });

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
