import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
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
      <div class="stock-chart">
        <div class="chart-line" [ngClass]="stock.change >= 0 ? 'positive-chart' : 'negative-chart'"></div>
      </div>
    </div>
  `,
  styles: `
    .stock-card {
      padding: 16px;
      margin-bottom: 16px;
      width: 100%;
      transition: all 0.3s ease;
      border-left: 4px solid transparent;
      will-change: transform, box-shadow;
    }

    .stock-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
      border-left: 4px solid var(--primary-color);
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
      position: relative;
      display: inline-block;
    }

    .stock-code::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 2px;
      background-color: var(--primary-color);
      transition: width 0.3s ease;
    }

    .stock-card:hover .stock-code::after {
      width: 100%;
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
      transition: all 0.3s ease;
    }

    .stock-card:hover .price-change.positive {
      color: var(--secondary-color);
      font-weight: bold;
    }

    .stock-card:hover .price-change.negative {
      color: var(--danger-color);
      font-weight: bold;
    }

    .positive {
      color: var(--secondary-color);
    }

    .negative {
      color: var(--danger-color);
    }

    .stock-category {
      font-size: 0.8rem;
      color: #888;
      margin-bottom: 10px;
    }

    .stock-chart {
      height: 30px;
      position: relative;
      overflow: hidden;
    }

    .chart-line {
      position: absolute;
      top: 50%;
      left: 0;
      width: 0;
      height: 2px;
      transform: translateY(-50%);
      transition: width 1s ease;
    }

    .stock-card:hover .chart-line {
      width: 100%;
    }

    .positive-chart {
      background: linear-gradient(90deg, transparent, var(--secondary-color));
    }

    .negative-chart {
      background: linear-gradient(90deg, transparent, var(--danger-color));
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StockCardComponent {
  @Input() stock!: Stock;
}