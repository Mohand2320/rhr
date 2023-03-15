import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { HistoriqueOffreFormService } from './historique-offre-form.service';
import { HistoriqueOffreService } from '../service/historique-offre.service';
import { IHistoriqueOffre } from '../historique-offre.model';

import { HistoriqueOffreUpdateComponent } from './historique-offre-update.component';

describe('HistoriqueOffre Management Update Component', () => {
  let comp: HistoriqueOffreUpdateComponent;
  let fixture: ComponentFixture<HistoriqueOffreUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let historiqueOffreFormService: HistoriqueOffreFormService;
  let historiqueOffreService: HistoriqueOffreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [HistoriqueOffreUpdateComponent],
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
      .overrideTemplate(HistoriqueOffreUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(HistoriqueOffreUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    historiqueOffreFormService = TestBed.inject(HistoriqueOffreFormService);
    historiqueOffreService = TestBed.inject(HistoriqueOffreService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const historiqueOffre: IHistoriqueOffre = { id: 456 };

      activatedRoute.data = of({ historiqueOffre });
      comp.ngOnInit();

      expect(comp.historiqueOffre).toEqual(historiqueOffre);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHistoriqueOffre>>();
      const historiqueOffre = { id: 123 };
      jest.spyOn(historiqueOffreFormService, 'getHistoriqueOffre').mockReturnValue(historiqueOffre);
      jest.spyOn(historiqueOffreService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ historiqueOffre });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: historiqueOffre }));
      saveSubject.complete();

      // THEN
      expect(historiqueOffreFormService.getHistoriqueOffre).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(historiqueOffreService.update).toHaveBeenCalledWith(expect.objectContaining(historiqueOffre));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHistoriqueOffre>>();
      const historiqueOffre = { id: 123 };
      jest.spyOn(historiqueOffreFormService, 'getHistoriqueOffre').mockReturnValue({ id: null });
      jest.spyOn(historiqueOffreService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ historiqueOffre: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: historiqueOffre }));
      saveSubject.complete();

      // THEN
      expect(historiqueOffreFormService.getHistoriqueOffre).toHaveBeenCalled();
      expect(historiqueOffreService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHistoriqueOffre>>();
      const historiqueOffre = { id: 123 };
      jest.spyOn(historiqueOffreService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ historiqueOffre });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(historiqueOffreService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
