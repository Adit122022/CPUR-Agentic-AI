import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
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

function LogLine({ log }: { log: AgentLog }) {
  let colorClass = 'text-zinc-400';
  let tag = '[SYSTEM]';

  if (log.agent === 'Data Analyst') {
    colorClass = 'text-cyan-400';
    tag = '[ANALYST]';
  } else if (log.agent === 'Market Scout') {
    colorClass = 'text-pink-400';
    tag = '[SCOUT]';
  } else if (log.agent === 'Weather Analyst') {
    colorClass = 'text-amber-400';
    tag = '[WEATHER]';
  } else if (log.agent === 'Synthesizer') {
    colorClass = 'text-emerald-400';
    tag = '[CONSENSUS]';
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className="font-mono text-[11px] leading-relaxed flex items-start gap-2 py-0.5 border-l-2 border-transparent hover:border-zinc-800 hover:bg-zinc-900/40 px-2 transition-colors"
    >
      <span className="text-zinc-600 shrink-0 select-none">[{log.timestamp}]</span>
      <span className={cn('font-bold shrink-0', colorClass)}>{tag}</span>
      <span className="text-zinc-300 whitespace-pre-wrap">{log.message}</span>
    </motion.div>
  );
}

function parseAndRenderConsensus(text: string) {
  if (!text) return null;
  
  const lines = text.split('\n');
  const items: React.ReactNode[] = [];
  let header = '';
  let footer = '';
  
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    
    if (trimmed.startsWith('###')) {
      header = trimmed.replace(/^###\s*/, '');
    } else if (trimmed.startsWith('*') && trimmed.endsWith('*') && !trimmed.includes('**')) {
      footer = trimmed.replace(/^\*\s*/, '').replace(/\*$/, '');
    } else if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
      // It's a list item: - **Key**: Value
      const cleanLine = trimmed.replace(/^[-*]\s*/, '');
      const boldMatch = cleanLine.match(/^\*\*(.*?)\*\*:(.*)/);
      if (boldMatch) {
        const key = boldMatch[1];
        const val = boldMatch[2].trim();
        
        let bgStyle = "bg-secondary/10 border-l-2 border-border";
        let textStyle = "text-foreground";
        
        if (key.toLowerCase().includes('baseline')) {
          bgStyle = "bg-secondary/20 border-l-2 border-zinc-500/80";
        } else if (key.toLowerCase().includes('market')) {
          bgStyle = "bg-pink-500/5 border-l-2 border-pink-500/50";
        } else if (key.toLowerCase().includes('weather')) {
          bgStyle = "bg-amber-500/5 border-l-2 border-amber-500/50";
        } else if (key.toLowerCase().includes('total')) {
          bgStyle = "bg-secondary/40 border-l-2 border-border/80";
          textStyle = "text-foreground font-bold";
        } else if (key.toLowerCase().includes('final')) {
          bgStyle = "bg-emerald-500/5 border-l-2 border-emerald-500/50";
          textStyle = "text-emerald-400 font-bold";
        }

        items.push(
          <div key={idx} className={cn("p-3 rounded-lg border border-border/40 flex flex-col gap-1 text-[11px] leading-relaxed transition-all hover:bg-secondary/15", bgStyle)}>
            <span className="font-bold text-muted-foreground uppercase tracking-widest text-[9px]">{key}</span>
            <span className={cn("text-zinc-200", textStyle)}>{val.replace(/\*\*/g, '')}</span>
          </div>
        );
      } else {
        items.push(
          <div key={idx} className="p-2.5 rounded-lg border border-border/30 bg-secondary/5 text-[11px] text-zinc-300">
            {cleanLine}
          </div>
        );
      }
    } else {
      items.push(
        <p key={idx} className="text-[11px] text-zinc-400 leading-relaxed py-1">
          {trimmed.replace(/\*\*/g, '')}
        </p>
      );
    }
  });

  return (
    <div className="space-y-3.5">
      {header && (
        <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground pb-2 border-b border-border/60 mb-2">
          {header}
        </h4>
      )}
      
      <div className="flex flex-col gap-2.5">
        {items}
      </div>
      
      {footer && (
        <div className="mt-4 p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest text-center shadow-inner">
          {footer}
        </div>
      )}
    </div>
  );
}

