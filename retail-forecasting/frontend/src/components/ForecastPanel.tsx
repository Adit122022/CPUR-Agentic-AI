import React, { useState } from 'react';
import { Sparkles, Brain, Cpu, CloudRain, Users, Eye, HelpCircle } from 'lucide-react';

interface ForecastPanelProps {
  productId: number | null;
  onForecastTriggered: (modelType: 'linear_regression' | 'decision_tree' | 'neural_network', useAgents: boolean) => Promise<void>;
  loading: boolean;
  agentAdjustments: string | null;
  predictedQuantity: number | null;
  adjustedQuantity: number | null;
}

export const ForecastPanel: React.FC<ForecastPanelProps> = ({
  productId,
  onForecastTriggered,
  loading,
  agentAdjustments,
  predictedQuantity,
  adjustedQuantity,
}) => {
  const [modelType, setModelType] = useState<'linear_regression' | 'decision_tree' | 'neural_network'>('linear_regression');
  const [useAgents, setUseAgents] = useState<boolean>(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (productId === null) return;
    onForecastTriggered(modelType, useAgents);
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-md flex flex-col h-full">
      <div className="flex items-center gap-2 border-b border-white/15 pb-3 mb-4">
        <div className="p-1.5 rounded-lg bg-indigo-500/15 text-indigo-400">
          <Brain className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Forecasting Engine</h3>
          <p className="text-xs text-slate-500">Configure modeling and agent overlays</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-2">Select Mathematical Model</label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'linear_regression', label: 'Linear Regression', desc: 'Baseline trends' },
                  { id: 'decision_tree', label: 'Decision Tree', desc: 'Non-linear branches' },
                  { id: 'neural_network', label: 'Neural Network', desc: 'Complex relationships' },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setModelType(m.id)}
                  className={`p-3 rounded-lg border text-left transition flex flex-col gap-1 ${
                    modelType === m.id
                      ? 'bg-indigo-600/15 border-indigo-500 text-white'
                      : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:border-white/10'
                  }`}
                >
                  <span className="text-xs font-bold block">{m.label}</span>
                  <span className="text-[10px] text-slate-500 leading-tight">{m.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="border border-white/5 rounded-lg p-3 bg-black/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                <div>
                  <span className="text-xs font-semibold text-white block">CrewAI Agent Consensus</span>
                  <span className="text-[10px] text-slate-500">Analyze weather, news, & social factors</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={useAgents}
                  onChange={(e) => setUseAgents(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500"></div>
              </label>
            </div>

            {useAgents && (
              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/5">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                  <Cpu className="w-3 h-3 text-cyan-400" />
                  <span>Data Analyst (Trends)</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                  <Sparkles className="w-3 h-3 text-yellow-400" />
                  <span>Market Scout (Social Sentiment)</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                  <CloudRain className="w-3 h-3 text-sky-400" />
                  <span>Weather Analyst (External factors)</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                  <Eye className="w-3 h-3 text-fuchsia-400" />
                  <span>Synthesizer (Adjustments)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4 pt-4">
          {predictedQuantity !== null && (
            <div className="grid grid-cols-2 gap-3 border border-white/10 rounded-lg p-3 bg-white/5 text-center font-mono">
              <div className="border-r border-white/10 pr-2">
                <span className="text-[10px] text-slate-500 block">ML Prediction</span>
                <span className="text-lg font-bold text-amber-400">{Math.round(predictedQuantity)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Agent-Adjusted</span>
                <span className="text-lg font-bold text-fuchsia-400">
                  {adjustedQuantity !== null ? Math.round(adjustedQuantity) : 'N/A'}
                </span>
              </div>
            </div>
          )}

          {agentAdjustments && (
            <div className="border border-white/5 rounded-lg p-3 bg-black/30 max-h-[100px] overflow-y-auto custom-scrollbar">
              <span className="text-[10px] text-slate-500 block font-semibold mb-1 flex items-center gap-1">
                <HelpCircle className="w-3 h-3" />
                Synthesized Consensus Report
              </span>
              <p className="text-[10px] text-slate-300 leading-relaxed font-mono whitespace-pre-wrap">
                {agentAdjustments}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={productId === null || loading}
            className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
              productId === null
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                : loading
                ? 'bg-indigo-600/30 text-indigo-300 cursor-wait border border-indigo-500/20'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 active:translate-y-[1px]'
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {useAgents ? 'Agents Collaborating...' : 'Running Algorithm...'}
              </>
            ) : (
              'Run Forecast'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
