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
  // Additional fields from API
  symbol?: string;
  shortName?: string;
  longName?: string;
  totalAssets?: number;
  totalDebt?: number;
  cashAndCashEquivalents?: number;
  interestIncome?: number;
  totalRevenue?: number;
  nonOperatingIncomeNetOther?: number;
  accountsReceivable?: number;
  inventory?: number;
  propertyPlantEquipment?: number;
  totalLiabilities?: number;
}

export interface ShariaCompliance {
  standard: string;
  description: string;
  value: number;
  threshold: number;
  isCompliant: boolean;
  details?: string;
}