jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { OffrePosteService } from '../service/offre-poste.service';

import { OffrePosteDeleteDialogComponent } from './offre-poste-delete-dialog.component';

describe('OffrePoste Management Delete Component', () => {
  let comp: OffrePosteDeleteDialogComponent;
  let fixture: ComponentFixture<OffrePosteDeleteDialogComponent>;
  let service: OffrePosteService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [OffrePosteDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(OffrePosteDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(OffrePosteDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(OffrePosteService);
    mockActiveModal = TestBed.inject(NgbActiveModal);
  });

  describe('confirmDelete', () => {
    it('Should call delete service on confirmDelete', inject(
      [],
      fakeAsync(() => {
        // GIVEN
        jest.spyOn(service, 'delete').mockReturnValue(of(new HttpResponse({ body: {} })));

        // WHEN
        comp.confirmDelete(123);
        tick();

        // THEN
        expect(service.delete).toHaveBeenCalledWith(123);
        expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
      })
    ));

    it('Should not call delete service on clear', () => {
      // GIVEN
      jest.spyOn(service, 'delete');

      // WHEN
      comp.cancel();

      // THEN
      expect(service.delete).not.toHaveBeenCalled();
      expect(mockActiveModal.close).not.toHaveBeenCalled();
      expect(mockActiveModal.dismiss).toHaveBeenCalled();
    });
  });
});
