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

const COLORS = ['#353535', '#666666', '#9B9B9B', '#D4D4D4', '#FFFFFF'];

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
        setLoadingTrend(false);
      });
  }, []);

  const totalStockValue = products.reduce((acc, p) => acc + (p.price * p.current_stock), 0);
  const lowStockItems = products.filter(p => p.current_stock > 0 && p.current_stock <= 50).length;
  const outOfStockItems = products.filter(p => p.current_stock === 0).length;
  const reorderNeeded = products.filter(p => p.current_stock <= 20).length;

  const getAlertSeverity = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', action: 'Restock immediately', urgency: 'border border-border bg-secondary/20 text-foreground font-bold' };
    if (stock < 15) return { label: 'Critical', action: 'Order this week', urgency: 'border border-border bg-transparent text-muted-foreground' };
    return { label: 'Low Stock', action: 'Watch closely', urgency: 'bg-card border border-border/80 text-muted-foreground' };
  };

  const categoryData = products.reduce((acc: any[], p) => {
    const existing = acc.find(c => c.name === p.category);
    if (existing) {
      existing.value += p.current_stock;
    } else {
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
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto dot-bg relative">
      <div className="absolute inset-0 glow-amber opacity-10 pointer-events-none" />

      {/* Header */}
      <div className="mb-10 z-10 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-4">
          <span>Inventory Statistics</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-foreground mb-2">Stock Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-xs tracking-wider uppercase">Keep your shelves ready without overordering.</p>
        <p className="mt-3 max-w-2xl text-muted-foreground text-xs leading-relaxed uppercase tracking-wider">
          Monitor your warehouse health. Click any product in the alerts list to analyze its automated demand forecast.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 z-10 relative">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-card/65 border border-border/80 backdrop-blur-md p-6 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-secondary text-foreground border border-border rounded-lg">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Total Stock Value</p>
              <p className="text-xl font-bold text-foreground mt-1">
                ₹<AnimatedCounter value={totalStockValue} decimals={0} />
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-card/65 border border-border/80 backdrop-blur-md p-6 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 border border-border bg-transparent text-muted-foreground rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Low Stock</p>
              <p className="text-xl font-bold text-foreground mt-1"><AnimatedCounter value={lowStockItems} /></p>
              <p className="text-[9px] text-muted-foreground/60 uppercase tracking-wider mt-1">products below 50 units</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-card/65 border border-border/80 backdrop-blur-md p-6 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-foreground text-background rounded-lg">
              <XOctagon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Out of Stock</p>
              <p className="text-xl font-bold text-foreground mt-1"><AnimatedCounter value={outOfStockItems} /></p>
              <p className="text-[9px] text-muted-foreground/60 uppercase tracking-wider mt-1">needs immediate restock</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-card/65 border border-border/80 backdrop-blur-md p-6 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-card border border-border/80 text-muted-foreground rounded-lg">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Reorder Needed</p>
              <p className="text-xl font-bold text-foreground mt-1"><AnimatedCounter value={reorderNeeded} /></p>
              <p className="text-[9px] text-muted-foreground/60 uppercase tracking-wider mt-1">products below threshold</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 z-10 relative">
        {/* Donut Chart */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="bg-card/45 border border-border/80 p-6 rounded-xl col-span-1 lg:col-span-1">
          <h3 className="text-xs font-bold uppercase tracking-widest text-foreground mb-4">Stock by Category</h3>
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
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)', borderRadius: '8px' }}
                  formatter={(value: any) => [`${value} units`, 'Stock']}
                />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: 1 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Real Sales Trend Chart */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="bg-card/45 border border-border/80 p-6 rounded-xl col-span-1 lg:col-span-2">
          <h3 className="text-xs font-bold uppercase tracking-widest text-foreground mb-1 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Sales Volume by Category (Last 6 Weeks)
          </h3>
          <p className="text-[9px] text-muted-foreground uppercase tracking-widest mb-4">Based on actual sales history from your product database</p>
          <div className="h-52">
            {loadingTrend ? (
              <div className="h-full flex items-center justify-center text-muted-foreground text-xs">Loading trend data...</div>
            ) : stockTrend.data.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stockTrend.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" stroke="#9B9B9B" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#9B9B9B" tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)', borderRadius: '8px' }} />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: 1 }} />
                  {stockTrend.categories.map((cat, i) => (
                    <Line
                      key={cat}
                      type="monotone"
                      dataKey={cat}
                      stroke={COLORS[i % COLORS.length]}
                      strokeWidth={2}
                      dot={{ r: 2 }}
                      activeDot={{ r: 4 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-xs uppercase tracking-wider">
                No historical sales data available.
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Stock Alerts Table */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="bg-card/45 border border-border/80 rounded-xl overflow-hidden z-10 relative">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">⚠ Action Required: Stock Alerts</h3>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest">Click "Forecast" to see demand prediction for any product</p>
          </div>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{alertProducts.length} items flagged</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/20 uppercase text-[9px] tracking-widest text-muted-foreground">
                <th className="p-4">Product Name</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Category</th>
                <th className="p-4">Severity</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Action</th>
                <th className="p-4">Forecast</th>
              </tr>
            </thead>
            <tbody className="text-xs text-muted-foreground">
              {alertProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-sm font-bold uppercase tracking-wider">
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
                    className="border-b border-border/50 last:border-0 hover:bg-secondary/10 transition-colors"
                  >
                    <td className="p-4 font-bold text-foreground max-w-[200px]">
                      <span className="line-clamp-1" title={alert.name}>{alert.name}</span>
                    </td>
                    <td className="p-4 font-mono">{alert.sku}</td>
                    <td className="p-4">
                      {alert.category?.split('&')[0]?.trim() ?? alert.category}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded text-[9px] ${severity.urgency}`}>
                        {severity.label}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-secondary/40 rounded-full h-1 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (alert.current_stock / 50) * 100)}%` }}
                            transition={{ duration: 1, delay: 0.8 }}
                            className={`h-full rounded-full ${alert.current_stock === 0 ? 'bg-foreground/20' : alert.current_stock < 15 ? 'bg-foreground/55' : 'bg-foreground'}`}
                          />
                        </div>
                        <span className="font-bold text-foreground font-mono">{alert.current_stock}</span>
                      </div>
                    </td>
                    <td className="p-4 text-xs font-medium uppercase tracking-wider">{severity.action}</td>
                    <td className="p-4">
                      <button
                        onClick={() => navigate(`/forecast?product_id=${alert.id}`)}
                        className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded bg-foreground text-background hover:opacity-90 transition-opacity"
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
