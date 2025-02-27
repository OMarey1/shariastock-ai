import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { News } from '../../models/news.model';

@Component({
  selector: 'app-news-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="news-card card">
      <div class="news-image">
        <img [src]="news.imageUrl" alt="{{ news.title }}">
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
      </div>
    </div>
  `,
  styles: `
    .news-card {
      display: flex;
      flex-direction: column;
      margin-bottom: 20px;
      overflow: hidden;
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
    }

    .news-image .badge {
      position: absolute;
      top: 10px;
      right: 10px;
    }

    .news-content {
      padding: 16px;
    }

    .news-title {
      margin-bottom: 8px;
      font-size: 1.1rem;
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
    }
  `
})
export class NewsCardComponent {
  @Input() news!: News;
}