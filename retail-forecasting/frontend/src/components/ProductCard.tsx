import React from 'react';
import type { Product } from '../services/api';
import { Package, Tag, Archive } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, isSelected, onSelect }) => {
  const isLowStock = product.current_stock < 50;

  return (
    <div
      onClick={() => onSelect(product)}
      className={`relative overflow-hidden rounded-xl border p-5 transition-all duration-300 cursor-pointer backdrop-blur-md ${
        isSelected
          ? 'bg-indigo-600/10 border-indigo-500 shadow-lg shadow-indigo-500/10 translate-y-[-2px]'
          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
      }`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
      
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 rounded-lg bg-indigo-500/15 text-indigo-400">
          <Package className="w-5 h-5" />
        </div>
        <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/5">
          {product.sku}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-white mb-1 tracking-tight">{product.name}</h3>
      <p className="text-xs text-slate-400 mb-4 flex items-center gap-1">
        <Tag className="w-3.5 h-3.5" />
        {product.category}
      </p>

      <div className="flex items-end justify-between mt-auto">
        <div>
          <span className="text-xs text-slate-500 block">Price</span>
          <span className="text-xl font-bold text-white">${product.price.toFixed(2)}</span>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-500 block flex items-center gap-1 justify-end">
            <Archive className="w-3.5 h-3.5" />
            Stock
          </span>
          <span
            className={`text-sm font-semibold ${
              isLowStock ? 'text-rose-400 font-bold' : 'text-emerald-400'
            }`}
          >
            {product.current_stock} units
            {isLowStock && <span className="text-xs block text-rose-500">Low Stock</span>}
          </span>
        </div>
      </div>
    </div>
  );
};
