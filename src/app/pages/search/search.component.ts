import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Stock } from '../../models/stock.model';
import { StockCardComponent } from '../../components/stock-card/stock-card.component';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, StockCardComponent, LoadingSpinnerComponent],
  template: `
    <div class="search-page">
      <div class="background-animation" #backgroundAnimation></div>
      
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
              (input)="searchTermChanged()"
              placeholder="Search by stock name or code"
            >
            <div class="search-icon">
              <i class="fas fa-search"></i>
            </div>
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
          
          <app-loading-spinner *ngIf="loading" message="Loading stocks..."></app-loading-spinner>
          
          <div class="no-results" *ngIf="!loading && stocks.length === 0">
            <p>No stocks found matching your criteria.</p>
          </div>
          
          <div class="stocks-grid" *ngIf="!loading && stocks.length > 0">
            <app-stock-card *ngFor="let stock of stocks; trackBy: trackByStockId" [stock]="stock"></app-stock-card>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    .search-page {
      padding: 20px 0;
      position: relative;
      overflow: hidden;
    }

    .background-animation {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.1;
    }

    .search-header {
      margin-bottom: 20px;
      text-align: center;
      animation: fadeInDown 0.8s ease;
    }

    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
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
      animation: fadeIn 1s ease;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .search-filters {
      background: white;
      border-radius: 8px;
      box-shadow: var(--shadow);
      padding: 16px;
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

    .search-box {
      margin-bottom: 20px;
      position: relative;
    }

    .search-box input {
      padding-right: 40px;
      transition: all 0.3s ease;
      border: 1px solid #ddd;
    }

    .search-box input:focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px rgba(44, 62, 80, 0.2);
    }

    .search-icon {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #999;
      transition: color 0.3s ease;
    }

    .search-box input:focus + .search-icon {
      color: var(--primary-color);
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
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .category-item button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s ease;
    }

    .category-item button:hover::before {
      left: 100%;
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

    .results-header {
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid #eee;
    }

    .no-results {
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
export class SearchComponent implements OnInit, AfterViewInit, OnDestroy {
  stocks: Stock[] = [];
  categories: string[] = [];
  searchTerm: string = '';
  selectedCategory: string = '';
  loading: boolean = true;
  
  private searchTerms = new Subject<string>();
  private destroy$ = new Subject<void>();
  private animationFrameId?: number;
  private resizeObserver?: ResizeObserver;
  
  @ViewChild('backgroundAnimation') backgroundAnimation!: ElementRef;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadStocks();
    
    // Set up debounced search
    this.searchTerms.pipe(
      takeUntil(this.destroy$),
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.loadStocks();
    });
  }

  ngAfterViewInit(): void {
    this.initBackgroundAnimation();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    // Clean up animation frame
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    
    // Clean up resize observer
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  searchTermChanged(): void {
    this.searchTerms.next(this.searchTerm);
  }

  initBackgroundAnimation(): void {
    // Wait for the DOM to be fully loaded
    setTimeout(() => {
      const container = this.backgroundAnimation.nativeElement;
      if (!container) return;
      
      const canvas = document.createElement('canvas');
      container.appendChild(canvas);
      
      canvas.width = container.offsetWidth || 300;
      canvas.height = container.offsetHeight || 500;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.warn('Canvas 2D context not supported');
        return;
      }
      
      // Reduce particle count for better performance
      const particles: any[] = [];
      const particleCount = 30; // Reduced from 50
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 3 + 1,
          color: i % 2 === 0 ? '#27ae60' : '#2c3e50',
          speedX: Math.random() * 0.3 - 0.15, // Reduced speed
          speedY: Math.random() * 0.3 - 0.15  // Reduced speed
        });
      }
      
      const drawParticles = () => {
        if (!ctx) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          ctx.fillStyle = particle.color;
          ctx.fill();
          
          // Update position
          particle.x += particle.speedX;
          particle.y += particle.speedY;
          
          // Bounce off edges
          if (particle.x < 0 || particle.x > canvas.width) {
            particle.speedX *= -1;
          }
          
          if (particle.y < 0 || particle.y > canvas.height) {
            particle.speedY *= -1;
          }
        });
        
        // Draw connections - only draw connections for particles that are close
        // This improves performance by reducing the number of lines drawn
        particles.forEach((particle, i) => {
          // Only check a subset of particles for connections
          for (let j = i + 1; j < Math.min(i + 10, particles.length); j++) {
            const otherParticle = particles[j];
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 80) { // Reduced connection distance
              ctx.beginPath();
              ctx.strokeStyle = `rgba(44, 62, 80, ${0.15 * (1 - distance / 80)})`; // Reduced opacity
              ctx.lineWidth = 1;
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.stroke();
            }
          }
        });
        
        this.animationFrameId = requestAnimationFrame(drawParticles);
      };
      
      drawParticles();
      
      // Handle resize with ResizeObserver
      this.resizeObserver = new ResizeObserver(() => {
        if (container) {
          canvas.width = container.offsetWidth || 300;
          canvas.height = container.offsetHeight || 500;
        }
      });
      
      this.resizeObserver.observe(container);
    }, 100); // Small delay to ensure DOM is ready
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

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.loadStocks();
  }
  
  // Track by function for ngFor to improve performance
  trackByStockId(index: number, stock: Stock): string {
    return stock.id;
  }
}