export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  salesHistory: { month: string; sales: number }[];
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
