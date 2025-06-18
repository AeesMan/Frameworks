import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, RouterModule, FormsModule],
})
export class LoginComponent {
  user = {
    login: '',
    password: '',
  };

  showPassword = false;
  showConfirmPassword = false;

  loginError: string | null = null; // для повідомлення про помилку

  constructor(private http: HttpClient, private router: Router) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  login(): void {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.loginError = null; // очистити попереднє повідомлення

    this.http.post<any>('http://localhost:5000/auth/login', this.user, { headers }).subscribe({
      next: (response) => {
        localStorage.setItem('userId', response.userId);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.loginError = error.error?.error || 'Login failed'; // показати повідомлення
      }
    });
  }
}