export default function AgentConsole() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useAuth();
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [socketError, setSocketError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    searchParams.get('product_id') ? Number(searchParams.get('product_id')) : null
  );
  const [selectOpen, setSelectOpen] = useState(false);
  const [forecastResult, setForecastResult] = useState<any | null>(null);
  const terminalBodyRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const lastFetchedProductIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTo({
        top: terminalBodyRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [logs, activeAgent]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    fetch(`${API_BASE_URL}/api/products`)
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch products');
        return r.json();
      })
      .then((data: Product[]) => {
        if (Array.isArray(data)) {
          setProducts(data);
          if (!selectedProductId && data.length > 0) setSelectedProductId(data[0].id);
        } else {
          setProducts([]);
        }
      })
      .catch(console.error);
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    if (!selectedProductId || !isLoaded || !isSignedIn) return;
    if (isRunning) return;

    // Avoid double fetching/overwriting detailed logs after running a fresh forecast
    if (lastFetchedProductIdRef.current === selectedProductId) return;
    lastFetchedProductIdRef.current = selectedProductId;

    fetch(`${API_BASE_URL}/api/forecast/results/${selectedProductId}`)
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch past results');
        return r.json();
      })
      .then((data: any[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const lastRun = data[0];
          setForecastResult(lastRun);
          
          const timestamp = new Date(lastRun.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          const dateStr = new Date(lastRun.created_at || Date.now()).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
          
          setLogs([
            {
              id: 'restore-start',
              agent: 'System',
              role: 'Orchestrator',
              emoji: '⚙️',
              message: `Loading historical forecast run from database (Generated on ${dateStr} at ${timestamp})`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
              color: '',
            },
            {
              id: 'restore-ml',
              agent: 'Data Analyst',
              role: 'Quantitative Analysis',
              emoji: '📊',
              message: `Restored baseline mathematical projection: ${Math.round(lastRun.predicted_quantity)} units`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
              color: '',
            },
            {
              id: 'restore-agents',
              agent: 'Synthesizer',
              role: 'Consensus Builder',
              emoji: '🧠',
              message: lastRun.adjusted_quantity 
                ? `Restored agent consensus forecast: ${Math.round(lastRun.adjusted_quantity)} units (Adjustment: ${Math.round((lastRun.adjusted_quantity - lastRun.predicted_quantity)/lastRun.predicted_quantity * 100)}% applied)`
                : `Restored baseline forecast: ${Math.round(lastRun.predicted_quantity)} units (No adjustments applied)`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
              color: '',
            },
            {
              id: 'restore-end',
              agent: 'System',
              role: 'Orchestrator',
              emoji: '⚙️',
              message: `Historical results loaded. Ready for new analysis.`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
              color: '',
            }
          ]);
        } else {
          setForecastResult(null);
          setLogs([]);
        }
      })
      .catch(err => {
        console.error(err);
        setForecastResult(null);
        setLogs([]);
      });
  }, [selectedProductId, isLoaded, isSignedIn, isRunning]);

  useEffect(() => {
    if (isRunning) {
      if (!selectedProductId) { setIsRunning(false); return; }
      setLogs([]);
      setForecastResult(null);
      setSocketError(null);

      const wsProtocol = API_BASE_URL.startsWith('https') ? 'wss' : 'ws';
      const wsUrl = `${wsProtocol}://${API_BASE_URL.replace(/^https?:\/\//, '')}/api/ws/logs`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen  = () => {
        setWsConnected(true);
        setSocketError(null);

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
        })
          .then(res => {
            if (!res.ok) throw new Error('Agent forecast run failed');
            return res.json();
          })
          .then((data) => {
            setForecastResult(data.forecast);
            setTimeout(() => setIsRunning(false), 2000);
          })
          .catch(err => {
            console.error(err);
            setSocketError('Forecast trigger execution failed.');
            setIsRunning(false);
          });
      };

      wsRef.current.onclose = () => setWsConnected(false);
      
      wsRef.current.onerror = () => {
        setWsConnected(false);
        setSocketError('WebSocket connection error. Please ensure the backend server is running.');
        setIsRunning(false);
      };

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

    } else {
      wsRef.current?.close();
      setWsConnected(false);
    }

    return () => { wsRef.current?.close(); };
  }, [isRunning]);

  const selectedProduct = Array.isArray(products) ? products.find(p => p.id === selectedProductId) : undefined;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-background dot-bg overflow-hidden">
      <div className="absolute inset-0 glow-amber opacity-10 pointer-events-none" />

      {/* LEFT SIDEBAR */}
      <aside className="w-full md:w-72 lg:w-80 border-r border-border bg-card/50 flex flex-col shrink-0 z-10 relative h-auto md:h-full overflow-y-auto">
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
                  className="absolute z-20 mt-1 w-full rounded-lg border border-border bg-card shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
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
        <div className="flex-grow p-4 space-y-2.5">
          <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Council Members</p>
          <div className="grid grid-cols-2 md:grid-cols-1 gap-2.5">
            {agents.map(agent => (
              <AgentCard key={agent.id} agent={agent} isActive={activeAgent === agent.id} />
            ))}
          </div>
        </div>

        {/* Run button */}
        <div className="p-4 border-t border-border mt-auto">
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

      {/* MAIN TERMINAL & RESULTS PANEL */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0 z-10 relative h-full p-4 sm:p-6 overflow-y-auto lg:overflow-hidden">
        
        {/* Terminal Window Wrapper */}
        <div className={cn(
          "flex flex-col bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl transition-all duration-300",
          forecastResult ? "flex-grow lg:w-1/2 h-[45vh] lg:h-[calc(100vh-7rem)] shrink-0" : "flex-grow w-full lg:h-[calc(100vh-7rem)] h-full"
        )}>
          
          {/* Terminal Window Header Bar */}
          <div className="flex items-center justify-between gap-4 px-4 py-3 bg-zinc-900 border-b border-zinc-800 shrink-0">
            <div className="flex items-center gap-2">
              {/* Window controls (Mac style dots) */}
              <div className="flex gap-1.5 shrink-0">
                <span className="w-3 h-3 rounded-full bg-red-500/80 border border-red-600/30" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 border border-yellow-600/30" />
                <span className="w-3 h-3 rounded-full bg-green-500/80 border border-green-600/30" />
              </div>
              <span className="font-mono text-[10px] text-zinc-500 font-bold ml-2 tracking-widest uppercase">
                clear_shelf_orchestrator.sh
              </span>
            </div>
            
            {/* Live Socket Status Indicator */}
            <div className={cn(
              'flex items-center gap-1.5 rounded border px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest',
              wsConnected && isRunning
                ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-400 animate-pulse'
                : 'border-zinc-800 bg-zinc-900 text-zinc-500'
            )}>
              {wsConnected && isRunning ? (
                <><Wifi className="h-2.5 w-2.5" /> SOCKET LIVE</>
              ) : (
                <><WifiOff className="h-2.5 w-2.5" /> SOCKET OFFLINE</>
              )}
            </div>
          </div>

          {/* Terminal Logs viewport (Scrollable section) */}
          <div ref={terminalBodyRef} className="flex-1 overflow-y-auto p-4 space-y-1.5 max-h-full">
            <AnimatePresence>
              {socketError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="font-mono text-xs text-red-400 bg-red-950/20 border border-red-900/40 p-3 rounded-lg flex items-center gap-2 select-none"
                >
                  <WifiOff className="h-4 w-4 shrink-0" />
                  <span>[ERROR] {socketError}</span>
                </motion.div>
              )}

              {logs.length === 0 && !activeAgent && !isRunning && !socketError && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-full text-center py-16"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 mb-3">
                    <BrainCircuit className="h-6 w-6 text-zinc-600" />
                  </div>
                  <p className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-400">CONSOLE READY</p>
                  <p className="mt-1 font-mono text-[10px] text-zinc-500 max-w-xs uppercase tracking-wider leading-relaxed">
                    Select a product from the panel and trigger "Run Analysis" to start streaming agent deliberation.
                  </p>
                </motion.div>
              )}

              {/* Logs output */}
              {logs.map(log => <LogLine key={log.id} log={log} />)}

              {/* Agent Active Deliberation/Thinking Log Line */}
              {activeAgent && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-mono text-[11px] text-zinc-400 flex items-center gap-2 px-2 py-0.5"
                >
                  <span className="text-zinc-600 select-none">[{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                  <span className={cn('font-bold shrink-0',
                    activeAgent === 'data' ? 'text-cyan-400' :
                    activeAgent === 'market' ? 'text-pink-400' :
                    activeAgent === 'weather' ? 'text-amber-400' : 'text-emerald-400'
                  )}>
                    [{
                      activeAgent === 'data' ? 'ANALYST' :
                      activeAgent === 'market' ? 'SCOUT' :
                      activeAgent === 'weather' ? 'WEATHER' : 'CONSENSUS'
                    }]
                  </span>
                  <span className="flex items-center gap-1.5 text-zinc-400">
                    Thinking
                    <span className="flex gap-0.5">
                      {[0, 1, 2].map(i => (
                        <motion.span
                          key={i}
                          className="h-1 w-1 bg-current rounded-full"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                    </span>
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Terminal Command Input Prompt Footer */}
          <div className="bg-zinc-950 border-t border-zinc-900 px-4 py-2 shrink-0 select-none font-mono text-[10px] text-zinc-500">
            $ clear_shelf_orchestrator.sh --product-id={selectedProductId || 'null'} --agents=all
          </div>

        </div>

        {/* Consensus Result Panel */}
        {forecastResult && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-grow lg:w-1/2 lg:h-[calc(100vh-7rem)] h-auto flex flex-col bg-card border border-border rounded-xl overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-border bg-secondary/15 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-foreground animate-pulse" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-foreground">Consensus Synthesis Report</h2>
              </div>
              <span className="text-[9px] px-2 py-0.5 border border-border bg-background text-foreground font-bold uppercase tracking-widest animate-pulse">
                Enriched
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-5 scrollbar-thin">
              
              {/* Product Info */}
              <div className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border bg-secondary/10">
                <div className="min-w-0">
                  <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest block">Selected Product</span>
                  <span className="text-xs font-bold text-foreground truncate block">{selectedProduct?.name}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest block">SKU Barcode</span>
                  <span className="text-xs font-mono font-bold text-foreground block">{selectedProduct?.sku}</span>
                </div>
              </div>

              {/* Quantities Side-by-side */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-border bg-secondary/5 flex flex-col justify-center">
                  <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mb-1">ML Baseline Forecast</span>
                  <span className="text-2xl font-black text-foreground font-mono">
                    {Math.round(forecastResult.predicted_quantity)}{' '}
                    <span className="text-xs font-normal text-muted-foreground uppercase">Units</span>
                  </span>
                  <span className="text-[8px] text-muted-foreground uppercase tracking-wider mt-1">Linear Regression</span>
                </div>
                
                <div className="p-4 rounded-xl border border-border bg-foreground/5 flex flex-col justify-center relative overflow-hidden">
                  <span className="text-[8px] font-bold text-foreground uppercase tracking-widest mb-1">Agent Consensus Forecast</span>
                  <span className="text-2xl font-black text-foreground font-mono">
                    {forecastResult.adjusted_quantity ? Math.round(forecastResult.adjusted_quantity) : Math.round(forecastResult.predicted_quantity)}{' '}
                    <span className="text-xs font-normal text-muted-foreground uppercase">Units</span>
                  </span>
                  <span className="text-[8px] text-muted-foreground uppercase tracking-wider mt-1">
                    {forecastResult.adjusted_quantity && forecastResult.adjusted_quantity !== forecastResult.predicted_quantity ? (
                      <span className="text-foreground font-bold">
                        {forecastResult.adjusted_quantity > forecastResult.predicted_quantity ? '↑' : '↓'}{' '}
                        {Math.round(Math.abs((forecastResult.adjusted_quantity - forecastResult.predicted_quantity) / forecastResult.predicted_quantity * 100))}% Adjustment Applied
                      </span>
                    ) : 'No Adjustment Required'}
                  </span>
                </div>
              </div>

              {/* Rationale Report */}
              <div className="rounded-xl border border-border bg-zinc-950 p-4">
                <h3 className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-3 border-b border-border/40 pb-1.5 flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5" />
                  Consensus Rationale Report
                </h3>
                {forecastResult.agent_adjustments ? (
                  <div className="space-y-3">
                    {parseAndRenderConsensus(forecastResult.agent_adjustments)}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No consensus rationale report generated.</p>
                )}
              </div>

              {/* Navigation CTAs */}
              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={() => navigate(`/forecast?product_id=${selectedProductId}`)}
                  className="px-4 py-2 border border-border rounded-lg text-[9px] font-bold uppercase tracking-widest text-foreground hover:bg-secondary transition-colors"
                >
                  View Forecast Chart
                </button>
                <button
                  onClick={() => navigate('/history')}
                  className="px-4 py-2 bg-foreground text-background rounded-lg text-[9px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity shadow-brand"
                >
                  View History Logs
                </button>
              </div>

            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
