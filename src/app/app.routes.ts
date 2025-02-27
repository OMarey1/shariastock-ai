import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'search',
    pathMatch: 'full'
  },
  {
    path: 'search',
    loadComponent: () => import('./pages/search/search.component').then(m => m.SearchComponent)
  },
  {
    path: 'news',
    loadComponent: () => import('./pages/news/news.component').then(m => m.NewsComponent)
  },
  {
    path: 'stock/:id',
    loadComponent: () => import('./pages/stock-detail/stock-detail.component').then(m => m.StockDetailComponent)
  },
  {
    path: '**',
    redirectTo: 'search'
  }
];