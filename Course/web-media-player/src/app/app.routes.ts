import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MediaUploadComponent } from './media-upload/media-upload.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { DummyComponent, redirectGuard } from './services/redirect.guard';
import { NgModule } from '@angular/core';
import { authGuard } from './services/auth.guard';


export const routes: Routes = [
  { path: 'upload', component: MediaUploadComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent),
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
  path: '**',
  canActivate: [redirectGuard],
  component: DummyComponent, // будь-який тимчасовий компонент або створений порожній компонент
}

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
