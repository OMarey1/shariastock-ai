import { Component, OnInit, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <header [class.scrolled]="scrolled">
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
      transition: all 0.3s ease;
    }

    header.scrolled {
      padding: 10px 0;
      background-color: rgba(44, 62, 80, 0.95);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    }

    .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo h1 {
      font-size: 1.5rem;
      margin: 0;
      position: relative;
      overflow: hidden;
    }

    .logo h1::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background-color: var(--secondary-color);
      transition: width 0.3s ease;
    }

    .logo h1:hover::after {
      width: 100%;
    }

    nav ul {
      display: flex;
      list-style: none;
      align-items: center;
      margin: 0;
      padding: 0;
    }

    nav ul li {
      margin-left: 20px;
    }

    nav ul li a {
      color: white;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s ease;
      cursor: pointer;
      position: relative;
      padding: 5px 0;
    }

    nav ul li a::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background-color: var(--secondary-color);
      transition: width 0.3s ease;
    }

    nav ul li a:hover::after, nav ul li a.active::after {
      width: 100%;
    }

    nav ul li a:hover, nav ul li a.active {
      color: var(--secondary-color);
    }

    .signup-btn {
      background-color: var(--secondary-color);
      padding: 8px 16px !important;
      border-radius: 4px;
      color: white;
      transition: all 0.3s ease;
      display: inline-block;
    }

    .signup-btn:hover {
      background-color: #219653;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .signup-btn:active {
      transform: translateY(0);
    }

    .user-menu {
      position: relative;
    }

    .user-toggle {
      display: flex;
      align-items: center;
      padding: 5px 10px !important;
    }

    .arrow-down {
      font-size: 10px;
      margin-left: 5px;
      transition: transform 0.3s ease;
    }

    .user-toggle:hover .arrow-down {
      transform: rotate(180deg);
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
      z-index: 1001;
      animation: dropdownFade 0.3s ease forwards;
    }

    @keyframes dropdownFade {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .dropdown-menu a {
      display: block;
      padding: 10px 15px !important;
      color: #333 !important;
      border-bottom: 1px solid #eee;
      transition: all 0.2s ease;
    }

    .dropdown-menu a:last-child {
      border-bottom: none;
    }

    .dropdown-menu a:hover {
      background-color: #f8f9fa;
      color: var(--primary-color) !important;
      padding-left: 20px !important;
    }
  `
})
export class HeaderComponent implements OnInit {
  isAuthenticated: boolean = false;
  user: User | null = null;
  showUserMenu: boolean = false;
  scrolled: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.authState$.subscribe(state => {
      this.isAuthenticated = state.isAuthenticated;
      this.user = state.user;
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = window.scrollY > 50;
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    // Close the user menu when clicking outside
    const userMenuElement = (event.target as HTMLElement).closest('.user-menu');
    if (!userMenuElement && this.showUserMenu) {
      this.showUserMenu = false;
    }
  }

  logout(): void {
    this.authService.logout();
    this.showUserMenu = false;
  }
}