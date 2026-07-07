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

export default function AgentConsole() {
  const [searchParams] = useSearchParams();
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
  const terminalBodyRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTo({
        top: terminalBodyRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
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
          .then(() => {
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

  const selectedProduct = products.find(p => p.id === selectedProductId);

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

      {/* MAIN TERMINAL PANEL */}
      <div className="flex-1 flex flex-col min-h-0 z-10 relative h-full p-4 sm:p-6 overflow-hidden">
        {/* Terminal Window Wrapper */}
        <div className="flex-1 flex flex-col bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
          
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
      </div>
    </div>
  );
}
