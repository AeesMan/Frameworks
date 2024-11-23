import { Component } from '@angular/core';
import { SearchComponent } from '../search/search.component';
import { MediaFilterComponent } from '../media-filter/media-filter.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [SearchComponent, MediaFilterComponent, RouterModule],
})
export class HomeComponent {

  isMenuOpen: boolean = false;
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  onSearch(query: string) {
    console.log('Search:', query);
  }

  onFilter(filter: string) {
    console.log('Filter:', filter);
  }
}
