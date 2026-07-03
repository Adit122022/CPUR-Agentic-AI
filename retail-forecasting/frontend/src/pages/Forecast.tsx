import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Cpu, CheckCircle2, AlertCircle, BrainCircuit, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { Product } from '../types';
import AnimatedCounter from '../components/AnimatedCounter';

const MODEL_COLORS = ['#94a3b8', '#64748b', '#475569', '#6366f1'];

export default function Forecast() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | ''>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  useEffect(() => {
    fetch('http://localhost:8000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const handleGenerate = () => {
    setIsGenerating(true);
    setShowResults(false);
    
    // Simulate API call and agent deliberation
    setTimeout(() => {
      setIsGenerating(false);
      setShowResults(true);
    }, 2500);
  };

  const modelData = [
    { name: 'Linear Regression', prediction: 450 },
    { name: 'Decision Tree', prediction: 485 },
    { name: 'Neural Network', prediction: 510 },
    { name: 'Agent Consensus', prediction: 535 },
  ];

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mb-4">
          AI Demand Forecast
        </h1>
        <p className="text-text-secondary text-lg">Harness the power of multi-agent consensus to predict future demand.</p>
      </div>

      <div className="glass-card p-6 rounded-2xl mb-8 relative z-20">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-2/3">
            <label className="block text-sm font-medium text-text-secondary mb-2">Select Product to Forecast</label>
            <div className="relative">
              <select
                value={selectedProductId}
                onChange={(e) => {
                  setSelectedProductId(Number(e.target.value));
                  setShowResults(false);
                }}
                className="w-full pl-4 pr-10 py-3 bg-card-bg/50 border border-border-color rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 text-text-primary"
              >
                <option value="">Select a DMart Product...</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5 pointer-events-none" />
            </div>
          </div>
          <div className="w-full md:w-1/3">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-indigo-500/50 flex justify-center items-center gap-2 group relative overflow-hidden"
            >
              {isGenerating ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                    <Cpu className="w-5 h-5" />
                  </motion.div>
                  Agents Analyzing...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Generate Forecast
                  {/* Pulse Ring */}
                  <span className="absolute w-full h-full rounded-xl border-2 border-indigo-400 animate-ping opacity-20"></span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showResults && selectedProduct && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, staggerChildren: 0.2 }}
            className="space-y-8"
          >
            {/* Top Results Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8 rounded-2xl md:col-span-2 flex flex-col justify-center items-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10" />
                <h3 className="text-lg font-medium text-text-secondary mb-2 relative z-10">Predicted Demand (Next 30 Days)</h3>
                <div className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 relative z-10">
                  <AnimatedCounter value={535} duration={2.5} />
                </div>
                <p className="text-green-500 font-semibold mt-4 flex items-center gap-1 relative z-10">
                  <CheckCircle2 className="w-4 h-4" /> +24% vs last month
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6 rounded-2xl flex flex-col justify-center items-center text-center">
                <h3 className="text-lg font-medium text-text-secondary mb-4">Agent Confidence</h3>
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="56" fill="transparent" stroke="currentColor" strokeWidth="12" className="text-gray-200 dark:text-slate-800" />
                    <motion.circle
                      cx="64" cy="64" r="56" fill="transparent" stroke="currentColor" strokeWidth="12"
                      className="text-indigo-500" strokeLinecap="round"
                      strokeDasharray={351.86}
                      initial={{ strokeDashoffset: 351.86 }}
                      animate={{ strokeDashoffset: 351.86 * (1 - 0.92) }}
                      transition={{ duration: 2, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-bold text-text-primary"><AnimatedCounter value={92} duration={2} />%</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Model Comparison & Insights Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-text-primary mb-6">Model Comparison</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={modelData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                      <XAxis type="number" stroke="#9ca3af" />
                      <YAxis dataKey="name" type="category" width={120} stroke="#9ca3af" tick={{ fontSize: 12 }} />
                      <Tooltip cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }} contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
                      <Bar dataKey="prediction" radius={[0, 4, 4, 0]}>
                        {modelData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={MODEL_COLORS[index % MODEL_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="glass-card p-6 rounded-2xl bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/50">
                  <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-300 mb-3 flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 text-indigo-500" /> Synthesizer Explanation
                  </h3>
                  <p className="text-indigo-800 dark:text-indigo-200 leading-relaxed text-sm">
                    The Agent Council predicts higher demand than traditional models. The <span className="font-semibold">Weather Analyst</span> identified an upcoming heatwave likely to boost outdoor categories, while the <span className="font-semibold">Market Scout</span> detected a 15% increase in social media sentiment for {selectedProduct.name}. The <span className="font-semibold">Data Analyst</span> confirmed historical correlations supporting a 24% uplift.
                  </p>
                </div>

                <div className="glass-card p-6 rounded-2xl border-l-4 border-l-amber-500">
                  <h3 className="text-lg font-bold text-text-primary mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-500" /> Actionable Recommendations
                  </h3>
                  <ul className="space-y-3 text-sm text-text-secondary">
                    <li className="flex items-start gap-2">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                      <span>Increase stock levels by 150 units before next Tuesday to avoid stockouts during the expected demand spike.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                      <span>Prepare promotional marketing aligned with the upcoming weather event to maximize conversion rates.</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
