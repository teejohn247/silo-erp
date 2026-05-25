// Angular modules
import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@guards/auth.guard';

// Components
import { NotFoundComponent } from './static/not-found/not-found.component';

const routes : Routes = [
  {
    path: 'login',
    loadComponent: () => import('./modules/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'verify',
    loadComponent: () => import('./modules/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'signup',
    loadComponent: () => import('./modules/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'set-password',
    loadComponent: () => import('./modules/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./modules/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'onboarding',
    loadComponent: () => import('./modules/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'apply/:formId',
    loadComponent: () => import('./modules/public/job-application/job-application.component').then(m => m.JobApplicationComponent),
  },
  {
    path: 'app',
    loadChildren: () => import('./modules/features/features.module').then(m => m.FeaturesModule),
    canActivate: [ AuthGuard ]
  },
  { path : '',   redirectTo : '/login', pathMatch : 'full' },
  { path : '**', component : NotFoundComponent }
];

@NgModule({
  imports : [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports : [RouterModule]
})
export class AppRoutingModule { }
