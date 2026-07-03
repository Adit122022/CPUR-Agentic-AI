import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Product, SalesHistory, ForecastResult } from '../services/api';
import { ProductCard } from './ProductCard';
import { ForecastPanel } from './ForecastPanel';
import { ChartComponent } from './ChartComponent';
import { AgentLogStream } from './AgentLogStream';
import { LayoutDashboard, AlertCircle, ShoppingBag, Plus, X } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [historicalData, setHistoricalData] = useState<SalesHistory[]>([]);
  const [forecastResult, setForecastResult] = useState<ForecastResult | null>(null);
  
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingForecast, setLoadingForecast] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal State for adding a product
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    category: '',
    price: 0,
    current_stock: 0,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      loadHistory(selectedProduct.id);
      setForecastResult(null); // Reset forecast when product changes
    }
  }, [selectedProduct]);

  const loadProducts = async () => {
    setLoadingProducts(true);
    setError(null);
    try {
      const data = await api.getProducts();
      setProducts(data);
      if (data.length > 0 && !selectedProduct) {
        setSelectedProduct(data[0]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoadingProducts(false);
    }
  };

  const loadHistory = async (productId: number) => {
    setError(null);
    try {
      const history = await api.getSalesHistory(productId);
      setHistoricalData(history);
    } catch (err: any) {
      setError(err.message || 'Failed to load sales history');
    }
  };

  const handleForecastTrigger = async (
    modelType: 'linear_regression' | 'decision_tree' | 'neural_network',
    useAgents: boolean
  ) => {
    if (!selectedProduct) return;
    setLoadingForecast(true);
    setError(null);
    try {
      const response = await api.triggerForecast({
        product_id: selectedProduct.id,
        model_type: modelType,
        use_agents: useAgents,
      });
      setForecastResult(response.forecast);
    } catch (err: any) {
      setError(err.message || 'Failed to trigger forecasting process');
    } finally {
      setLoadingForecast(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await api.createProduct(newProduct);
      setProducts((prev) => [...prev, created]);
      setSelectedProduct(created);
      setIsModalOpen(false);
      setNewProduct({ name: '', sku: '', category: '', price: 0, current_stock: 0 });
    } catch (err: any) {
      alert(err.message || 'Failed to create product');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Background Decoratives */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--color-olive-400)]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="border-b border-white/10 bg-slate-950/60 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[var(--color-olive-400)] rounded-xl text-white shadow-lg shadow-indigo-600/35">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-fuchsia-300">
              Antigravity Demand Forecaster
            </h1>
            <p className="text-xs text-slate-400">Collaborative Machine Learning + CrewAI Multi-Agent Consensus</p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg text-white transition-all shadow-md active:translate-y-[1px]"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </header>

      {/* Main Grid */}
      <main className="flex-1 p-6 grid grid-cols-1 xl:grid-cols-4 gap-6 z-10 max-w-[1600px] w-full mx-auto">
        {/* Error message */}
        {error && (
          <div className="col-span-full bg-rose-500/10 border border-rose-500/25 p-4 rounded-xl flex items-center gap-3 text-rose-300 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span className="font-mono">{error}</span>
          </div>
        )}

        {/* Column 1: Product Inventory Sidebar */}
        <div className="xl:col-span-1 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-400 flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4" />
              Product Catalog
            </h2>
            <span className="text-xs text-slate-500 font-mono">({products.length})</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 max-h-[780px] pr-1 custom-scrollbar">
            {loadingProducts ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
                <svg className="animate-spin h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="text-xs">Loading catalog...</span>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 text-slate-600 text-xs">
                No products found. Use "Add Product" to create one.
              </div>
            ) : (
              products.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  isSelected={selectedProduct?.id === prod.id}
                  onSelect={setSelectedProduct}
                />
              ))
            )}
          </div>
        </div>

        {/* Columns 2-4: Main content workspace */}
        <div className="xl:col-span-3 flex flex-col gap-6">
          {/* Top Row: Chart & Model Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ChartComponent
                historicalData={historicalData}
                forecastData={forecastResult}
                productName={selectedProduct?.name || ''}
              />
            </div>
            <div className="lg:col-span-1">
              <ForecastPanel
                productId={selectedProduct?.id || null}
                onForecastTriggered={handleForecastTrigger}
                loading={loadingForecast}
                agentAdjustments={forecastResult?.agent_adjustments || null}
                predictedQuantity={forecastResult?.predicted_quantity || null}
                adjustedQuantity={forecastResult?.adjusted_quantity || null}
              />
            </div>
          </div>

          {/* Bottom Row: Agent Console Stream */}
          <div>
            <AgentLogStream />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/5 py-4 text-center text-[10px] text-slate-600 font-mono">
        &copy; {new Date().getFullYear()} Antigravity Systems. Custom forecasting pipeline active.
      </footer>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-white/10 rounded-xl max-w-md w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-4">Add Product to Inventory</h3>
            
            <form onSubmit={handleCreateProduct} className="space-y-4 text-sm">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Winter Ski Jacket"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-indigo-500 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">SKU</label>
                  <input
                    type="text"
                    required
                    placeholder="WNT-SKI-JKT"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-indigo-500 font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Category</label>
                  <input
                    type="text"
                    required
                    placeholder="Apparel"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-indigo-500 font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    min="0"
                    placeholder="129.99"
                    value={newProduct.price || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Initial Stock</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="150"
                    value={newProduct.current_stock || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, current_stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-[var(--color-olive-400)] hover:bg-[var(--color-olive-300)] text-white transition"
                >
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
