import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { StructureFormService } from './structure-form.service';
import { StructureService } from '../service/structure.service';
import { IStructure } from '../structure.model';
import { IDemande } from 'app/entities/demande/demande.model';
import { DemandeService } from 'app/entities/demande/service/demande.service';
import { IOffre } from 'app/entities/offre/offre.model';
import { OffreService } from 'app/entities/offre/service/offre.service';

import { StructureUpdateComponent } from './structure-update.component';

describe('Structure Management Update Component', () => {
  let comp: StructureUpdateComponent;
  let fixture: ComponentFixture<StructureUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let structureFormService: StructureFormService;
  let structureService: StructureService;
  let demandeService: DemandeService;
  let offreService: OffreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [StructureUpdateComponent],
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
      .overrideTemplate(StructureUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StructureUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    structureFormService = TestBed.inject(StructureFormService);
    structureService = TestBed.inject(StructureService);
    demandeService = TestBed.inject(DemandeService);
    offreService = TestBed.inject(OffreService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Demande query and add missing value', () => {
      const structure: IStructure = { id: 456 };
      const demande: IDemande = { id: 78409 };
      structure.demande = demande;

      const demandeCollection: IDemande[] = [{ id: 31397 }];
      jest.spyOn(demandeService, 'query').mockReturnValue(of(new HttpResponse({ body: demandeCollection })));
      const additionalDemandes = [demande];
      const expectedCollection: IDemande[] = [...additionalDemandes, ...demandeCollection];
      jest.spyOn(demandeService, 'addDemandeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ structure });
      comp.ngOnInit();

      expect(demandeService.query).toHaveBeenCalled();
      expect(demandeService.addDemandeToCollectionIfMissing).toHaveBeenCalledWith(
        demandeCollection,
        ...additionalDemandes.map(expect.objectContaining)
      );
      expect(comp.demandesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Offre query and add missing value', () => {
      const structure: IStructure = { id: 456 };
      const offre: IOffre = { id: 82568 };
      structure.offre = offre;

      const offreCollection: IOffre[] = [{ id: 94853 }];
      jest.spyOn(offreService, 'query').mockReturnValue(of(new HttpResponse({ body: offreCollection })));
      const additionalOffres = [offre];
      const expectedCollection: IOffre[] = [...additionalOffres, ...offreCollection];
      jest.spyOn(offreService, 'addOffreToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ structure });
      comp.ngOnInit();

      expect(offreService.query).toHaveBeenCalled();
      expect(offreService.addOffreToCollectionIfMissing).toHaveBeenCalledWith(
        offreCollection,
        ...additionalOffres.map(expect.objectContaining)
      );
      expect(comp.offresSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const structure: IStructure = { id: 456 };
      const demande: IDemande = { id: 97223 };
      structure.demande = demande;
      const offre: IOffre = { id: 14037 };
      structure.offre = offre;

      activatedRoute.data = of({ structure });
      comp.ngOnInit();

      expect(comp.demandesSharedCollection).toContain(demande);
      expect(comp.offresSharedCollection).toContain(offre);
      expect(comp.structure).toEqual(structure);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStructure>>();
      const structure = { id: 123 };
      jest.spyOn(structureFormService, 'getStructure').mockReturnValue(structure);
      jest.spyOn(structureService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ structure });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: structure }));
      saveSubject.complete();

      // THEN
      expect(structureFormService.getStructure).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(structureService.update).toHaveBeenCalledWith(expect.objectContaining(structure));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStructure>>();
      const structure = { id: 123 };
      jest.spyOn(structureFormService, 'getStructure').mockReturnValue({ id: null });
      jest.spyOn(structureService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ structure: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: structure }));
      saveSubject.complete();

      // THEN
      expect(structureFormService.getStructure).toHaveBeenCalled();
      expect(structureService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStructure>>();
      const structure = { id: 123 };
      jest.spyOn(structureService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ structure });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(structureService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareDemande', () => {
      it('Should forward to demandeService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(demandeService, 'compareDemande');
        comp.compareDemande(entity, entity2);
        expect(demandeService.compareDemande).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareOffre', () => {
      it('Should forward to offreService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(offreService, 'compareOffre');
        comp.compareOffre(entity, entity2);
        expect(offreService.compareOffre).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
