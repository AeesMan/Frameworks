import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

// Інтерфейс для треку
export interface Track {
  _id: string;
  name: string;
  author: string;
  filePath: string;
}

// Інтерфейс для відео
export interface Video {
  _id: string;
  name: string;
  author: string;
  filePath: string;
}

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  // === TRACKS ===

  getTracks(userId: string): Observable<Track[]> {
    return this.http.get<Track[]>(`${this.apiUrl}/tracks/${userId}`);
  }

  uploadTrack(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/uploads`, formData);
  }

  deleteTrack(id: string, userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/uploads/${id}?userId=${userId}`);
  }

  // === VIDEOS ===

  getVideos(userId: string): Observable<Video[]> {
    return this.http.get<Video[]>(`${this.apiUrl}/videos/${userId}`);
  }

  uploadVideo(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/uploads/video`, formData);
  }

  deleteVideo(id: string, userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/uploads/video/${id}?userId=${userId}`);
  }

  // Загальний обробник помилок
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => new Error(error.message || 'Server error'));
  }
}