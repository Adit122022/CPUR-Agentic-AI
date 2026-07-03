
import type { Product } from '../types/products.types';
export const fetchProductsAPI = async (): Promise<Product[]> => {
  const response = await fetch('http://localhost:8000/api/products');
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
};
