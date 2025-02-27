import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Stock } from '../models/stock.model';
import { News } from '../models/news.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Mock data for demonstration purposes
  private mockStocks: Stock[] = [
    {
      id: '1',
      code: 'AAPL',
      name: 'Apple Inc.',
      price: 175.34,
      change: 2.45,
      changePercent: 1.42,
      category: 'Technology',
      shariaStatus: 'Haram',
      description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.',
      marketCap: 2850000000000,
      volume: 58000000,
      peRatio: 28.5,
      dividend: 0.82,
      sector: 'Technology',
      industry: 'Consumer Electronics'
    },
    {
      id: '2',
      code: 'MSFT',
      name: 'Microsoft Corporation',
      price: 325.76,
      change: -1.23,
      changePercent: -0.38,
      category: 'Technology',
      shariaStatus: 'Haram',
      description: 'Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide.',
      marketCap: 2420000000000,
      volume: 25000000,
      peRatio: 34.2,
      dividend: 0.94,
      sector: 'Technology',
      industry: 'Software'
    },
    {
      id: '3',
      code: 'ADNOC',
      name: 'ADNOC Drilling',
      price: 42.15,
      change: 0.85,
      changePercent: 2.06,
      category: 'Energy',
      shariaStatus: 'Halal',
      description: 'ADNOC Drilling Company is the largest drilling company in the Middle East by fleet size.',
      marketCap: 67500000000,
      volume: 12000000,
      peRatio: 18.2,
      dividend: 3.5,
      sector: 'Energy',
      industry: 'Oil & Gas'
    },
    {
      id: '4',
      code: 'AMZN',
      name: 'Amazon.com Inc.',
      price: 132.65,
      change: 1.05,
      changePercent: 0.80,
      category: 'Consumer Discretionary',
      shariaStatus: 'Haram',
      description: 'Amazon.com, Inc. engages in the retail sale of consumer products and subscriptions in North America and internationally.',
      marketCap: 1350000000000,
      volume: 35000000,
      peRatio: 40.8,
      dividend: 0,
      sector: 'Consumer Discretionary',
      industry: 'Internet Retail'
    },
    {
      id: '5',
      code: 'SABIC',
      name: 'Saudi Basic Industries',
      price: 98.30,
      change: -0.45,
      changePercent: -0.46,
      category: 'Materials',
      shariaStatus: 'Halal',
      description: 'Saudi Basic Industries Corporation (SABIC) is a diversified manufacturing company, active in chemicals and intermediates, industrial polymers, fertilizers, and metals.',
      marketCap: 294900000000,
      volume: 8500000,
      peRatio: 22.4,
      dividend: 4.2,
      sector: 'Materials',
      industry: 'Chemicals'
    }
  ];

  private mockNews: News[] = [
    {
      id: '1',
      title: 'Apple Announces New Interest-Bearing Savings Account',
      content: 'Apple has announced a new high-yield savings account in partnership with Goldman Sachs, offering interest rates that exceed the national average.',
      source: 'TechCrunch',
      date: '2025-03-15',
      imageUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9',
      shariaStatus: 'Haram',
      relatedStocks: ['1']
    },
    {
      id: '2',
      title: 'Microsoft Completes Acquisition of Activision Blizzard',
      content: 'Microsoft has finally completed its $68.7 billion acquisition of gaming giant Activision Blizzard after clearing regulatory hurdles.',
      source: 'The Verge',
      date: '2025-03-14',
      imageUrl: 'https://images.unsplash.com/photo-1593642532744-d377ab507dc8',
      shariaStatus: 'Haram',
      relatedStocks: ['2']
    },
    {
      id: '3',
      title: 'ADNOC Drilling Secures $1.5 Billion Contract',
      content: 'ADNOC Drilling has secured a $1.5 billion contract to provide offshore drilling services, expanding its operations in the Gulf region.',
      source: 'Gulf Business',
      date: '2025-03-12',
      imageUrl: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3',
      shariaStatus: 'Halal',
      relatedStocks: ['3']
    },
    {
      id: '4',
      title: 'Amazon Launches New Payment System with Financing Options',
      content: 'Amazon has introduced a new payment system that includes financing options with interest for large purchases, raising concerns among Sharia-compliant investors.',
      source: 'Reuters',
      date: '2025-03-10',
      imageUrl: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2',
      shariaStatus: 'Haram',
      relatedStocks: ['4']
    },
    {
      id: '5',
      title: 'SABIC Invests in Sustainable Manufacturing Processes',
      content: 'Saudi Basic Industries Corporation (SABIC) has announced a major investment in sustainable manufacturing processes, aligning with Sharia principles of environmental stewardship.',
      source: 'Saudi Gazette',
      date: '2025-03-08',
      imageUrl: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce',
      shariaStatus: 'Halal',
      relatedStocks: ['5']
    }
  ];

  constructor() {}

  // In a real application, these would make actual HTTP requests to an API
  getStocks(searchTerm: string = '', category: string = ''): Observable<Stock[]> {
    let filteredStocks = this.mockStocks;
    
    if (searchTerm) {
      searchTerm = searchTerm.toLowerCase();
      filteredStocks = filteredStocks.filter(stock => 
        stock.name.toLowerCase().includes(searchTerm) || 
        stock.code.toLowerCase().includes(searchTerm)
      );
    }
    
    if (category) {
      filteredStocks = filteredStocks.filter(stock => stock.category === category);
    }
    
    // Simulate API delay
    return of(filteredStocks).pipe(delay(300));
  }

  getStockById(id: string): Observable<Stock | undefined> {
    const stock = this.mockStocks.find(s => s.id === id);
    return of(stock).pipe(delay(300));
  }

  getNews(): Observable<News[]> {
    return of(this.mockNews).pipe(delay(300));
  }

  getNewsForStock(stockId: string): Observable<News[]> {
    const relatedNews = this.mockNews.filter(news => 
      news.relatedStocks?.includes(stockId)
    );
    return of(relatedNews).pipe(delay(300));
  }

  getCategories(): Observable<string[]> {
    const categories = [...new Set(this.mockStocks.map(stock => stock.category))];
    return of(categories).pipe(delay(300));
  }
}