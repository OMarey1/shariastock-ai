import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { News } from '../../models/news.model';
import { NewsCardComponent } from '../../components/news-card/news-card.component';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, NewsCardComponent, LoadingSpinnerComponent],
  template: `
    <div class="news-page">
      <div class="news-header">
        <h2>Latest Stock News</h2>
        <p>Stay updated with Sharia-compliant investment news</p>
      </div>

      <div class="news-filters">
        <button 
          [ngClass]="{'active': filter === 'all'}" 
          (click)="setFilter('all')"
        >
          All News
        </button>
        <button 
          [ngClass]="{'active': filter === 'halal'}" 
          (click)="setFilter('halal')"
        >
          Halal Only
        </button>
        <button 
          [ngClass]="{'active': filter === 'haram'}" 
          (click)="setFilter('haram')"
        >
          Haram Only
        </button>
      </div>

      <app-loading-spinner *ngIf="loading" message="Loading news..."></app-loading-spinner>
      
      <div class="no-news" *ngIf="!loading && filteredNews.length === 0">
        <p>No news articles found matching your criteria.</p>
      </div>
      
      <div class="news-grid" *ngIf="!loading && filteredNews.length > 0">
        <app-news-card *ngFor="let newsItem of filteredNews; trackBy: trackByNewsId" [news]="newsItem"></app-news-card>
      </div>
    </div>
  `,
  styles: `
    .news-page {
      padding: 20px 0;
    }

    .news-header {
      margin-bottom: 20px;
      text-align: center;
    }

    .news-header h2 {
      font-size: 1.8rem;
      color: var(--primary-color);
      margin-bottom: 8px;
    }

    .news-header p {
      color: #666;
    }

    .news-filters {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-bottom: 20px;
    }

    .news-filters button {
      background: white;
      color: #333;
      border: 1px solid #ddd;
    }

    .news-filters button.active {
      background-color: var(--primary-color);
      color: white;
      border-color: var(--primary-color);
    }

    .no-news {
      padding: 20px;
      text-align: center;
      color: #666;
      background: white;
      border-radius: 8px;
      box-shadow: var(--shadow);
    }

    .news-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
    }

    @media (max-width: 768px) {
      .news-grid {
        grid-template-columns: 1fr;
      }
    }
  `
})
export class NewsComponent implements OnInit {
  allNews: News[] = [];
  filteredNews: News[] = [];
  filter: string = 'all';
  loading: boolean = true;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews(): void {
    this.loading = true;
    this.apiService.getNews().subscribe(news => {
      this.allNews = news;
      this.applyFilter();
      this.loading = false;
    });
  }

  setFilter(filter: string): void {
    this.filter = filter;
    this.applyFilter();
  }

  applyFilter(): void {
    if (this.filter === 'all') {
      this.filteredNews = this.allNews;
    } else if (this.filter === 'halal') {
      this.filteredNews = this.allNews.filter(news => news.shariaStatus === 'Halal');
    } else if (this.filter === 'haram') {
      this.filteredNews = this.allNews.filter(news => news.shariaStatus === 'Haram');
    }
  }
  
  // Track by function for ngFor to improve performance
  trackByNewsId(index: number, news: News): string {
    return news.id;
  }
}