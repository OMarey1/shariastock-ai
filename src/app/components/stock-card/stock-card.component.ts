import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Stock } from '../../models/stock.model';

@Component({
  selector: 'app-stock-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="stock-card card" [routerLink]="['/stock', stock.id]">
      <div class="stock-header">
        <div class="stock-code">{{ stock.code }}</div>
        <span class="badge" [ngClass]="stock.shariaStatus === 'Halal' ? 'badge-halal' : 'badge-haram'">
          {{ stock.shariaStatus }}
        </span>
      </div>
      <div class="stock-name">{{ stock.name }}</div>
      <div class="stock-price">
        <span class="current-price">\${{ stock.price.toFixed(2) }}</span>
        <span class="price-change" [ngClass]="stock.change >= 0 ? 'positive' : 'negative'">
          {{ stock.change >= 0 ? '+' : '' }}{{ stock.change.toFixed(2) }} ({{ stock.changePercent.toFixed(2) }}%)
        </span>
      </div>
      <div class="stock-category">{{ stock.category }}</div>
    </div>
  `,
  styles: `
    .stock-card {
      padding: 16px;
      margin-bottom: 16px;
      width: 100%;
    }

    .stock-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .stock-code {
      font-weight: bold;
      font-size: 1.1rem;
    }

    .stock-name {
      font-size: 0.9rem;
      color: #666;
      margin-bottom: 12px;
    }

    .stock-price {
      margin-bottom: 8px;
    }

    .current-price {
      font-size: 1.2rem;
      font-weight: bold;
      margin-right: 8px;
    }

    .price-change {
      font-size: 0.9rem;
    }

    .positive {
      color: var(--halal-color);
    }

    .negative {
      color: var(--danger-color);
    }

    .stock-category {
      font-size: 0.8rem;
      color: #888;
    }
  `
})
export class StockCardComponent {
  @Input() stock!: Stock;
}