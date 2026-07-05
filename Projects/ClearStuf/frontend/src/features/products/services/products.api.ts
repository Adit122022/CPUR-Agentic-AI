
import { API_BASE_URL } from '../../../services/api';
import type { Product } from '../types/products.types';
export const fetchProductsAPI = async (): Promise<Product[]> => {
  const response = await fetch(`${API_BASE_URL}/api/products`);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
};
