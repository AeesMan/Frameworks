import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MediaUploadComponent } from './media-upload/media-upload.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'upload', component: MediaUploadComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}