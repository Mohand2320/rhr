import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICandidat } from '../candidat.model';
import { CandidatService } from '../service/candidat.service';

@Injectable({ providedIn: 'root' })
export class CandidatRoutingResolveService implements Resolve<ICandidat | null> {
  constructor(protected service: CandidatService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICandidat | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((candidat: HttpResponse<ICandidat>) => {
          if (candidat.body) {
            return of(candidat.body);
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
