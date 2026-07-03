import React, { useEffect, useState, useRef } from 'react';
import { Terminal, Shield, RefreshCw } from 'lucide-react';

interface LogLine {
  timestamp: string;
  agent: string;
  message: string;
}

export const AgentLogStream: React.FC = () => {
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [status, setStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');
  const scrollRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    connect();
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const connect = () => {
    setStatus('connecting');
    const wsUrl = (import.meta.env.VITE_WS_URL || 'ws://localhost:8000').replace(/^http/, 'ws');
    const ws = new WebSocket(`${wsUrl}/api/ws/logs`);

    ws.onopen = () => {
      setStatus('connected');
      setLogs((prev) => [...prev, { timestamp: new Date().toLocaleTimeString(), agent: 'System', message: 'Connected to Agent Live Log Stream' }]);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLogs((prev) => [
          ...prev,
          {
            timestamp: new Date().toLocaleTimeString(),
            agent: data.agent || 'Orchestrator',
            message: data.message || event.data,
          },
        ]);
      } catch {
        setLogs((prev) => [
          ...prev,
          {
            timestamp: new Date().toLocaleTimeString(),
            agent: 'CrewAI',
            message: event.data,
          },
        ]);
      }
    };

    ws.onerror = () => {
      setStatus('disconnected');
    };

    ws.onclose = () => {
      setStatus('disconnected');
      setLogs((prev) => [...prev, { timestamp: new Date().toLocaleTimeString(), agent: 'System', message: 'Connection to Agent Live Log Stream closed.' }]);
    };

    socketRef.current = ws;
  };

  const getAgentColor = (agent: string) => {
    switch (agent.toLowerCase()) {
      case 'system':
        return 'text-emerald-400';
      case 'data_analyst':
        return 'text-cyan-400';
      case 'market_scout':
        return 'text-yellow-400';
      case 'weather_analyst':
        return 'text-sky-400';
      case 'synthesizer':
        return 'text-fuchsia-400';
      default:
        return 'text-indigo-400';
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/70 p-5 backdrop-blur-md flex flex-col h-[350px]">
      <div className="flex items-center justify-between border-b border-white/15 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[var(--color-olive-300)]/15 text-indigo-400">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Live CrewAI Agent Stream</h3>
            <p className="text-xs text-slate-500">Real-time collaboration monitoring</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                status === 'connected'
                  ? 'bg-emerald-500 animate-pulse'
                  : status === 'connecting'
                  ? 'bg-amber-500 animate-pulse'
                  : 'bg-rose-500'
              }`}
            />
            <span className="text-xs text-slate-400 capitalize">{status}</span>
          </div>

          {status === 'disconnected' && (
            <button
              onClick={connect}
              className="p-1 rounded hover:bg-white/5 text-slate-400 hover:text-white transition"
              title="Reconnect"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={clearLogs}
            className="text-xs font-medium text-slate-400 hover:text-white px-2 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/5 transition"
          >
            Clear
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto font-mono text-xs space-y-2.5 pr-2 custom-scrollbar bg-black/35 rounded-lg p-3 border border-white/5"
      >
        {logs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-1.5">
            <Shield className="w-6 h-6 stroke-1" />
            <span>Waiting for agent activity... Trigger a forecast with Agents enabled.</span>
          </div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="flex items-start gap-2 leading-relaxed">
              <span className="text-slate-600 select-none">[{log.timestamp}]</span>
              <span className={`font-semibold shrink-0 select-none ${getAgentColor(log.agent)}`}>
                [{log.agent}]:
              </span>
              <span className="text-slate-300 whitespace-pre-wrap">{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
