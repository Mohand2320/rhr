import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOrientationCandidat } from '../orientation-candidat.model';
import { OrientationCandidatService } from '../service/orientation-candidat.service';

@Injectable({ providedIn: 'root' })
export class OrientationCandidatRoutingResolveService implements Resolve<IOrientationCandidat | null> {
  constructor(protected service: OrientationCandidatService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOrientationCandidat | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((orientationCandidat: HttpResponse<IOrientationCandidat>) => {
          if (orientationCandidat.body) {
            return of(orientationCandidat.body);
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
