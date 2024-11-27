import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { SearchComponent } from '../search/search.component';
import { MediaFilterComponent } from '../media-filter/media-filter.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; // Імпорт HttpClientModule
import { TrackService, Track } from '../services/track.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, SearchComponent, MediaFilterComponent, RouterModule, HttpClientModule], // Додайте HttpClientModule
})
export class HomeComponent implements OnInit {
  isMenuOpen: boolean = false;
  tracks: Track[] = [];
  currentTrack: Track | null = null; // Поточний трек
  @ViewChild('audioElement') audioElement!: ElementRef<HTMLAudioElement>;

  constructor(private trackService: TrackService) {}

  ngOnInit(): void {
    this.loadTracks();
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  loadTracks(): void {
    this.trackService.getTracks().subscribe(
      (data) => {
        this.tracks = data;
      },
      (error) => {
        console.error('Error loading tracks:', error);
      }
    );
  }

  onSearch(query: string) {
    console.log('Search:', query);
  }

  onFilter(filter: string) {
    console.log('Filter:', filter);
  }



  togglePlay(track: Track): void {
    if (!this.audioElement) {
      console.error('Audio element not found!');
      return;
    }
  
    const audio = this.audioElement.nativeElement;
  
    if (this.currentTrack && this.currentTrack === track) {
      if (!audio.paused) {
        audio.pause(); // Pause
      } else {
        audio.play(); // Play
      }
    } else {
      if (this.currentTrack) {
        audio.pause(); // Stop the previous track
      }
  
      this.currentTrack = track;
        const fixedFilePath = track.filePath.replace(/\\/g, '/');
        // const encodedFilePath = encodeURIComponent(fixedFilePath);
        console.log("File path: http://localhost:5000/", fixedFilePath); 
        audio.src = `http://localhost:5000/${fixedFilePath}`;
        audio.load();
        audio.play();

    }
  }
  
  
  


  isPlaying(track: Track): boolean {
    const audio = this.audioElement.nativeElement;
    return this.currentTrack === track && !audio.paused;
  }
}
