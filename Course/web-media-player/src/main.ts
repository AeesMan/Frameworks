import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { MediaUploadComponent } from './app/media-upload/media-upload.component';
import { provideHttpClient } from "@angular/common/http";


bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ],
}).catch((err) => console.error(err));

bootstrapApplication(MediaUploadComponent).catch(err => console.error(err));
