import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

// Інтерфейс для треку
export interface Track {
  id: string; // Use `id` instead of `_id` for consistency
  name: string;
  author: string;
  filePath: string;
}

// Інтерфейс для відео
export interface Video {
  id: string;
  name: string;
  author: string;
  filePath: string;
}

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  private apiUrl = 'http://localhost:5000/uploads'; // Базовий URL для треків
  private videoApiUrl = 'http://localhost:5000/uploads/video'; // Базовий URL для відео

  constructor(private http: HttpClient) {}

  // Отримання списку треків
  getTracks(): Observable<Track[]> {
    return this.http.get<Track[]>(this.apiUrl).pipe(
      tap(tracks => {
        console.log('Fetched tracks:', tracks);
      }),
      catchError(this.handleError)
    );
  }

  // Видалення треку
  deleteTrack(trackId: string): Observable<any> {
    if (!trackId) {
      console.error('Track ID is undefined or null');
      return throwError(() => new Error('Track ID is undefined or null'));
    }

    return this.http.delete(`${this.apiUrl}/${trackId}`).pipe(
      tap(() => {
        console.log(`Track with ID ${trackId} deleted successfully`);
      }),
      catchError(this.handleError)
    );
  }

  // Отримання списку відео
  getVideos(): Observable<Video[]> {
    return this.http.get<Video[]>(this.videoApiUrl).pipe(
      tap(videos => {
        console.log('Fetched videos:', videos);
      }),
      catchError(this.handleError)
    );
  }

  // Видалення відео
  deleteVideo(videoId: string): Observable<any> {
    if (!videoId) {
      console.error('Video ID is undefined or null');
      return throwError(() => new Error('Video ID is undefined or null'));
    }

    return this.http.delete(`${this.videoApiUrl}/${videoId}`).pipe(
      tap(() => {
        console.log(`Video with ID ${videoId} deleted successfully`);
      }),
      catchError(this.handleError)
    );
  }

  // Загальний обробник помилок
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => new Error(error.message || 'Server error'));
  }
}