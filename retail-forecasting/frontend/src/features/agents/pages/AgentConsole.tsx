import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, Activity, BrainCircuit } from 'lucide-react';
import type { AgentLog } from '../../../types';

const agents = [
  { id: 'data', name: 'Data Analyst', role: 'Quantitative Analysis', emoji: '📊', color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30', border: 'border-blue-200 dark:border-blue-800' },
  { id: 'market', name: 'Market Scout', role: 'Trend Detection', emoji: '🔍', color: 'text-pink-500', bg: 'bg-pink-100 dark:bg-pink-900/30', border: 'border-pink-200 dark:border-pink-800' },
  { id: 'weather', name: 'Weather Analyst', role: 'Climate Impacts', emoji: '🌤️', color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30', border: 'border-amber-200 dark:border-amber-800' },
  { id: 'synth', name: 'Synthesizer', role: 'Consensus Builder', emoji: '🧠', color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30', border: 'border-green-200 dark:border-green-800' },
];


import { API_BASE_URL } from '../../../services/api';

export default function AgentConsole() {
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs, activeAgent]);

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    scrollToBottom();
  }, [logs, activeAgent]);

  useEffect(() => {
    if (isRunning) {
      setLogs([]);
      // Connect to real WebSocket
      const wsProtocol = API_BASE_URL.startsWith('https') ? 'wss' : 'ws';
      const wsUrl = `${wsProtocol}://${API_BASE_URL.replace(/^https?:\/\//, '')}/api/ws/logs`;
      wsRef.current = new WebSocket(wsUrl);
      
      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const agent = agents.find(a => a.name === data.agent) || agents[3]; // Fallback to synthesizer
          
          // Show typing indicator briefly before adding log
          setActiveAgent(agent.id);
          
          setTimeout(() => {
            setLogs(prev => [...prev, {
              id: `log-${Date.now()}-${Math.random()}`,
              agent: agent.name,
              role: agent.role,
              emoji: agent.emoji,
              message: data.message,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
              color: agent.color
            }]);
            setActiveAgent(null);
          }, 500);
        } catch (e) {
          console.error("Failed to parse websocket message", e);
        }
      };

      // Trigger a real forecast for product ID 1 (simulation demo)
      fetch(`${API_BASE_URL}/api/forecast/trigger`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: 1,
          model_type: 'linear_regression',
          use_agents: true
        })
      }).then(res => res.json()).then(() => {
        // When forecast completes, we can stop the simulation state
        setTimeout(() => setIsRunning(false), 2000);
      }).catch(err => {
        console.error("Forecast trigger failed", err);
        setIsRunning(false);
      });
      
    } else {
      if (wsRef.current) {
        wsRef.current.close();
      }
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [isRunning]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col md:flex-row w-full bg-bg-color">
      {/* Left Sidebar - Agents */}
      <div className="w-full md:w-80 border-r border-border-color bg-card-bg p-6 flex flex-col">
        <div className="mb-8">
          <h2 className="text-2xl font-gothic text-text-primary uppercase flex items-center gap-2">
            <Activity className="w-5 h-5 text-[var(--color-olive-300)]" />
            AI Council
          </h2>
          <p className="text-xs font-pixel tracking-widest uppercase text-text-secondary mt-1">Multi-agent debate system</p>
        </div>

        <div className="flex-1 space-y-4">
          {agents.map((agent) => (
            <div 
              key={agent.id}
              className={`p-4 rounded-xl border-2 transition-all duration-300 ${activeAgent === agent.id ? agent.border + ' shadow-lg scale-105' : 'border-transparent bg-gray-50 dark:bg-slate-800/50'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${agent.bg}`}>
                  {agent.emoji}
                </div>
                <div>
                  <h3 className="font-bold text-text-primary flex items-center gap-2">
                    {agent.name}
                    {activeAgent === agent.id && (
                      <span className="flex h-2 w-2 relative">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${agent.bg.split(' ')[0]}`}></span>
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${agent.bg.split(' ')[0].replace('bg-', 'bg-opacity-100 bg-')}`}></span>
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-text-secondary">{agent.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <button
            onClick={() => isRunning ? setIsRunning(false) : setIsRunning(true)}
            className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              isRunning 
                ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50' 
                : 'bg-[var(--color-olive-400)] text-white hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/50'
            }`}
          >
            {isRunning ? (
              <><Square className="w-5 h-5" /> Stop Simulation</>
            ) : (
              <><Play className="w-5 h-5 fill-current" /> Start Simulation</>
            )}
          </button>
        </div>
      </div>

      {/* Right Content - Logs */}
      <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] bg-gray-50 dark:bg-slate-950">
        <div className="p-4 border-b border-border-color bg-card-bg flex justify-between items-center sticky top-0 z-10">
          <h3 className="font-bold text-text-primary">Live Deliberation Log</h3>
          <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            WebSocket Connected
          </span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <AnimatePresence>
            {logs.length === 0 && !activeAgent && !isRunning && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-text-secondary"
              >
                <BrainCircuit className="w-16 h-16 mb-4 opacity-20" />
                <p>Click "Start Simulation" to watch the AI agents deliberate.</p>
              </motion.div>
            )}
            
            {logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="flex flex-col max-w-3xl"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{log.emoji}</span>
                  <span className="font-bold text-sm text-text-primary">{log.agent}</span>
                  <span className="text-xs text-text-secondary">{log.timestamp}</span>
                </div>
                <div className={`p-4 rounded-2xl rounded-tl-sm glass-card border-l-4 ${log.color.replace('text-', 'border-')}`}>
                  <p className="text-text-primary text-sm leading-relaxed">{log.message}</p>
                </div>
              </motion.div>
            ))}
            
            {activeAgent && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-3 text-text-secondary max-w-3xl"
              >
                <span className="text-lg">{agents.find(a => a.id === activeAgent)?.emoji}</span>
                <div className="glass-card p-3 rounded-2xl rounded-tl-sm flex items-center gap-1 w-16">
                  <span className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
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
