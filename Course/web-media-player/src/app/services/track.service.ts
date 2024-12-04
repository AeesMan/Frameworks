// services/track.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Track {
  name: string;
  author: string;
  filePath: string;
  mimeType: string;
}

@Injectable({
  providedIn: 'root',
})
export class TrackService {
  private apiUrl = 'http://localhost:5000/tracks';

  constructor(private http: HttpClient) {}

  getTracks(): Observable<Track[]> {
    return this.http.get<Track[]>(this.apiUrl);
  }
  
}
