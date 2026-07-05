import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Upload, FileText, CheckCircle2, XCircle, AlertTriangle,
  Download, Trash2, ArrowRight, Table2, Loader2, RotateCcw,
  Package, BarChart2, CalendarDays, Database,
} from 'lucide-react';
import { API_BASE_URL } from '../../../services/api';
import { cn } from '../../../lib/utils';

/* ── types ── */
interface ValidationResult {
  valid: boolean;
  error?: string;
  errors?: string[];
  total_rows: number;
  unique_products: number;
  columns_found: string[];
  preview: Record<string, string>[];
}

interface ImportResult {
  success: boolean;
  message: string;
  products_created: number;
  products_updated: number;
  sales_inserted: number;
  total_products: number;
}

type Step = 'idle' | 'validating' | 'preview' | 'importing' | 'done' | 'error';

/* ── required columns info ── */
const REQUIRED_COLS = [
  { key: 'date',           label: 'Date',           desc: 'YYYY-MM-DD format',          example: '2024-06-01' },
  { key: 'product_name',   label: 'Product Name',   desc: 'Display name of the product', example: 'Blue Denim Jeans' },
  { key: 'sku',            label: 'SKU',            desc: 'Unique product identifier',   example: 'CLT-001' },
  { key: 'category',       label: 'Category',       desc: 'Product category',            example: 'Apparels' },
  { key: 'price',          label: 'Price (₹)',       desc: 'Selling price',               example: '1299' },
  { key: 'quantity_sold',  label: 'Quantity Sold',  desc: 'Units sold that day',         example: '12' },
  { key: 'current_stock',  label: 'Current Stock',  desc: 'Inventory on hand',           example: '150' },
];

const OPTIONAL_COLS = [
  { key: 'brand',            example: 'Levi\'s' },
  { key: 'discounted_price', example: '999' },
  { key: 'description',      example: 'Slim-fit jeans' },
];

