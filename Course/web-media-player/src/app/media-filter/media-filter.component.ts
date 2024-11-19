import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-media-filter',
  standalone: true, // Позначає компонент як Standalone
  template: `
    <select (change)="onFilter($event)">
      <option value="">All</option>
      <option value="video">Video</option>
      <option value="audio">Audio</option>
      <option value="image">Image</option>
    </select>
  `,
})
export class MediaFilterComponent {
  @Output() filter = new EventEmitter<string>();

  onFilter(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.filter.emit(value);
  }
}
