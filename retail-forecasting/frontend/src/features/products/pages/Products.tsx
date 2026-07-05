import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Sparkles, TrendingUp, ChevronDown, ChevronRight, LayoutGrid, List } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Product } from '../types/products.types';
import { useProducts } from '../hook/useProducts';
import { API_BASE_URL } from '../../../services/api';

interface SalesHistory {
  date: string;
  quantity: number;
}

// Category colour palette (cycles for any number of categories)
const CATEGORY_COLORS = [
  { bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-600 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-700/50', dot: 'bg-indigo-400' },
  { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-700/50', dot: 'bg-emerald-400' },
  { bg: 'bg-amber-50 dark:bg-amber-900/20',   text: 'text-amber-600 dark:text-amber-300',   border: 'border-amber-200 dark:border-amber-700/50',   dot: 'bg-amber-400' },
  { bg: 'bg-rose-50 dark:bg-rose-900/20',     text: 'text-rose-600 dark:text-rose-300',     border: 'border-rose-200 dark:border-rose-700/50',     dot: 'bg-rose-400' },
  { bg: 'bg-violet-50 dark:bg-violet-900/20', text: 'text-violet-600 dark:text-violet-300', border: 'border-violet-200 dark:border-violet-700/50', dot: 'bg-violet-400' },
  { bg: 'bg-cyan-50 dark:bg-cyan-900/20',     text: 'text-cyan-600 dark:text-cyan-300',     border: 'border-cyan-200 dark:border-cyan-700/50',     dot: 'bg-cyan-400' },
  { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-300', border: 'border-orange-200 dark:border-orange-700/50', dot: 'bg-orange-400' },
  { bg: 'bg-teal-50 dark:bg-teal-900/20',     text: 'text-teal-600 dark:text-teal-300',     border: 'border-teal-200 dark:border-teal-700/50',     dot: 'bg-teal-400' },
];

export default function Products() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grouped' | 'flat'>('grouped');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [salesHistory, setSalesHistory] = useState<SalesHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const { products, loading } = useProducts();

  // Deduplicate by ID (not by name — products are unique database rows)
  const uniqueProducts = Array.from(new Map(products.map(p => [p.id, p])).values());

  // All distinct categories sorted alphabetically
  const allCategories = Array.from(new Set(uniqueProducts.map(p => p.category))).sort();
  const categoryColorMap = Object.fromEntries(
    allCategories.map((cat, i) => [cat, CATEGORY_COLORS[i % CATEGORY_COLORS.length]])
  );

  // Products matching current filters
  const filteredProducts = uniqueProducts.filter(product =>
    (selectedCategory === 'All' || product.category === selectedCategory) &&
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group filtered products by category
  const groupedProducts: Record<string, Product[]> = {};
  filteredProducts.forEach(product => {
    if (!groupedProducts[product.category]) groupedProducts[product.category] = [];
    groupedProducts[product.category].push(product);
  });
  const sortedGroupKeys = Object.keys(groupedProducts).sort();

  const toggleCategory = (cat: string) => {
    setCollapsedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const getStockState = (stock: number) => {
    if (stock > 100) return { label: 'Healthy',      color: 'text-green-600 bg-green-50 dark:bg-green-900/30' };
    if (stock > 50)  return { label: 'Watchlist',    color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30' };
    return               { label: 'Restock soon', color: 'text-red-600 bg-red-50 dark:bg-red-900/30' };
  };

  const getFallbackImage = (product: Product) => {
    const shortName = product.name.split(' ').slice(0, 3).join(' ');
    return `https://placehold.co/400x400/312e81/ffffff/png?text=${encodeURIComponent(shortName)}`;
  };

  useEffect(() => {
    if (!selectedProduct) { setSalesHistory([]); return; }
    setLoadingHistory(true);
    fetch(`${API_BASE_URL}/api/forecast/history/${selectedProduct.id}`)
      .then(r => r.json())
      .then((data: SalesHistory[]) => {
        setSalesHistory(data.slice(-30).map(d => ({ date: d.date.slice(5), quantity: d.quantity })));
      })
      .catch(() => setSalesHistory([]))
      .finally(() => setLoadingHistory(false));
  }, [selectedProduct?.id]);

  /* ── Product Card ─────────────────────────────────────────────────── */
  const ProductCard = ({ product, idx }: { product: Product; idx: number }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: idx * 0.03 }}
      key={product.id}
      onClick={() => setSelectedProduct(product)}
      className="glass-card group cursor-pointer overflow-hidden rounded-[1.4rem] border border-border-color/60 transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-44 overflow-hidden bg-gray-100 dark:bg-slate-800">
        <img
          src={product.image || getFallbackImage(product)}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => { (e.target as HTMLImageElement).src = getFallbackImage(product); }}
        />
        <div className={`absolute top-3 right-3 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-md ${getStockState(product.current_stock).color}`}>
          {getStockState(product.current_stock).label}
        </div>
        {/* Category badge on card */}
        {viewMode === 'flat' && (
          <div className={`absolute bottom-3 left-3 rounded-full px-2 py-0.5 text-[10px] font-semibold ${categoryColorMap[product.category]?.bg} ${categoryColorMap[product.category]?.text} border ${categoryColorMap[product.category]?.border}`}>
            {product.category}
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="mb-1 text-xs uppercase tracking-[0.25em] text-text-secondary">{product.brand || product.category}</p>
        <h3 className="mb-2 line-clamp-1 text-base font-semibold text-text-primary" title={product.name}>{product.name}</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-lg font-semibold text-olive-500">₹{product.discounted_price || product.price}</p>
            {product.discounted_price && product.discounted_price < product.price && (
              <p className="text-xs text-text-secondary line-through">₹{product.price}</p>
            )}
          </div>
          <span className="text-xs text-text-secondary">{product.current_stock} units</span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="page-shell">

        {/* ── Header ── */}
        <section className="mb-8 rounded-[2rem] border border-border-color/70 bg-[linear-gradient(135deg,rgba(197,190,106,0.16),transparent)] p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="eyebrow">
                <Sparkles className="h-3.5 w-3.5" />
                Inventory Intelligence
              </div>
              <h1 className="section-title mt-3">Product Catalog</h1>
              <p className="mt-2 max-w-2xl text-text-secondary text-sm">
                Browse your product inventory by category. Click any product to see its sales history, then click <strong>Forecast →</strong> to get demand predictions.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* View mode toggle */}
              <div className="flex rounded-xl border border-border-color/60 bg-[var(--card-bg)] p-1">
                <button
                  onClick={() => setViewMode('grouped')}
                  title="Grouped by category"
                  className={`rounded-lg p-2 transition-colors ${viewMode === 'grouped' ? 'bg-olive-100/80 text-olive-600 dark:bg-[#2a281f] dark:text-olive-300' : 'text-text-secondary hover:text-text-primary'}`}
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('flat')}
                  title="Flat grid"
                  className={`rounded-lg p-2 transition-colors ${viewMode === 'flat' ? 'bg-olive-100/80 text-olive-600 dark:bg-[#2a281f] dark:text-olive-300' : 'text-text-secondary hover:text-text-primary'}`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
              </div>
              {/* Search */}
              <div className="relative w-full lg:w-72">
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
          </div>
        </section>

        {/* ── Category filter pills ── */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === 'All' ? 'bg-olive-100/80 text-olive-600 dark:bg-[#2a281f] dark:text-olive-300' : 'text-text-secondary hover:bg-[#f7f5dd] dark:hover:bg-slate-800'
            }`}
          >
            All
            <span className="rounded-full bg-olive-200/60 px-1.5 py-0.5 text-[10px] font-semibold text-olive-700 dark:bg-olive-800/50 dark:text-olive-300">
              {uniqueProducts.length}
            </span>
            {selectedCategory === 'All' && (
              <motion.div layoutId="category-indicator" className="absolute inset-x-1 bottom-1 h-0.5 rounded-full bg-olive-300" initial={false} />
            )}
          </button>
          {allCategories.map((category) => {
            const colors = categoryColorMap[category];
            const count = uniqueProducts.filter(p => p.category === category).length;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`relative flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? `${colors.bg} ${colors.text} ${colors.border}`
                    : 'border-transparent text-text-secondary hover:bg-[#f7f5dd] dark:hover:bg-slate-800'
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${colors.dot}`} />
                {category}
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${selectedCategory === category ? `${colors.bg} ${colors.text}` : 'bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-slate-400'}`}>
                  {count}
                </span>
                {selectedCategory === category && (
                  <motion.div layoutId="category-indicator" className="absolute inset-x-1 bottom-1 h-0.5 rounded-full bg-olive-300" initial={false} />
                )}
              </button>
            );
          })}
        </div>

        {/* ── Stats row ── */}
        <div className="mb-8 flex flex-wrap items-center gap-4 text-sm text-text-secondary">
          <span>Showing <span className="font-semibold text-text-primary">{filteredProducts.length}</span> products</span>
          {selectedCategory === 'All' && (
            <>
              <span>•</span>
              <span><span className="font-semibold text-text-primary">{allCategories.length}</span> categories</span>
            </>
          )}
          <span>•</span>
          <span><span className="font-semibold text-red-500">{filteredProducts.filter(p => p.current_stock <= 20).length}</span> need reorder</span>
          <span>•</span>
          <span><span className="font-semibold text-amber-500">{filteredProducts.filter(p => p.current_stock > 20 && p.current_stock <= 50).length}</span> low stock</span>
        </div>

        {/* ── Product List ── */}
        {loading ? (
          <div className="flex justify-center py-20 text-text-secondary">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-text-secondary">
            <Search className="h-10 w-10 opacity-30" />
            <p className="text-lg font-medium">No products found</p>
            <p className="text-sm">Try a different search term or category.</p>
          </div>
        ) : viewMode === 'grouped' ? (
          /* ── GROUPED VIEW ── */
          <div className="space-y-10">
            {sortedGroupKeys.map((category) => {
              const colors = categoryColorMap[category];
              const catProducts = groupedProducts[category];
              const isCollapsed = collapsedCategories.has(category);
              return (
                <motion.section
                  key={category}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {/* Category header */}
                  <button
                    onClick={() => toggleCategory(category)}
                    className="group mb-4 flex w-full items-center gap-3 rounded-2xl border border-border-color/50 bg-[var(--card-bg)] px-5 py-3.5 text-left transition-all hover:border-border-color"
                  >
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${colors.bg} ${colors.text}`}>
                      {catProducts.length}
                    </span>
                    <div className="flex flex-1 items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${colors.dot}`} />
                      <h2 className="font-gothic text-base font-semibold uppercase tracking-[0.15em] text-text-primary">{category}</h2>
                      <span className={`ml-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${colors.bg} ${colors.text} ${colors.border}`}>
                        {catProducts.length} {catProducts.length === 1 ? 'product' : 'products'}
                      </span>
                    </div>
                    <motion.div
                      animate={{ rotate: isCollapsed ? -90 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-text-secondary"
                    >
                      <ChevronDown className="h-5 w-5" />
                    </motion.div>
                  </button>

                  {/* Products grid */}
                  <AnimatePresence initial={false}>
                    {!isCollapsed && (
                      <motion.div
                        key="grid"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                          {catProducts.map((product, idx) => (
                            <ProductCard key={product.id} product={product} idx={idx} />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.section>
              );
            })}
          </div>
        ) : (
          /* ── FLAT GRID VIEW ── */
          <motion.div layout className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence>
              {filteredProducts.map((product, idx) => (
                <ProductCard key={product.id} product={product} idx={idx} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── Product Detail Modal ── */}
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
                <div className="relative h-52 overflow-hidden bg-gray-100 dark:bg-slate-800">
                  <img
                    src={selectedProduct.image || getFallbackImage(selectedProduct)}
                    alt={selectedProduct.name}
                    className="h-full w-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = getFallbackImage(selectedProduct); }}
                  />
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="absolute top-4 right-4 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  {/* Category badge */}
                  <div className={`absolute top-4 left-4 flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-md ${categoryColorMap[selectedProduct.category]?.bg} ${categoryColorMap[selectedProduct.category]?.text} ${categoryColorMap[selectedProduct.category]?.border}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${categoryColorMap[selectedProduct.category]?.dot}`} />
                    {selectedProduct.category}
                  </div>
                  <div className={`absolute bottom-4 left-4 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-md ${getStockState(selectedProduct.current_stock).color}`}>
                    {getStockState(selectedProduct.current_stock).label}
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-bold text-text-primary">{selectedProduct.name}</h2>
                      <p className="text-text-secondary text-sm mt-1">{selectedProduct.brand} • {selectedProduct.category}</p>
                      {selectedProduct.quantity && <p className="mt-1 text-xs text-text-secondary">Pack Size: {selectedProduct.quantity}</p>}
                      <p className="mt-1 text-xs font-mono text-text-secondary">SKU: {selectedProduct.sku}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-2xl font-bold text-olive-500">₹{selectedProduct.discounted_price || selectedProduct.price}</p>
                      {selectedProduct.discounted_price && selectedProduct.discounted_price < selectedProduct.price && (
                        <p className="text-sm text-text-secondary line-through">₹{selectedProduct.price}</p>
                      )}
                      <p className={`mt-1 text-sm font-medium ${
                        selectedProduct.current_stock > 100 ? 'text-green-600' :
                        selectedProduct.current_stock > 50 ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {selectedProduct.current_stock} units in stock
                      </p>
                    </div>
                  </div>

                  {selectedProduct.description && (
                    <div className="mb-5">
                      <h3 className="mb-2 text-sm font-bold text-text-primary">Description</h3>
                      <p className="text-sm leading-relaxed text-text-secondary line-clamp-3">{selectedProduct.description}</p>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="mb-6 flex gap-3">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        setSelectedProduct(null);
                        navigate(`/forecast?product_id=${selectedProduct.id}`);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
                    >
                      <TrendingUp className="w-4 h-4" />
                      View Demand Forecast →
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedProduct(null)}
                      className="py-2.5 px-4 border border-border-color rounded-xl text-sm text-text-secondary hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      Close
                    </motion.button>
                  </div>

                  {/* Sales History Chart */}
                  <div>
                    <h3 className="mb-1 text-sm font-bold text-text-primary flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-olive-400" />
                      Last 30 Days — Actual Sales
                    </h3>
                    <p className="text-xs text-text-secondary mb-4">Daily units sold from your sales records</p>
                    <div className="h-52 w-full">
                      {loadingHistory ? (
                        <div className="h-full flex items-center justify-center text-text-secondary text-sm">Loading sales data...</div>
                      ) : salesHistory.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={salesHistory}>
                            <defs>
                              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%"  stopColor="#a3a833" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#a3a833" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                            <XAxis dataKey="date" stroke="#9ca3af" tick={{ fontSize: 10 }} interval={6} />
                            <YAxis stroke="#9ca3af" tick={{ fontSize: 10 }} />
                            <Tooltip
                              contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)', borderRadius: '12px' }}
                              formatter={(v: any) => [`${v} units`, 'Sales']}
                            />
                            <Area type="monotone" dataKey="quantity" name="Sales" stroke="#a3a833" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" dot={false} />
                          </AreaChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center text-text-secondary text-sm">
                          No sales history available for this product.
                        </div>
                      )}
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
