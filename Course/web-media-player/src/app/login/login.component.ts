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

  constructor(private http: HttpClient, private router: Router) {}


    togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }


  login(): void {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post<any>('http://localhost:5000/auth/login', this.user, { headers }).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        
        // Вивести в консоль userId
        console.log('User ID:', response.userId);

        // Зберегти userId в localStorage
        localStorage.setItem('userId', response.userId);
        
        // Перехід на сторінку home
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Login failed:', error);
        alert(error.error?.error || 'Login failed');
      }
    });
  }
}
