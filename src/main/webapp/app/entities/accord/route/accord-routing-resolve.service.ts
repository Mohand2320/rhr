import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAccord } from '../accord.model';
import { AccordService } from '../service/accord.service';

@Injectable({ providedIn: 'root' })
export class AccordRoutingResolveService implements Resolve<IAccord | null> {
  constructor(protected service: AccordService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAccord | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((accord: HttpResponse<IAccord>) => {
          if (accord.body) {
            return of(accord.body);
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
