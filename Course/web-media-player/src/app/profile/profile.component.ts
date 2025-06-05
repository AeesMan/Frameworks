import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [CommonModule, RouterModule],
})
export class ProfileComponent implements OnInit {
  isMenuOpen: boolean = false;

  user = {
    login: '',
    email: '',
    bio: '',
    usedStorage: 0 // в байтах
  };

  get usedPercentage(): number {
    return (this.user.usedStorage / (2 * 1024 * 1024 * 1024)) * 100;
  }

  get formattedUsedStorage(): string {
    const gb = this.user.usedStorage / (1024 * 1024 * 1024);
    return gb.toFixed(2) + ' GB';
  }


  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.http.get<any>(`http://localhost:5000/users/${userId}`).subscribe({
        next: (data) => {
          this.user = data;
        },
        error: (err) => {
          console.error('Не вдалося завантажити дані користувача:', err);
        }
      });
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    localStorage.clear(); // або видали конкретні ключі, якщо треба
    this.router.navigate(['/login']);
  }

}
