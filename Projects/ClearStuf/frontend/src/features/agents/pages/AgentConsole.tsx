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

const accentClasses: Record<string, { bg: string; text: string; ring: string; border: string; bgDot: string }> = {
  blue:    { bg: 'bg-secondary/40',    text: 'text-foreground font-bold',    ring: 'ring-border/40',    border: 'border-border', bgDot: 'bg-foreground' },
  pink:    { bg: 'bg-card',           text: 'text-muted-foreground',         ring: 'ring-border/20',    border: 'border-border/80', bgDot: 'bg-muted-foreground' },
  amber:   { bg: 'bg-secondary/60',    text: 'text-foreground/80',            ring: 'ring-border/60',    border: 'border-border/60', bgDot: 'bg-foreground/50' },
  emerald: { bg: 'bg-card border border-border/80', text: 'text-foreground', ring: 'ring-border/80', border: 'border-border', bgDot: 'bg-foreground' },
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
        <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl border border-border bg-background')}>
          {agent.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground truncate">{agent.name}</h3>
            {isActive && (
              <span className="flex gap-0.5">
                {[0, 1, 2].map(i => (
                  <motion.span
                    key={i}
                    className={cn('h-1.5 w-1.5 rounded-full', colors.bgDot)}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </span>
            )}
          </div>
          <p className={cn('text-[10px] uppercase tracking-widest', isActive ? colors.text : 'text-muted-foreground')}>{agent.role}</p>
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
      <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm mt-0.5 border border-border bg-background')}>
        {log.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1.5">
          <span className={cn('text-xs font-bold uppercase tracking-wider', agent ? colors.text : 'text-muted-foreground')}>{log.agent}</span>
          <span className="text-[9px] font-mono text-muted-foreground">{log.timestamp}</span>
        </div>
        <div className={cn('rounded-2xl rounded-tl-sm border p-4', colors.border, colors.bg)}>
          <p className="text-xs text-foreground leading-relaxed font-semibold uppercase tracking-wider">{log.message}</p>
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
    <div className="min-h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-background dot-bg">
      <div className="absolute inset-0 glow-amber opacity-10 pointer-events-none" />

      {/* LEFT SIDEBAR */}
      <aside className="w-full md:w-72 lg:w-80 border-r border-border bg-card/50 flex flex-col shrink-0 z-10 relative">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-5 w-5 text-foreground animate-pulse" />
            <h1 className="text-sm font-bold uppercase tracking-widest text-foreground">AI Council</h1>
          </div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Multi-agent consensus panel</p>
        </div>

        {/* Product selector */}
        <div className="p-4 border-b border-border">
          <label className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
            <Package className="h-3.5 w-3.5 text-foreground" />
            Analyzing Product
          </label>

          <div className="relative">
            <button
              onClick={() => setSelectOpen(o => !o)}
              disabled={isRunning}
              className="w-full flex items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-left transition-colors hover:bg-secondary disabled:opacity-60"
            >
              <span className="truncate text-foreground">
                {selectedProduct ? (selectedProduct.name.length > 22 ? selectedProduct.name.slice(0, 22) + '…' : selectedProduct.name) : 'Select SKU…'}
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
                          'w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors hover:bg-secondary',
                          p.id === selectedProductId ? 'text-foreground font-black' : 'text-muted-foreground'
                        )}
                      >
                        <div className="truncate">{p.name}</div>
                        <div className="text-[9px] text-muted-foreground font-mono mt-0.5">{p.category} · {p.sku}</div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
              'w-full flex items-center justify-center gap-2 rounded-lg py-3 text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50',
              isRunning
                ? 'bg-secondary text-foreground border border-border hover:bg-secondary/70'
                : 'bg-foreground text-background shadow-brand hover:opacity-90'
            )}
          >
            {isRunning ? (
              <><Square className="h-4 w-4" /> Stop Analysis</>
            ) : (
              <><Play className="h-4 w-4 fill-current" /> Run Analysis</>
            )}
          </button>
        </div>
      </aside>

      {/* MAIN LOG PANEL */}
      <div className="flex-1 flex flex-col min-h-0 z-10 relative">
        {/* Header bar */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-border bg-card/30 sticky top-0 z-10 backdrop-blur-sm">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-foreground">Live Agent Deliberation Log</h2>
            {selectedProduct && (
              <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-widest">{selectedProduct.name} · SKU: {selectedProduct.sku}</p>
            )}
          </div>
          <div className={cn(
            'flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest',
            wsConnected && isRunning
              ? 'border-border bg-secondary text-foreground'
              : 'border-border bg-muted/50 text-muted-foreground'
          )}>
            {wsConnected && isRunning ? (
              <><Wifi className="h-3 w-3" /> Live Socket</>
            ) : (
              <><WifiOff className="h-3 w-3" /> Offline</>
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
                <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-border bg-card mb-4">
                  <BrainCircuit className="h-8 w-8 text-muted-foreground/35" />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-foreground">Select SKU and run analysis</p>
                <p className="mt-1 text-[10px] text-muted-foreground max-w-xs uppercase tracking-wider leading-relaxed">
                  The AI agents will process daily quantities and output consensus restock suggestions.
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
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-sm mt-0.5">
                  {agents.find(a => a.id === activeAgent)?.emoji}
                </div>
                <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-3">
                  {[0, 150, 300].map(delay => (
                    <motion.span
                      key={delay}
                      className="h-1.5 w-1.5 rounded-full bg-foreground"
                      animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
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
