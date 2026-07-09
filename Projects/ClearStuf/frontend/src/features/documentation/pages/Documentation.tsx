import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download, FileSpreadsheet, Shield, Sparkles, BookOpen, Layers,
  Info, Database, BrainCircuit, Zap, Lock
} from 'lucide-react';
import { cn } from '../../../lib/utils';

const DUMMY_CSV_DATA = [
  { date: '2026-07-01', product_name: 'Organic Espresso Beans (1kg)', sku: 'GP-101', category: 'Beverages', price: '1499', quantity_sold: '24', current_stock: '85', brand: 'Blue Bottle' },
  { date: '2026-07-01', product_name: 'Ceremonial Matcha Tin (40g)', sku: 'GP-102', category: 'Beverages', price: '2499', quantity_sold: '15', current_stock: '42', brand: 'Ippodo' },
  { date: '2026-07-02', product_name: 'Cold Pressed Olive Oil (500ml)', sku: 'GP-103', category: 'Pantry', price: '1899', quantity_sold: '10', current_stock: '68', brand: 'Brightland' },
  { date: '2026-07-02', product_name: 'Himalayan Pink Salt Grinder', sku: 'GP-104', category: 'Pantry', price: '399', quantity_sold: '35', current_stock: '210', brand: 'Spice House' },
  { date: '2026-07-03', product_name: 'Raw Manuka Honey (MGO 250+)', sku: 'GP-105', category: 'Pantry', price: '3299', quantity_sold: '6', current_stock: '28', brand: 'Comvita' },
  { date: '2026-07-03', product_name: 'Gluten-Free Almond Flour (1kg)', sku: 'GP-106', category: 'Baking', price: '799', quantity_sold: '18', current_stock: '115', brand: 'Bob\'s Red Mill' },
];

