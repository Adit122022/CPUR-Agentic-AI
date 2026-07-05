
export interface Product {
  id: number;
  name: string;
  sku: string;
  description?: string;
  category: string;
  brand: string;
  price: number;
  discounted_price?: number;
  current_stock: number;
  image?: string;
  quantity?: string;
  salesHistory?: { month: string; sales: number }[];
}
