import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="spinner-container" [ngClass]="{'fullscreen': fullscreen}">
      <div class="spinner">
        <div class="spinner-inner"></div>
      </div>
      <p *ngIf="message" class="spinner-message">{{ message }}</p>
    </div>
  `,
  styles: `
    .spinner-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 20px;
      animation: fadeIn 0.3s ease;
    }

    .fullscreen {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.8);
      z-index: 9999;
    }

    .spinner {
      position: relative;
      width: 60px;
      height: 60px;
    }

    .spinner-inner {
      position: absolute;
      border: 4px solid transparent;
      border-radius: 50%;
      border-top-color: var(--primary-color);
      border-bottom-color: var(--secondary-color);
      width: 100%;
      height: 100%;
      animation: spin 1.2s linear infinite;
    }

    .spinner-inner::before, .spinner-inner::after {
      content: '';
      position: absolute;
      border-radius: 50%;
      border: 4px solid transparent;
    }

    .spinner-inner::before {
      top: 5px;
      left: 5px;
      right: 5px;
      bottom: 5px;
      border-top-color: var(--primary-color);
      border-bottom-color: var(--secondary-color);
      animation: spin 0.8s linear infinite reverse;
    }

    .spinner-message {
      margin-top: 15px;
      color: var(--primary-color);
      font-weight: 500;
      text-align: center;
    }

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `
})
export class LoadingSpinnerComponent {
  @Input() message: string = '';
  @Input() fullscreen: boolean = false;
}