import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'personne',
        data: { pageTitle: 'rhRecrutementApp.personne.home.title' },
        loadChildren: () => import('./personne/personne.module').then(m => m.PersonneModule),
      },
      {
        path: 'candidat',
        data: { pageTitle: 'rhRecrutementApp.candidat.home.title' },
        loadChildren: () => import('./candidat/candidat.module').then(m => m.CandidatModule),
      },
      {
        path: 'examen',
        data: { pageTitle: 'rhRecrutementApp.examen.home.title' },
        loadChildren: () => import('./examen/examen.module').then(m => m.ExamenModule),
      },
      {
        path: 'offre-poste',
        data: { pageTitle: 'rhRecrutementApp.offrePoste.home.title' },
        loadChildren: () => import('./offre-poste/offre-poste.module').then(m => m.OffrePosteModule),
      },
      {
        path: 'offre',
        data: { pageTitle: 'rhRecrutementApp.offre.home.title' },
        loadChildren: () => import('./offre/offre.module').then(m => m.OffreModule),
      },
      {
        path: 'poste',
        data: { pageTitle: 'rhRecrutementApp.poste.home.title' },
        loadChildren: () => import('./poste/poste.module').then(m => m.PosteModule),
      },
      {
        path: 'prevision',
        data: { pageTitle: 'rhRecrutementApp.prevision.home.title' },
        loadChildren: () => import('./prevision/prevision.module').then(m => m.PrevisionModule),
      },
      {
        path: 'demande',
        data: { pageTitle: 'rhRecrutementApp.demande.home.title' },
        loadChildren: () => import('./demande/demande.module').then(m => m.DemandeModule),
      },
      {
        path: 'accord',
        data: { pageTitle: 'rhRecrutementApp.accord.home.title' },
        loadChildren: () => import('./accord/accord.module').then(m => m.AccordModule),
      },
      {
        path: 'historique-offre',
        data: { pageTitle: 'rhRecrutementApp.historiqueOffre.home.title' },
        loadChildren: () => import('./historique-offre/historique-offre.module').then(m => m.HistoriqueOffreModule),
      },
      {
        path: 'agence',
        data: { pageTitle: 'rhRecrutementApp.agence.home.title' },
        loadChildren: () => import('./agence/agence.module').then(m => m.AgenceModule),
      },
      {
        path: 'ville',
        data: { pageTitle: 'rhRecrutementApp.ville.home.title' },
        loadChildren: () => import('./ville/ville.module').then(m => m.VilleModule),
      },
      {
        path: 'orientation',
        data: { pageTitle: 'rhRecrutementApp.orientation.home.title' },
        loadChildren: () => import('./orientation/orientation.module').then(m => m.OrientationModule),
      },
      {
        path: 'structure',
        data: { pageTitle: 'rhRecrutementApp.structure.home.title' },
        loadChildren: () => import('./structure/structure.module').then(m => m.StructureModule),
      },
      {
        path: 'candidat-examen',
        data: { pageTitle: 'rhRecrutementApp.candidatExamen.home.title' },
        loadChildren: () => import('./candidat-examen/candidat-examen.module').then(m => m.CandidatExamenModule),
      },
      {
        path: 'orientation-candidat',
        data: { pageTitle: 'rhRecrutementApp.orientationCandidat.home.title' },
        loadChildren: () => import('./orientation-candidat/orientation-candidat.module').then(m => m.OrientationCandidatModule),
      },
      {
        path: 'prevision-poste',
        data: { pageTitle: 'rhRecrutementApp.previsionPoste.home.title' },
        loadChildren: () => import('./prevision-poste/prevision-poste.module').then(m => m.PrevisionPosteModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
