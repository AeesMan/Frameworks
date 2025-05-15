import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MediaUploadComponent } from './media-upload/media-upload.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // редирект на login
  { path: 'home', component: HomeComponent },
  { path: 'upload', component: MediaUploadComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
