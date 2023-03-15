import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPersonne } from '../personne.model';
import { PersonneService } from '../service/personne.service';

@Injectable({ providedIn: 'root' })
export class PersonneRoutingResolveService implements Resolve<IPersonne | null> {
  constructor(protected service: PersonneService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPersonne | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((personne: HttpResponse<IPersonne>) => {
          if (personne.body) {
            return of(personne.body);
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
