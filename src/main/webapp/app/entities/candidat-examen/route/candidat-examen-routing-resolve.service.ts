import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICandidatExamen } from '../candidat-examen.model';
import { CandidatExamenService } from '../service/candidat-examen.service';

@Injectable({ providedIn: 'root' })
export class CandidatExamenRoutingResolveService implements Resolve<ICandidatExamen | null> {
  constructor(protected service: CandidatExamenService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICandidatExamen | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((candidatExamen: HttpResponse<ICandidatExamen>) => {
          if (candidatExamen.body) {
            return of(candidatExamen.body);
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
