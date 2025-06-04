import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MediaService, Track, Video } from '../services/track.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, RouterModule, HttpClientModule],
})
export class HomeComponent implements OnInit, AfterViewInit {
  isMenuOpen: boolean = false;
  tracks: Track[] = [];
  videos: Video[] = [];
  filteredTracks: Track[] = [];
  currentTrack: Track | null = null;
  currentVideo: Video | null = null;
  audioElement?: HTMLAudioElement;
  isPlaying: boolean = false;
  repeatMode: 'none' | 'single' | 'all' = 'none';
  currentTime: string = '0:00';
  duration: string = '0:00';
  currentTimeInSeconds: number = 0;
  durationInSeconds: number = 0;
  showTracks: boolean = true;
  showControls: boolean = true;
  showVideoPlayer: boolean = false;

  @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef<HTMLVideoElement>;

  constructor(private trackService: MediaService) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    console.log('Loaded userId from localStorage:', userId);
    if (userId) {
      this.loadTracks(userId);
      this.loadVideos(userId);
    }
  }

  ngAfterViewInit(): void {
    this.audioElement = new Audio();
    this.audioElement.style.display = 'none';
    document.body.appendChild(this.audioElement);


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


    this.videoPlayer.nativeElement.addEventListener('ended', () => {
      if (this.repeatMode === 'single') {
        this.videoPlayer.nativeElement.currentTime = 0;
        this.videoPlayer.nativeElement.play();
      } else {
        this.playNextVideo();
      }
    });

    this.videoPlayer.nativeElement.ontimeupdate = () => {
      this.updateTime(this.videoPlayer.nativeElement);
    };

    this.videoPlayer.nativeElement.onloadedmetadata = () => {
      this.durationInSeconds = this.videoPlayer.nativeElement.duration;
      this.duration = this.formatTime(this.videoPlayer.nativeElement.duration);
    };
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  loadTracks(userId: string): void { 
  this.trackService.getTracks(userId).subscribe(
    (data: any) => {
      this.tracks = data.map((track: any) => ({
        _id: track._id,
        name: track.name,
        author: track.author,
        filePath: track.filePath,
      }));

      console.log('Loaded tracks:', this.tracks);

      if (this.tracks.length > 0) {
        this.setCurrentTrack(this.tracks[0], false);
      }

      this.filteredTracks = [...this.tracks];
    },
    (error) => {
      console.error('Error loading tracks:', error);
    }
  );
}


  loadVideos(userId: string): void {
    this.trackService.getVideos(userId).subscribe(
      (data: any) => {
        this.videos = data.map((video: any) => ({
          _id: video._id,
          name: video.name,
          author: video.author,
          filePath: video.filePath,
        }));

        console.log('Loaded videos:', this.videos);

        if (this.videos.length > 0) {
          this.setCurrentVideo(this.videos[0], false);
        }
      },
      (error) => {
        console.error('Error loading videos:', error);
      }
    );
  }

  togglePlay(media: Track | Video): void {
    if (media.hasOwnProperty('filePath')) {
      if (this.isTrack(media)) {
        if (this.currentTrack && this.currentTrack === media) {
          this.togglePlayPause();
        } else {
          this.setCurrentTrack(media as Track, true);
        }
      } else if (this.isVideo(media)) {
        if (this.currentVideo && this.currentVideo === media) {
          this.togglePlayPauseVideo();
        } else {
          this.setCurrentVideo(media as Video, true);
        }
      }
    }
  }
  

  private isTrack(media: Track | Video): media is Track {
    return (media as Track).filePath !== undefined;
  }
  
  private isVideo(media: Track | Video): media is Video {
    return (media as Video).filePath !== undefined;
  }

  togglePlayPause(): void {
    if (this.audioElement) {
      if (this.audioElement.paused) {
        this.audioElement.play();
        this.isPlaying = true;
        this.showControls = true;
        this.showVideoPlayer = false;
        if (this.videoPlayer) {
          this.videoPlayer.nativeElement.pause();
        }
      } else {
        this.audioElement.pause();
        this.isPlaying = false;
      }
    }
  }

  togglePlayPauseVideo(): void {
    if (this.videoPlayer) {
      if (this.videoPlayer.nativeElement.paused) {
        this.videoPlayer.nativeElement.play();
        this.isPlaying = true;
        this.showControls = false;
        this.showVideoPlayer = true;
      } else {
        this.videoPlayer.nativeElement.pause();
        this.isPlaying = false;
      }
    }
  }

  playNextTrack(): void {
    if (this.currentTrack && this.tracks.length > 0) {
      const currentIndex = this.tracks.findIndex((track) => track === this.currentTrack);
      const nextIndex = (currentIndex + 1) % this.tracks.length;
      this.setCurrentTrack(this.tracks[nextIndex]);
    } else if (this.currentVideo && this.videos.length > 0) {
      const currentIndex = this.videos.findIndex((video) => video === this.currentVideo);
      const nextIndex = (currentIndex + 1) % this.videos.length;
      this.setCurrentVideo(this.videos[nextIndex]);
    }
  }

  playPreviousTrack(): void {
    if (this.currentTrack && this.tracks.length > 0) {
      const currentIndex = this.tracks.findIndex((track) => track === this.currentTrack);
      const prevIndex = (currentIndex - 1 + this.tracks.length) % this.tracks.length;
      this.setCurrentTrack(this.tracks[prevIndex]);
    } else if (this.currentVideo && this.videos.length > 0) {
      const currentIndex = this.videos.findIndex((video) => video === this.currentVideo);
      const prevIndex = (currentIndex - 1 + this.videos.length) % this.videos.length;
      this.setCurrentVideo(this.videos[prevIndex]);
    }
  }

  playNextVideo(): void {
    if (this.currentVideo && this.videos.length > 0) {
      const currentIndex = this.videos.findIndex((video) => video === this.currentVideo);
      const nextIndex = (currentIndex + 1) % this.videos.length;
      this.setCurrentVideo(this.videos[nextIndex]);
    }
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
      const value = parseFloat(inputElement.value);
      if (this.audioElement) {
        this.audioElement.volume = value;
      }
      if (this.videoPlayer) {
        this.videoPlayer.nativeElement.volume = value;
      }
    }
  }

  seekTrack(event: MouseEvent): void {
    const sliderContainer = event.currentTarget as HTMLElement;
    const rect = sliderContainer.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const percentage = Math.min(1, Math.max(0, offsetX / rect.width));

    if (this.audioElement) {
      this.audioElement.currentTime = percentage * this.durationInSeconds;
    }
    if (this.videoPlayer) {
      this.videoPlayer.nativeElement.currentTime = percentage * this.durationInSeconds;
    }
  }

  private setCurrentTrack(track: Track, autoPlay: boolean = true): void {
    if (!this.audioElement) {
      console.error('Audio element not found!');
      return;
    }

    this.currentTrack = track;
    const fixedFilePath = track.filePath.replace(/\\/g, '/');
    this.audioElement.src = `${fixedFilePath}`;
    this.audioElement.load();

    if (autoPlay) {
      this.audioElement.play();
      this.isPlaying = true;
      this.showControls = true;
      this.showVideoPlayer = false;
      if (this.videoPlayer) {
        this.videoPlayer.nativeElement.pause();
      }
    } else {
      this.isPlaying = false;
    }
    this.currentTime = '0:00';
    this.audioElement.addEventListener('loadedmetadata', () => {
      this.duration = this.formatTime(this.audioElement!.duration);
    });
  }

  private setCurrentVideo(video: Video, autoPlay: boolean = true): void {
    if (!this.videoPlayer) {
      console.error('Video player not found!');
      return;
    }

    this.currentVideo = video;
    const fixedFilePath = video.filePath.replace(/\\/g, '/');
    this.videoPlayer.nativeElement.src = `${fixedFilePath}`;
    this.videoPlayer.nativeElement.load();

    if (autoPlay) {
      this.videoPlayer.nativeElement.play();
      this.isPlaying = true;
      this.showControls = false;
      this.showVideoPlayer = true;
    } else {
      this.isPlaying = false;
    }
    this.currentTime = '0:00';
    this.videoPlayer.nativeElement.addEventListener('loadedmetadata', () => {
      this.duration = this.formatTime(this.videoPlayer.nativeElement.duration);
    });
  }

