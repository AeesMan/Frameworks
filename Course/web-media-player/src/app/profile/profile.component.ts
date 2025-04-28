import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [CommonModule, RouterModule],
})
export class ProfileComponent {
  isMenuOpen: boolean = false;

  user = {
    name: 'Ім\'я Користувача',
    email: 'user@example.com',
    bio: 'Це коротка біографія користувача.'
  };

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
