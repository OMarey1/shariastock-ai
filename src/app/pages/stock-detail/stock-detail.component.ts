import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Stock } from '../../models/stock.model';
import { News } from '../../models/news.model';
import { NewsCardComponent } from '../../components/news-card/news-card.component';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-stock-detail',
  standalone: true,
  imports: [CommonModule, NewsCardComponent, LoadingSpinnerComponent],
  template: `
    <div class="stock-detail-page">
      <app-loading-spinner *ngIf="loading" message="Loading stock details..."></app-loading-spinner>
      
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
        
        <div class="stock-chart">
          <div class="chart-placeholder">
            <div class="chart-line" [ngClass]="stock.change >= 0 ? 'positive-chart' : 'negative-chart'"></div>
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
          
          <app-loading-spinner *ngIf="loadingNews" message="Loading news..."></app-loading-spinner>
          
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

    .not-found {
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
      animation: slideUp 0.8s ease;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .stock-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid #eee;
      animation: slideInLeft 0.8s ease;
    }

    @keyframes slideInLeft {
      from {
        opacity: 0;
        transform: translateX(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
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
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
      100% {
        transform: scale(1);
      }
    }

    .stock-price-section {
      margin-bottom: 24px;
      animation: slideInRight 0.8s ease;
    }

    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .current-price {
      font-size: 2.5rem;
      font-weight: bold;
      margin-bottom: 4px;
    }

    .price-change {
      font-size: 1.2rem;
      transition: all 0.3s ease;
    }

    .price-change:hover {
      transform: translateY(-2px);
    }

    .positive {
      color: var(--secondary-color);
    }

    .negative {
      color: var(--danger-color);
    }

    .stock-chart {
      margin-bottom: 24px;
      animation: fadeIn 1s ease;
      animation-delay: 0.3s;
      animation-fill-mode: both;
    }

    .chart-placeholder {
      height: 200px;
      background-color: #f8f9fa;
      border-radius: 8px;
      position: relative;
      overflow: hidden;
    }

    .chart-line {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 100%;
      animation: chartDraw 2s ease forwards;
      animation-delay: 0.5s;
    }

    @keyframes chartDraw {
      to {
        width: 100%;
      }
    }

    .positive-chart {
      background: linear-gradient(90deg, transparent, rgba(39, 174, 96, 0.2));
    }

    .negative-chart {
      background: linear-gradient(90deg, transparent, rgba(231, 76, 60, 0.2));
    }

    .stock-details {
      margin-bottom: 24px;
      animation: fadeIn 1s ease;
      animation-delay: 0.5s;
      animation-fill-mode: both;
    }

    .detail-section {
      margin-bottom: 20px;
    }

    .detail-section h3 {
      font-size: 1.3rem;
      margin-bottom: 12px;
      color: var(--primary-color);
      position: relative;
      display: inline-block;
    }

    .detail-section h3::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 40px;
      height: 2px;
      background-color: var(--secondary-color);
      transition: width 0.3s ease;
    }

    .detail-section h3:hover::after {
      width: 100%;
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
      transition: all 0.3s ease;
    }

    .stat-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      background-color: white;
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
      position: relative;
      display: inline-block;
    }

    .stock-news h3::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 40px;
      height: 2px;
      background-color: var(--secondary-color);
      transition: width 0.3s ease;
    }

    .stock-news h3:hover::after {
      width: 100%;
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
      animation: fadeIn 1s ease;
      animation-delay: 0.7s;
      animation-fill-mode: both;
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