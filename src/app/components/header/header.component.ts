import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
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
    }

    nav ul li {
      margin-left: 20px;
    }

    nav ul li a {
      color: white;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s ease;
    }

    nav ul li a:hover, nav ul li a.active {
      color: var(--secondary-color);
    }
  `
})
export class HeaderComponent {}