import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-container">
        <div class="auth-header">
          <h2>Login to ShariaStock AI</h2>
          <p>Access your personalized Sharia-compliant investment dashboard</p>
        </div>
        
        <form (ngSubmit)="onSubmit()" #loginForm="ngForm" class="auth-form">
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
              [class.input-error]="emailInput.invalid && emailInput.touched"
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
              placeholder="Enter your password"
              [class.input-error]="passwordInput.invalid && passwordInput.touched"
            >
            <div class="error-message" *ngIf="passwordInput.invalid && passwordInput.touched">
              Password must be at least 6 characters
            </div>
          </div>
          
          <button 
            type="submit" 
            class="auth-button" 
            [disabled]="loginForm.invalid || loading"
          >
            <span *ngIf="!loading">Login</span>
            <span *ngIf="loading" class="button-loader">
              <span class="loader-dot"></span>
              <span class="loader-dot"></span>
              <span class="loader-dot"></span>
            </span>
          </button>
          
          <div class="auth-error" *ngIf="error">
            {{ error }}
          </div>
          
          <div class="auth-redirect">
            Don't have an account? <a routerLink="/signup">Sign up</a>
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
      animation: fadeIn 0.8s ease;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .auth-container {
      background: white;
      border-radius: 8px;
      box-shadow: var(--shadow);
      width: 100%;
      max-width: 450px;
      padding: 30px;
      animation: scaleIn 0.5s ease;
    }

    @keyframes scaleIn {
      from {
        transform: scale(0.95);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }

    .auth-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .auth-header h2 {
      color: var(--primary-color);
      margin-bottom: 10px;
      position: relative;
      display: inline-block;
    }

    .auth-header h2::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 50%;
      transform: translateX(-50%);
      width: 50px;
      height: 2px;
      background-color: var(--secondary-color);
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
      animation: slideUp 0.5s ease;
      animation-fill-mode: both;
    }

    .form-group:nth-child(1) {
      animation-delay: 0.1s;
    }

    .form-group:nth-child(2) {
      animation-delay: 0.2s;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      transition: color 0.3s ease;
    }

    .form-group input {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
      transition: all 0.3s ease;
    }

    .form-group input:focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px rgba(44, 62, 80, 0.2);
    }

    .form-group input.input-error {
      border-color: var(--danger-color);
      background-color: rgba(231, 76, 60, 0.05);
    }

    .form-group input.ng-invalid.ng-touched + label {
      color: var(--danger-color);
    }

    .error-message {
      color: var(--danger-color);
      font-size: 14px;
      margin-top: 5px;
      animation: fadeIn 0.3s ease;
    }

    .auth-button {
      background-color: var(--primary-color);
      color: white;
      padding: 12px;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      animation: slideUp 0.5s ease;
      animation-delay: 0.3s;
      animation-fill-mode: both;
    }

    .auth-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s ease;
    }

    .auth-button:hover:not(:disabled)::before {
      left: 100%;
    }

    .auth-button:hover:not(:disabled) {
      background-color: #34495e;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .auth-button:active:not(:disabled) {
      transform: translateY(0);
    }

    .auth-button:disabled {
      background-color: #95a5a6;
      cursor: not-allowed;
    }

    .button-loader {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .loader-dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      margin: 0 3px;
      background-color: white;
      border-radius: 50%;
      animation: dotPulse 1.5s infinite ease-in-out;
    }

    .loader-dot:nth-child(2) {
      animation-delay: 0.2s;
    }

    .loader-dot:nth-child(3) {
      animation-delay: 0.4s;
    }

    @keyframes dotPulse {
      0%, 100% {
        transform: scale(0.8);
        opacity: 0.5;
      }
      50% {
        transform: scale(1.2);
        opacity: 1;
      }
    }

    .auth-error {
      color: var(--danger-color);
      text-align: center;
      margin-top: 15px;
      animation: shake 0.5s ease;
    }

    @keyframes shake {
      0%, 100% {
        transform: translateX(0);
      }
      10%, 30%, 50%, 70%, 90% {
        transform: translateX(-5px);
      }
      20%, 40%, 60%, 80% {
        transform: translateX(5px);
      }
    }

    .auth-redirect {
      text-align: center;
      margin-top: 20px;
      font-size: 14px;
      animation: slideUp 0.5s ease;
      animation-delay: 0.4s;
      animation-fill-mode: both;
    }

    .auth-redirect a {
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s ease;
      position: relative;
    }

    .auth-redirect a::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 2px;
      background-color: var(--primary-color);
      transition: width 0.3s ease;
    }

    .auth-redirect a:hover::after {
      width: 100%;
    }

    .auth-redirect a:hover {
      color: var(--secondary-color);
    }
  `
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loading: boolean = false;
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.loading = true;
    this.error = '';

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/search']);
      },
      error: (err) => {
        this.error = 'Failed to login. Please check your credentials.';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}