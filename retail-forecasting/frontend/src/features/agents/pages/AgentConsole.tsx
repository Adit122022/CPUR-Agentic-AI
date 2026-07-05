import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, Activity, BrainCircuit, Package, Wifi, WifiOff, ChevronDown } from 'lucide-react';
import type { AgentLog } from '../../../types';
import { API_BASE_URL } from '../../../services/api';
import { cn } from '../../../lib/utils';

const agents = [
  { id: 'data',    name: 'Data Analyst',     role: 'Quantitative Analysis', emoji: '📊', accent: 'blue'   },
  { id: 'market',  name: 'Market Scout',      role: 'Trend Detection',       emoji: '🔍', accent: 'pink'   },
  { id: 'weather', name: 'Weather Analyst',   role: 'Climate Impacts',       emoji: '🌤️', accent: 'amber'  },
  { id: 'synth',   name: 'Synthesizer',       role: 'Consensus Builder',     emoji: '🧠', accent: 'emerald'},
];

const accentClasses: Record<string, { bg: string; text: string; ring: string; border: string }> = {
  blue:    { bg: 'bg-blue-500/10',    text: 'text-blue-400',    ring: 'ring-blue-500/30',    border: 'border-blue-500/40'    },
  pink:    { bg: 'bg-pink-500/10',    text: 'text-pink-400',    ring: 'ring-pink-500/30',    border: 'border-pink-500/40'    },
  amber:   { bg: 'bg-amber-500/10',   text: 'text-amber-400',   ring: 'ring-amber-500/30',   border: 'border-amber-500/40'   },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', ring: 'ring-emerald-500/30', border: 'border-emerald-500/40' },
};

interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
}