export default function Documentation() {
  const [activeTab, setActiveTab] = useState<'intro' | 'csv' | 'models' | 'security'>('intro');

  const downloadSampleCSV = () => {
    const headers = ['date', 'product_name', 'sku', 'category', 'price', 'quantity_sold', 'current_stock', 'brand'];
    const rows = DUMMY_CSV_DATA.map(d => 
      [d.date, `"${d.product_name}"`, d.sku, d.category, d.price, d.quantity_sold, d.current_stock, d.brand].join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' 
      + [headers.join(','), ...rows].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'clearshelf_sample_pantry_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const menuGroups = [
    {
      title: 'Guide & Basics',
      items: [
        { id: 'intro', label: 'Introduction', icon: <BookOpen className="h-3.5 w-3.5" /> },
        { id: 'security', label: 'Security & Access', icon: <Shield className="h-3.5 w-3.5" /> },
      ],
    },
    {
      title: 'Data Ingestion',
      items: [
        { id: 'csv', label: 'CSV Schema & Template', icon: <FileSpreadsheet className="h-3.5 w-3.5" /> },
      ],
    },
    {
      title: 'Intelligence',
      items: [
        { id: 'models', label: 'AI Forecasting Logic', icon: <Layers className="h-3.5 w-3.5" /> },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground dot-bg relative">
      <div className="absolute inset-0 glow-amber opacity-10 pointer-events-none" />

      {/* Main layout container matching Shadcn UI Documentation grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-10 items-start z-10 relative">
        
        {/* Left Sidebar Navigation (Shadcn Style) */}
        <aside className="sticky top-24 space-y-6 border-r border-border/40 pr-6 hidden md:block">
          {menuGroups.map(group => (
            <div key={group.title} className="space-y-2.5">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 px-3">{group.title}</h3>
              <ul className="space-y-1">
                {group.items.map(item => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id as any)}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all text-left uppercase tracking-wider",
                        activeTab === item.id 
                          ? "bg-secondary text-foreground shadow-sm border-l-2 border-foreground" 
                          : "text-muted-foreground hover:bg-secondary/35 hover:text-foreground"
                      )}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside>

        {/* Mobile Sidebar Dropdown */}
        <div className="md:hidden flex gap-2 overflow-x-auto pb-4 border-b border-border/40 mb-4 scrollbar-none">
          {menuGroups.flatMap(g => g.items).map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap uppercase tracking-wider shrink-0 border transition-all",
                activeTab === item.id 
                  ? "bg-foreground border-foreground text-background" 
                  : "bg-card border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Right Content Panel Viewport */}
        <main className="min-h-[65vh] bg-card/35 border border-border/80 rounded-2xl p-6 md:p-10 backdrop-blur-md shadow-xl">
          <AnimatePresence mode="wait">
            
            {/* Tab 1: Introduction */}
            {activeTab === 'intro' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-background/50 text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                  <Sparkles className="h-3.5 w-3.5 text-foreground animate-pulse" />
                  <span>Interactive System Walkthrough</span>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-foreground">
                  Welcome to ClearShelf
                </h1>
                
                <p className="text-sm text-muted-foreground leading-relaxed">
                  ClearShelf is an intelligent inventory management and demand forecasting portal designed for modern retailers. By analyzing your store's transaction history, ClearShelf maps sales velocity, identifies low-stock vulnerabilities, and runs predictive machine learning models to forecast future inventory requirements.
                </p>

                <hr className="border-border/40" />

                <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">
                  Step-by-Step Operations Workflow
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      num: '01',
                      title: 'Format & Upload Data',
                      desc: 'Ingest daily sales history files in the CSV section. The system validates formatting rules in real-time, preventing corruption.',
                      link: 'CSV Integration tab'
                    },
                    {
                      num: '02',
                      title: 'Review Catalog & Stock',
                      desc: 'Browse product lists, categories, and inventory margins. ClearShelf monitors shelf items and flags low-stock risks.',
                      link: 'Products & Catalog'
                    },
                    {
                      num: '03',
                      title: 'Run AI Forecasts',
                      desc: 'Trigger demand forecasting algorithms over customizable periods (7 to 90 days) utilizing linear regression and agent adjustment modules.',
                      link: 'AI Predictions'
                    },
                    {
                      num: '04',
                      title: 'Audit Historical Runs',
                      desc: 'Browse historical file uploads and prediction runs to audit changes and optimize scheduling over time.',
                      link: 'Operations History Log'
                    }
                  ].map((step) => (
                    <div key={step.num} className="p-5 rounded-xl border border-border bg-secondary/10 flex flex-col justify-between">
                      <div>
                        <div className="text-2xl font-black text-foreground/20 font-mono mb-2">{step.num}</div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">{step.title}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-4">{step.desc}</p>
                      </div>
                      <span className="text-[9px] uppercase font-bold tracking-widest text-foreground/60 flex items-center gap-1.5">
                        <Info className="h-3 w-3" /> Related: {step.link}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Tab 2: Security & Authentication */}
            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-background/50 text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                  <Lock className="h-3.5 w-3.5 text-foreground" />
                  <span>Tenant Isolation Policy</span>
                </div>
                
                <h1 className="text-3xl font-black uppercase tracking-tight text-foreground">
                  Security & Workspace Isolation
                </h1>
                
                <p className="text-sm text-muted-foreground leading-relaxed">
                  ClearShelf guarantees complete database segregation and workspace protection. We utilize industry-standard practices to isolate store inventory parameters, ensuring that zero telemetry leaks outside your account.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-5 rounded-xl border border-border bg-secondary/15">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-foreground shrink-0" />
                      Clerk Session Management
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      All browser interactions require authentication via Clerk JWT credentials. Social logins and email OTP verification tokens are cryptographically validated for secure access.
                    </p>
                  </div>
                  <div className="p-5 rounded-xl border border-border bg-secondary/15">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2 flex items-center gap-2">
                      <Database className="h-4 w-4 text-foreground shrink-0" />
                      Isolated Neon Databases
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Product metadata, sales records, and forecasting histories are stored inside tenant-isolated database rows. SSL-only connections prevent intercept risks.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tab 3: CSV Format & Schemas */}
            {activeTab === 'csv' && (
              <motion.div
                key="csv"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/40 pb-6">
                  <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight text-foreground">CSV Schema & Formatting</h1>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Data Ingestion File Guidelines</p>
                  </div>
                  <button
                    onClick={downloadSampleCSV}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-foreground text-background hover:opacity-90 font-bold uppercase tracking-widest text-[10px] transition-all shadow-brand"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download Sample CSV
                  </button>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed uppercase tracking-wider">
                  Ingested sales history sheets must match the following columns exactly. Any missing or malformed values will cause validation failures to protect database integrity.
                </p>

                <div className="overflow-x-auto rounded-xl border border-border bg-background/50">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-secondary/40 text-foreground font-bold border-b border-border uppercase text-[9px] tracking-widest">
                      <tr>
                        <th className="p-4">Column Header</th>
                        <th className="p-4">Format Type</th>
                        <th className="p-4">Description</th>
                        <th className="p-4">Sample Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40 text-muted-foreground font-mono text-[11px]">
                      {[
                        { field: 'date', type: 'YYYY-MM-DD', desc: 'Date of daily transaction(s)', val: '2026-07-01' },
                        { field: 'product_name', type: 'String', desc: 'Display name of product item', val: 'Organic Espresso Beans (1kg)' },
                        { field: 'sku', type: 'String (Unique)', desc: 'Inventory stock keeping unit identifier', val: 'GP-101' },
                        { field: 'category', type: 'String', desc: 'Product grouping category', val: 'Beverages' },
                        { field: 'price', type: 'Float / Integer', desc: 'Retail unit price in INR', val: '1499' },
                        { field: 'quantity_sold', type: 'Integer', desc: 'Quantity of items sold on that date', val: '24' },
                        { field: 'current_stock', type: 'Integer', desc: 'Available stock on hand at upload', val: '85' },
                        { field: 'brand (Optional)', type: 'String', desc: 'Product manufacturer/brand name', val: 'Blue Bottle' },
                      ].map((row) => (
                        <tr key={row.field} className="hover:bg-secondary/5 transition-colors">
                          <td className="p-4 font-bold text-foreground">{row.field}</td>
                          <td className="p-4 text-[10px]">
                            <span className="px-2 py-0.5 rounded border border-border bg-card font-semibold text-foreground">
                              {row.type}
                            </span>
                          </td>
                          <td className="p-4 font-sans text-xs">{row.desc}</td>
                          <td className="p-4 text-foreground">{row.val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Dummy Data Preview */}
                <div className="space-y-3 pt-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4" />
                    Interactive Sample Template Preview
                  </h3>
                  <div className="overflow-x-auto border border-border rounded-xl bg-background/80">
                    <table className="w-full text-left text-[10px] font-mono border-collapse">
                      <thead className="bg-secondary/40 text-foreground border-b border-border uppercase tracking-widest text-[8px]">
                        <tr>
                          <th className="p-3">date</th>
                          <th className="p-3">product_name</th>
                          <th className="p-3">sku</th>
                          <th className="p-3">category</th>
                          <th className="p-3 text-right">price</th>
                          <th className="p-3 text-right">quantity_sold</th>
                          <th className="p-3 text-right">current_stock</th>
                          <th className="p-3">brand</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/20 text-muted-foreground">
                        {DUMMY_CSV_DATA.map((row, idx) => (
                          <tr key={idx} className="hover:bg-foreground/5 transition-colors">
                            <td className="p-3 whitespace-nowrap">{row.date}</td>
                            <td className="p-3 text-foreground font-sans font-bold whitespace-nowrap">{row.product_name}</td>
                            <td className="p-3 whitespace-nowrap">{row.sku}</td>
                            <td className="p-3 whitespace-nowrap">{row.category}</td>
                            <td className="p-3 text-right text-foreground whitespace-nowrap">₹{row.price}</td>
                            <td className="p-3 text-right text-foreground font-bold whitespace-nowrap">{row.quantity_sold}</td>
                            <td className="p-3 text-right text-foreground font-bold whitespace-nowrap">{row.current_stock}</td>
                            <td className="p-3 font-sans whitespace-nowrap">{row.brand}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tab 4: Forecasting Logic */}
            {activeTab === 'models' && (
              <motion.div
                key="models"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-background/50 text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                  <BrainCircuit className="h-3.5 w-3.5 text-foreground" />
                  <span>Mathematical Forecasting Overview</span>
                </div>

                <h1 className="text-3xl font-black uppercase tracking-tight text-foreground">
                  AI Forecasting Core Logic
                </h1>
                
                <p className="text-sm text-muted-foreground leading-relaxed">
                  ClearShelf utilizes a hybrid analytical approach, chaining simple linear trends with multi-factor adjustments to predict stock demand.
                </p>
                
                <div className="space-y-4">
                  {[
                    {
                      title: 'Linear Regression Engine',
                      desc: 'Estimates sales trendlines using historical daily transactions. By calculating the slope of quantity sold over time (Ordinary Least Squares), it establishes the baseline demand for the chosen horizon.',
                      icon: <Layers className="h-4 w-4" />
                    },
                    {
                      title: 'Seasonality Weight Adjuster',
                      desc: 'Calculates day-of-week demand variance to smooth out raw linear trajectories (e.g. higher pantry sales on weekends). This factor helps correct baseline errors.',
                      icon: <Zap className="h-4 w-4" />
                    },
                    {
                      title: 'Agent Enrichment Layer',
                      desc: 'An optional layer that triggers specialized LLM backend agents. These agents review current stock constraints, run heuristics, analyze context, and provide logical adjustments to raw numeric values.',
                      icon: <BrainCircuit className="h-4 w-4" />
                    }
                  ].map((engine) => (
                    <div key={engine.title} className="p-5 rounded-xl border border-border bg-secondary/10 hover:bg-secondary/15 transition-colors">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2 flex items-center gap-2">
                        {engine.icon}
                        {engine.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {engine.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