export default function UploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<Step>('idle');
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [clearOnImport, setClearOnImport] = useState(true);
  const [clearing, setClearing] = useState(false);

  /* ── file handling ── */
  const handleFile = useCallback(async (f: File) => {
    if (!f.name.endsWith('.csv')) {
      setStep('error');
      setValidation({ valid: false, error: 'Only .csv files are accepted.', total_rows: 0, unique_products: 0, columns_found: [], preview: [] });
      return;
    }
    setFile(f);
    setStep('validating');
    setValidation(null);
    setImportResult(null);

    const form = new FormData();
    form.append('file', f);

    try {
      const res = await fetch(`${API_BASE_URL}/api/upload/validate`, { method: 'POST', body: form });
      const data: ValidationResult = await res.json();
      setValidation(data);
      setStep(data.valid ? 'preview' : 'error');
    } catch {
      setStep('error');
      setValidation({ valid: false, error: 'Server unreachable. Is the backend running?', total_rows: 0, unique_products: 0, columns_found: [], preview: [] });
    }
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  /* ── import ── */
  const handleImport = async () => {
    if (!file) return;
    setStep('importing');

    const form = new FormData();
    form.append('file', file);

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/upload/import?clear_existing=${clearOnImport}`,
        { method: 'POST', body: form }
      );
      const data: ImportResult = await res.json();
      setImportResult(data);
      setStep(data.success ? 'done' : 'error');
    } catch {
      setStep('error');
    }
  };

  /* ── clear DB ── */
  const handleClear = async () => {
    if (!window.confirm('This will delete ALL products and sales data. Are you sure?')) return;
    setClearing(true);
    try {
      await fetch(`${API_BASE_URL}/api/upload/clear`, { method: 'DELETE' });
    } finally {
      setClearing(false);
    }
  };

  /* ── reset ── */
  const reset = () => {
    setFile(null);
    setStep('idle');
    setValidation(null);
    setImportResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="page-shell max-w-5xl">

        {/* ── Header ── */}
        <div className="mb-10">
          <div className="brand-pill mb-4 w-fit">
            <Upload className="h-3 w-3" />
            Data Import
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-3">
            Upload Your Shop Data
          </h1>
          <p className="text-muted-foreground max-w-xl">
            Import your sales history as a CSV file. ClearShelf will automatically create your product catalog and run demand forecasting on your real data.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">

          {/* ── LEFT: Upload + Preview ── */}
          <div className="space-y-6">

            {/* Drop zone */}
            {(step === 'idle' || step === 'error' || step === 'validating') && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  'relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed cursor-pointer transition-all py-16 px-8 text-center',
                  dragOver
                    ? 'border-brand bg-brand/5 scale-[1.01]'
                    : step === 'error'
                    ? 'border-red-500/50 bg-red-500/5'
                    : 'border-border bg-card hover:border-brand/50 hover:bg-brand/5'
                )}
              >
                <input ref={fileInputRef} type="file" accept=".csv" onChange={onFileInput} className="hidden" />
                {step === 'validating' ? (
                  <>
                    <Loader2 className="h-10 w-10 text-brand animate-spin" />
                    <p className="font-medium text-foreground">Validating your CSV…</p>
                  </>
                ) : (
                  <>
                    <div className={cn('flex h-16 w-16 items-center justify-center rounded-2xl', step === 'error' ? 'bg-red-500/10 text-red-400' : 'bg-brand/10 text-brand')}>
                      {step === 'error' ? <XCircle className="h-8 w-8" /> : <Upload className="h-8 w-8" />}
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-foreground">
                        {step === 'error' && file ? `"${file.name}" has issues` : 'Drop your CSV here'}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {step === 'error' ? 'Fix the errors below and re-upload' : 'or click to browse · .csv files only'}
                      </p>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* Validation errors */}
            <AnimatePresence>
              {step === 'error' && validation && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-xl border border-red-500/30 bg-red-500/10 p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="h-4 w-4 text-red-400" />
                    <p className="text-sm font-semibold text-red-400">Validation Failed</p>
                  </div>
                  <p className="text-sm text-red-300/80">{validation.error}</p>
                  {validation.errors && validation.errors.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {validation.errors.map((e, i) => (
                        <li key={i} className="text-xs text-red-300/70">• {e}</li>
                      ))}
                    </ul>
                  )}
                  <button onClick={reset} className="mt-3 flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors">
                    <RotateCcw className="h-3 w-3" /> Try again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Preview + Import */}
            <AnimatePresence>
              {(step === 'preview' || step === 'importing') && validation && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* File info bar */}
                  <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-emerald-400">Valid CSV — Ready to import</p>
                      <p className="text-xs text-emerald-300/70 truncate">{file?.name}</p>
                    </div>
                    <div className="flex gap-4 text-center shrink-0">
                      <div>
                        <p className="text-lg font-bold text-foreground">{validation.unique_products}</p>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Products</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-foreground">{validation.total_rows}</p>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Sales rows</p>
                      </div>
                    </div>
                  </div>

                  {/* Preview table */}
                  {validation.preview.length > 0 && (
                    <div className="rounded-xl border border-border overflow-hidden">
                      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
                        <Table2 className="h-4 w-4 text-muted-foreground" />
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Preview (first {validation.preview.length} rows)
                        </p>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead className="bg-muted/20">
                            <tr>
                              {Object.keys(validation.preview[0]).map(col => (
                                <th key={col} className="px-3 py-2 text-left font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                                  {col}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {validation.preview.map((row, i) => (
                              <tr key={i} className={cn('border-t border-border', i % 2 === 0 ? 'bg-background' : 'bg-muted/10')}>
                                {Object.values(row).map((val, j) => (
                                  <td key={j} className="px-3 py-2 text-foreground whitespace-nowrap max-w-[160px] truncate" title={val}>
                                    {val || <span className="text-muted-foreground/40">—</span>}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Options */}
                  <label className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 cursor-pointer hover:border-brand/40 transition-colors">
                    <input
                      type="checkbox"
                      checked={clearOnImport}
                      onChange={e => setClearOnImport(e.target.checked)}
                      className="h-4 w-4 rounded accent-brand"
                    />
                    <div>
                      <p className="text-sm font-medium text-foreground">Clear existing data before import</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Removes all previous products and sales history first</p>
                    </div>
                  </label>

                  {/* Action buttons */}
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleImport}
                      disabled={step === 'importing'}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-bold text-background shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_32px_rgba(245,158,11,0.45)] disabled:opacity-70 transition-all"
                    >
                      {step === 'importing' ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Importing…</>
                      ) : (
                        <><Database className="h-4 w-4" /> Import to Database</>
                      )}
                    </motion.button>
                    <button
                      onClick={reset}
                      disabled={step === 'importing'}
                      className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 text-sm text-muted-foreground hover:bg-secondary transition-colors disabled:opacity-50"
                    >
                      <RotateCcw className="h-4 w-4" /> Reset
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── SUCCESS STATE ── */}
            <AnimatePresence>
              {step === 'done' && importResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 mx-auto mb-4"
                  >
                    <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                  </motion.div>
                  <h2 className="text-xl font-bold text-foreground mb-2">Import Complete!</h2>
                  <p className="text-sm text-muted-foreground mb-6">{importResult.message}</p>

                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                      { icon: <Package className="h-5 w-5" />, value: importResult.products_created, label: 'Products Created' },
                      { icon: <BarChart2 className="h-5 w-5" />, value: importResult.sales_inserted, label: 'Sales Records' },
                      { icon: <CalendarDays className="h-5 w-5" />, value: importResult.products_updated, label: 'Products Updated' },
                    ].map(s => (
                      <div key={s.label} className="rounded-xl border border-border bg-card/60 p-4">
                        <div className="mb-2 flex justify-center text-brand">{s.icon}</div>
                        <p className="text-2xl font-bold text-foreground">{s.value}</p>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate('/products')}
                      className="flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-background"
                    >
                      View Products <ArrowRight className="h-4 w-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate('/forecast')}
                      className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                    >
                      Run Forecast <BarChart2 className="h-4 w-4" />
                    </motion.button>
                    <button onClick={reset} className="text-sm text-muted-foreground hover:text-foreground transition-colors px-4">
                      Upload another
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── RIGHT SIDEBAR: Guide ── */}
          <div className="space-y-5">

            {/* Download template */}
            <div className="rounded-2xl border border-brand/30 bg-brand/5 p-5">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-brand" />
                <h3 className="text-sm font-semibold text-foreground">Start with our template</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Download the sample CSV pre-filled with clothing store data. Replace with your own shop's numbers.
              </p>
              <a
                href={`${API_BASE_URL}/api/upload/template`}
                download="clearshelf_template.csv"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-brand/40 bg-brand/10 py-2.5 text-sm font-semibold text-brand hover:bg-brand/20 transition-colors"
              >
                <Download className="h-4 w-4" />
                Download Template CSV
              </a>
            </div>

            {/* Required columns */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Table2 className="h-4 w-4 text-brand" />
                Required Columns
              </h3>
              <div className="space-y-2.5">
                {REQUIRED_COLS.map(col => (
                  <div key={col.key} className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-mono font-semibold text-foreground">{col.key}</span>
                      <span className="text-xs text-muted-foreground ml-1.5">— {col.desc}</span>
                      <div className="text-[10px] text-muted-foreground/60 mt-0.5">e.g. {col.example}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Optional</p>
                {OPTIONAL_COLS.map(col => (
                  <div key={col.key} className="flex items-center gap-2 mb-1.5">
                    <div className="h-3.5 w-3.5 shrink-0 rounded-full border border-border" />
                    <span className="text-xs font-mono text-muted-foreground">{col.key}</span>
                    <span className="text-[10px] text-muted-foreground/50">e.g. {col.example}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                Tips for best results
              </h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>• <strong className="text-foreground">At least 7 days</strong> of sales history per product for accurate forecasts</li>
                <li>• <strong className="text-foreground">Consistent SKUs</strong> — same SKU across all rows = same product</li>
                <li>• <strong className="text-foreground">One row per day</strong> per product (not per transaction)</li>
                <li>• Dates in <strong className="text-foreground">YYYY-MM-DD</strong> format (e.g. 2024-06-01)</li>
                <li>• <strong className="text-foreground">quantity_sold</strong> = units sold that day (the ML model trains on this)</li>
              </ul>
            </div>

            {/* Danger zone */}
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
              <h3 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Danger Zone
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                Manually clear all products and sales data from the database.
              </p>
              <button
                onClick={handleClear}
                disabled={clearing}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/20 disabled:opacity-50 transition-colors"
              >
                {clearing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                {clearing ? 'Clearing…' : 'Clear All Data'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
