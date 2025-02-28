import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-container">
        <div class="auth-header">
          <h2>Create an Account</h2>
          <p>Join ShariaStock AI for Sharia-compliant investment insights</p>
        </div>
        
        <form (ngSubmit)="onSubmit()" #signupForm="ngForm" class="auth-form">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              name="name"
              [(ngModel)]="name"
              required
              #nameInput="ngModel"
              placeholder="Enter your full name"
            >
            <div class="error-message" *ngIf="nameInput.invalid && nameInput.touched">
              Name is required
            </div>
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              [(ngModel)]="email"
              required
              email
              #emailInput="ngModel"
              placeholder="Enter your email"
            >
            <div class="error-message" *ngIf="emailInput.invalid && emailInput.touched">
              Please enter a valid email address
            </div>
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password"
              [(ngModel)]="password"
              required
              minlength="6"
              #passwordInput="ngModel"
              placeholder="Create a password (min. 6 characters)"
            >
            <div class="error-message" *ngIf="passwordInput.invalid && passwordInput.touched">
              Password must be at least 6 characters
            </div>
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              name="confirmPassword"
              [(ngModel)]="confirmPassword"
              required
              #confirmPasswordInput="ngModel"
              placeholder="Confirm your password"
            >
            <div class="error-message" *ngIf="confirmPassword && password !== confirmPassword && confirmPasswordInput.touched">
              Passwords do not match
            </div>
          </div>
          
          <button 
            type="submit" 
            class="auth-button" 
            [disabled]="signupForm.invalid || password !== confirmPassword || loading"
          >
            <span *ngIf="!loading">Create Account</span>
            <span *ngIf="loading">Creating account...</span>
          </button>
          
          <div class="auth-error" *ngIf="error">
            {{ error }}
          </div>
          
          <div class="auth-redirect">
            Already have an account? <a routerLink="/login">Login</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: `
    .auth-page {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 70px);
      padding: 20px;
    }

    .auth-container {
      background: white;
      border-radius: 8px;
      box-shadow: var(--shadow);
      width: 100%;
      max-width: 450px;
      padding: 30px;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .auth-header h2 {
      color: var(--primary-color);
      margin-bottom: 10px;
    }

    .auth-header p {
      color: #666;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
    }

    .form-group input {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
    }

    .form-group input.ng-invalid.ng-touched {
      border-color: var(--danger-color);
    }

    .error-message {
      color: var(--danger-color);
      font-size: 14px;
      margin-top: 5px;
    }

    .auth-button {
      background-color: var(--primary-color);
      color: white;
      padding: 12px;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .auth-button:hover:not(:disabled) {
      background-color: #34495e;
    }

    .auth-button:disabled {
      background-color: #95a5a6;
      cursor: not-allowed;
    }

    .auth-error {
      color: var(--danger-color);
      text-align: center;
      margin-top: 15px;
    }

    .auth-redirect {
      text-align: center;
      margin-top: 20px;
      font-size: 14px;
    }

    .auth-redirect a {
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 500;
    }

    .auth-redirect a:hover {
      text-decoration: underline;
    }
  `
})
export class SignupComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  loading: boolean = false;
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.register(this.email, this.password, this.name).subscribe({
      next: () => {
        this.router.navigate(['/search']);
      },
      error: (err) => {
        this.error = 'Failed to create account. Please try again.';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}