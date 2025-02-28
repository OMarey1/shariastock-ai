import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="profile-page">
      <div class="profile-container">
        <div class="profile-header">
          <h2>Your Profile</h2>
          <p>Manage your ShariaStock AI account</p>
        </div>
        
        <div class="profile-content" *ngIf="user">
          <div class="profile-section">
            <h3>Account Information</h3>
            <div class="profile-info">
              <div class="info-item">
                <span class="info-label">Name</span>
                <span class="info-value">{{ user.name }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Email</span>
                <span class="info-value">{{ user.email }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Member Since</span>
                <span class="info-value">{{ user.createdAt | date }}</span>
              </div>
            </div>
          </div>
          
          <div class="profile-section">
            <h3>Preferences</h3>
            <div class="preferences-form">
              <div class="form-group">
                <label for="notificationEmail">Email Notifications</label>
                <div class="toggle-switch">
                  <input type="checkbox" id="notificationEmail" [(ngModel)]="preferences.emailNotifications">
                  <label for="notificationEmail"></label>
                </div>
              </div>
              
              <div class="form-group">
                <label for="darkMode">Dark Mode</label>
                <div class="toggle-switch">
                  <input type="checkbox" id="darkMode" [(ngModel)]="preferences.darkMode">
                  <label for="darkMode"></label>
                </div>
              </div>
              
              <button class="save-button" (click)="savePreferences()">Save Preferences</button>
              <div class="success-message" *ngIf="showSuccess">
                Preferences saved successfully!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    .profile-page {
      padding: 20px 0;
    }

    .profile-container {
      background: white;
      border-radius: 8px;
      box-shadow: var(--shadow);
      max-width: 800px;
      margin: 0 auto;
      padding: 30px;
    }

    .profile-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .profile-header h2 {
      color: var(--primary-color);
      margin-bottom: 10px;
    }

    .profile-header p {
      color: #666;
    }

    .profile-section {
      margin-bottom: 30px;
    }

    .profile-section h3 {
      color: var(--primary-color);
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }

    .profile-info {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 15px;
    }

    .info-item {
      padding: 15px;
      background-color: #f8f9fa;
      border-radius: 6px;
    }

    .info-label {
      display: block;
      font-size: 0.9rem;
      color: #666;
      margin-bottom: 5px;
    }

    .info-value {
      font-size: 1.1rem;
      font-weight: 500;
      color: #333;
    }

    .preferences-form {
      max-width: 500px;
    }

    .form-group {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      padding: 10px 0;
    }

    .toggle-switch {
      position: relative;
      width: 60px;
      height: 34px;
    }

    .toggle-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .toggle-switch label {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: .4s;
      border-radius: 34px;
    }

    .toggle-switch label:before {
      position: absolute;
      content: "";
      height: 26px;
      width: 26px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }

    .toggle-switch input:checked + label {
      background-color: var(--secondary-color);
    }

    .toggle-switch input:checked + label:before {
      transform: translateX(26px);
    }

    .save-button {
      background-color: var(--primary-color);
      color: white;
      padding: 12px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      margin-top: 10px;
    }

    .save-button:hover {
      background-color: #34495e;
    }

    .success-message {
      color: var(--secondary-color);
      margin-top: 10px;
      font-weight: 500;
    }
  `
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  preferences = {
    emailNotifications: true,
    darkMode: false
  };
  showSuccess: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.currentUser;
    
    // In a real app, you would fetch user preferences from an API
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      this.preferences = JSON.parse(savedPreferences);
    }
  }

  savePreferences(): void {
    // In a real app, you would save to an API
    localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
    
    this.showSuccess = true;
    setTimeout(() => {
      this.showSuccess = false;
    }, 3000);
  }
}