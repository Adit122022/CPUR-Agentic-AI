import type { Product, StockAlert } from '../types';

export const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'Smart Home Hub',
    category: 'Electronics',
    price: 129.99,
    stock: 145,
    image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?auto=format&fit=crop&q=80&w=400',
    salesHistory: [
      { month: 'Jan', sales: 120 }, { month: 'Feb', sales: 150 },
      { month: 'Mar', sales: 180 }, { month: 'Apr', sales: 140 },
      { month: 'May', sales: 210 }, { month: 'Jun', sales: 250 },
    ]
  },
  {
    id: 'p2',
    name: 'Wireless Earbuds Pro',
    category: 'Electronics',
    price: 199.99,
    stock: 45,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=400',
    salesHistory: [
      { month: 'Jan', sales: 300 }, { month: 'Feb', sales: 320 },
      { month: 'Mar', sales: 280 }, { month: 'Apr', sales: 410 },
      { month: 'May', sales: 390 }, { month: 'Jun', sales: 450 },
    ]
  },
  {
    id: 'p3',
    name: 'Ergonomic Office Chair',
    category: 'Furniture',
    price: 249.99,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=400',
    salesHistory: [
      { month: 'Jan', sales: 50 }, { month: 'Feb', sales: 65 },
      { month: 'Mar', sales: 80 }, { month: 'Apr', sales: 95 },
      { month: 'May', sales: 110 }, { month: 'Jun', sales: 140 },
    ]
  },
  {
    id: 'p4',
    name: 'Organic Cotton T-Shirt',
    category: 'Apparel',
    price: 29.99,
    stock: 530,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=400',
    salesHistory: [
      { month: 'Jan', sales: 800 }, { month: 'Feb', sales: 850 },
      { month: 'Mar', sales: 900 }, { month: 'Apr', sales: 1100 },
      { month: 'May', sales: 1300 }, { month: 'Jun', sales: 1500 },
    ]
  },
  {
    id: 'p5',
    name: 'Yoga Mat Premium',
    category: 'Fitness',
    price: 49.99,
    stock: 85,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&q=80&w=400',
    salesHistory: [
      { month: 'Jan', sales: 200 }, { month: 'Feb', sales: 210 },
      { month: 'Mar', sales: 250 }, { month: 'Apr', sales: 230 },
      { month: 'May', sales: 280 }, { month: 'Jun', sales: 310 },
    ]
  },
  {
    id: 'p6',
    name: 'Mechanical Keyboard',
    category: 'Electronics',
    price: 149.99,
    stock: 28,
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=400',
    salesHistory: [
      { month: 'Jan', sales: 150 }, { month: 'Feb', sales: 160 },
      { month: 'Mar', sales: 140 }, { month: 'Apr', sales: 180 },
      { month: 'May', sales: 200 }, { month: 'Jun', sales: 220 },
    ]
  }
];

export const mockStockAlerts: StockAlert[] = [
  {
    id: 'a1',
    productId: 'p3',
    productName: 'Ergonomic Office Chair',
    severity: 'critical',
    currentStock: 12,
    recommendedOrder: 50
  },
  {
    id: 'a2',
    productId: 'p6',
    productName: 'Mechanical Keyboard',
    severity: 'critical',
    currentStock: 28,
    recommendedOrder: 100
  },
  {
    id: 'a3',
    productId: 'p2',
    productName: 'Wireless Earbuds Pro',
    severity: 'low',
    currentStock: 45,
    recommendedOrder: 200
  },
  {
    id: 'a4',
    productId: 'p5',
    productName: 'Yoga Mat Premium',
    severity: 'low',
    currentStock: 85,
    recommendedOrder: 150
  }
];
