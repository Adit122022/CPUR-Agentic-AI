import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, TrendingDown, MapPin, Store, ShoppingBag, Users,
  Zap, BrainCircuit, AlertCircle, ChevronRight, BarChart3,
  CloudSun, Sparkles, ArrowUpRight, ArrowDownRight, Package, RefreshCw
} from 'lucide-react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

// ─── City & Retailer Data ───────────────────────────────────────────────────
const CITY = 'Kota, Rajasthan';

const RETAILERS = [
  { id: 'dmart', name: 'DMart', emoji: '🏬', color: 'bg-[var(--color-olive-100)] text-[var(--color-olive-600)]', light: 'bg-[var(--color-olive-100)] text-[var(--color-olive-600)]', border: 'border-[var(--color-olive-100)]' },
  { id: 'vmart', name: 'V Mart', emoji: '🛒', color: 'bg-[var(--color-olive-300)] text-[var(--color-olive-600)]', light: 'bg-[var(--color-olive-300)] text-[var(--color-olive-600)]', border: 'border-[var(--color-olive-300)]' },
  { id: 'local', name: 'Local Shops', emoji: '🏪', color: 'bg-[var(--color-olive-400)] text-white', light: 'bg-[var(--color-olive-400)] text-white', border: 'border-[var(--color-olive-400)]' },
];

const SEASONS = ['Monsoon (Jul–Sep)', 'Festive (Oct–Nov)', 'Winter (Dec–Feb)', 'Summer (Mar–Jun)'];

// ─── Kota-specific category demand data ────────────────────────────────────


// Weekly demand forecast chart data




const AI_INSIGHTS = [
  {
    icon: '🌡️',
    title: 'Extreme Heat Alert',
    text: 'Kota temps expected 44°C+ next week. Beverages, ORS, and ice cream will see 35–45% demand surge across all retailers.',
    tag: 'Weather Signal',
    color: 'border-l-orange-500 bg-orange-50/50 dark:bg-orange-900/10',
    tagColor: 'text-orange-600 bg-orange-100 dark:bg-orange-900/40',
  },
  {
    icon: '📖',
    title: 'Exam Season Spike',
    text: 'JEE/NEET exam season begins — 180k+ students stocking up on stationery, energy drinks, and ready-to-eat meals. Local shops will capture 40% of this demand.',
    tag: 'Kota Student Economy',
    color: 'border-l-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/10',
    tagColor: 'text-[var(--color-olive-400)] bg-indigo-100 dark:bg-indigo-900/40',
  },
  {
    icon: '🏷️',
    title: 'V Mart Competitive Edge',
    text: 'V Mart\'s budget apparel category is outperforming DMart by 23% in Kota due to student price sensitivity. Recommended to increase stock by 200 units.',
    tag: 'Market Intelligence',
    color: 'border-l-purple-500 bg-purple-50/50 dark:bg-purple-900/10',
    tagColor: 'text-purple-600 bg-purple-100 dark:bg-purple-900/40',
  },
];

// ─── Component ───────────────────────────────────────────────────────────────
import { useForecastData } from '../hook/useForecast';

