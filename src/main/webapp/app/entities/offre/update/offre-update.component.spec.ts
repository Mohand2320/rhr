import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { OffreFormService } from './offre-form.service';
import { OffreService } from '../service/offre.service';
import { IOffre } from '../offre.model';
import { IDemande } from 'app/entities/demande/demande.model';
import { DemandeService } from 'app/entities/demande/service/demande.service';
import { IHistoriqueOffre } from 'app/entities/historique-offre/historique-offre.model';
import { HistoriqueOffreService } from 'app/entities/historique-offre/service/historique-offre.service';
import { IAgence } from 'app/entities/agence/agence.model';
import { AgenceService } from 'app/entities/agence/service/agence.service';

import { OffreUpdateComponent } from './offre-update.component';

describe('Offre Management Update Component', () => {
  let comp: OffreUpdateComponent;
  let fixture: ComponentFixture<OffreUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let offreFormService: OffreFormService;
  let offreService: OffreService;
  let demandeService: DemandeService;
  let historiqueOffreService: HistoriqueOffreService;
  let agenceService: AgenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [OffreUpdateComponent],
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
      .overrideTemplate(OffreUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OffreUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    offreFormService = TestBed.inject(OffreFormService);
    offreService = TestBed.inject(OffreService);
    demandeService = TestBed.inject(DemandeService);
    historiqueOffreService = TestBed.inject(HistoriqueOffreService);
    agenceService = TestBed.inject(AgenceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Demande query and add missing value', () => {
      const offre: IOffre = { id: 456 };
      const demande: IDemande = { id: 95993 };
      offre.demande = demande;

      const demandeCollection: IDemande[] = [{ id: 15910 }];
      jest.spyOn(demandeService, 'query').mockReturnValue(of(new HttpResponse({ body: demandeCollection })));
      const additionalDemandes = [demande];
      const expectedCollection: IDemande[] = [...additionalDemandes, ...demandeCollection];
      jest.spyOn(demandeService, 'addDemandeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ offre });
      comp.ngOnInit();

      expect(demandeService.query).toHaveBeenCalled();
      expect(demandeService.addDemandeToCollectionIfMissing).toHaveBeenCalledWith(
        demandeCollection,
        ...additionalDemandes.map(expect.objectContaining)
      );
      expect(comp.demandesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call HistoriqueOffre query and add missing value', () => {
      const offre: IOffre = { id: 456 };
      const historiqueOffre: IHistoriqueOffre = { id: 27658 };
      offre.historiqueOffre = historiqueOffre;

      const historiqueOffreCollection: IHistoriqueOffre[] = [{ id: 37683 }];
      jest.spyOn(historiqueOffreService, 'query').mockReturnValue(of(new HttpResponse({ body: historiqueOffreCollection })));
      const additionalHistoriqueOffres = [historiqueOffre];
      const expectedCollection: IHistoriqueOffre[] = [...additionalHistoriqueOffres, ...historiqueOffreCollection];
      jest.spyOn(historiqueOffreService, 'addHistoriqueOffreToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ offre });
      comp.ngOnInit();

      expect(historiqueOffreService.query).toHaveBeenCalled();
      expect(historiqueOffreService.addHistoriqueOffreToCollectionIfMissing).toHaveBeenCalledWith(
        historiqueOffreCollection,
        ...additionalHistoriqueOffres.map(expect.objectContaining)
      );
      expect(comp.historiqueOffresSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Agence query and add missing value', () => {
      const offre: IOffre = { id: 456 };
      const agence: IAgence = { id: 24227 };
      offre.agence = agence;

      const agenceCollection: IAgence[] = [{ id: 22217 }];
      jest.spyOn(agenceService, 'query').mockReturnValue(of(new HttpResponse({ body: agenceCollection })));
      const additionalAgences = [agence];
      const expectedCollection: IAgence[] = [...additionalAgences, ...agenceCollection];
      jest.spyOn(agenceService, 'addAgenceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ offre });
      comp.ngOnInit();

      expect(agenceService.query).toHaveBeenCalled();
      expect(agenceService.addAgenceToCollectionIfMissing).toHaveBeenCalledWith(
        agenceCollection,
        ...additionalAgences.map(expect.objectContaining)
      );
      expect(comp.agencesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const offre: IOffre = { id: 456 };
      const demande: IDemande = { id: 91073 };
      offre.demande = demande;
      const historiqueOffre: IHistoriqueOffre = { id: 60918 };
      offre.historiqueOffre = historiqueOffre;
      const agence: IAgence = { id: 54542 };
      offre.agence = agence;

      activatedRoute.data = of({ offre });
      comp.ngOnInit();

      expect(comp.demandesSharedCollection).toContain(demande);
      expect(comp.historiqueOffresSharedCollection).toContain(historiqueOffre);
      expect(comp.agencesSharedCollection).toContain(agence);
      expect(comp.offre).toEqual(offre);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOffre>>();
      const offre = { id: 123 };
      jest.spyOn(offreFormService, 'getOffre').mockReturnValue(offre);
      jest.spyOn(offreService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ offre });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: offre }));
      saveSubject.complete();

      // THEN
      expect(offreFormService.getOffre).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(offreService.update).toHaveBeenCalledWith(expect.objectContaining(offre));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOffre>>();
      const offre = { id: 123 };
      jest.spyOn(offreFormService, 'getOffre').mockReturnValue({ id: null });
      jest.spyOn(offreService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ offre: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: offre }));
      saveSubject.complete();

      // THEN
      expect(offreFormService.getOffre).toHaveBeenCalled();
      expect(offreService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOffre>>();
      const offre = { id: 123 };
      jest.spyOn(offreService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ offre });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(offreService.update).toHaveBeenCalled();
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

    describe('compareHistoriqueOffre', () => {
      it('Should forward to historiqueOffreService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(historiqueOffreService, 'compareHistoriqueOffre');
        comp.compareHistoriqueOffre(entity, entity2);
        expect(historiqueOffreService.compareHistoriqueOffre).toHaveBeenCalledWith(entity, entity2);
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
