import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
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
    if (stock > 100) return 'text-green-500 bg-green-50 dark:bg-green-900/30';
    if (stock > 50) return 'text-amber-500 bg-amber-50 dark:bg-amber-900/30';
    return 'text-red-500 bg-red-50 dark:bg-red-900/30';
  };

  const getFallbackImage = (product: Product) => {
    // Since we do not have a real database of 300+ DMart photos, 
    // we use a clean placeholder that prominently displays the exact product name.
    const shortName = product.name.split(' ').slice(0, 3).join(' ');
    const text = encodeURIComponent(shortName);
    return `https://placehold.co/400x400/312e81/ffffff/png?text=${text}`;
  };

  // Mock sales history since the backend API for products doesn't include it in this endpoint yet
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
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-gothic text-text-primary uppercase mb-2">Product Catalog</h1>
          <p className="text-text-secondary mt-1 font-pixel text-xs tracking-widest uppercase">Manage and monitor your DMart inventory.</p>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary h-5 w-5" />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 glass-card rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex space-x-1 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`relative px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
              selectedCategory === category ? 'text-[var(--color-olive-400)] dark:text-indigo-400' : 'text-text-secondary hover:bg-gray-100 dark:hover:bg-slate-800'
            }`}
          >
            {category}
            {selectedCategory === category && (
              <motion.div
                layoutId="category-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-olive-300)]"
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredProducts.map((product, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.05 }}
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="glass-card rounded-xl overflow-hidden cursor-pointer group hover:-translate-y-2 transition-transform"
              >
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={product.image || getFallbackImage(product)} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold backdrop-blur-md ${getStockColor(product.current_stock)}`}>
                    {product.current_stock} in stock
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">{product.brand || product.category}</p>
                  <h3 className="text-lg font-bold text-text-primary mb-2 line-clamp-1" title={product.name}>{product.name}</h3>
                  <div className="flex items-center gap-2">
                    <p className="text-xl font-semibold text-[var(--color-olive-400)] dark:text-indigo-400">₹{product.discounted_price || product.price}</p>
                    {product.discounted_price && product.discounted_price < product.price && (
                      <p className="text-sm line-through text-text-secondary">₹{product.price}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl bg-card-bg max-h-[90vh] overflow-y-auto"
            >
              <div className="relative h-64">
                <img src={selectedProduct.image || getFallbackImage(selectedProduct)} alt={selectedProduct.name} className="w-full h-full object-cover" />
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-text-primary">{selectedProduct.name}</h2>
                    <p className="text-text-secondary">{selectedProduct.brand} • {selectedProduct.category}</p>
                    {selectedProduct.quantity && <p className="text-sm text-text-secondary mt-1">Pack Size: {selectedProduct.quantity}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[var(--color-olive-400)] dark:text-indigo-400">₹{selectedProduct.discounted_price || selectedProduct.price}</p>
                    <p className={`text-sm mt-1 font-medium ${selectedProduct.current_stock > 100 ? 'text-green-500' : selectedProduct.current_stock > 50 ? 'text-amber-500' : 'text-red-500'}`}>
                      {selectedProduct.current_stock} units available
                    </p>
                  </div>
                </div>

                {selectedProduct.description && (
                  <div className="mb-6">
                    <h3 className="text-sm font-bold text-text-primary mb-2">Description</h3>
                    <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">{selectedProduct.description}</p>
                  </div>
                )}

                <div className="mt-8">
                  <h3 className="text-lg font-bold text-text-primary mb-4">Simulated Sales History</h3>
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
  );
}
