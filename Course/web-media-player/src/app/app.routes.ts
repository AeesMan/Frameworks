import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MediaDetailsComponent } from './media-details/media-details.component';
import { MediaUploadComponent } from './media-upload/media-upload.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'media/:id', component: MediaDetailsComponent },
  { path: 'upload', component: MediaUploadComponent },
];
