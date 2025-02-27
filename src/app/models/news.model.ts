export interface News {
  id: string;
  title: string;
  content: string;
  source: string;
  date: string;
  imageUrl: string;
  shariaStatus: 'Halal' | 'Haram';
  relatedStocks?: string[];
}