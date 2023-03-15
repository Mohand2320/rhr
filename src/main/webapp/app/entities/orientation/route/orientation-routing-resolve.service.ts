import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOrientation } from '../orientation.model';
import { OrientationService } from '../service/orientation.service';

@Injectable({ providedIn: 'root' })
export class OrientationRoutingResolveService implements Resolve<IOrientation | null> {
  constructor(protected service: OrientationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOrientation | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((orientation: HttpResponse<IOrientation>) => {
          if (orientation.body) {
            return of(orientation.body);
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
