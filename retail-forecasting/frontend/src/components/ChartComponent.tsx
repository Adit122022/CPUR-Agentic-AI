import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import type { SalesHistory, ForecastResult } from '../services/api';
import { TrendingUp } from 'lucide-react';

interface ChartComponentProps {
  historicalData: SalesHistory[];
  forecastData: ForecastResult | null;
  productName: string;
}

export const ChartComponent: React.FC<ChartComponentProps> = ({
  historicalData,
  forecastData,
  productName,
}) => {
  // Map historical data to chart format
  const chartData: Array<{
    date: string;
    historical: number | null;
    mlForecast: number | null;
    agentForecast: number | null;
  }> = historicalData.map((d) => ({
    date: d.date,
    historical: d.quantity,
    mlForecast: null,
    agentForecast: null,
  }));

  // Append forecast data if available
  if (forecastData) {
    chartData.push({
      date: forecastData.forecast_date,
      historical: null,
      mlForecast: forecastData.predicted_quantity,
      agentForecast: forecastData.adjusted_quantity,
    });
  }

  const formatXAxis = (tickItem: string) => {
    try {
      const date = new Date(tickItem);
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return tickItem;
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-white/10 p-3 rounded-lg backdrop-blur-md shadow-xl text-xs font-mono">
          <p className="text-slate-400 mb-1.5">{label}</p>
          {payload.map((item: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between gap-6 py-0.5">
              <span style={{ color: item.color }} className="capitalize font-sans">
                {item.name}:
              </span>
              <span className="font-bold text-white text-right">
                {Math.round(item.value)} units
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-md flex flex-col h-[380px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-semibold text-white">Demand Forecast Analytics</h3>
          <p className="text-xs text-slate-400">
            {productName ? `Sales trajectory for ${productName}` : 'Select a product to view forecasting models'}
          </p>
        </div>
        {forecastData && (
          <div className="flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-xs font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Active Model: {forecastData.model_used.replace('_', ' ')}</span>
          </div>
        )}
      </div>

      <div className="flex-1 w-full text-xs">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500">
            Select a product to load historical sales data.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorHistorical" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorMl" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorAgent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d946ef" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#d946ef" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
              <XAxis
                dataKey="date"
                stroke="#64748b"
                tickFormatter={formatXAxis}
                fontSize={10}
                tickLine={false}
              />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={36}
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ color: '#94a3b8', fontSize: '11px', paddingBottom: '10px' }}
              />
              <Area
                name="Historical Sales"
                type="monotone"
                dataKey="historical"
                stroke="#6366f1"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorHistorical)"
              />
              <Area
                name="ML Algorithm Forecast"
                type="monotone"
                dataKey="mlForecast"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#colorMl)"
              />
              <Area
                name="Agent Adjusted Forecast"
                type="monotone"
                dataKey="agentForecast"
                stroke="#d946ef"
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#colorAgent)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
