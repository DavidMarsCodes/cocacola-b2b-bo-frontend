import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginGuard } from './core/guards/login.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/login/login-routing.module').then((m) => m.LoginRoutingModule),
    canActivate: [LoginGuard],
  },
  {
    path: 'main',
    loadChildren: () => import('./pages/main/main.module').then((m) => m.MainModule),
    canActivate: [AuthGuard],
  },


  {
    path: '**',
    loadChildren: () => import('./pages/page-not-found/page-not-found.module').then((m) => m.PageNotFoundModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
