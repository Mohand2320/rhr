import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOffrePoste } from '../offre-poste.model';
import { OffrePosteService } from '../service/offre-poste.service';

@Injectable({ providedIn: 'root' })
export class OffrePosteRoutingResolveService implements Resolve<IOffrePoste | null> {
  constructor(protected service: OffrePosteService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOffrePoste | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((offrePoste: HttpResponse<IOffrePoste>) => {
          if (offrePoste.body) {
            return of(offrePoste.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
