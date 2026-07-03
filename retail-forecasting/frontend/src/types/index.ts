export interface Product {
  id: number;
  sku: string;
  name: string;
  brand?: string;
  category: string;
  sub_category?: string;
  price: number;
  discounted_price?: number;
  quantity?: string;
  description?: string;
  current_stock: number;
  salesHistory: { month: string; sales: number }[]; // Only used for UI mock chart currently
  image?: string;
}

export interface StockAlert {
  id: string;
  productId: string;
  productName: string;
  severity: 'low' | 'critical' | 'normal';
  currentStock: number;
  recommendedOrder: number;
}

export interface ForecastResult {
  productId: string;
  predictedDemand: number;
  confidence: number;
  models: {
    name: string;
    prediction: number;
  }[];
  explanation: string;
  recommendations: string[];
}

export interface AgentLog {
  id: string;
  agent: string;
  role: string;
  emoji: string;
  message: string;
  timestamp: string;
  color: string;
}
