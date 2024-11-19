import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-media-details',
  template: `
    <div class="details-container">
      <h2>{{ media.title }}</h2>
      <div *ngIf="media.type === 'image'">
        <img [src]="media.url" alt="{{ media.title }}" />
      </div>
      <div *ngIf="media.type === 'video'">
        <video [src]="media.url" controls></video>
      </div>
      <div *ngIf="media.type === 'audio'">
        <audio [src]="media.url" controls></audio>
      </div>
      <p>{{ media.description }}</p>
    </div>
  `,
  styles: [`
    .details-container { padding: 20px; }
  `],
})
export class MediaDetailsComponent implements OnInit {
  media: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const mediaId = this.route.snapshot.paramMap.get('id');
    // Запит даних на основі mediaId
    this.media = {
      id: mediaId,
      title: 'Example Media',
      description: 'This is an example media file.',
      type: 'image',
      url: 'path-to-media.jpg',
    };
  }
}
