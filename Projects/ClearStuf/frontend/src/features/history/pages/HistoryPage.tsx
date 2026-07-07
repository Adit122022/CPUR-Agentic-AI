import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileSpreadsheet, TrendingUp, RefreshCw, AlertCircle, Calendar,
  Clock, Hash, Database, CheckCircle, XCircle, ChevronDown, ChevronUp,
  Copy, Check, BrainCircuit, Cpu, Sparkles, Package, Play, X,
  Zap, BarChart3, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../../services/api';
import { cn } from '../../../lib/utils';

interface UploadHistoryItem {
  id: number;
  filename: string;
  file_hash: string;
  total_rows: number;
  unique_products: number;
  uploaded_at: string;
  status: string;
}

interface PredictionHistoryItem {
  id: number;
  product_id: number;
  product_name: string;
  product_sku: string;
  forecast_date: string;
  predicted_quantity: number;
  model_used: string;
  agent_adjustments: string | null;
  adjusted_quantity: number | null;
  created_at: string;
}

interface ProductItem {
  id: number;
  name: string;
  sku: string;
  category: string;
  current_stock: number;
  price: number;
}

interface ForecastRunResult {
  product_id: number;
  status: 'idle' | 'running' | 'done' | 'error';
  predicted_quantity?: number;
  adjusted_quantity?: number | null;
  model_used?: string;
  error?: string;
}

interface ProductPredictionGroup {
  product_id: number;
  product_name: string;
  product_sku: string;
  predictions: PredictionHistoryItem[];
  hasAgentRuns: boolean;
}