deleteTrack(event: Event, track: Track): void {
  event.stopPropagation();

  if (!track._id) {
    console.error('Track ID is undefined');
    return;
  }

  const userId = localStorage.getItem('userId');
  if (!userId) {
    console.error('User ID is undefined');
    return;
  }

  this.trackService.deleteTrack(track._id, userId).subscribe(
    () => {
      this.tracks = this.tracks.filter((t) => t._id !== track._id);

      if (this.currentTrack && this.currentTrack._id === track._id) {
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


deleteVideo(video: Video): void {
  if (!video._id) {
    console.error('Video ID is undefined');
    return;
  }

  const userId = localStorage.getItem('userId');
  if (!userId) {
    console.error('User ID is undefined');
    return;
  }

  this.trackService.deleteVideo(video._id, userId).subscribe(
    () => {
      this.videos = this.videos.filter((v) => v._id !== video._id);

      if (this.currentVideo && this.currentVideo._id === video._id) {
        if (this.videoPlayer) {
          this.videoPlayer.nativeElement.pause();
          this.videoPlayer.nativeElement.src = '';
        }
        this.currentVideo = null;
        this.isPlaying = false;
      }

    },
    (error) => {
      console.error('Error deleting video:', error);
    }
  );
}



  updateTime(media: HTMLAudioElement | HTMLVideoElement): void {
    this.currentTime = this.formatTime(media.currentTime);
    this.currentTimeInSeconds = media.currentTime;
  }

  formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  }

  toggleMediaList(): void {
    // Пауза поточного трека або відео перед переключенням
    if (this.audioElement && !this.audioElement.paused) {
      this.audioElement.pause();
      this.isPlaying = false;
    }
    
    if (this.videoPlayer && !this.videoPlayer.nativeElement.paused) {
      this.videoPlayer.nativeElement.pause();
      this.isPlaying = false;
    }
  
    this.showTracks = !this.showTracks;
  
    if (!this.showTracks) {
      this.showControls = false;
    } else {
      this.showControls = true;
    }
  }

  openVideoInNewTab(video: Video): void {
    const videoUrl = `${video.filePath.replace(/\\/g, '/')}`;
    window.open(videoUrl, '_blank');
  }
}