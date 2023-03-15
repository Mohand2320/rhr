import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPrevisionPoste } from '../prevision-poste.model';
import { PrevisionPosteService } from '../service/prevision-poste.service';

@Injectable({ providedIn: 'root' })
export class PrevisionPosteRoutingResolveService implements Resolve<IPrevisionPoste | null> {
  constructor(protected service: PrevisionPosteService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPrevisionPoste | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((previsionPoste: HttpResponse<IPrevisionPoste>) => {
          if (previsionPoste.body) {
            return of(previsionPoste.body);
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
