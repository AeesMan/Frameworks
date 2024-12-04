import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from '../search/search.component';
import { MediaFilterComponent } from '../media-filter/media-filter.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { TrackService, Track } from '../services/track.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, SearchComponent, MediaFilterComponent, RouterModule, HttpClientModule],
})
export class HomeComponent implements OnInit, AfterViewInit {
  isMenuOpen: boolean = false;
  tracks: Track[] = [];
  currentTrack: Track | null = null;
  @ViewChild('audioElement') audioElement?: ElementRef<HTMLAudioElement>; // Може бути undefined
  currentTrackIndex: number = 0;
  isPlaying: boolean = false;
  repeatMode: 'none' | 'single' | 'all' = 'none';
  currentTime: string = '0:00';  // Поточний час
  duration: string = '0:00';     // Загальна тривалість треку
  Video: Track[] = [];


  constructor(private trackService: TrackService) {}

  ngOnInit(): void {
    this.loadTracks();
  }

  ngAfterViewInit(): void {
    if (!this.audioElement) {
      console.error('Audio element not found!');
      return;
    }

    const audio = this.audioElement.nativeElement;

    audio.addEventListener('ended', () => {
      if (this.repeatMode === 'single') {
        audio.currentTime = 0;
        audio.play();
      } else {
        this.playNextTrack();
      }
    });

    // Оновлюємо час кожну секунду
    audio.ontimeupdate = () => {
      this.updateTime(audio);
    };
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  loadTracks(): void { 
    this.trackService.getTracks().subscribe(
      (data) => {
        // Спочатку ініціалізуємо обидва масиви
        this.Video = [...data]; 
        this.tracks = [...data]; 
  
        // Потім фільтруємо
        this.Video = this.Video.filter(track => track.mimeType.startsWith('video'));
        this.tracks = this.tracks.filter(track => track.mimeType.startsWith('audio'));
  
        // Встановлюємо перший трек, якщо є аудіотреки
        if (this.tracks.length > 0) {
          this.setCurrentTrack(this.tracks[0], false);
        }
      },
      (error) => {
        console.error('Error loading tracks:', error);
      }
    );
  }

  togglePlay(track: Track): void {
    if (!this.audioElement) {
      console.error('Audio element not found!');
      return;
    }

    const audio = this.audioElement.nativeElement;

    // Якщо поточний трек вже відтворюється, просто ставимо його на паузу або відновлюємо відтворення
    if (this.currentTrack && this.currentTrack === track) {
      if (!audio.paused) {
        audio.pause();
        this.isPlaying = false;
      } else {
        audio.play();
        this.isPlaying = true;
      }
    } else {
      // Якщо інший трек, припиняємо відтворення старого і ставимо новий
      if (this.currentTrack) {
        audio.pause();
      }
      
      this.setCurrentTrack(track, true);  // Встановлюємо новий трек
    }
  }

  togglePlayPause(): void {
    if (!this.audioElement) {
      console.error('Audio element not found!');
      return;
    }

    const audio = this.audioElement.nativeElement;

    if (audio.paused) {
      audio.play();
      this.isPlaying = true;
    } else {
      audio.pause();
      this.isPlaying = false;
    }
  }

  playNextTrack(): void {
    if (!this.currentTrack || this.tracks.length === 0) return;

    const currentIndex = this.tracks.findIndex((track) => track === this.currentTrack);
    const nextIndex = (currentIndex + 1) % this.tracks.length;
    this.setCurrentTrack(this.tracks[nextIndex]);
  }

  playPreviousTrack(): void {
    if (!this.currentTrack || this.tracks.length === 0) return;

    const currentIndex = this.tracks.findIndex((track) => track === this.currentTrack);
    const prevIndex = (currentIndex - 1 + this.tracks.length) % this.tracks.length;
    this.setCurrentTrack(this.tracks[prevIndex]);
  }

  toggleRepeatMode() {
    if (this.repeatMode === 'none') {
      this.repeatMode = 'single';
    } else if (this.repeatMode === 'single') {
      this.repeatMode = 'all';
    } else {
      this.repeatMode = 'none';
    }
  }

  setVolume(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      const value = inputElement.value;
      const audio = this.audioElement?.nativeElement;
      if (audio) {
        audio.volume = parseFloat(value);
      }
    }
  }
  

  private setCurrentTrack(track: Track, autoPlay: boolean = true): void {
    if (!this.audioElement) {
      console.error('Audio element not found!');
      return;
    }

    const audio = this.audioElement.nativeElement;
    this.currentTrack = track;
    const fixedFilePath = track.filePath.replace(/\\/g, '/');
    audio.src = `http://localhost:5000/${fixedFilePath}`;
    audio.load();

    if (autoPlay) {
      audio.play();
      this.isPlaying = true;
    } else {
      this.isPlaying = false;
    }
    this.currentTime = '0:00'; // Скидаємо час на початок
    audio.addEventListener('loadedmetadata', () => {
      this.duration = this.formatTime(audio.duration);
    });
    
    this.currentTrackIndex = this.tracks.indexOf(track);
  }


  // Оновлення часу
  updateTime(audio: HTMLAudioElement): void {
    this.currentTime = this.formatTime(audio.currentTime);
  }

  // Форматування часу у вигляді хвилини:секунди
  formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  }



}