export default function HistoryPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'uploads' | 'predictions'>('uploads');
  const [uploads, setUploads] = useState<UploadHistoryItem[]>([]);
  const [predictions, setPredictions] = useState<PredictionHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Expand/collapse state
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set());
  const [expandedRationale, setExpandedRationale] = useState<Set<number>>(new Set());
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Quick forecast runner state
  const [showForecastPanel, setShowForecastPanel] = useState(false);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [forecastMode, setForecastMode] = useState<'ml' | 'agents'>('ml');
  const [runResults, setRunResults] = useState<Map<number, ForecastRunResult>>(new Map());
  const [runningAll, setRunningAll] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [uploadsRes, predictionsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/history/uploads`),
        fetch(`${API_BASE_URL}/api/history/predictions`),
      ]);
      if (!uploadsRes.ok) throw new Error('Failed to fetch upload history.');
      if (!predictionsRes.ok) throw new Error('Failed to fetch predictions history.');
      setUploads(await uploadsRes.json());
      setPredictions(await predictionsRes.json());
    } catch (e: any) {
      setError(e.message || 'System history could not be retrieved.');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/products`);
      if (!res.ok) throw new Error('Failed to load products.');
      setProducts(await res.json());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openForecastPanel = () => {
    setShowForecastPanel(true);
    setRunResults(new Map());
    fetchProducts();
  };

  const runForecastForProduct = async (productId: number) => {
    setRunResults(prev => {
      const next = new Map(prev);
      next.set(productId, { product_id: productId, status: 'running' });
      return next;
    });

    try {
      const res = await fetch(`${API_BASE_URL}/api/forecast/trigger`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productId,
          model_type: 'linear_regression',
          use_agents: forecastMode === 'agents',
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ detail: 'Unknown error' }));
        throw new Error(errData.detail || 'Forecast failed');
      }

      const data = await res.json();
      setRunResults(prev => {
        const next = new Map(prev);
        next.set(productId, {
          product_id: productId,
          status: 'done',
          predicted_quantity: data.forecast.predicted_quantity,
          adjusted_quantity: data.forecast.adjusted_quantity,
          model_used: data.forecast.model_used,
        });
        return next;
      });
    } catch (e: any) {
      setRunResults(prev => {
        const next = new Map(prev);
        next.set(productId, { product_id: productId, status: 'error', error: e.message });
        return next;
      });
    }
  };

  const runAllForecasts = async () => {
    setRunningAll(true);
    for (const product of products) {
      await runForecastForProduct(product.id);
    }
    setRunningAll(false);
    // Refresh history data after all done
    await fetchData();
  };

  // Group predictions by product
  const predictionGroups: ProductPredictionGroup[] = [];
  const groupMap = new Map<number, ProductPredictionGroup>();
  for (const p of predictions) {
    if (!groupMap.has(p.product_id)) {
      const grp: ProductPredictionGroup = {
        product_id: p.product_id,
        product_name: p.product_name,
        product_sku: p.product_sku,
        predictions: [],
        hasAgentRuns: false,
      };
      groupMap.set(p.product_id, grp);
      predictionGroups.push(grp);
    }
    const grp = groupMap.get(p.product_id)!;
    grp.predictions.push(p);
    if (p.agent_adjustments) grp.hasAgentRuns = true;
  }

  const toggleGroup = (id: number) =>
    setExpandedGroups(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const toggleRationale = (id: number) =>
    setExpandedRationale(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString([], {
        year: 'numeric', month: 'short', day: '2-digit',
        hour: '2-digit', minute: '2-digit',
      });
    } catch { return dateStr; }
  };

  const doneCount = [...runResults.values()].filter(r => r.status === 'done').length;
  const errorCount = [...runResults.values()].filter(r => r.status === 'error').length;
  const runningCount = [...runResults.values()].filter(r => r.status === 'running').length;

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto dot-bg relative overflow-x-hidden">
      <div className="absolute inset-0 glow-amber opacity-10 pointer-events-none" />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
        className="mb-10 z-10 relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-4">
            <Database className="h-3.5 w-3.5 text-foreground" />
            <span>Operations History Log</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-foreground mb-2">System History</h1>
          <p className="text-muted-foreground text-xs tracking-wider uppercase">Audit spreadsheet ingestion and all forecasting predictions.</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <motion.button whileTap={{ scale: 0.95 }} onClick={openForecastPanel}
            className="flex items-center gap-2 px-4 py-2.5 bg-foreground text-background text-xs font-bold uppercase tracking-widest rounded-lg hover:opacity-90 transition-all shadow-brand">
            <Zap className="w-3.5 h-3.5" />
            Run Forecast
          </motion.button>
          <motion.button whileTap={{ scale: 0.95 }} onClick={fetchData} disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-lg text-xs font-bold uppercase tracking-widest text-foreground hover:bg-secondary transition-all">
            <motion.div animate={loading ? { rotate: 360 } : { rotate: 0 }}
              transition={loading ? { repeat: Infinity, duration: 1, ease: 'linear' } : {}}>
              <RefreshCw className="w-3.5 h-3.5" />
            </motion.div>
            Refresh
          </motion.button>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 z-10 relative">
        {[
          { label: 'Total Uploads', value: uploads.length, icon: FileSpreadsheet },
          { label: 'Products Tracked', value: predictionGroups.length, icon: Package },
          { label: 'Total Predictions', value: predictions.length, icon: TrendingUp },
          { label: 'Agent Runs', value: predictions.filter(p => p.agent_adjustments).length, icon: BrainCircuit },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-card/60 border border-border rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <stat.icon className="h-3.5 w-3.5 text-foreground" />
              <span className="text-[9px] uppercase tracking-widest font-bold">{stat.label}</span>
            </div>
            <span className="text-2xl font-black text-foreground">{stat.value}</span>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border mb-8 gap-6 z-10 relative overflow-x-auto">
        {[
          { key: 'uploads', label: `Ingested Spreadsheets (${uploads.length})`, icon: FileSpreadsheet },
          { key: 'predictions', label: `Prediction Audits (${predictions.length})`, icon: TrendingUp },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
            className={cn(
              "pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap flex items-center gap-2",
              activeTab === tab.key
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}>
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Panel */}
      <div className="z-10 relative">
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center text-muted-foreground text-xs uppercase tracking-widest gap-3 bg-card/40 border border-border rounded-xl">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
              <RefreshCw className="w-5 h-5 text-foreground" />
            </motion.div>
            Loading historical data...
          </div>
        ) : error ? (
          <div className="h-64 flex flex-col items-center justify-center p-6 text-center bg-card/40 border border-border rounded-xl">
            <AlertCircle className="w-8 h-8 text-foreground mb-3" />
            <p className="text-xs font-bold uppercase tracking-wider text-foreground">{error}</p>
            <button onClick={fetchData} className="mt-4 px-4 py-2 border border-border rounded-lg text-[10px] font-bold uppercase tracking-wider bg-background hover:bg-secondary transition-colors">
              Retry Connection
            </button>
          </div>

        ) : activeTab === 'uploads' ? (
          uploads.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center gap-4 bg-card/40 border border-border rounded-xl">
              <FileSpreadsheet className="w-10 h-10 text-muted-foreground/40" />
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-foreground mb-1">No spreadsheets yet</p>
                <p className="text-xs text-muted-foreground">Upload a CSV on the Upload Data page to see your ingestion history.</p>
              </div>
              <button onClick={() => navigate('/upload')}
                className="px-4 py-2 bg-foreground text-background text-[10px] font-bold uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity">
                Go to Upload Data
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {uploads.map((item, i) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-card/60 border border-border rounded-xl p-4 sm:p-5 backdrop-blur-sm hover:border-border/80 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary/20">
                        <FileSpreadsheet className="h-4 w-4 text-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-foreground truncate">{item.filename}</p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Clock className="h-2.5 w-2.5" />{formatDate(item.uploaded_at)}
                          </span>
                          <span className="text-[10px] text-muted-foreground">{item.unique_products} SKUs · {item.total_rows} rows</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                      <div className="flex items-center gap-1.5 bg-secondary/20 border border-border rounded px-2 py-1">
                        <Hash className="h-2.5 w-2.5 text-muted-foreground/60" />
                        <span className="font-mono text-[10px] text-muted-foreground" title={item.file_hash}>
                          {item.file_hash.slice(0, 8)}…{item.file_hash.slice(-4)}
                        </span>
                        <button onClick={() => copyToClipboard(item.file_hash)}
                          className="p-0.5 hover:text-foreground transition-colors" title="Copy hash">
                          {copiedHash === item.file_hash
                            ? <Check className="h-2.5 w-2.5 text-green-500" />
                            : <Copy className="h-2.5 w-2.5" />}
                        </button>
                      </div>
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2.5 py-1 rounded text-[9px] uppercase tracking-wider font-bold border",
                        item.status === 'Success'
                          ? "bg-secondary text-foreground border-border"
                          : "bg-secondary/20 text-muted-foreground border-border/60"
                      )}>
                        {item.status === 'Success' ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                        {item.status}
                      </span>
                      {/* Quick forecast CTA per upload */}
                      <button onClick={openForecastPanel}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-border bg-secondary/20 hover:bg-secondary/40 text-[9px] font-bold uppercase tracking-wider text-foreground transition-colors">
                        <Zap className="h-2.5 w-2.5" /> Run Forecast
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )

        ) : (
          predictionGroups.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center gap-4 bg-card/40 border border-border rounded-xl">
              <TrendingUp className="w-10 h-10 text-muted-foreground/40" />
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-foreground mb-1">No predictions yet</p>
                <p className="text-xs text-muted-foreground">Load the Forecast chart for any product, or use the Run Forecast button above.</p>
              </div>
              <button onClick={openForecastPanel}
                className="px-4 py-2 bg-foreground text-background text-[10px] font-bold uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity">
                <span className="flex items-center gap-1.5"><Zap className="h-3 w-3" /> Run Forecast Now</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {predictionGroups.map((group, gi) => {
                const isOpen = expandedGroups.has(group.product_id);
                const latestPred = group.predictions[0];
                return (
                  <motion.div key={group.product_id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: gi * 0.05 }}
                    className="bg-card/60 border border-border rounded-xl backdrop-blur-sm overflow-hidden hover:border-border/80 transition-all">
                    <button className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 sm:p-5 text-left"
                      onClick={() => toggleGroup(group.product_id)}>
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary/20">
                          <Package className="h-4 w-4 text-foreground" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-bold text-sm text-foreground truncate">{group.product_name}</p>
                            <span className="font-mono text-[9px] text-muted-foreground bg-secondary/30 px-1.5 py-0.5 rounded border border-border/40">{group.product_sku}</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                            <span className="text-[10px] text-muted-foreground">
                              {group.predictions.length} prediction{group.predictions.length !== 1 ? 's' : ''}
                            </span>
                            {group.hasAgentRuns && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-foreground">
                                <BrainCircuit className="h-2.5 w-2.5" /> AI Agent Enriched
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:shrink-0">
                        {/* Re-run forecast shortcut */}
                        <button
                          onClick={e => { e.stopPropagation(); navigate(`/forecast?product_id=${group.product_id}`); }}
                          className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider border border-border rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors text-foreground">
                          <BarChart3 className="h-3 w-3" /> View Chart
                        </button>
                        <div className="text-right hidden sm:block">
                          <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Latest</p>
                          <p className="font-mono font-bold text-foreground text-sm">
                            {Math.round(latestPred.adjusted_quantity ?? latestPred.predicted_quantity)} units
                          </p>
                          <p className="text-[9px] text-muted-foreground">{latestPred.forecast_date}</p>
                        </div>
                        <div className="p-2 rounded-lg border border-border bg-secondary/20">
                          {isOpen ? <ChevronUp className="h-4 w-4 text-foreground" /> : <ChevronDown className="h-4 w-4 text-foreground" />}
                        </div>
                      </div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                          className="overflow-hidden border-t border-border/40">
                          <div className="overflow-x-auto">
                            <table className="w-full min-w-[560px] text-left border-collapse">
                              <thead>
                                <tr className="bg-secondary/20 text-[9px] uppercase tracking-widest text-muted-foreground">
                                  <th className="px-4 py-3">Forecast Date</th>
                                  <th className="px-4 py-3">ML Baseline</th>
                                  <th className="px-4 py-3">AI Consensus</th>
                                  <th className="px-4 py-3">Model</th>
                                  <th className="px-4 py-3">Type</th>
                                  <th className="px-4 py-3">Logged At</th>
                                  <th className="px-4 py-3 text-center">Rationale</th>
                                </tr>
                              </thead>
                              <tbody className="text-xs">
                                {group.predictions.map((pred) => {
                                  const isAgentEnriched = !!pred.agent_adjustments;
                                  const isAdjusted = pred.adjusted_quantity !== null && pred.adjusted_quantity !== pred.predicted_quantity;
                                  const showRationale = expandedRationale.has(pred.id);
                                  return (
                                    <>
                                      <tr key={pred.id}
                                        className={cn("border-b border-border/30 last:border-0 hover:bg-secondary/10 transition-colors", showRationale && "bg-secondary/10")}>
                                        <td className="px-4 py-3 font-mono text-[10px] whitespace-nowrap text-foreground font-bold">
                                          <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3 text-muted-foreground" />{pred.forecast_date}</span>
                                        </td>
                                        <td className="px-4 py-3 font-mono font-bold text-foreground">
                                          {Math.round(pred.predicted_quantity)} <span className="text-muted-foreground font-normal">units</span>
                                        </td>
                                        <td className="px-4 py-3 font-mono font-bold text-foreground">
                                          {pred.adjusted_quantity !== null ? Math.round(pred.adjusted_quantity) : Math.round(pred.predicted_quantity)}{' '}
                                          <span className="text-muted-foreground font-normal">units</span>
                                          {isAdjusted && <span className="ml-1 text-[9px] text-foreground font-bold uppercase">↑ Adj</span>}
                                        </td>
                                        <td className="px-4 py-3 text-[10px] text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                                          <span className="flex items-center gap-1"><Cpu className="h-3 w-3" />{pred.model_used.replace(/_/g, ' ')}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                          {isAgentEnriched ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-foreground text-background">
                                              <Sparkles className="h-2.5 w-2.5" /> AI Agent
                                            </span>
                                          ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border border-border text-muted-foreground">
                                              <Cpu className="h-2.5 w-2.5" /> ML Only
                                            </span>
                                          )}
                                        </td>
                                        <td className="px-4 py-3 text-[10px] text-muted-foreground font-mono whitespace-nowrap">
                                          <span className="flex items-center gap-1"><Clock className="h-2.5 w-2.5" />{formatDate(pred.created_at)}</span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                          {isAgentEnriched ? (
                                            <button onClick={() => toggleRationale(pred.id)}
                                              className="inline-flex items-center gap-1 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded bg-foreground text-background hover:opacity-90 transition-opacity">
                                              {showRationale ? <><ChevronUp className="h-3 w-3" /> Collapse</> : <><ChevronDown className="h-3 w-3" /> Rationale</>}
                                            </button>
                                          ) : (
                                            <span className="text-[10px] text-muted-foreground/40 uppercase tracking-widest font-bold">—</span>
                                          )}
                                        </td>
                                      </tr>
                                      {showRationale && pred.agent_adjustments && (
                                        <tr className="bg-secondary/15 border-b border-border/30">
                                          <td colSpan={7} className="px-5 py-4">
                                            <div className="rounded-lg border border-border bg-card p-4 max-w-4xl mx-auto">
                                              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
                                                <BrainCircuit className="h-4 w-4 text-foreground" />
                                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground">AI Agent Deliberation Rationale</h4>
                                              </div>
                                              <pre className="text-xs text-foreground leading-relaxed whitespace-pre-wrap font-mono max-h-72 overflow-y-auto">
                                                {pred.agent_adjustments}
                                              </pre>
                                            </div>
                                          </td>
                                        </tr>
                                      )}
                                    </>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                          <div className="px-5 py-3 border-t border-border/30 flex justify-end gap-2">
                            <button onClick={() => navigate(`/forecast?product_id=${group.product_id}`)}
                              className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
                              <TrendingUp className="h-3 w-3" /> View Forecast Chart
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )
        )}
      </div>

      {/* ═══════════ QUICK FORECAST PANEL ═══════════ */}
      <AnimatePresence>
        {showForecastPanel && (
          <>
            {/* Backdrop */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
              onClick={() => !runningAll && setShowForecastPanel(false)} />

            {/* Slide-in Panel */}
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed right-0 top-0 h-full w-full max-w-lg bg-card border-l border-border z-50 flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Panel Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-border shrink-0">
                <div>
                  <div className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    <Zap className="h-3 w-3" /> Quick Forecast Runner
                  </div>
                  <h2 className="text-lg font-black uppercase tracking-tight text-foreground">Run Predictions</h2>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Run ML or AI Agent forecasts on your uploaded products.</p>
                </div>
                <button onClick={() => setShowForecastPanel(false)} disabled={runningAll}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Mode Selector */}
              <div className="px-6 py-4 border-b border-border shrink-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Forecast Mode</p>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { key: 'ml', label: 'ML Forecast', desc: 'Linear Regression only', icon: Cpu },
                    { key: 'agents', label: 'AI Agents', desc: 'ML + CrewAI enrichment', icon: BrainCircuit },
                  ] as const).map(mode => (
                    <button key={mode.key}
                      onClick={() => setForecastMode(mode.key)}
                      className={cn(
                        "flex flex-col items-start gap-1 p-3 rounded-lg border transition-all text-left",
                        forecastMode === mode.key
                          ? "border-foreground bg-foreground/10"
                          : "border-border bg-secondary/10 hover:bg-secondary/20"
                      )}>
                      <div className="flex items-center gap-2">
                        <mode.icon className={cn("h-4 w-4", forecastMode === mode.key ? "text-foreground" : "text-muted-foreground")} />
                        <span className={cn("text-[10px] font-bold uppercase tracking-wider", forecastMode === mode.key ? "text-foreground" : "text-muted-foreground")}>
                          {mode.label}
                        </span>
                      </div>
                      <span className="text-[9px] text-muted-foreground">{mode.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress indicator if running */}
              {runResults.size > 0 && (
                <div className="px-6 py-3 border-b border-border bg-secondary/10 shrink-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Progress</span>
                    <span className="text-[10px] font-mono text-foreground">{doneCount + errorCount}/{products.length}</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-foreground rounded-full"
                      animate={{ width: `${products.length > 0 ? ((doneCount + errorCount) / products.length) * 100 : 0}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <div className="flex gap-3 mt-2">
                    {doneCount > 0 && <span className="text-[9px] text-foreground font-bold">✓ {doneCount} done</span>}
                    {errorCount > 0 && <span className="text-[9px] text-red-400 font-bold">✗ {errorCount} failed</span>}
                    {runningCount > 0 && <span className="text-[9px] text-muted-foreground font-bold">⟳ {runningCount} running</span>}
                  </div>
                </div>
              )}

              {/* Products List */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
                {productsLoading ? (
                  <div className="h-32 flex items-center justify-center text-muted-foreground text-xs uppercase tracking-widest gap-2">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                      <RefreshCw className="h-4 w-4" />
                    </motion.div>
                    Loading products...
                  </div>
                ) : products.length === 0 ? (
                  <div className="h-32 flex flex-col items-center justify-center text-center gap-2">
                    <Package className="h-8 w-8 text-muted-foreground/30" />
                    <p className="text-xs text-muted-foreground">No products in database yet. Upload data first.</p>
                  </div>
                ) : (
                  products.map((product) => {
                    const result = runResults.get(product.id);
                    return (
                      <div key={product.id}
                        className={cn(
                          "flex items-center justify-between gap-3 p-3 rounded-lg border transition-all",
                          result?.status === 'done' ? "border-border bg-secondary/10" :
                          result?.status === 'error' ? "border-red-500/30 bg-red-500/5" :
                          result?.status === 'running' ? "border-foreground/40 bg-foreground/5" :
                          "border-border bg-secondary/5 hover:bg-secondary/10"
                        )}>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 min-w-0">
                            <p className="text-xs font-bold text-foreground truncate">{product.name}</p>
                            <span className="text-[9px] font-mono text-muted-foreground bg-secondary/30 px-1.5 py-0.5 rounded shrink-0">{product.sku}</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{product.category} · Stock: {product.current_stock}</p>

                          {/* Result row */}
                          {result?.status === 'done' && (
                            <div className="flex items-center gap-2 mt-1.5">
                              <CheckCircle className="h-3 w-3 text-green-500 shrink-0" />
                              <span className="text-[10px] text-foreground font-mono font-bold">
                                {Math.round(result.adjusted_quantity ?? result.predicted_quantity ?? 0)} units predicted
                              </span>
                              {result.adjusted_quantity && result.adjusted_quantity !== result.predicted_quantity && (
                                <span className="text-[9px] text-muted-foreground">(ML: {Math.round(result.predicted_quantity ?? 0)})</span>
                              )}
                            </div>
                          )}
                          {result?.status === 'error' && (
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <XCircle className="h-3 w-3 text-red-400 shrink-0" />
                              <span className="text-[10px] text-red-400 font-bold">{result.error}</span>
                            </div>
                          )}
                        </div>

                        {/* Action button */}
                        <div className="shrink-0">
                          {result?.status === 'running' ? (
                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                              <RefreshCw className="h-4 w-4 text-foreground" />
                            </motion.div>
                          ) : result?.status === 'done' ? (
                            <button
                              onClick={() => runForecastForProduct(product.id)}
                              title="Re-run forecast"
                              className="p-1.5 rounded border border-border hover:bg-secondary transition-colors">
                              <RefreshCw className="h-3 w-3 text-muted-foreground" />
                            </button>
                          ) : (
                            <button
                              onClick={() => runForecastForProduct(product.id)}
                              disabled={runningAll}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-foreground text-background text-[9px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-40">
                              <Play className="h-3 w-3" /> Run
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Panel Footer */}
              <div className="px-6 py-4 border-t border-border shrink-0 flex flex-col sm:flex-row gap-3">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={runAllForecasts}
                  disabled={runningAll || productsLoading || products.length === 0}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-foreground text-background text-xs font-bold uppercase tracking-widest rounded-lg hover:opacity-90 transition-all disabled:opacity-40"
                >
                  {runningAll ? (
                    <>
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                        <RefreshCw className="h-3.5 w-3.5" />
                      </motion.div>
                      Running All...
                    </>
                  ) : (
                    <>
                      <Zap className="h-3.5 w-3.5" />
                      Run All {products.length} Products
                    </>
                  )}
                </motion.button>
                {doneCount > 0 && (
                  <button
                    onClick={() => { setShowForecastPanel(false); setActiveTab('predictions'); fetchData(); }}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 border border-border rounded-lg text-xs font-bold uppercase tracking-widest text-foreground hover:bg-secondary transition-colors"
                  >
                    View Results <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