function AgentCard({ agent, isActive }: { agent: typeof agents[0]; isActive: boolean }) {
  const colors = accentClasses[agent.accent];
  return (
    <motion.div
      animate={{ scale: isActive ? 1.02 : 1 }}
      className={cn(
        'rounded-xl border p-4 transition-all duration-300',
        isActive ? `${colors.border} ring-1 ${colors.ring} bg-card` : 'border-border bg-card/50'
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl', colors.bg)}>
          {agent.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground truncate">{agent.name}</h3>
            {isActive && (
              <span className="flex gap-0.5">
                {[0, 1, 2].map(i => (
                  <motion.span
                    key={i}
                    className={cn('h-1.5 w-1.5 rounded-full', colors.text.replace('text-', 'bg-'))}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </span>
            )}
          </div>
          <p className={cn('text-xs', isActive ? colors.text : 'text-muted-foreground')}>{agent.role}</p>
        </div>
      </div>
    </motion.div>
  );
}

function LogBubble({ log }: { log: AgentLog }) {
  const agent = agents.find(a => a.name === log.agent);
  const colors = agent ? accentClasses[agent.accent] : accentClasses.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="flex gap-3"
    >
      <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm mt-0.5', colors.bg)}>
        {log.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1.5">
          <span className={cn('text-xs font-semibold', agent ? colors.text : 'text-muted-foreground')}>{log.agent}</span>
          <span className="text-[10px] text-muted-foreground">{log.timestamp}</span>
        </div>
        <div className={cn('rounded-2xl rounded-tl-sm border p-4', colors.border, colors.bg)}>
          <p className="text-sm text-foreground leading-relaxed">{log.message}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function AgentConsole() {
  const [searchParams] = useSearchParams();
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    searchParams.get('product_id') ? Number(searchParams.get('product_id')) : null
  );
  const [selectOpen, setSelectOpen] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs, activeAgent]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then(r => r.json())
      .then((data: Product[]) => {
        setProducts(data);
        if (!selectedProductId && data.length > 0) setSelectedProductId(data[0].id);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (isRunning) {
      if (!selectedProductId) { setIsRunning(false); return; }
      setLogs([]);

      const wsProtocol = API_BASE_URL.startsWith('https') ? 'wss' : 'ws';
      const wsUrl = `${wsProtocol}://${API_BASE_URL.replace(/^https?:\/\//, '')}/api/ws/logs`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen  = () => setWsConnected(true);
      wsRef.current.onclose = () => setWsConnected(false);
      wsRef.current.onerror = () => setWsConnected(false);

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const agent = agents.find(a => a.name === data.agent) || agents[3];
          setActiveAgent(agent.id);
          setTimeout(() => {
            setLogs(prev => [...prev, {
              id: `log-${Date.now()}-${Math.random()}`,
              agent: agent.name,
              role: agent.role,
              emoji: agent.emoji,
              message: data.message,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
              color: '',
            }]);
            setActiveAgent(null);
          }, 500);
        } catch (e) { console.error(e); }
      };

      const selectedProduct = products.find(p => p.id === selectedProductId);
      setLogs([{
        id: 'system-start',
        agent: 'System',
        role: 'Orchestrator',
        emoji: '⚙️',
        message: `Starting AI agent analysis for: ${selectedProduct?.name || `Product #${selectedProductId}`} (SKU: ${selectedProduct?.sku || '—'})`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        color: '',
      }]);

      fetch(`${API_BASE_URL}/api/forecast/trigger`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: selectedProductId, model_type: 'linear_regression', use_agents: true }),
      }).then(res => res.json()).then(() => {
        setTimeout(() => setIsRunning(false), 2000);
      }).catch(err => { console.error(err); setIsRunning(false); });

    } else {
      wsRef.current?.close();
      setWsConnected(false);
    }

    return () => { wsRef.current?.close(); };
  }, [isRunning]);

  const selectedProduct = products.find(p => p.id === selectedProductId);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-background">

      {/* ── LEFT SIDEBAR ── */}
      <aside className="w-full md:w-72 lg:w-80 border-r border-border bg-card/50 flex flex-col shrink-0">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-5 w-5 text-brand" />
            <h1 className="text-base font-bold text-foreground">AI Council</h1>
          </div>
          <p className="text-xs text-muted-foreground">Multi-agent deliberation system</p>
        </div>

        {/* Product selector */}
        <div className="p-4 border-b border-border">
          <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            <Package className="h-3 w-3" />
            Analyzing Product
          </label>

          {/* Custom select dropdown */}
          <div className="relative">
            <button
              onClick={() => setSelectOpen(o => !o)}
              disabled={isRunning}
              className="w-full flex items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-left transition-colors hover:bg-secondary disabled:opacity-60"
            >
              <span className="truncate text-foreground">
                {selectedProduct ? (selectedProduct.name.length > 26 ? selectedProduct.name.slice(0, 26) + '…' : selectedProduct.name) : 'Select product…'}
              </span>
              <ChevronDown className={cn('h-4 w-4 shrink-0 text-muted-foreground transition-transform', selectOpen && 'rotate-180')} />
            </button>
            <AnimatePresence>
              {selectOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute z-20 mt-1 w-full rounded-lg border border-border bg-card shadow-xl overflow-hidden"
                >
                  <div className="max-h-52 overflow-y-auto py-1">
                    {products.map(p => (
                      <button
                        key={p.id}
                        onClick={() => { setSelectedProductId(p.id); setSelectOpen(false); }}
                        className={cn(
                          'w-full text-left px-3 py-2 text-sm transition-colors hover:bg-secondary',
                          p.id === selectedProductId ? 'text-brand font-medium' : 'text-foreground'
                        )}
                      >
                        <div className="truncate">{p.name}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">{p.category} · {p.sku}</div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {selectedProduct && (
            <p className="text-[10px] text-muted-foreground mt-2">{selectedProduct.sku} · {selectedProduct.category}</p>
          )}
        </div>

        {/* Agent cards */}
        <div className="flex-1 p-4 space-y-2.5 overflow-y-auto">
          {agents.map(agent => (
            <AgentCard key={agent.id} agent={agent} isActive={activeAgent === agent.id} />
          ))}
        </div>

        {/* Run button */}
        <div className="p-4 border-t border-border">
          <button
            onClick={() => setIsRunning(r => !r)}
            disabled={!selectedProductId}
            className={cn(
              'w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all disabled:opacity-50',
              isRunning
                ? 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20'
                : 'bg-brand text-background shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:shadow-[0_0_32px_rgba(245,158,11,0.4)] hover:opacity-90'
            )}
          >
            {isRunning ? (
              <><Square className="h-4 w-4" /> Stop Analysis</>
            ) : (
              <><Play className="h-4 w-4 fill-current" /> Run Agent Analysis</>
            )}
          </button>
          {!selectedProductId && (
            <p className="text-[11px] text-muted-foreground text-center mt-2">Select a product first</p>
          )}
        </div>
      </aside>

      {/* ── MAIN LOG PANEL ── */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header bar */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-border bg-card/30 sticky top-0 z-10 backdrop-blur-sm">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Live Agent Deliberation</h2>
            {selectedProduct && (
              <p className="text-xs text-muted-foreground mt-0.5">{selectedProduct.name} · SKU: {selectedProduct.sku}</p>
            )}
          </div>
          <div className={cn(
            'flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium',
            wsConnected && isRunning
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
              : 'border-border bg-muted/50 text-muted-foreground'
          )}>
            {wsConnected && isRunning ? (
              <><Wifi className="h-3 w-3" /> WebSocket Live</>
            ) : (
              <><WifiOff className="h-3 w-3" /> Idle</>
            )}
          </div>
        </div>

        {/* Log feed */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          <AnimatePresence>
            {logs.length === 0 && !activeAgent && !isRunning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-64 text-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card mb-4">
                  <BrainCircuit className="h-8 w-8 text-muted-foreground/40" />
                </div>
                <p className="font-medium text-foreground">Select a product and run the analysis</p>
                <p className="mt-1 text-sm text-muted-foreground max-w-xs">
                  The AI agents will analyze demand factors and produce a consensus forecast.
                </p>
              </motion.div>
            )}

            {logs.map(log => <LogBubble key={log.id} log={log} />)}

            {activeAgent && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex gap-3"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-base mt-0.5">
                  {agents.find(a => a.id === activeAgent)?.emoji}
                </div>
                <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-3">
                  {[0, 150, 300].map(delay => (
                    <motion.span
                      key={delay}
                      className="h-2 w-2 rounded-full bg-muted-foreground/50"
                      animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                      transition={{ duration: 1, repeat: Infinity, delay: delay / 1000 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  );
}
