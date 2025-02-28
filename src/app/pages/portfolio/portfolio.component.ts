import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { Stock } from '../../models/stock.model';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';

interface PortfolioItem {
  stock: Stock;
  shares: number;
  purchasePrice: number;
  currentValue: number;
  profit: number;
  profitPercent: number;
}

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent],
  template: `
    <div class="portfolio-page">
      <div class="portfolio-header">
        <h2>Your Portfolio</h2>
        <p>Track your Sharia-compliant investments</p>
      </div>
      
      <div class="portfolio-summary">
        <div class="summary-card">
          <div class="summary-title">Total Value</div>
          <div class="summary-value">\${{ totalValue.toFixed(2) }}</div>
        </div>
        <div class="summary-card">
          <div class="summary-title">Total Profit/Loss</div>
          <div class="summary-value" [ngClass]="totalProfit >= 0 ? 'positive' : 'negative'">
            {{ totalProfit >= 0 ? '+' : '' }}\${{ totalProfit.toFixed(2) }}
            ({{ totalProfitPercent.toFixed(2) }}%)
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-title">Halal Stocks</div>
          <div class="summary-value">{{ halalStocksCount }} / {{ portfolio.length }}</div>
        </div>
      </div>
      
      <div class="portfolio-content">
        <app-loading-spinner *ngIf="loading" message="Loading your portfolio..."></app-loading-spinner>
        
        <div class="empty-portfolio" *ngIf="!loading && portfolio.length === 0">
          <p>Your portfolio is empty. Start by adding some Sharia-compliant stocks!</p>
          <a routerLink="/search" class="browse-button">Browse Stocks</a>
        </div>
        
        <div class="portfolio-table" *ngIf="!loading && portfolio.length > 0">
          <table>
            <thead>
              <tr>
                <th>Stock</th>
                <th>Status</th>
                <th>Shares</th>
                <th>Avg. Price</th>
                <th>Current Price</th>
                <th>Current Value</th>
                <th>Profit/Loss</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of portfolio" [routerLink]="['/stock', item.stock.id]">
                <td class="stock-info">
                  <div class="stock-code">{{ item.stock.code }}</div>
                  <div class="stock-name">{{ item.stock.name }}</div>
                </td>
                <td>
                  <span class="badge" [ngClass]="item.stock.shariaStatus === 'Halal' ? 'badge-halal' : 'badge-haram'">
                    {{ item.stock.shariaStatus }}
                  </span>
                </td>
                <td>{{ item.shares }}</td>
                <td>\${{ item.purchasePrice.toFixed(2) }}</td>
                <td>\${{ item.stock.price.toFixed(2) }}</td>
                <td>\${{ item.currentValue.toFixed(2) }}</td>
                <td [ngClass]="item.profit >= 0 ? 'positive' : 'negative'">
                  {{ item.profit >= 0 ? '+' : '' }}\${{ item.profit.toFixed(2) }}
                  ({{ item.profitPercent.toFixed(2) }}%)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: `
    .portfolio-page {
      padding: 20px 0;
    }

    .portfolio-header {
      margin-bottom: 20px;
      text-align: center;
    }

    .portfolio-header h2 {
      font-size: 1.8rem;
      color: var(--primary-color);
      margin-bottom: 8px;
    }

    .portfolio-header p {
      color: #666;
    }

    .portfolio-summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .summary-card {
      background: white;
      border-radius: 8px;
      box-shadow: var(--shadow);
      padding: 20px;
      text-align: center;
    }

    .summary-title {
      font-size: 1rem;
      color: #666;
      margin-bottom: 10px;
    }

    .summary-value {
      font-size: 1.8rem;
      font-weight: bold;
      color: #333;
    }

    .positive {
      color: var(--secondary-color);
    }

    .negative {
      color: var(--danger-color);
    }

    .portfolio-content {
      background: white;
      border-radius: 8px;
      box-shadow: var(--shadow);
      padding: 20px;
    }

    .empty-portfolio {
      padding: 30px;
      text-align: center;
      color: #666;
    }

    .browse-button {
      display: inline-block;
      background-color: var(--primary-color);
      color: white;
      padding: 10px 20px;
      border-radius: 4px;
      margin-top: 15px;
      text-decoration: none;
      transition: background-color 0.3s;
    }

    .browse-button:hover {
      background-color: #34495e;
    }

    .portfolio-table {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th {
      text-align: left;
      padding: 12px 15px;
      background-color: #f8f9fa;
      color: #333;
      font-weight: 600;
      border-bottom: 2px solid #eee;
    }

    td {
      padding: 12px 15px;
      border-bottom: 1px solid #eee;
    }

    tbody tr {
      cursor: pointer;
      transition: background-color 0.3s;
    }

    tbody tr:hover {
      background-color: #f8f9fa;
    }

    .stock-info {
      display: flex;
      flex-direction: column;
    }

    .stock-code {
      font-weight: bold;
      color: #333;
    }

    .stock-name {
      font-size: 0.9rem;
      color: #666;
    }

    .badge {
      display: inline-block;
      padding: 4px 8px;
      font-size: 0.8rem;
    }
  `
})
export class PortfolioComponent implements OnInit {
  portfolio: PortfolioItem[] = [];
  loading: boolean = true;
  totalValue: number = 0;
  totalProfit: number = 0;
  totalProfitPercent: number = 0;
  halalStocksCount: number = 0;

  constructor(
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.loadPortfolio();
  }

  loadPortfolio(): void {
    this.loading = true;
    
    // In a real app, you would fetch the user's portfolio from an API
    // For demo purposes, we'll create a mock portfolio using the stocks from the API service
    this.apiService.getStocks().subscribe(stocks => {
      // Create a mock portfolio with random shares and purchase prices
      this.portfolio = stocks.slice(0, 3).map(stock => {
        const shares = Math.floor(Math.random() * 20) + 1;
        const purchasePrice = stock.price * (1 - (Math.random() * 0.2 - 0.1)); // +/- 10%
        const currentValue = shares * stock.price;
        const profit = currentValue - (shares * purchasePrice);
        const profitPercent = (profit / (shares * purchasePrice)) * 100;
        
        return {
          stock,
          shares,
          purchasePrice,
          currentValue,
          profit,
          profitPercent
        };
      });
      
      // Calculate summary statistics
      this.calculateSummary();
      this.loading = false;
    });
  }

  calculateSummary(): void {
    this.totalValue = this.portfolio.reduce((sum, item) => sum + item.currentValue, 0);
    
    const totalCost = this.portfolio.reduce((sum, item) => sum + (item.shares * item.purchasePrice), 0);
    this.totalProfit = this.totalValue - totalCost;
    this.totalProfitPercent = totalCost > 0 ? (this.totalProfit / totalCost) * 100 : 0;
    
    this.halalStocksCount = this.portfolio.filter(item => item.stock.shariaStatus === 'Halal').length;
  }
}