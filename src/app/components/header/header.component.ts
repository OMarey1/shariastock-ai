import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <header>
      <div class="container">
        <div class="logo">
          <h1>ShariaStock AI</h1>
        </div>
        <nav>
          <ul>
            <li><a routerLink="/search" routerLinkActive="active">Search</a></li>
            <li><a routerLink="/news" routerLinkActive="active">News</a></li>
            <ng-container *ngIf="!isAuthenticated">
              <li><a routerLink="/login" routerLinkActive="active">Login</a></li>
              <li><a routerLink="/signup" routerLinkActive="active" class="signup-btn">Sign Up</a></li>
            </ng-container>
            <ng-container *ngIf="isAuthenticated">
              <li class="user-menu">
                <a (click)="toggleUserMenu()" class="user-toggle">
                  {{ user?.name || 'User' }} <span class="arrow-down">▼</span>
                </a>
                <div class="dropdown-menu" *ngIf="showUserMenu">
                  <a routerLink="/profile">Profile</a>
                  <a routerLink="/portfolio">Portfolio</a>
                  <a (click)="logout()">Logout</a>
                </div>
              </li>
            </ng-container>
          </ul>
        </nav>
      </div>
    </header>
  `,
  styles: `
    header {
      background-color: var(--primary-color);
      color: white;
      padding: 15px 0;
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 1000;
      box-shadow: var(--shadow);
    }

    .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo h1 {
      font-size: 1.5rem;
      margin: 0;
    }

    nav ul {
      display: flex;
      list-style: none;
      align-items: center;
    }

    nav ul li {
      margin-left: 20px;
    }

    nav ul li a {
      color: white;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s ease;
      cursor: pointer;
    }

    nav ul li a:hover, nav ul li a.active {
      color: var(--secondary-color);
    }

    .signup-btn {
      background-color: var(--secondary-color);
      padding: 8px 16px;
      border-radius: 4px;
      color: white;
    }

    .signup-btn:hover {
      background-color: #219653;
      color: white;
    }

    .user-menu {
      position: relative;
    }

    .user-toggle {
      display: flex;
      align-items: center;
    }

    .arrow-down {
      font-size: 10px;
      margin-left: 5px;
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      right: 0;
      background-color: white;
      border-radius: 4px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      width: 150px;
      margin-top: 10px;
    }

    .dropdown-menu a {
      display: block;
      padding: 10px 15px;
      color: #333 !important;
      border-bottom: 1px solid #eee;
    }

    .dropdown-menu a:last-child {
      border-bottom: none;
    }

    .dropdown-menu a:hover {
      background-color: #f8f9fa;
      color: var(--primary-color) !important;
    }
  `
})
export class HeaderComponent implements OnInit {
  isAuthenticated: boolean = false;
  user: User | null = null;
  showUserMenu: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.authState$.subscribe(state => {
      this.isAuthenticated = state.isAuthenticated;
      this.user = state.user;
    });
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  logout(): void {
    this.authService.logout();
    this.showUserMenu = false;
  }
}