import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IHistoriqueOffre } from '../historique-offre.model';
import { HistoriqueOffreService } from '../service/historique-offre.service';

import { HistoriqueOffreRoutingResolveService } from './historique-offre-routing-resolve.service';

describe('HistoriqueOffre routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: HistoriqueOffreRoutingResolveService;
  let service: HistoriqueOffreService;
  let resultHistoriqueOffre: IHistoriqueOffre | null | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(HistoriqueOffreRoutingResolveService);
    service = TestBed.inject(HistoriqueOffreService);
    resultHistoriqueOffre = undefined;
  });

  describe('resolve', () => {
    it('should return IHistoriqueOffre returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultHistoriqueOffre = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultHistoriqueOffre).toEqual({ id: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultHistoriqueOffre = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultHistoriqueOffre).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IHistoriqueOffre>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultHistoriqueOffre = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultHistoriqueOffre).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
