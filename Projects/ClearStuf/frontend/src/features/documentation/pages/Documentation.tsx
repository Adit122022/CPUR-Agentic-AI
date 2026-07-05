import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileSpreadsheet, Shield, Sparkles, BookOpen, Layers, Terminal } from 'lucide-react';
import { cn } from '../../../lib/utils';

const DUMMY_CSV_DATA = [
  { date: '2026-07-01', product_name: 'Premium Leather Boots', sku: 'SH-001', category: 'Footwear', price: '4500', quantity_sold: '14', current_stock: '120', brand: 'Timberland' },
  { date: '2026-07-01', product_name: 'Organic Cotton Tee', sku: 'AP-002', category: 'Apparel', price: '1200', quantity_sold: '45', current_stock: '300', brand: 'Adidas' },
  { date: '2026-07-02', product_name: 'Smart Running Watch', sku: 'WT-003', category: 'Electronics', price: '8999', quantity_sold: '8', current_stock: '45', brand: 'Garmin' },
  { date: '2026-07-02', product_name: 'Wireless ANC Headphones', sku: 'WT-004', category: 'Electronics', price: '12500', quantity_sold: '12', current_stock: '60', brand: 'Sony' },
  { date: '2026-07-03', product_name: 'Ergonomic Desk Chair', sku: 'FN-005', category: 'Furniture', price: '15400', quantity_sold: '3', current_stock: '25', brand: 'Herman Miller' },
  { date: '2026-07-03', product_name: 'Double Walled Mug', sku: 'FN-006', category: 'Kitchenware', price: '750', quantity_sold: '32', current_stock: '150', brand: 'Bodum' },
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
    link.setAttribute('download', 'clearshelf_sample_retail_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const menuGroups = [
    {
      title: 'Getting Started',
      items: [
        { id: 'intro', label: 'Introduction', icon: <BookOpen className="h-3.5 w-3.5" /> },
        { id: 'security', label: 'Security & Auth', icon: <Shield className="h-3.5 w-3.5" /> },
      ],
    },
    {
      title: 'CSV Integration',
      items: [
        { id: 'csv', label: 'Format & Schemas', icon: <FileSpreadsheet className="h-3.5 w-3.5" /> },
      ],
    },
    {
      title: 'AI Models',
      items: [
        { id: 'models', label: 'Forecasting Logic', icon: <Layers className="h-3.5 w-3.5" /> },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground dot-bg relative">
      <div className="absolute inset-0 glow-amber opacity-10 pointer-events-none" />

      {/* Main layout container matching Shadcn UI Documentation grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-10 items-start z-10 relative">
        
        {/* Left Sidebar Navigation (Shadcn Style) */}
        <aside className="sticky top-20 space-y-6 border-r border-border/40 pr-6 hidden md:block">
          {menuGroups.map(group => (
            <div key={group.title} className="space-y-2">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{group.title}</h3>
              <ul className="space-y-1">
                {group.items.map(item => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id as any)}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all text-left uppercase tracking-wider",
                        activeTab === item.id 
                          ? "bg-secondary text-foreground border-l-2 border-foreground" 
                          : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
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
        <div className="md:hidden flex gap-2 overflow-x-auto pb-4 border-b border-border/40 mb-6">
          {menuGroups.flatMap(g => g.items).map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold whitespace-nowrap uppercase tracking-wider shrink-0",
                activeTab === item.id ? "bg-foreground text-background" : "bg-card border border-border text-muted-foreground"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Right Content Panel Viewport */}
        <main className="min-h-[60vh] bg-card/40 border border-border/80 rounded-xl p-6 md:p-10 backdrop-blur-xl shadow-xl">
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
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-background text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                  <Sparkles className="h-3.5 w-3.5 text-foreground animate-pulse" />
                  <span>Introduction to ClearShelf</span>
                </div>
                <h1 className="text-3xl font-black uppercase tracking-tight text-foreground">ClearShelf System Guide</h1>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Welcome to the official developer guide. ClearShelf is designed for modern retail business managers and inventory coordinators. By combining simple, row-based sales logs with advanced AI regression algorithms, ClearShelf automates weekly demand forecasting and optimizes store shelving.
                </p>
                <div className="p-4 rounded-lg border border-border bg-secondary/20 space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wide flex items-center gap-2">
                    <Terminal className="h-4 w-4" /> Quick System Workflow
                  </h3>
                  <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-4 leading-relaxed">
                    <li>Create an account securely using Clerk Email OTP or Social Sign-In.</li>
                    <li>Download the Sample CSV dataset template from the Integration tab.</li>
                    <li>Upload your daily transactions sheet inside the Upload Portal.</li>
                    <li>Access regression forecasts, low-stock warnings, and seasonality indices.</li>
                  </ul>
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
                <h1 className="text-3xl font-black uppercase tracking-tight text-foreground">Security & Workspace Isolation</h1>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We take workspace security and isolated tenant access seriously. To ensure compliance and zero credential leakage, we implement the following:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-lg border border-border bg-secondary/10">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2">Clerk Token Validation</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      All browser API requests transit via a global interceptor adding RS256 Bearer tokens. Clerk JWKS endpoints are cached to avoid verification overhead.
                    </p>
                  </div>
                  <div className="p-5 rounded-lg border border-border bg-secondary/10">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2">Database Encryption</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Your store's product metadata and forecast runs sit inside isolated tables, encrypted at rest and in transit via secure Neon database connections.
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
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Upload validation parameters</p>
                  </div>
                  <button
                    onClick={downloadSampleCSV}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-foreground text-background hover:bg-foreground/90 font-bold uppercase tracking-widest text-[10px] transition-all shadow-brand"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download Sample CSV
                  </button>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  ClearShelf processes raw transaction logs as comma-separated values. Please ensure your files strictly conform to the following schema definition:
                </p>

                <div className="overflow-x-auto rounded-lg border border-border bg-background/50">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-secondary/40 text-foreground font-bold border-b border-border uppercase text-[9px] tracking-widest">
                      <tr>
                        <th className="p-3">Field</th>
                        <th className="p-3">Format Type</th>
                        <th className="p-3">Description</th>
                        <th className="p-3">Example</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40 text-muted-foreground font-mono text-[11px]">
                      {[
                        { field: 'date', type: 'YYYY-MM-DD', desc: 'Transaction record date', val: '2026-07-01' },
                        { field: 'product_name', type: 'String', desc: 'SKU label / display name', val: 'Leather Jacket' },
                        { field: 'sku', type: 'String (Unique)', desc: 'Distinct SKU barcode', val: 'SH-001' },
                        { field: 'category', type: 'String', desc: 'Product inventory category', val: 'Apparel' },
                        { field: 'price', type: 'Float / Int', desc: 'Unit price in INR (₹)', val: '4500' },
                        { field: 'quantity_sold', type: 'Int', desc: 'Daily items sold', val: '14' },
                        { field: 'current_stock', type: 'Int', desc: 'Available shelf items', val: '120' },
                      ].map((row) => (
                        <tr key={row.field}>
                          <td className="p-3 font-bold text-foreground">{row.field}</td>
                          <td className="p-3 text-[10px]"><span className="px-1.5 py-0.5 rounded border border-border bg-card font-semibold">{row.type}</span></td>
                          <td className="p-3 font-sans text-xs">{row.desc}</td>
                          <td className="p-3 text-foreground">{row.val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Dummy Data Preview */}
                <div className="space-y-3 pt-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Live Spreadsheet Template Preview</h3>
                  <div className="overflow-x-auto border border-border rounded-lg bg-background/80">
                    <table className="w-full text-left text-[10px] font-mono">
                      <thead className="bg-secondary/40 text-foreground border-b border-border uppercase tracking-widest text-[9px]">
                        <tr>
                          <th className="p-2.5">date</th>
                          <th className="p-2.5">product_name</th>
                          <th className="p-2.5">sku</th>
                          <th className="p-2.5">category</th>
                          <th className="p-2.5">price</th>
                          <th className="p-2.5">quantity_sold</th>
                          <th className="p-2.5">current_stock</th>
                          <th className="p-2.5">brand</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/20 text-muted-foreground">
                        {DUMMY_CSV_DATA.map((row, idx) => (
                          <tr key={idx} className="hover:bg-foreground/5 transition-colors">
                            <td className="p-2.5">{row.date}</td>
                            <td className="p-2.5 text-foreground font-sans font-bold">{row.product_name}</td>
                            <td className="p-2.5">{row.sku}</td>
                            <td className="p-2.5">{row.category}</td>
                            <td className="p-2.5">₹{row.price}</td>
                            <td className="p-2.5 text-foreground font-bold">{row.quantity_sold}</td>
                            <td className="p-2.5 text-foreground font-bold">{row.current_stock}</td>
                            <td className="p-2.5 font-sans">{row.brand}</td>
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
                <h1 className="text-3xl font-black uppercase tracking-tight text-foreground">Forecasting Algorithm Logic</h1>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  ClearShelf processes raw daily records to determine optimal stocking points. The cooperative pipeline runs two primary analytical scripts on the backend:
                </p>
                <div className="space-y-4">
                  <div className="p-5 rounded-lg border border-border bg-secondary/15">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-foreground" /> Linear Regression Engine
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Fits a weekly trendline to historical transaction quantities sold using least-squares regression. This isolates a weekly slope coefficient, extending the predicted demand quantities over a 30-day forecast horizon.
                    </p>
                  </div>
                  <div className="p-5 rounded-lg border border-border bg-secondary/15">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-foreground" /> Seasonality Adjuster
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Applies weight coefficients to predictions based on day-of-week demand variations and national holidays, correcting the raw regression lines for seasonal local trends.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
