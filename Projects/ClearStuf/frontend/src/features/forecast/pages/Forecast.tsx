import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, Package, RefreshCw, Zap,
  BrainCircuit, AlertCircle, ChevronRight, BarChart3,
  Sparkles, ShoppingCart, Clock, AlertTriangle, CheckCircle2,
  Store
} from 'lucide-react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, ReferenceLine
} from 'recharts';
import { API_BASE_URL } from '../../../services/api';
import { cn } from '../../../lib/utils';

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

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const isForecast = payload[0]?.payload?.is_forecast;
    return (
      <div className="bg-card border border-border p-3 shadow-xl text-xs rounded-lg">
        <p className="font-bold text-foreground mb-1 font-mono">{label}</p>
        <p className={cn("font-bold", isForecast ? 'text-foreground' : 'text-muted-foreground')}>
          {isForecast ? '🔮 Predicted: ' : '📦 Actual: '}
          {Math.round(payload[0]?.value)} units
        </p>
        {isForecast && (
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">AI Forecast Model</p>
        )}
      </div>
    );
  }
  return null;
};

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

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then(r => r.json())
      .then((data: Product[]) => {
        setProducts(data);
        if (!selectedProductId && data.length > 0) {
          setSelectedProductId(data[0].id);
        }
      })
      .catch(() => setError('Failed to load products from server.'));
  }, []);

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

  const chartData = forecastData?.data_points.map(pt => {
    const shortDate = pt.date.slice(5);
    return {
      date: shortDate,
      actual: pt.is_forecast ? null : pt.predicted_quantity,
      forecast: pt.is_forecast ? pt.predicted_quantity : null,
      is_forecast: pt.is_forecast,
      predicted_quantity: pt.predicted_quantity
    };
  }) ?? [];

  const forecastStartDate = forecastData?.data_points.find(p => p.is_forecast)?.date.slice(5);
  const summary = forecastData?.summary;

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto dot-bg relative">
      <div className="absolute inset-0 glow-amber opacity-10 pointer-events-none" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 z-10 relative"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-4">
              <Sparkles className="h-3.5 w-3.5 text-foreground" />
              <span>AI-Powered Demand forecasting</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-foreground mb-2">
              Demand Predictions
            </h1>
            <p className="text-muted-foreground text-xs uppercase tracking-wider leading-relaxed">
              Analyze daily unit demands and execute cooperative adjustments for seasonality.
            </p>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/agents')}
            className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-lg text-xs font-bold uppercase tracking-widest text-foreground hover:bg-secondary transition-all shadow-brand"
          >
            <BrainCircuit className="w-4 h-4" />
            AI Agent Console
          </motion.button>
        </div>
      </motion.div>

      {/* Controls Bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card/65 border border-border backdrop-blur-md rounded-xl p-4 mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center z-10 relative"
      >
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
            Select Product SKU
          </label>
          <select
            value={selectedProductId ?? ''}
            onChange={e => setSelectedProductId(Number(e.target.value))}
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-foreground font-mono"
          >
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.sku}) — Stock: {p.current_stock}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
            Forecast Horizon
          </label>
          <select
            value={forecastDays}
            onChange={e => setForecastDays(Number(e.target.value))}
            className="px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-foreground font-bold uppercase tracking-wider"
          >
            <option value={3}>Next 3 Days</option>
            <option value={7}>Next 7 Days</option>
            <option value={14}>Next 14 Days</option>
            <option value={30}>Next 30 Days</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
            AI Enrichment
          </label>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleRunAgents}
            disabled={loadingAgent || !selectedProductId}
            className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-lg font-bold text-xs uppercase tracking-widest shadow-brand disabled:opacity-60 whitespace-nowrap"
          >
            {loadingAgent ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="mr-1">
                  <RefreshCw className="w-3.5 h-3.5" />
                </motion.div>
                Running Agents...
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5" />
                Run AI Agents
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Error Banner */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 rounded-lg bg-secondary/15 border border-border p-4 flex items-center gap-3 z-10 relative"
        >
          <AlertCircle className="w-4 h-4 text-foreground flex-shrink-0" />
          <p className="text-xs text-foreground font-semibold uppercase tracking-wider">{error}</p>
        </motion.div>
      )}

      {/* Product KPI Strip */}
      {selectedProduct && summary && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 z-10 relative"
        >
          {[
            {
              label: 'Current Stock',
              value: `${selectedProduct.current_stock} units`,
              icon: <Package className="w-5 h-5" />,
              color: selectedProduct.current_stock < 20
                ? 'text-foreground border border-border bg-secondary/20 font-bold'
                : selectedProduct.current_stock < 50
                  ? 'text-muted-foreground border border-border bg-transparent'
                  : 'bg-card border border-border/80 text-muted-foreground',
              sub: selectedProduct.current_stock < 20 ? 'Critical restock' : selectedProduct.current_stock < 50 ? 'Watch closely' : 'Healthy stock'
            },
            {
              label: `${forecastDays}-Day Forecast`,
              value: `${Math.round(summary.total_7day_forecast)} units`,
              icon: <TrendingUp className="w-5 h-5" />,
              color: 'border border-border bg-secondary/10 text-foreground font-bold',
              sub: `~${Math.round(summary.avg_daily_forecast)} units/day avg`
            },
            {
              label: 'Days of Stock Left',
              value: `${summary.days_of_stock_left} days`,
              icon: <Clock className="w-5 h-5" />,
              color: summary.days_of_stock_left < 3
                ? 'text-foreground border border-border bg-secondary/20 font-bold'
                : summary.days_of_stock_left < 7
                  ? 'text-muted-foreground border border-border bg-transparent'
                  : 'bg-card border border-border/80 text-muted-foreground',
              sub: summary.reorder_recommended ? '⚠ Reorder advised' : '✓ Stock sufficient'
            },
            {
              label: 'Reorder Status',
              value: summary.reorder_recommended ? 'Order Now' : 'Not Needed',
              icon: summary.reorder_recommended ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />,
              color: summary.reorder_recommended
                ? 'text-foreground border border-border bg-secondary/20 font-bold'
                : 'bg-card border border-border/80 text-muted-foreground',
              sub: summary.reorder_recommended
                ? `Need ~${Math.max(0, Math.round(summary.total_7day_forecast - selectedProduct.current_stock))} units`
                : 'Sufficient inventory'
            },
          ].map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.06 }}
              className="bg-card/45 border border-border p-4 rounded-xl"
            >
              <div className={`flex items-center gap-2 rounded-lg p-2 w-fit mb-3 ${kpi.color}`}>
                {kpi.icon}
              </div>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{kpi.label}</p>
              <p className="text-base font-bold text-foreground">{kpi.value}</p>
              <p className="text-[9px] text-muted-foreground mt-1 uppercase tracking-wider">{kpi.sub}</p>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Chart: Actuals + Forecast */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-card/45 border border-border rounded-xl p-6 mb-6 z-10 relative"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Sales History + {forecastDays}-Day Demand Forecast
            </h2>
            {selectedProduct && (
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
                {selectedProduct.name} — SKU: {selectedProduct.sku}
              </p>
            )}
          </div>
          <div className="flex gap-4 text-[10px] uppercase font-bold tracking-wider">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="w-3 h-0.5 bg-muted-foreground inline-block rounded" />
              Actual Sales
            </span>
            <span className="flex items-center gap-1.5 text-foreground">
              <span className="w-3 h-0.5 bg-foreground inline-block rounded border-dashed border-b" />
              AI Forecast
            </span>
          </div>
        </div>

        {loadingChart ? (
          <div className="h-72 flex items-center justify-center text-muted-foreground text-xs uppercase tracking-widest">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="mr-3">
              <RefreshCw className="w-4 h-4" />
            </motion.div>
            Loading forecast data...
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-72 flex items-center justify-center text-muted-foreground text-xs uppercase tracking-widest">
            No sales data available. Select a valid SKU.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="gradActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9B9B9B" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#9B9B9B" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradForecast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="date" stroke="#9B9B9B" tick={{ fontSize: 10 }} interval={4} />
              <YAxis stroke="#9B9B9B" tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              {forecastStartDate && (
                <ReferenceLine
                  x={forecastStartDate}
                  stroke="#FFFFFF"
                  strokeDasharray="4 4"
                  label={{ value: 'Forecast Starts', fill: '#FFFFFF', fontSize: 10, position: 'top' }}
                />
              )}
              <Area
                type="monotone"
                dataKey="actual"
                name="Actual Sales"
                stroke="#9B9B9B"
                fill="url(#gradActual)"
                strokeWidth={2}
                dot={false}
                connectNulls={false}
              />
              <Area
                type="monotone"
                dataKey="forecast"
                name="AI Forecast"
                stroke="#FFFFFF"
                fill="url(#gradForecast)"
                strokeWidth={2}
                strokeDasharray="5 3"
                dot={false}
                connectNulls={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      {/* AI Agent Results */}
      <AnimatePresence>
        {agentRan && agentForecast && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 z-10 relative"
          >
            <div className="flex items-center gap-2 mb-3">
              <BrainCircuit className="w-4 h-4 text-foreground" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-foreground">
                AI Agent Report — {selectedProduct?.name}
              </h2>
              <span className="text-[9px] px-2 py-0.5 border border-border bg-secondary/35 text-foreground font-bold uppercase tracking-widest">
                Enriched
              </span>
            </div>
            <div className="bg-card border border-border border-l-4 border-l-foreground rounded-xl p-6 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                <div className="text-center p-4 rounded-lg bg-secondary/15">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">ML Baseline</p>
                  <p className="text-xl font-bold text-foreground font-mono">
                    {Math.round(agentForecast.predicted_quantity)} units
                  </p>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wider mt-1">Linear Regression</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-secondary/40">
                  <p className="text-[9px] font-bold text-foreground uppercase tracking-widest mb-1">Agent-Adjusted</p>
                  <p className="text-xl font-bold text-foreground font-mono">
                    {agentForecast.adjusted_quantity ? Math.round(agentForecast.adjusted_quantity) : Math.round(agentForecast.predicted_quantity)} units
                  </p>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wider mt-1">Seasonality + Market factors</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-card border border-border/80">
                  <p className="text-[9px] font-bold text-foreground uppercase tracking-widest mb-1">Suggested Order</p>
                  <p className="text-xl font-bold text-foreground font-mono">
                    {Math.max(0, Math.round((agentForecast.adjusted_quantity ?? agentForecast.predicted_quantity) - (selectedProduct?.current_stock ?? 0)))} units
                  </p>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wider mt-1">Stock coverage</p>
                </div>
              </div>
              {agentForecast.agent_adjustments && (
                <div className="rounded-lg bg-secondary/10 p-4">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Agent Rationale</p>
                  <pre className="text-xs text-foreground leading-relaxed whitespace-pre-wrap font-mono">
                    {agentForecast.agent_adjustments}
                  </pre>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recommendations */}
      {forecastData && summary && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 z-10 relative"
        >
          {[
            {
              icon: <ShoppingCart className="w-5 h-5 text-foreground" />,
              title: 'Reorder Action',
              color: 'border-border bg-card/60',
              items: summary.reorder_recommended
                ? [
                    `Order at least ${Math.round(summary.total_7day_forecast)} units for ${forecastDays} days`,
                    `Current stock lasts ~${summary.days_of_stock_left} days`,
                    `Peak expected daily sales: ${summary.max_day_forecast} units`,
                  ]
                : [
                    `Stock is sufficient for the next ${forecastDays} days`,
                    `Current stock covers forecasted ${Math.round(summary.total_7day_forecast)} units`,
                    `Review when stock drops below threshold`,
                  ]
            },
            {
              icon: <BarChart3 className="w-5 h-5 text-foreground" />,
              title: 'Demand Insights',
              color: 'border-border bg-card/60',
              items: [
                `Avg daily demand: ${summary.avg_daily_forecast} units`,
                `Peak forecast day: ${summary.max_day_forecast} units`,
                `Low forecast day: ${summary.min_day_forecast} units`,
              ]
            },
            {
              icon: <Store className="w-5 h-5 text-foreground" />,
              title: 'SKU Metadata',
              color: 'border-border bg-card/60',
              items: [
                `${forecastData.product_name}`,
                `SKU Barcode: ${forecastData.sku}`,
                `Category: ${forecastData.category}`,
              ]
            },
          ].map(({ icon, title, items, color }) => (
            <div key={title} className={cn("rounded-xl p-5 border", color)}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-foreground mb-3 flex items-center gap-2">{icon}{title}</h3>
              <ul className="space-y-2">
                {items.map(item => (
                  <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground uppercase tracking-wider">
                    <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>
      )}

      {/* How to use hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="rounded-xl border border-border bg-card/30 p-4 text-xs text-muted-foreground z-10 relative"
      >
        <p className="font-bold text-foreground mb-2 flex items-center gap-2 uppercase tracking-widest">
          <Sparkles className="w-4 h-4 text-foreground" />
          Instructions
        </p>
        <ol className="list-decimal list-inside space-y-1.5 uppercase tracking-wider text-[10px]">
          <li>Select a product from the database drop-down</li>
          <li>Chart renders actual sales and prediction metrics</li>
          <li>Click <span className="font-bold text-foreground underline">Run AI Agents</span> to request weather + market validation</li>
          <li>Act on the <span className="font-bold">Reorder Action</span> recommendation card</li>
        </ol>
      </motion.div>
    </div>
  );
}
