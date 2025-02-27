export interface Stock {
  id: string;
  code: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  category: string;
  shariaStatus: 'Halal' | 'Haram';
  description?: string;
  marketCap?: number;
  volume?: number;
  peRatio?: number;
  dividend?: number;
  sector?: string;
  industry?: string;
}