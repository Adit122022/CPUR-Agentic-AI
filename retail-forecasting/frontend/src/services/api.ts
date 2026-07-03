const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  current_stock: number;
}

export interface SalesHistory {
  date: string;
  quantity: number;
}

export interface ForecastResult {
  id: number;
  product_id: number;
  forecast_date: string;
  predicted_quantity: number;
  model_used: string;
  agent_adjustments: string | null;
  adjusted_quantity: number | null;
}

export interface ForecastTriggerRequest {
  product_id: number;
  model_type: 'linear_regression' | 'decision_tree' | 'neural_network';
  use_agents: boolean;
}

export interface ForecastResponse {
  message: string;
  forecast: ForecastResult;
}

export const api = {
  getProducts: async (): Promise<Product[]> => {
    const res = await fetch(`${API_BASE_URL}/api/products`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  createProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
    const res = await fetch(`${API_BASE_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error('Failed to create product');
    return res.json();
  },

  getSalesHistory: async (productId: number): Promise<SalesHistory[]> => {
    const res = await fetch(`${API_BASE_URL}/api/forecast/history/${productId}`);
    if (!res.ok) throw new Error('Failed to fetch sales history');
    return res.json();
  },

  triggerForecast: async (req: ForecastTriggerRequest): Promise<ForecastResponse> => {
    const res = await fetch(`${API_BASE_URL}/api/forecast/trigger`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    if (!res.ok) throw new Error('Failed to trigger forecast');
    return res.json();
  },
};
