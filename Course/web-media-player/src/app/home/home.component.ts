import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
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
  audioElement?: HTMLAudioElement; // Посилання на аудіоелемент
  currentTrackIndex: number = 0;
  isPlaying: boolean = false;
  repeatMode: 'none' | 'single' | 'all' = 'none';
  currentTime: string = '0:00';  // Поточний час
  duration: string = '0:00';     // Загальна тривалість треку
  currentTimeInSeconds: number = 0; // Поточний час в секундах
  durationInSeconds: number = 0; // Тривалість треку в секундах

  constructor(private trackService: TrackService) {}

  ngOnInit(): void {
    this.loadTracks();
  }

  ngAfterViewInit(): void {
    // Створюємо аудіоелемент програмно
    this.audioElement = new Audio();
    this.audioElement.style.display = 'none'; // Приховуємо аудіоелемент
    document.body.appendChild(this.audioElement); // Додаємо аудіоелемент до DOM

    // Додаємо обробники подій
    this.audioElement.addEventListener('ended', () => {
      if (this.repeatMode === 'single') {
        this.audioElement!.currentTime = 0;
        this.audioElement!.play();
      } else {
        this.playNextTrack();
      }
    });

    this.audioElement.ontimeupdate = () => {
      this.updateTime(this.audioElement!);
    };

    this.audioElement.onloadedmetadata = () => {
      this.durationInSeconds = this.audioElement!.duration;
      this.duration = this.formatTime(this.audioElement!.duration);
    };
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  loadTracks(): void { 
    this.trackService.getTracks().subscribe(
      (data: any) => {
        // Map the tracks and ensure `id` is correctly assigned from `_id`
        this.tracks = data.map((track: any) => ({
          id: track.id, // Assign `id` from `_id`
          name: track.name,
          author: track.author,
          filePath: track.filePath,
        }));
  
        // Log the tracks to verify `id`
        console.log('Loaded tracks:', this.tracks);
  
        // Set the first track if the list is not empty
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

    // Якщо поточний трек вже відтворюється, просто ставимо його на паузу або відновлюємо відтворення
    if (this.currentTrack && this.currentTrack === track) {
      if (!this.audioElement.paused) {
        this.audioElement.pause();
        this.isPlaying = false;
      } else {
        this.audioElement.play();
        this.isPlaying = true;
      }
    } else {
      // Якщо інший трек, припиняємо відтворення старого і ставимо новий
      if (this.currentTrack) {
        this.audioElement.pause();
      }
      
      this.setCurrentTrack(track, true);  // Встановлюємо новий трек
    }
  }

  togglePlayPause(): void {
    if (!this.audioElement) {
      console.error('Audio element not found!');
      return;
    }

    if (this.audioElement.paused) {
      this.audioElement.play();
      this.isPlaying = true;
    } else {
      this.audioElement.pause();
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
      if (this.audioElement) {
        this.audioElement.volume = parseFloat(value);
      }
    }
  }

  // Метод для переходу до певного часу відтворення
  seekTrack(event: MouseEvent): void {
    const sliderContainer = event.currentTarget as HTMLElement;
    const rect = sliderContainer.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const percentage = Math.min(1, Math.max(0, offsetX / rect.width)); // Обмеження від 0 до 1

    if (this.audioElement) {
      this.audioElement.currentTime = percentage * this.durationInSeconds;
    }
  }
  
  private setCurrentTrack(track: Track, autoPlay: boolean = true): void {
    if (!this.audioElement) {
      console.error('Audio element not found!');
      return;
    }

    this.currentTrack = track;
    const fixedFilePath = track.filePath.replace(/\\/g, '/');
    this.audioElement.src = `http://localhost:5000/${fixedFilePath}`;
    this.audioElement.load();

    if (autoPlay) {
      this.audioElement.play();
      this.isPlaying = true;
    } else {
      this.isPlaying = false;
    }
    this.currentTime = '0:00'; // Скидаємо час на початок
    this.audioElement.addEventListener('loadedmetadata', () => {
      this.duration = this.formatTime(this.audioElement!.duration);
    });
    
    this.currentTrackIndex = this.tracks.indexOf(track);
  }

  deleteTrack(track: Track): void {
    if (!track.id) {
      console.error('Track ID is undefined'); // This is where the error is logged
      return;
    }
  
    this.trackService.deleteTrack(track.id).subscribe(
      () => {
        // Update the list of tracks
        this.tracks = this.tracks.filter((t) => t.id !== track.id);
        // If the current track is deleted, stop playback
        if (this.currentTrack && this.currentTrack.id === track.id) {
          if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement.src = '';
          }
          this.currentTrack = null;
          this.isPlaying = false;
        }
      },
      (error) => {
        console.error('Error deleting track:', error);
      }
    );
  }
  
  // Оновлення часу
  updateTime(audio: HTMLAudioElement): void {
    this.currentTime = this.formatTime(audio.currentTime);
    this.currentTimeInSeconds = audio.currentTime; // Оновлюємо поточний час в секундах
  }

  // Форматування часу у вигляді хвилини:секунди
  formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  }
}