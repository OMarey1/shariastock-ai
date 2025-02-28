import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { News } from '../../models/news.model';

@Component({
  selector: 'app-news-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="news-card card">
      <div class="news-image">
        <img [src]="news.imageUrl" alt="{{ news.title }}" loading="lazy">
        <span class="badge" [ngClass]="news.shariaStatus === 'Halal' ? 'badge-halal' : 'badge-haram'">
          {{ news.shariaStatus }}
        </span>
      </div>
      <div class="news-content">
        <h3 class="news-title">{{ news.title }}</h3>
        <div class="news-meta">
          <span class="news-source">{{ news.source }}</span>
          <span class="news-date">{{ news.date | date }}</span>
        </div>
        <p class="news-excerpt">{{ news.content | slice:0:150 }}...</p>
        <div class="read-more">Read More</div>
      </div>
    </div>
  `,
  styles: `
    .news-card {
      display: flex;
      flex-direction: column;
      margin-bottom: 20px;
      overflow: hidden;
      transition: all 0.3s ease;
      will-change: transform, box-shadow;
    }

    .news-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }

    .news-image {
      position: relative;
      height: 180px;
      overflow: hidden;
    }

    .news-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .news-card:hover .news-image img {
      transform: scale(1.05);
    }

    .news-image .badge {
      position: absolute;
      top: 10px;
      right: 10px;
      z-index: 1;
      transition: transform 0.3s ease;
    }

    .news-card:hover .news-image .badge {
      transform: translateY(-3px);
    }

    .news-content {
      padding: 16px;
      position: relative;
    }

    .news-title {
      margin-bottom: 8px;
      font-size: 1.1rem;
      position: relative;
      display: inline-block;
      transition: color 0.3s ease;
    }

    .news-card:hover .news-title {
      color: var(--primary-color);
    }

    .news-meta {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      font-size: 0.8rem;
      color: #666;
    }

    .news-excerpt {
      font-size: 0.9rem;
      color: #333;
      line-height: 1.5;
      margin-bottom: 15px;
    }

    .read-more {
      color: var(--primary-color);
      font-size: 0.9rem;
      font-weight: 500;
      position: relative;
      display: inline-block;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .read-more::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 2px;
      background-color: var(--primary-color);
      transition: width 0.3s ease;
    }

    .news-card:hover .read-more::after {
      width: 100%;
    }

    .news-card:hover .read-more {
      color: var(--secondary-color);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewsCardComponent {
  @Input() news!: News;
}