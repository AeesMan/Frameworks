import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface Track {
  id: string; // Use `id` instead of `_id` for consistency
  name: string;
  author: string;
  filePath: string;
}

@Injectable({
  providedIn: 'root',
})
export class TrackService {
  private apiUrl = 'http://localhost:5000/uploads';

  constructor(private http: HttpClient) {}

  // Отримання треків
  getTracks(): Observable<Track[]> {
    return this.http.get<Track[]>(this.apiUrl).pipe(
      tap(tracks => {
        // Логування для перевірки наявності _id у кожного треку
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

  // Загальний обробник помилок
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => new Error(error.message || 'Server error'));
  }
}