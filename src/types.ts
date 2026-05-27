export interface BabyProduct {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  price: number; // in Local Currency (e.g., SAR)
  priceUsd: number; // original price on CJ/Ali
  source: 'AliExpress' | 'CJDropshipping' | 'Manual';
  sourceUrl: string;
  imageUrl: string;
  category: string;
  stock: number;
  ageGroup: string;
  safetyRating: string; // e.g. "خامات طبية خالية من BPA"
  features: string[];
  specs: { [key: string]: string };
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  items: {
    product: BabyProduct;
    quantity: number;
  }[];
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'fulfilled';
  date: string;
  dropshipSource: 'AliExpress' | 'CJDropshipping' | 'None';
  trackingNumber?: string;
  syncAttempts?: number;
}

export interface ImportConfig {
  markupMultiplier: number; // default e.g. 1.8
  targetCurrency: 'SAR' | 'AED' | 'USD';
  autoFulfill: boolean;
  defaultStock: number;
}

export interface SyncLog {
  id: string;
  timestamp: string;
  type: 'import' | 'fulfill' | 'inventory_sync';
  platform: 'AliExpress' | 'CJDropshipping';
  status: 'success' | 'warning' | 'error';
  message: string;
}
