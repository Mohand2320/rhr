import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOffre } from '../offre.model';
import { OffreService } from '../service/offre.service';

@Injectable({ providedIn: 'root' })
export class OffreRoutingResolveService implements Resolve<IOffre | null> {
  constructor(protected service: OffreService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOffre | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((offre: HttpResponse<IOffre>) => {
          if (offre.body) {
            return of(offre.body);
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
