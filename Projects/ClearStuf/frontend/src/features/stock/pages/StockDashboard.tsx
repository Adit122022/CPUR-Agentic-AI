import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Package, AlertTriangle, XOctagon, RefreshCw, TrendingUp } from 'lucide-react';
import {
  PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import type { Product } from '../../../types';
import AnimatedCounter from '../../../components/AnimatedCounter';
import { API_BASE_URL } from '../../../services/api';

const COLORS = ['#a3a833', '#6366f1', '#f97316', '#14b8a6', '#ec4899'];

export default function StockDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stockTrend, setStockTrend] = useState<{ data: any[]; categories: string[] }>({ data: [], categories: [] });
  const [loadingTrend, setLoadingTrend] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/forecast-data/stock-trend`)
      .then(res => res.json())
      .then(data => {
        setStockTrend(data);
        setLoadingTrend(false);
      })
      .catch(() => {
        // Fallback: generate from products data
        setLoadingTrend(false);
      });
  }, []);

  const totalStockValue = products.reduce((acc, p) => acc + (p.price * p.current_stock), 0);
  const lowStockItems = products.filter(p => p.current_stock > 0 && p.current_stock <= 50).length;
  const outOfStockItems = products.filter(p => p.current_stock === 0).length;
  const reorderNeeded = products.filter(p => p.current_stock <= 20).length;

  const getAlertSeverity = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', action: 'Restock immediately', urgency: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' };
    if (stock < 15) return { label: 'Critical', action: 'Order this week', urgency: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' };
    return { label: 'Low Stock', action: 'Watch closely', urgency: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' };
  };

  // Group by category for donut chart
  const categoryData = products.reduce((acc: any[], p) => {
    const existing = acc.find(c => c.name === p.category);
    if (existing) {
      existing.value += p.current_stock;
    } else {
      // Shorten category name for display
      const shortName = p.category.split('&')[0].trim();
      acc.push({ name: shortName, value: p.current_stock });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const alertProducts = products
    .filter(p => p.current_stock < 30)
    .sort((a, b) => a.current_stock - b.current_stock)
    .slice(0, 10);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="eyebrow mb-3">Inventory Management</div>
        <h1 className="text-3xl md:text-4xl font-gothic text-text-primary uppercase mb-2">Stock Dashboard</h1>
        <p className="text-text-secondary mt-1 font-pixel text-xs tracking-widest uppercase">Keep your shelves ready without overordering.</p>
        <p className="mt-3 max-w-2xl text-text-secondary text-sm">
          This view shows your inventory health at a glance. Click any product in the alerts table to go straight to its demand forecast.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-card p-6 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-olive-100/60 text-olive-600 dark:bg-[#2a281f] dark:text-olive-300 rounded-xl">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-secondary">Total Stock Value</p>
              <p className="text-2xl font-bold text-text-primary">
                ₹<AnimatedCounter value={totalStockValue} decimals={0} />
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 rounded-xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-secondary">Low Stock</p>
              <p className="text-2xl font-bold text-text-primary"><AnimatedCounter value={lowStockItems} /></p>
              <p className="text-xs text-text-secondary mt-0.5">products below 50 units</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="glass-card p-6 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-xl">
              <XOctagon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-secondary">Out of Stock</p>
              <p className="text-2xl font-bold text-text-primary"><AnimatedCounter value={outOfStockItems} /></p>
              <p className="text-xs text-text-secondary mt-0.5">products need immediate restock</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="glass-card p-6 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-xl">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-secondary">Reorder Needed</p>
              <p className="text-2xl font-bold text-text-primary"><AnimatedCounter value={reorderNeeded} /></p>
              <p className="text-xs text-text-secondary mt-0.5">products below reorder threshold</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Donut Chart */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="glass-card p-6 rounded-2xl col-span-1 lg:col-span-1">
          <h3 className="text-lg font-bold text-text-primary mb-4">Stock by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)', borderRadius: '12px' }}
                  formatter={(value: any) => [`${value} units`, 'Stock']}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Real Sales Trend Chart */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="glass-card p-6 rounded-2xl col-span-1 lg:col-span-2">
          <h3 className="text-lg font-bold text-text-primary mb-1 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-olive-400" />
            Sales Volume by Category (Last 6 Weeks)
          </h3>
          <p className="text-xs text-text-secondary mb-4">Based on actual sales history from your product database</p>
          <div className="h-52">
            {loadingTrend ? (
              <div className="h-full flex items-center justify-center text-text-secondary text-sm">Loading trend data...</div>
            ) : stockTrend.data.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stockTrend.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#9ca3af" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)', borderRadius: '12px' }} />
                  <Legend verticalAlign="top" height={36} />
                  {stockTrend.categories.map((cat, i) => (
                    <Line
                      key={cat}
                      type="monotone"
                      dataKey={cat}
                      stroke={COLORS[i % COLORS.length]}
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-text-secondary text-sm">
                No historical sales data available. Add products and record sales to see trends.
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Stock Alerts Table */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="glass-card rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-border-color flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-text-primary">⚠ Action Required: Stock Alerts</h3>
            <p className="text-sm text-text-secondary mt-1">Click "Forecast" to see demand prediction for any product</p>
          </div>
          <span className="text-sm text-text-secondary">{alertProducts.length} products need attention</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-800/50">
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">Product Name</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">SKU</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">Category</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">Severity</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">Stock</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">Action</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">Forecast</th>
              </tr>
            </thead>
            <tbody>
              {alertProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-text-secondary text-sm">
                    ✅ All products are well-stocked! No alerts at this time.
                  </td>
                </tr>
              ) : alertProducts.map((alert, index) => {
                const severity = getAlertSeverity(alert.current_stock);
                return (
                  <motion.tr
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.06 }}
                    key={alert.id}
                    className="border-b border-border-color last:border-0 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="p-4 font-medium text-text-primary text-sm max-w-[200px]">
                      <span className="line-clamp-1" title={alert.name}>{alert.name}</span>
                    </td>
                    <td className="p-4 text-xs font-mono text-text-secondary">{alert.sku}</td>
                    <td className="p-4 text-xs text-text-secondary">
                      {alert.category?.split('&')[0]?.trim() ?? alert.category}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${severity.urgency}`}>
                        {severity.label}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (alert.current_stock / 50) * 100)}%` }}
                            transition={{ duration: 1, delay: 0.8 }}
                            className={`h-full rounded-full ${alert.current_stock === 0 ? 'bg-red-500' : alert.current_stock < 15 ? 'bg-orange-500' : 'bg-amber-500'}`}
                          />
                        </div>
                        <span className="text-sm font-semibold text-text-primary">{alert.current_stock}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-text-secondary">{severity.action}</td>
                    <td className="p-4">
                      <button
                        onClick={() => navigate(`/forecast?product_id=${alert.id}`)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50 transition-colors"
                      >
                        Forecast →
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
