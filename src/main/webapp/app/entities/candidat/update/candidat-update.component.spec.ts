import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CandidatFormService } from './candidat-form.service';
import { CandidatService } from '../service/candidat.service';
import { ICandidat } from '../candidat.model';

import { CandidatUpdateComponent } from './candidat-update.component';

describe('Candidat Management Update Component', () => {
  let comp: CandidatUpdateComponent;
  let fixture: ComponentFixture<CandidatUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let candidatFormService: CandidatFormService;
  let candidatService: CandidatService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CandidatUpdateComponent],
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
      .overrideTemplate(CandidatUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CandidatUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    candidatFormService = TestBed.inject(CandidatFormService);
    candidatService = TestBed.inject(CandidatService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const candidat: ICandidat = { id: 456 };

      activatedRoute.data = of({ candidat });
      comp.ngOnInit();

      expect(comp.candidat).toEqual(candidat);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICandidat>>();
      const candidat = { id: 123 };
      jest.spyOn(candidatFormService, 'getCandidat').mockReturnValue(candidat);
      jest.spyOn(candidatService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ candidat });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: candidat }));
      saveSubject.complete();

      // THEN
      expect(candidatFormService.getCandidat).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(candidatService.update).toHaveBeenCalledWith(expect.objectContaining(candidat));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICandidat>>();
      const candidat = { id: 123 };
      jest.spyOn(candidatFormService, 'getCandidat').mockReturnValue({ id: null });
      jest.spyOn(candidatService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ candidat: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: candidat }));
      saveSubject.complete();

      // THEN
      expect(candidatFormService.getCandidat).toHaveBeenCalled();
      expect(candidatService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICandidat>>();
      const candidat = { id: 123 };
      jest.spyOn(candidatService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ candidat });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(candidatService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
