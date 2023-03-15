import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IHistoriqueOffre } from '../historique-offre.model';
import { HistoriqueOffreService } from '../service/historique-offre.service';

@Injectable({ providedIn: 'root' })
export class HistoriqueOffreRoutingResolveService implements Resolve<IHistoriqueOffre | null> {
  constructor(protected service: HistoriqueOffreService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IHistoriqueOffre | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((historiqueOffre: HttpResponse<IHistoriqueOffre>) => {
          if (historiqueOffre.body) {
            return of(historiqueOffre.body);
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
