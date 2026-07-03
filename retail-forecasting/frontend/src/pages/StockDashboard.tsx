import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, AlertTriangle, XOctagon, RefreshCw } from 'lucide-react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Product } from '../types';
import AnimatedCounter from '../components/AnimatedCounter';

const COLORS = ['#6366f1', '#ec4899', '#8b5cf6', '#14b8a6', '#f59e0b'];

export default function StockDashboard() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  const totalStockValue = products.reduce((acc, p) => acc + (p.price * p.current_stock), 0);
  const lowStockItems = products.filter(p => p.current_stock > 0 && p.current_stock <= 50).length;
  const outOfStockItems = products.filter(p => p.current_stock === 0).length;
  const reorderNeeded = products.filter(p => p.current_stock <= 20).length;

  // Group by category for donut chart
  const categoryData = products.reduce((acc: any[], p) => {
    const existing = acc.find(c => c.name === p.category);
    if (existing) {
      existing.value += p.current_stock;
    } else {
      acc.push({ name: p.category, value: p.current_stock });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Mock stock history over time
  const stockHistory = [
    { name: 'Week 1', Electronics: 400, Furniture: 240, Apparel: 2400 },
    { name: 'Week 2', Electronics: 300, Furniture: 139, Apparel: 2210 },
    { name: 'Week 3', Electronics: 200, Furniture: 980, Apparel: 2290 },
    { name: 'Week 4', Electronics: 278, Furniture: 390, Apparel: 2000 },
    { name: 'Week 5', Electronics: 189, Furniture: 480, Apparel: 2181 },
    { name: 'Week 6', Electronics: 239, Furniture: 380, Apparel: 2500 },
  ];



  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Stock Dashboard</h1>
        <p className="text-text-secondary mt-1">Real-time inventory metrics and reorder alerts.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-card p-6 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-xl">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-secondary">Total Value</p>
              <p className="text-2xl font-bold text-text-primary">
                $<AnimatedCounter value={totalStockValue} decimals={2} />
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
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Donut Chart */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="glass-card p-6 rounded-2xl col-span-1 lg:col-span-1">
          <h3 className="text-lg font-bold text-text-primary mb-4">Stock Distribution</h3>
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
                <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Line Chart */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="glass-card p-6 rounded-2xl col-span-1 lg:col-span-2">
          <h3 className="text-lg font-bold text-text-primary mb-4">Stock Levels Over Time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stockHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
                <Legend verticalAlign="top" height={36} />
                <Line type="monotone" dataKey="Electronics" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Furniture" stroke="#ec4899" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Apparel" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Stock Alerts Table */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="glass-card rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-border-color">
          <h3 className="text-lg font-bold text-text-primary">Action Required: Stock Alerts</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-800/50">
                <th className="p-4 text-sm font-semibold text-text-secondary">Product Name</th>
                <th className="p-4 text-sm font-semibold text-text-secondary">Severity</th>
                <th className="p-4 text-sm font-semibold text-text-secondary">Current Stock</th>
                <th className="p-4 text-sm font-semibold text-text-secondary">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.filter(p => p.current_stock < 30).slice(0, 10).map((alert, index) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  key={alert.id} 
                  className="border-b border-border-color last:border-0 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="p-4 font-medium text-text-primary">{alert.name}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          alert.current_stock === 0 ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                          alert.current_stock < 15 ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' :
                          'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}>
                          {alert.current_stock === 0 ? 'Out of Stock' : 'Low Stock'}
                    </span>
                  </td>
                  <td className="p-4 text-text-primary">{alert.current_stock} units</td>
                  <td className="p-4">
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5 max-w-[120px]">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (alert.current_stock / 100) * 100)}%` }}
                        transition={{ duration: 1, delay: 1 }}
                        className={`h-2.5 rounded-full ${alert.current_stock === 0 ? 'bg-red-500' : 'bg-amber-500'}`}
                      ></motion.div>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
