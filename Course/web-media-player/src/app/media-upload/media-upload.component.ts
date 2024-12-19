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
  uploadType: 'audio' | 'video' = 'audio'; // Початковий тип - аудіо
  name: string = '';
  author: string = '';
  file: File | null = null;
  isMenuOpen: boolean = false;

  constructor(private http: HttpClient) {}

  // Перемикання між аудіо та відео
  toggleUploadType() {
    this.uploadType = this.uploadType === 'audio' ? 'video' : 'audio';
  }

  // Обробка вибору файлу
  onFileChange(event: any) {
    const file = event.target.files[0];
    const allowedTypes =
      this.uploadType === 'audio'
        ? ['audio/mpeg', 'audio/wav']
        : ['video/mp4', 'video/webm'];

    if (file && allowedTypes.includes(file.type)) {
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

  // Відкриття/закриття меню
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Завантаження файлу
  uploadFile() {
    if (!this.file || !this.name || !this.author) {
      alert('Please fill in all fields and select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('name', this.name);
    formData.append('author', this.author);

    const apiUrl =
      this.uploadType === 'audio'
        ? 'http://localhost:5000/uploads'
        : 'http://localhost:5000/uploads/video';

    this.http.post(apiUrl, formData).subscribe({
      next: (response) => {
        console.log('Upload successful', response);
        alert('File uploaded successfully!');
        this.resetForm();
      },
      error: (err) => {
        console.error('Upload error', err);
        alert('File upload failed.');
      },
    });
  }

  // Скидання форми
  resetForm() {
    this.name = '';
    this.author = '';
    this.file = null;
  }
}