export default function Forecast() {
  const [selectedRetailer, setSelectedRetailer] = useState('dmart');
  const [selectedSeason, setSelectedSeason] = useState(SEASONS[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [ran, setRan] = useState(false);
  const { categories, weekly, radar, dispatch, fetchForecastData } = useForecastData();
  const KOTA_CATEGORIES = categories;
  const WEEKLY_FORECAST = weekly;
  const RADAR_DATA = radar;

  const retailer = RETAILERS.find(r => r.id === selectedRetailer)!;

  const handleRunForecast = async () => {
    setIsRunning(true);
    await dispatch(fetchForecastData() as any);
    setTimeout(() => {
      setIsRunning(false);
      setRan(true);
    }, 1500);
  };

  type RetailerId = 'dmart' | 'vmart' | 'local';
  const rid = selectedRetailer as RetailerId;
  const topCategory = KOTA_CATEGORIES && KOTA_CATEGORIES.length > 0 ? KOTA_CATEGORIES.slice().sort(
    (a: any, b: any) => b[rid]?.demand - a[rid]?.demand
  )[0] : null;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-text-secondary mb-2">
              <MapPin className="w-4 h-4 text-[var(--color-olive-300)]" />
              <span className="font-medium">{CITY}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-green-500 font-medium">Live Intelligence</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-gothic text-text-primary uppercase mb-2">
              Retail Demand Intelligence
            </h1>
            <p className="text-text-secondary mt-1 font-pixel text-xs tracking-widest uppercase">AI-powered demand forecast for Kota's retail ecosystem</p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="px-4 py-2 glass-card border border-border-color rounded-xl text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleRunForecast}
              disabled={isRunning}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-indigo-500/40 transition-all disabled:opacity-70 relative overflow-hidden"
            >
              {isRunning ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                    <RefreshCw className="w-4 h-4" />
                  </motion.div>
                  Analyzing Kota Market...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Run AI Forecast
                  <span className="absolute inset-0 rounded-xl border-2 border-purple-400 animate-ping opacity-20" />
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* ── Retailer Selector ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4 mb-8"
      >
        {RETAILERS.map((r) => (
          <motion.button
            key={r.id}
            
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedRetailer(r.id)}
            className={`relative glass-card rounded-2xl p-5 text-left transition-all border-2 ${
              selectedRetailer === r.id ? r.border : 'border-transparent'
            }`}
          >
            {selectedRetailer === r.id && (
              <motion.div
                layoutId="retailer-glow"
                className={`absolute inset-0 rounded-2xl opacity-10 bg-gradient-to-br ${r.color}`}
              />
            )}
            <div className="text-3xl mb-2">{r.emoji}</div>
            <div className="font-bold text-text-primary text-lg">{r.name}</div>
            <div className="text-xs text-text-secondary mt-1 flex items-center gap-1">
              <Store className="w-3 h-3" />
              {r.id === 'dmart' ? 'Superstore chain' : r.id === 'vmart' ? 'Value fashion retail' : 'Kirana & neighbourhood'}
            </div>
            {selectedRetailer === r.id && (
              <span className={`absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full ${r.light}`}>Active</span>
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* ── AI Insights Strip ── */}
      <AnimatePresence>
        {ran && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">AI Agent Insights for Kota</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {AI_INSIGHTS.map((insight, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`glass-card rounded-xl p-4 border-l-4 ${insight.color}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-2xl">{insight.icon}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${insight.tagColor}`}>{insight.tag}</span>
                  </div>
                  <h3 className="font-bold text-text-primary text-sm mb-1">{insight.title}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">{insight.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Category Demand Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

        {/* Left: Category cards */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <Package className="w-5 h-5 text-[var(--color-olive-300)]" />
            Category Demand Forecast — <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${retailer.light}`}>{retailer.name}</span>
          </h2>
          <div className="space-y-3">
            {KOTA_CATEGORIES.map((cat: any, idx: number) => {
              const data = cat[rid];
              const isUp = data.trend >= 0;
              return (
                <motion.div
                  key={cat.category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className="glass-card rounded-xl p-4 flex items-center gap-4 hover:shadow-lg transition-shadow"
                >
                  <div className="text-2xl w-10 text-center flex-shrink-0">{cat.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-text-primary text-sm truncate">{cat.category}</h3>
                      <span className={`flex items-center gap-1 text-xs font-bold ml-2 flex-shrink-0 ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                        {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {isUp ? '+' : ''}{data.trend}%
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary mb-2">{cat.reason}</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${data.demand}%` }}
                          transition={{ duration: 1, delay: idx * 0.08 }}
                          className={`h-full rounded-full bg-gradient-to-r ${retailer.color}`}
                        />
                      </div>
                      <span className="text-sm font-bold text-text-primary w-8 text-right">{data.demand}</span>
                    </div>
                  </div>
                  {topCategory && cat.category === topCategory.category && (
                    <span className="text-xs font-bold px-2 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full flex-shrink-0">🏆 Top</span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right: Radar + Context */}
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-5">
            <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-purple-500" />
              Retailer Comparison Radar
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={RADAR_DATA}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                <Radar name="DMart" dataKey="dmart" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} />
                <Radar name="V Mart" dataKey="vmart" stroke="#f97316" fill="#f97316" fillOpacity={0.15} />
                <Radar name="Local" dataKey="local" stroke="#22c55e" fill="#22c55e" fillOpacity={0.15} />
              </RadarChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {[['#6366f1', 'DMart'], ['#f97316', 'V Mart'], ['#22c55e', 'Local']].map(([color, label]) => (
                <div key={label} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color as string }} />
                  <span className="text-xs text-text-secondary">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5">
            <h3 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
              <CloudSun className="w-4 h-4 text-amber-500" />
              Kota Market Context
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Student Population', value: '1.8L+', icon: <Users className="w-3.5 h-3.5" /> },
                { label: 'Peak Demand Days', value: 'Fri–Sun', icon: <BarChart3 className="w-3.5 h-3.5" /> },
                { label: 'Avg Summer Temp', value: '44°C', icon: <CloudSun className="w-3.5 h-3.5" /> },
                { label: 'Coaching Centers', value: '500+', icon: <ShoppingBag className="w-3.5 h-3.5" /> },
              ].map(({ label, value, icon }) => (
                <div key={label} className="flex justify-between items-center text-sm">
                  <span className="text-text-secondary flex items-center gap-1.5">{icon}{label}</span>
                  <span className="font-bold text-text-primary">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Weekly Demand Forecast Chart ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl p-6 mb-8"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Weekly Demand Forecast — Kota
          </h2>
          <span className="text-xs text-text-secondary bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-full">
            {selectedSeason}
          </span>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={WEEKLY_FORECAST} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="gdmart" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gvmart" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="glocal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="day" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)', borderRadius: '12px' }}
            />
            <Area type="monotone" dataKey="dmart" name="DMart" stroke="#6366f1" fill="url(#gdmart)" strokeWidth={2} dot={{ r: 3 }} />
            <Area type="monotone" dataKey="vmart" name="V Mart" stroke="#f97316" fill="url(#gvmart)" strokeWidth={2} dot={{ r: 3 }} />
            <Area type="monotone" dataKey="local" name="Local Shops" stroke="#22c55e" fill="url(#glocal)" strokeWidth={2} dot={{ r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* ── Recommendation Cards ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {[
          {
            icon: <TrendingUp className="w-5 h-5 text-green-500" />,
            title: 'Stock More Of',
            items: ['Beverages & Cold Drinks', 'Instant Noodles & Snacks', 'Stationery & Study Items'],
            color: 'border-green-200 dark:border-green-800',
            bg: 'bg-green-50 dark:bg-green-900/10',
          },
          {
            icon: <TrendingDown className="w-5 h-5 text-red-500" />,
            title: 'Reduce / Clear',
            items: ['Heavy Winter Apparel', 'Luxury Personal Care', 'Seasonal Decor'],
            color: 'border-red-200 dark:border-red-800',
            bg: 'bg-red-50 dark:bg-red-900/10',
          },
          {
            icon: <AlertCircle className="w-5 h-5 text-amber-500" />,
            title: 'Action Required',
            items: ['Reorder ORS & Electrolytes', 'Negotiate bulk deals for rice/flour', 'Add express checkout for students'],
            color: 'border-amber-200 dark:border-amber-800',
            bg: 'bg-amber-50 dark:bg-amber-900/10',
          },
        ].map(({ icon, title, items, color, bg }) => (
          <div key={title} className={`glass-card rounded-xl p-5 border ${color} ${bg}`}>
            <h3 className="font-bold text-text-primary mb-3 flex items-center gap-2">{icon}{title}</h3>
            <ul className="space-y-2">
              {items.map(item => (
                <li key={item} className="flex items-center gap-2 text-sm text-text-secondary">
                  <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 text-text-secondary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
