import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Sparkles } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Product } from '../types/products.types';
import { useProducts } from '../hook/useProducts';

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { products, loading } = useProducts();

  const uniqueProducts = products.reduce((acc, current) => {
    const x = acc.find(item => item.name === current.name);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, [] as Product[]);

  const categories = ['All', ...Array.from(new Set(uniqueProducts.map(p => p.category)))];

  const filteredProducts = uniqueProducts.filter(product => 
    (selectedCategory === 'All' || product.category === selectedCategory) &&
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockColor = (stock: number) => {
    if (stock > 100) return 'text-green-600 bg-green-50 dark:bg-green-900/30';
    if (stock > 50) return 'text-amber-600 bg-amber-50 dark:bg-amber-900/30';
    return 'text-red-600 bg-red-50 dark:bg-red-900/30';
  };

  const getFallbackImage = (product: Product) => {
    const shortName = product.name.split(' ').slice(0, 3).join(' ');
    const text = encodeURIComponent(shortName);
    return `https://placehold.co/400x400/312e81/ffffff/png?text=${text}`;
  };

  const getMockSalesHistory = () => {
    return [
      { month: 'Jan', sales: Math.floor(Math.random() * 200) + 50 },
      { month: 'Feb', sales: Math.floor(Math.random() * 200) + 50 },
      { month: 'Mar', sales: Math.floor(Math.random() * 200) + 50 },
      { month: 'Apr', sales: Math.floor(Math.random() * 200) + 50 },
      { month: 'May', sales: Math.floor(Math.random() * 200) + 50 },
      { month: 'Jun', sales: Math.floor(Math.random() * 200) + 50 },
    ];
  };

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="page-shell">
        <section className="mb-8 rounded-[2rem] border border-border-color/70 bg-[linear-gradient(135deg,rgba(197,190,106,0.16),transparent)] p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="eyebrow">
                <Sparkles className="h-3.5 w-3.5" />
                Inventory Intelligence
              </div>
              <h1 className="section-title mt-3">Product Catalog</h1>
              <p className="mt-2 max-w-2xl text-text-secondary">Manage and monitor your DMart inventory with a clearer, faster view.</p>
            </div>
            
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-full border border-border-color/60 bg-[var(--card-bg)] py-3 pl-10 pr-4 text-sm text-text-primary shadow-sm outline-none transition focus:ring-2 focus:ring-olive-300"
              />
            </div>
          </div>
        </section>

        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`relative rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === category ? 'bg-olive-100/80 text-olive-600 dark:bg-[#2a281f] dark:text-olive-300' : 'text-text-secondary hover:bg-[#f7f5dd] dark:hover:bg-slate-800'
              }`}
            >
              {category}
              {selectedCategory === category && (
                <motion.div
                  layoutId="category-indicator"
                  className="absolute inset-x-1 bottom-1 h-0.5 rounded-full bg-olive-300"
                  initial={false}
                />
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20 text-text-secondary">Loading DMart products...</div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            <AnimatePresence>
              {filteredProducts.map((product, idx) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.04 }}
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="glass-card group cursor-pointer overflow-hidden rounded-[1.4rem] border border-border-color/60 transition-all hover:-translate-y-1"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={product.image || getFallbackImage(product)} 
                      alt={product.name} 
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className={`absolute top-3 right-3 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-md ${getStockColor(product.current_stock)}`}>
                      {product.current_stock} in stock
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="mb-1 text-xs uppercase tracking-[0.25em] text-text-secondary">{product.brand || product.category}</p>
                    <h3 className="mb-2 line-clamp-1 text-lg font-semibold text-text-primary" title={product.name}>{product.name}</h3>
                    <div className="flex items-center gap-2">
                      <p className="text-xl font-semibold text-olive-400">₹{product.discounted_price || product.price}</p>
                      {product.discounted_price && product.discounted_price < product.price && (
                        <p className="text-sm text-text-secondary line-through">₹{product.price}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        <AnimatePresence>
          {selectedProduct && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
              onClick={() => setSelectedProduct(null)}
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-card max-h-[90vh] w-full max-w-2xl overflow-hidden overflow-y-auto rounded-[1.8rem] shadow-2xl"
              >
                <div className="relative h-64">
                  <img src={selectedProduct.image || getFallbackImage(selectedProduct)} alt={selectedProduct.name} className="h-full w-full object-cover" />
                  <button 
                    onClick={() => setSelectedProduct(null)}
                    className="absolute top-4 right-4 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-text-primary">{selectedProduct.name}</h2>
                      <p className="text-text-secondary">{selectedProduct.brand} • {selectedProduct.category}</p>
                      {selectedProduct.quantity && <p className="mt-1 text-sm text-text-secondary">Pack Size: {selectedProduct.quantity}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-olive-400">₹{selectedProduct.discounted_price || selectedProduct.price}</p>
                      <p className={`mt-1 text-sm font-medium ${selectedProduct.current_stock > 100 ? 'text-green-600' : selectedProduct.current_stock > 50 ? 'text-amber-600' : 'text-red-600'}`}>
                        {selectedProduct.current_stock} units available
                      </p>
                    </div>
                  </div>

                  {selectedProduct.description && (
                    <div className="mb-6">
                      <h3 className="mb-2 text-sm font-bold text-text-primary">Description</h3>
                      <p className="text-sm leading-relaxed text-text-secondary line-clamp-3">{selectedProduct.description}</p>
                    </div>
                  )}

                  <div className="mt-8">
                    <h3 className="mb-4 text-lg font-bold text-text-primary">Simulated Sales History</h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={selectedProduct.salesHistory || getMockSalesHistory()}>
                          <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                          <XAxis dataKey="month" stroke="#9ca3af" />
                          <YAxis stroke="#9ca3af" />
                          <Tooltip 
                            contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                            itemStyle={{ color: '#6366f1' }}
                          />
                          <Area type="monotone" dataKey="sales" stroke="#6366f1" fillOpacity={1} fill="url(#colorSales)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
