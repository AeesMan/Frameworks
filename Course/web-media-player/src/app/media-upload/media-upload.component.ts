import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-media-upload',
  standalone: true,
  templateUrl: './media-upload.component.html',
  styleUrls: ['./media-upload.component.css'],
  imports: [FormsModule, RouterModule, CommonModule],
})
export class MediaUploadComponent {
  uploadType: 'audio' | 'video' = 'audio';
  name: string = '';
  author: string = '';
  file: File | null = null;
  isMenuOpen: boolean = false;
  isUploading: boolean = false;

  constructor(private http: HttpClient) {}

  toggleUploadType() {
    this.uploadType = this.uploadType === 'audio' ? 'video' : 'audio';
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    const allowedTypes =
      this.uploadType === 'audio'
        ? ['audio/mpeg', 'audio/wav']
        : ['video/mp4', 'video/webm'];

    if (file && allowedTypes.includes(file.type)) {
      if (file.size > 100 * 1024 * 1024) {
        alert('File is too large. Maximum size is 100MB.');
        this.file = null;
        return;
      }
      this.file = file;
    } else {
      alert(
        `Please select a valid ${
          this.uploadType === 'audio' ? 'audio' : 'video'
        } file.`
      );
      this.file = null;
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  uploadFile(event: Event) {
  event.preventDefault();

  if (!this.file || !this.name) {
    alert('Please fill in all fields and select a file.');
    return;
  }

  const userId = localStorage.getItem('userId');

if (!userId) {
  alert('You must be logged in to upload files.');
  return;
}


  const formData = new FormData();
  formData.append('file', this.file);
  formData.append('name', this.name);
  formData.append('author', userId);
  formData.append('userId', userId);


  const apiUrl =
    this.uploadType === 'audio'
      ? 'http://localhost:5000/uploads'
      : 'http://localhost:5000/uploads/video';



  this.isUploading = true;

  this.http.post(apiUrl, formData).subscribe({
    next: (response) => {
      console.log('Upload successful', response);
      alert('File uploaded successfully!');
      this.resetForm();
      this.isUploading = false;
    },
    error: (err) => {
      console.error('Upload error', err);
      alert('File upload failed.');
      this.isUploading = false;
    },
  });
}


  resetForm() {
    this.name = '';
    this.author = '';
    this.file = null;
  }
}
