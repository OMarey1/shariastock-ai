import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, LoadingSpinnerComponent],
  template: `
    <app-header></app-header>
    <div class="header-space"></div>
    <main class="container">
      <router-outlet></router-outlet>
    </main>
  `,
})
export class AppComponent {
  title = 'ShariaStock AI';
}