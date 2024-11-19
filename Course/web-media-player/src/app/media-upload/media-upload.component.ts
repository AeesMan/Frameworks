import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-media-upload',
  standalone: true,
  template: `
    <form>
      <input type="text" placeholder="Title" [(ngModel)]="mediaTitle" name="title" />
      <textarea placeholder="Description" [(ngModel)]="mediaDescription" name="description"></textarea>
      <input type="file" (change)="onFileSelected($event)" />
      <button (click)="onUpload()">Upload</button>
    </form>
  `,
  imports: [FormsModule], // Додати FormsModule
})
export class MediaUploadComponent {
  mediaTitle = '';
  mediaDescription = '';
  selectedFile: File | null = null;

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUpload() {
    console.log('Uploading:', this.mediaTitle, this.mediaDescription, this.selectedFile);
  }
}
