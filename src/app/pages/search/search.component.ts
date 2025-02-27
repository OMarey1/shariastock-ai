import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Stock } from '../../models/stock.model';
import { StockCardComponent } from '../../components/stock-card/stock-card.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, StockCardComponent],
  template: `
    <div class="search-page">
      <div class="search-header">
        <h2>Search Stocks</h2>
        <p>Find Sharia-compliant stocks for your investment portfolio</p>
      </div>

      <div class="search-container">
        <div class="search-filters">
          <div class="search-box">
            <input 
              type="text" 
              [(ngModel)]="searchTerm" 
              (input)="onSearch()"
              placeholder="Search by stock name or code"
            >
          </div>
          
          <div class="category-filter">
            <h3>Filter by Category</h3>
            <div class="category-list">
              <div class="category-item">
                <button 
                  [ngClass]="{'active': selectedCategory === ''}" 
                  (click)="filterByCategory('')"
                >
                  All Categories
                </button>
              </div>
              <div class="category-item" *ngFor="let category of categories">
                <button 
                  [ngClass]="{'active': selectedCategory === category}" 
                  (click)="filterByCategory(category)"
                >
                  {{ category }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="search-results">
          <div class="results-header">
            <h3>Results ({{ stocks.length }})</h3>
          </div>
          
          <div class="loading" *ngIf="loading">
            <p>Loading stocks...</p>
          </div>
          
          <div class="no-results" *ngIf="!loading && stocks.length === 0">
            <p>No stocks found matching your criteria.</p>
          </div>
          
          <div class="stocks-grid" *ngIf="!loading && stocks.length > 0">
            <app-stock-card *ngFor="let stock of stocks" [stock]="stock"></app-stock-card>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    .search-page {
      padding: 20px 0;
    }

    .search-header {
      margin-bottom: 20px;
      text-align: center;
    }

    .search-header h2 {
      font-size: 1.8rem;
      color: var(--primary-color);
      margin-bottom: 8px;
    }

    .search-header p {
      color: #666;
    }

    .search-container {
      display: grid;
      grid-template-columns: 250px 1fr;
      gap: 20px;
    }

    .search-filters {
      background: white;
      border-radius: 8px;
      box-shadow: var(--shadow);
      padding: 16px;
    }

    .search-box {
      margin-bottom: 20px;
    }

    .category-filter h3 {
      font-size: 1rem;
      margin-bottom: 10px;
    }

    .category-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .category-item button {
      width: 100%;
      text-align: left;
      background: none;
      color: #333;
      padding: 8px;
      border-radius: 4px;
    }

    .category-item button.active {
      background-color: var(--primary-color);
      color: white;
    }

    .search-results {
      background: white;
      border-radius: 8px;
      box-shadow: var(--shadow);
      padding: 16px;
    }

    .results-header {
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid #eee;
    }

    .loading, .no-results {
      padding: 20px;
      text-align: center;
      color: #666;
    }

    .stocks-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
    }

    @media (max-width: 768px) {
      .search-container {
        grid-template-columns: 1fr;
      }
    }
  `
})
export class SearchComponent implements OnInit {
  stocks: Stock[] = [];
  categories: string[] = [];
  searchTerm: string = '';
  selectedCategory: string = '';
  loading: boolean = true;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadStocks();
  }

  loadCategories(): void {
    this.apiService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  loadStocks(): void {
    this.loading = true;
    this.apiService.getStocks(this.searchTerm, this.selectedCategory).subscribe(stocks => {
      this.stocks = stocks;
      this.loading = false;
    });
  }

  onSearch(): void {
    this.loadStocks();
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.loadStocks();
  }
}