import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Stock } from '../../models/stock.model';
import { News } from '../../models/news.model';
import { NewsCardComponent } from '../../components/news-card/news-card.component';

@Component({
  selector: 'app-stock-detail',
  standalone: true,
  imports: [CommonModule, NewsCardComponent],
  template: `
    <div class="stock-detail-page">
      <div class="loading" *ngIf="loading">
        <p>Loading stock details...</p>
      </div>
      
      <div class="not-found" *ngIf="!loading && !stock">
        <p>Stock not found.</p>
      </div>
      
      <div class="stock-content" *ngIf="!loading && stock">
        <div class="stock-header">
          <div class="stock-title">
            <h2>{{ stock.code }}</h2>
            <span class="stock-name">{{ stock.name }}</span>
          </div>
          <span class="badge" [ngClass]="stock.shariaStatus === 'Halal' ? 'badge-halal' : 'badge-haram'">
            {{ stock.shariaStatus }}
          </span>
        </div>
        
        <div class="stock-price-section">
          <div class="current-price">\${{ stock.price.toFixed(2) }}</div>
          <div class="price-change" [ngClass]="stock.change >= 0 ? 'positive' : 'negative'">
            {{ stock.change >= 0 ? '+' : '' }}{{ stock.change.toFixed(2) }} ({{ stock.changePercent.toFixed(2) }}%)
          </div>
        </div>
        
        <div class="stock-details">
          <div class="detail-section">
            <h3>About</h3>
            <p>{{ stock.description }}</p>
          </div>
          
          <div class="detail-section">
            <h3>Key Statistics</h3>
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-label">Market Cap</div>
                <div class="stat-value">\${{ formatLargeNumber(stock.marketCap) }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">Volume</div>
                <div class="stat-value">{{ formatLargeNumber(stock.volume) }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">P/E Ratio</div>
                <div class="stat-value">{{ stock.peRatio?.toFixed(2) }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">Dividend Yield</div>
                <div class="stat-value">{{ stock.dividend?.toFixed(2) }}%</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">Sector</div>
                <div class="stat-value">{{ stock.sector }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">Industry</div>
                <div class="stat-value">{{ stock.industry }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="stock-news">
          <h3>Latest News</h3>
          
          <div class="loading" *ngIf="loadingNews">
            <p>Loading news...</p>
          </div>
          
          <div class="no-news" *ngIf="!loadingNews && relatedNews.length === 0">
            <p>No recent news for this stock.</p>
          </div>
          
          <div class="news-list" *ngIf="!loadingNews && relatedNews.length > 0">
            <app-news-card *ngFor="let newsItem of relatedNews" [news]="newsItem"></app-news-card>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    .stock-detail-page {
      padding: 20px 0;
    }

    .loading, .not-found {
      padding: 20px;
      text-align: center;
      color: #666;
      background: white;
      border-radius: 8px;
      box-shadow: var(--shadow);
    }

    .stock-content {
      background: white;
      border-radius: 8px;
      box-shadow: var(--shadow);
      padding: 20px;
    }

    .stock-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid #eee;
    }

    .stock-title h2 {
      font-size: 2rem;
      margin: 0 0 4px 0;
      color: var(--primary-color);
    }

    .stock-name {
      font-size: 1.1rem;
      color: #666;
    }

    .badge {
      font-size: 1rem;
      padding: 6px 12px;
    }

    .stock-price-section {
      margin-bottom: 24px;
    }

    .current-price {
      font-size: 2.5rem;
      font-weight: bold;
      margin-bottom: 4px;
    }

    .price-change {
      font-size: 1.2rem;
    }

    .positive {
      color: var(--secondary-color);
    }

    .negative {
      color: var(--danger-color);
    }

    .stock-details {
      margin-bottom: 24px;
    }

    .detail-section {
      margin-bottom: 20px;
    }

    .detail-section h3 {
      font-size: 1.3rem;
      margin-bottom: 12px;
      color: var(--primary-color);
    }

    .detail-section p {
      line-height: 1.6;
      color: #333;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
    }

    .stat-item {
      padding: 12px;
      background-color: #f8f9fa;
      border-radius: 6px;
    }

    .stat-label {
      font-size: 0.9rem;
      color: #666;
      margin-bottom: 4px;
    }

    .stat-value {
      font-size: 1.1rem;
      font-weight: bold;
      color: #333;
    }

    .stock-news h3 {
      font-size: 1.3rem;
      margin-bottom: 16px;
      color: var(--primary-color);
    }

    .no-news {
      padding: 20px;
      text-align: center;
      color: #666;
      background: #f8f9fa;
      border-radius: 6px;
    }

    .news-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
    }

    @media (max-width: 768px) {
      .news-list {
        grid-template-columns: 1fr;
      }
    }
  `
})
export class StockDetailComponent implements OnInit {
  stock?: Stock;
  relatedNews: News[] = [];
  loading: boolean = true;
  loadingNews: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const stockId = params.get('id');
      if (stockId) {
        this.loadStockDetails(stockId);
        this.loadStockNews(stockId);
      }
    });
  }

  loadStockDetails(id: string): void {
    this.loading = true;
    this.apiService.getStockById(id).subscribe(stock => {
      this.stock = stock;
      this.loading = false;
    });
  }

  loadStockNews(id: string): void {
    this.loadingNews = true;
    this.apiService.getNewsForStock(id).subscribe(news => {
      this.relatedNews = news;
      this.loadingNews = false;
    });
  }

  formatLargeNumber(num?: number): string {
    if (num === undefined) return 'N/A';
    
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(2) + 'B';
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + 'K';
    }
    return num.toString();
  }
}