import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-media-upload',
  standalone: true,
  templateUrl: './media-upload.component.html',
  styleUrls: ['./media-upload.component.css'],
  imports: [FormsModule, RouterModule],
})


export class MediaUploadComponent {
  name = '';
  author = '';
  file: File | null = null;

  constructor(private http: HttpClient) {}

  onFileChange(event: any) {
    this.file = event.target.files[0];
  }

  isMenuOpen: boolean = false;
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  uploadFile() {
    if (this.file) {
      const formData = new FormData();
      formData.append('file', this.file);
      formData.append('name', this.name);
      formData.append('author', this.author);

      this.http.post('http://localhost:5000/upload', formData).subscribe({
        next: (response) => {
          console.log('Upload successful', response);
          alert('File uploaded successfully!');
        },
        error: (err) => {
          console.error('Upload error', err);
          alert('File upload failed.');
        }
      });
    } else {
      alert('Please select a file to upload.');
    }
  }
}