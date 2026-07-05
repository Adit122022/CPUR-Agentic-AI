import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, Package, RefreshCw, Zap,
  BrainCircuit, AlertCircle, ChevronRight, BarChart3,
  Sparkles,
  ShoppingCart, Clock, AlertTriangle, CheckCircle2,
  Store
} from 'lucide-react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, ReferenceLine
} from 'recharts';
import { API_BASE_URL } from '../../../services/api';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  brand?: string;
  price: number;
  discounted_price?: number;
  current_stock: number;
}

interface ForecastPoint {
  date: string;
  predicted_quantity: number;
  is_forecast: boolean;
}

interface ForecastSummary {
  avg_daily_forecast: number;
  max_day_forecast: number;
  min_day_forecast: number;
  total_7day_forecast: number;
  reorder_recommended: boolean;
  days_of_stock_left: number;
}

interface MultiDayForecast {
  product_id: number;
  product_name: string;
  sku: string;
  category: string;
  current_stock: number;
  data_points: ForecastPoint[];
  summary: ForecastSummary;
}

interface AgentForecast {
  predicted_quantity: number;
  adjusted_quantity: number | null;
  agent_adjustments: string | null;
  model_used: string;
}

// ─── Custom Tooltip for chart ─────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const isForecast = payload[0]?.payload?.is_forecast;
    return (
      <div className="glass-card rounded-xl border border-border-color p-3 shadow-xl text-sm">
        <p className="font-semibold text-text-primary mb-1">{label}</p>
        <p className={`font-bold ${isForecast ? 'text-indigo-500' : 'text-olive-500'}`}>
          {isForecast ? '🔮 Predicted: ' : '📦 Actual: '}
          {Math.round(payload[0]?.value)} units
        </p>
        {isForecast && (
          <p className="text-xs text-text-secondary mt-1">AI Forecast</p>
        )}
      </div>
    );
  }
  return null;
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Forecast() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    searchParams.get('product_id') ? Number(searchParams.get('product_id')) : null
  );
  const [forecastDays, setForecastDays] = useState(7);
  const [forecastData, setForecastData] = useState<MultiDayForecast | null>(null);
  const [agentForecast, setAgentForecast] = useState<AgentForecast | null>(null);
  const [loadingChart, setLoadingChart] = useState(false);
  const [loadingAgent, setLoadingAgent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agentRan, setAgentRan] = useState(false);

  // Fetch product list on mount
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then(r => r.json())
      .then((data: Product[]) => {
        setProducts(data);
        // Auto-select first product if none selected
        if (!selectedProductId && data.length > 0) {
          setSelectedProductId(data[0].id);
        }
      })
      .catch(() => setError('Failed to load products from server.'));
  }, []);

  // Fetch multi-day forecast whenever product or days changes
  const loadForecast = useCallback(async () => {
    if (!selectedProductId) return;
    setLoadingChart(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/forecast/multi/${selectedProductId}?days=${forecastDays}`
      );
      if (!res.ok) throw new Error(await res.text());
      const data: MultiDayForecast = await res.json();
      setForecastData(data);
      setAgentRan(false);
      setAgentForecast(null);
    } catch (e: any) {
      setError('Could not load forecast. Make sure sales data exists for this product.');
    } finally {
      setLoadingChart(false);
    }
  }, [selectedProductId, forecastDays]);

  useEffect(() => {
    loadForecast();
  }, [loadForecast]);

  // Run AI Agent forecast
  const handleRunAgents = async () => {
    if (!selectedProductId) return;
    setLoadingAgent(true);
    setAgentRan(false);
    try {
      const res = await fetch(`${API_BASE_URL}/api/forecast/trigger`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: selectedProductId,
          model_type: 'linear_regression',
          use_agents: true
        })
      });
      if (!res.ok) throw new Error('Agent run failed');
      const data = await res.json();
      setAgentForecast({
        predicted_quantity: data.forecast.predicted_quantity,
        adjusted_quantity: data.forecast.adjusted_quantity,
        agent_adjustments: data.forecast.agent_adjustments,
        model_used: data.forecast.model_used
      });
      setAgentRan(true);
    } catch (e) {
      setError('AI agent run failed. Please try again.');
    } finally {
      setLoadingAgent(false);
    }
  };

  const selectedProduct = products.find(p => p.id === selectedProductId);

  // Prepare chart data — blend actuals + forecast with a separator
  const chartData = forecastData?.data_points.map(pt => {
    const shortDate = pt.date.slice(5); // MM-DD
    return {
      date: shortDate,
      actual: pt.is_forecast ? null : pt.predicted_quantity,
      forecast: pt.is_forecast ? pt.predicted_quantity : null,
      is_forecast: pt.is_forecast,
      predicted_quantity: pt.predicted_quantity
    };
  }) ?? [];

  // Find where forecast begins (for reference line)
  const forecastStartDate = forecastData?.data_points.find(p => p.is_forecast)?.date.slice(5);

  const summary = forecastData?.summary;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="eyebrow mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              AI-Powered Demand Forecasting
            </div>
            <h1 className="text-3xl md:text-4xl font-gothic text-text-primary uppercase mb-2">
              Product Demand Forecast
            </h1>
            <p className="text-text-secondary text-sm">
              Select a product to see the last 30 days of actual sales and the AI-predicted demand for the next {forecastDays} days.
            </p>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/agents')}
            className="flex items-center gap-2 px-4 py-2 glass-card border border-border-color rounded-xl text-sm text-text-secondary hover:text-text-primary transition-all"
          >
            <BrainCircuit className="w-4 h-4" />
            View AI Agent Console
          </motion.button>
        </div>
      </motion.div>

      {/* ── Controls Bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl p-4 mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center"
      >
        {/* Product selector */}
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Select Product
          </label>
          <select
            value={selectedProductId ?? ''}
            onChange={e => setSelectedProductId(Number(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl border border-border-color bg-[var(--bg-color)] text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.sku}) — Stock: {p.current_stock}
              </option>
            ))}
          </select>
        </div>

        {/* Days selector */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Forecast Horizon
          </label>
          <select
            value={forecastDays}
            onChange={e => setForecastDays(Number(e.target.value))}
            className="px-4 py-2.5 rounded-xl border border-border-color bg-[var(--bg-color)] text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value={3}>Next 3 Days</option>
            <option value={7}>Next 7 Days</option>
            <option value={14}>Next 14 Days</option>
            <option value={30}>Next 30 Days</option>
          </select>
        </div>

        {/* Run AI Agents button */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            AI Enhancement
          </label>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleRunAgents}
            disabled={loadingAgent || !selectedProductId}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-60 whitespace-nowrap"
          >
            {loadingAgent ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                  <RefreshCw className="w-4 h-4" />
                </motion.div>
                Running Agents...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Run AI Agents
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* ── Error Banner ── */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </motion.div>
      )}

      {/* ── Product KPI Strip ── */}
      {selectedProduct && summary && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        >
          {[
            {
              label: 'Current Stock',
              value: `${selectedProduct.current_stock} units`,
              icon: <Package className="w-5 h-5" />,
              color: selectedProduct.current_stock < 20
                ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                : selectedProduct.current_stock < 50
                  ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20'
                  : 'text-green-500 bg-green-50 dark:bg-green-900/20',
              sub: selectedProduct.current_stock < 20 ? 'Critical — Reorder now' : selectedProduct.current_stock < 50 ? 'Watch closely' : 'Healthy stock'
            },
            {
              label: `${forecastDays}-Day Forecast`,
              value: `${Math.round(summary.total_7day_forecast)} units`,
              icon: <TrendingUp className="w-5 h-5" />,
              color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20',
              sub: `~${Math.round(summary.avg_daily_forecast)} units/day average`
            },
            {
              label: 'Days of Stock Left',
              value: `${summary.days_of_stock_left} days`,
              icon: <Clock className="w-5 h-5" />,
              color: summary.days_of_stock_left < 3
                ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                : summary.days_of_stock_left < 7
                  ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20'
                  : 'text-green-500 bg-green-50 dark:bg-green-900/20',
              sub: summary.reorder_recommended ? '⚠ Reorder recommended' : '✓ Stock sufficient'
            },
            {
              label: 'Reorder Status',
              value: summary.reorder_recommended ? 'Order Now' : 'Not Needed',
              icon: summary.reorder_recommended ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />,
              color: summary.reorder_recommended
                ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                : 'text-green-500 bg-green-50 dark:bg-green-900/20',
              sub: summary.reorder_recommended
                ? `Need ~${Math.round(summary.total_7day_forecast - selectedProduct.current_stock)} more units`
                : 'Sufficient for forecast period'
            },
          ].map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.06 }}
              className="glass-card rounded-2xl p-4"
            >
              <div className={`flex items-center gap-2 rounded-xl p-2 w-fit mb-3 ${kpi.color}`}>
                {kpi.icon}
              </div>
              <p className="text-xs text-text-secondary font-medium uppercase tracking-wider mb-1">{kpi.label}</p>
              <p className="text-xl font-bold text-text-primary">{kpi.value}</p>
              <p className="text-xs text-text-secondary mt-1">{kpi.sub}</p>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* ── Chart: Actuals + Forecast ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass-card rounded-2xl p-6 mb-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
              Sales History + {forecastDays}-Day Demand Forecast
            </h2>
            {selectedProduct && (
              <p className="text-sm text-text-secondary mt-1">
                {selectedProduct.name} — SKU: {selectedProduct.sku} — {selectedProduct.category}
              </p>
            )}
          </div>
          <div className="flex gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-text-secondary">
              <span className="w-3 h-0.5 bg-olive-400 inline-block rounded" />
              Actual Sales
            </span>
            <span className="flex items-center gap-1.5 text-text-secondary">
              <span className="w-3 h-0.5 bg-indigo-500 inline-block rounded border-dashed border-b" />
              AI Forecast
            </span>
          </div>
        </div>

        {loadingChart ? (
          <div className="h-72 flex items-center justify-center text-text-secondary">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="mr-3">
              <RefreshCw className="w-5 h-5" />
            </motion.div>
            Loading forecast data...
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-72 flex items-center justify-center text-text-secondary text-sm">
            No data available. Select a product with sales history.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="gradActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a3a833" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#a3a833" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradForecast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
              <XAxis dataKey="date" stroke="#9ca3af" tick={{ fontSize: 11 }} interval={4} />
              <YAxis stroke="#9ca3af" tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              {forecastStartDate && (
                <ReferenceLine
                  x={forecastStartDate}
                  stroke="#6366f1"
                  strokeDasharray="4 4"
                  label={{ value: 'Forecast Starts', fill: '#6366f1', fontSize: 11, position: 'top' }}
                />
              )}
              <Area
                type="monotone"
                dataKey="actual"
                name="Actual Sales"
                stroke="#a3a833"
                fill="url(#gradActual)"
                strokeWidth={2.5}
                dot={false}
                connectNulls={false}
              />
              <Area
                type="monotone"
                dataKey="forecast"
                name="AI Forecast"
                stroke="#6366f1"
                fill="url(#gradForecast)"
                strokeWidth={2.5}
                strokeDasharray="5 3"
                dot={false}
                connectNulls={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      {/* ── AI Agent Results ── */}
      <AnimatePresence>
        {agentRan && agentForecast && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <BrainCircuit className="w-4 h-4 text-purple-500" />
              <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                AI Agent Analysis — {selectedProduct?.name}
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300 font-semibold">
                Live Result
              </span>
            </div>
            <div className="glass-card rounded-2xl p-6 border-l-4 border-purple-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                <div className="text-center p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50">
                  <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">ML Baseline</p>
                  <p className="text-2xl font-bold text-text-primary">
                    {Math.round(agentForecast.predicted_quantity)} units
                  </p>
                  <p className="text-xs text-text-secondary mt-1">Linear Regression</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20">
                  <p className="text-xs text-indigo-600 dark:text-indigo-300 uppercase tracking-wider mb-1">Agent-Adjusted</p>
                  <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">
                    {agentForecast.adjusted_quantity ? Math.round(agentForecast.adjusted_quantity) : Math.round(agentForecast.predicted_quantity)} units
                  </p>
                  <p className="text-xs text-text-secondary mt-1">Weather + Market factors</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-green-50 dark:bg-green-900/20">
                  <p className="text-xs text-green-600 dark:text-green-300 uppercase tracking-wider mb-1">Suggested Order</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-300">
                    {Math.max(0, Math.round((agentForecast.adjusted_quantity ?? agentForecast.predicted_quantity) - (selectedProduct?.current_stock ?? 0)))} units
                  </p>
                  <p className="text-xs text-text-secondary mt-1">To cover next {forecastDays} days</p>
                </div>
              </div>
              {agentForecast.agent_adjustments && (
                <div className="rounded-xl bg-gray-50 dark:bg-slate-800/50 p-4">
                  <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Agent Report</p>
                  <pre className="text-xs text-text-primary leading-relaxed whitespace-pre-wrap font-sans">
                    {agentForecast.agent_adjustments}
                  </pre>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Recommendations ── */}
      {forecastData && summary && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        >
          {[
            {
              icon: <ShoppingCart className="w-5 h-5 text-green-500" />,
              title: 'Reorder Action',
              color: 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10',
              items: summary.reorder_recommended
                ? [
                    `Order at least ${Math.round(summary.total_7day_forecast)} units to cover ${forecastDays} days`,
                    `Current stock: ${selectedProduct?.current_stock} units — lasts ~${summary.days_of_stock_left} days`,
                    `Peak daily demand expected: ${summary.max_day_forecast} units`,
                  ]
                : [
                    `Stock is sufficient for the next ${forecastDays} days`,
                    `${selectedProduct?.current_stock} units covers forecasted ${Math.round(summary.total_7day_forecast)} units needed`,
                    `Review again when stock drops below ${Math.round(summary.total_7day_forecast)} units`,
                  ]
            },
            {
              icon: <BarChart3 className="w-5 h-5 text-indigo-500" />,
              title: 'Demand Insights',
              color: 'border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-900/10',
              items: [
                `Avg daily demand: ${summary.avg_daily_forecast} units`,
                `Peak forecast day: ${summary.max_day_forecast} units`,
                `Low forecast day: ${summary.min_day_forecast} units`,
              ]
            },
            {
              icon: <Store className="w-5 h-5 text-amber-500" />,
              title: 'Product Info',
              color: 'border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10',
              items: [
                `${forecastData.product_name}`,
                `SKU: ${forecastData.sku}`,
                `Category: ${forecastData.category}`,
              ]
            },
          ].map(({ icon, title, items, color }) => (
            <div key={title} className={`glass-card rounded-xl p-5 border ${color}`}>
              <h3 className="font-bold text-text-primary mb-3 flex items-center gap-2">{icon}{title}</h3>
              <ul className="space-y-2">
                {items.map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                    <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 text-text-secondary mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>
      )}

      {/* ── How to use hint ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="rounded-xl border border-border-color/60 bg-[var(--card-bg)]/50 p-4 text-sm text-text-secondary"
      >
        <p className="font-semibold text-text-primary mb-1 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-olive-400" />
          How to use this page
        </p>
        <ol className="list-decimal list-inside space-y-1 text-text-secondary">
          <li>Select a product from the dropdown above</li>
          <li>The chart shows <span className="text-olive-500 font-medium">actual sales</span> (last 30 days) and <span className="text-indigo-500 font-medium">AI predictions</span> (next {forecastDays} days)</li>
          <li>Click <span className="font-semibold text-purple-600">Run AI Agents</span> for a full agent analysis with weather + market signals</li>
          <li>Use the <span className="font-semibold">Reorder Action</span> card to decide how much to order</li>
        </ol>
      </motion.div>
    </div>
  );
}
