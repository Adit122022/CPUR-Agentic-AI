import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../store';
import { fetchProducts } from '../../products/products.slice';
import {
  Upload, FileText, CheckCircle2, XCircle, AlertTriangle,
  Download, Trash2, ArrowRight, Table2, Loader2, RotateCcw,
  Package, BarChart2, CalendarDays, Database,
} from 'lucide-react';
import { API_BASE_URL } from '../../../services/api';
import { cn } from '../../../lib/utils';

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

const REQUIRED_COLS = [
  { key: 'date',           label: 'Date',           desc: 'YYYY-MM-DD format',          example: '2026-07-01' },
  { key: 'product_name',   label: 'Product Name',   desc: 'Display name of product',    example: 'Blue Denim Jeans' },
  { key: 'sku',            label: 'SKU',            desc: 'Unique identifier code',      example: 'SH-001' },
  { key: 'category',       label: 'Category',       desc: 'Product category',            example: 'Apparel' },
  { key: 'price',          label: 'Price (₹)',       desc: 'Selling price in INR',        example: '1299' },
  { key: 'quantity_sold',  label: 'Quantity Sold',  desc: 'Units sold that day',         example: '12' },
  { key: 'current_stock',  label: 'Current Stock',  desc: 'Inventory on hand',           example: '150' },
];

const OPTIONAL_COLS = [
  { key: 'brand',            example: 'Timberland' },
  { key: 'discounted_price', example: '999' },
  { key: 'description',      example: 'Slim-fit jeans' },
];

export default function UploadPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const redirectReason = location.state?.redirectReason;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<Step>('idle');
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [clearOnImport, setClearOnImport] = useState(true);
  const [clearing, setClearing] = useState(false);

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
      if (data.success) {
        dispatch(fetchProducts());
      }
      setStep(data.success ? 'done' : 'error');
    } catch {
      setStep('error');
    }
  };

  const handleClear = async () => {
    if (!window.confirm('This will delete ALL products and sales data. Are you sure?')) return;
    setClearing(true);
    try {
      await fetch(`${API_BASE_URL}/api/upload/clear`, { method: 'DELETE' });
      dispatch(fetchProducts());
    } finally {
      setClearing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setStep('idle');
    setValidation(null);
    setImportResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-background py-16 px-4 md:px-8 dot-bg relative">
      <div className="absolute inset-0 glow-amber opacity-10 pointer-events-none" />

      <div className="max-w-5xl mx-auto z-10 relative">
        {redirectReason && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg border border-border bg-card/60 text-foreground text-xs flex items-center gap-3 backdrop-blur-md uppercase tracking-wider font-bold"
          >
            <AlertTriangle className="h-4 w-4 text-muted-foreground shrink-0" />
            <span>{redirectReason}</span>
          </motion.div>
        )}

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-4">
            <Upload className="h-3.5 w-3.5 text-foreground" />
            <span>Data Ingestion Portal</span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-foreground mb-3">
            Upload Inventory Sheet
          </h1>
          <p className="text-xs text-muted-foreground max-w-xl leading-relaxed uppercase tracking-wider">
            Import your sales records. ClearShelf will automatically create your product catalog and run predictive demand forecasting.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">

          {/* LEFT: Upload + Preview */}
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
                  'relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed cursor-pointer transition-all py-16 px-8 text-center bg-card/45 backdrop-blur-md',
                  dragOver
                    ? 'border-foreground bg-foreground/5 scale-[1.01]'
                    : step === 'error'
                    ? 'border-border bg-secondary/10'
                    : 'border-border bg-card/30 hover:border-foreground/50 hover:bg-foreground/5'
                )}
              >
                <input ref={fileInputRef} type="file" accept=".csv" onChange={onFileInput} className="hidden" />
                {step === 'validating' ? (
                  <>
                    <Loader2 className="h-10 w-10 text-foreground animate-spin" />
                    <p className="text-xs font-bold uppercase tracking-widest text-foreground">Validating CSV Logs…</p>
                  </>
                ) : (
                  <>
                    <div className={cn('flex h-16 w-16 items-center justify-center rounded-xl border border-border bg-background')}>
                      {step === 'error' ? <XCircle className="h-8 w-8 text-foreground" /> : <Upload className="h-8 w-8 text-foreground" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-wider text-foreground">
                        {step === 'error' && file ? `"${file.name}" has format issues` : 'Drop your CSV transaction sheet here'}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground uppercase tracking-widest">
                        {step === 'error' ? 'Review validation logs and re-upload' : 'or click to browse local files'}
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
                  className="rounded-lg border border-border bg-secondary/10 p-5"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="h-4 w-4 text-foreground" />
                    <p className="text-xs font-bold uppercase tracking-widest text-foreground">Validation Log</p>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{validation.error}</p>
                  {validation.errors && validation.errors.length > 0 && (
                    <ul className="mt-2 space-y-1.5 border-t border-border pt-3">
                      {validation.errors.map((e, i) => (
                        <li key={i} className="text-xs text-muted-foreground font-mono">• {e}</li>
                      ))}
                    </ul>
                  )}
                  <button onClick={reset} className="mt-4 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-foreground hover:opacity-80 transition-opacity">
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
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-border bg-card/65 p-5 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-foreground" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-widest text-foreground">Verified CSV File</p>
                        <p className="text-xs text-muted-foreground font-mono truncate">{file?.name}</p>
                      </div>
                    </div>
                    <div className="flex gap-4 text-center">
                      <div>
                        <p className="text-base font-bold text-foreground">{validation.unique_products}</p>
                        <p className="text-[9px] uppercase tracking-wider text-muted-foreground">SKUs</p>
                      </div>
                      <div>
                        <p className="text-base font-bold text-foreground">{validation.total_rows}</p>
                        <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Sales Rows</p>
                      </div>
                    </div>
                  </div>

                  {/* Preview table */}
                  {validation.preview.length > 0 && (
                    <div className="rounded-xl border border-border bg-card/30 overflow-hidden">
                      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/20">
                        <Table2 className="h-4 w-4 text-muted-foreground" />
                        <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                          Spreadsheet Preview (first {validation.preview.length} rows)
                        </p>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead className="bg-secondary/40 text-foreground border-b border-border uppercase text-[9px] tracking-widest">
                            <tr>
                              {Object.keys(validation.preview[0]).map(col => (
                                <th key={col} className="px-3 py-2 text-left font-bold tracking-wider whitespace-nowrap">
                                  {col}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/40 text-muted-foreground font-mono text-[10px]">
                            {validation.preview.map((row, i) => (
                              <tr key={i} className={cn(i % 2 === 0 ? 'bg-background' : 'bg-secondary/10')}>
                                {Object.values(row).map((val, j) => (
                                  <td key={j} className="px-3 py-2 whitespace-nowrap max-w-[160px] truncate" title={val}>
                                    {val || <span className="text-muted-foreground/30">—</span>}
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
                  <label className="flex items-center gap-3 rounded-xl border border-border bg-card/60 p-4 cursor-pointer hover:border-foreground/45 transition-colors">
                    <input
                      type="checkbox"
                      checked={clearOnImport}
                      onChange={e => setClearOnImport(e.target.checked)}
                      className="h-4 w-4 rounded accent-foreground"
                    />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-foreground">Clear existing tables</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-widest">Wipes previous catalog records first</p>
                    </div>
                  </label>

                  {/* Action buttons */}
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleImport}
                      disabled={step === 'importing'}
                      className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-foreground py-3 text-xs font-bold uppercase tracking-widest text-background shadow-brand disabled:opacity-70 transition-all"
                    >
                      {step === 'importing' ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Importing…</>
                      ) : (
                        <><Database className="h-4 w-4" /> Load to neon db</>
                      )}
                    </motion.button>
                    <button
                      onClick={reset}
                      disabled={step === 'importing'}
                      className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:bg-secondary transition-colors disabled:opacity-50"
                    >
                      <RotateCcw className="h-4 w-4" /> Reset
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* SUCCESS STATE */}
            <AnimatePresence>
              {step === 'done' && importResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-xl border border-border bg-card/75 p-8 text-center backdrop-blur-md"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary border border-border mx-auto mb-4"
                  >
                    <CheckCircle2 className="h-8 w-8 text-foreground" />
                  </motion.div>
                  <h2 className="text-lg font-bold uppercase tracking-wider text-foreground mb-2">Import Successful</h2>
                  <p className="text-xs text-muted-foreground mb-6 uppercase tracking-wider leading-relaxed">{importResult.message}</p>

                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                      { icon: <Package className="h-4 w-4" />, value: importResult.products_created, label: 'SKUs Created' },
                      { icon: <BarChart2 className="h-4 w-4" />, value: importResult.sales_inserted, label: 'Sales Records' },
                      { icon: <CalendarDays className="h-4 w-4" />, value: importResult.products_updated, label: 'SKUs Updated' },
                    ].map(s => (
                      <div key={s.label} className="rounded-lg border border-border bg-background p-4">
                        <div className="mb-2 flex justify-center text-foreground">{s.icon}</div>
                        <p className="text-xl font-black text-foreground font-mono">{s.value}</p>
                        <p className="text-[9px] uppercase tracking-wider text-muted-foreground mt-1 leading-tight">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate('/products')}
                      className="flex items-center justify-center gap-2 rounded-lg bg-foreground px-6 py-3 text-xs font-bold uppercase tracking-widest text-background"
                    >
                      View Catalog <ArrowRight className="h-4 w-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate('/forecast')}
                      className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-xs font-bold uppercase tracking-widest text-foreground hover:bg-secondary transition-colors"
                    >
                      Run Predictions <BarChart2 className="h-4 w-4" />
                    </motion.button>
                    <button onClick={reset} className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors px-4 pt-2 sm:pt-0">
                      Upload another
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT SIDEBAR: Guide */}
          <div className="space-y-5">

            {/* Download template */}
            <div className="rounded-xl border border-border bg-card/65 p-5 backdrop-blur-md">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-foreground" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">Spreadsheet template</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wider leading-relaxed">
                Download a pre-filled sample spreadsheet with clothing SKU logs to test the pipeline.
              </p>
              <a
                href={`${API_BASE_URL}/api/upload/template`}
                download="clearshelf_template.csv"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-secondary/40 py-2.5 text-xs font-bold uppercase tracking-widest text-foreground hover:bg-secondary transition-colors"
              >
                <Download className="h-4 w-4" />
                Download template
              </a>
            </div>

            {/* Required columns */}
            <div className="rounded-xl border border-border bg-card/60 p-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-foreground mb-4 flex items-center gap-2">
                <Table2 className="h-4 w-4 text-foreground" />
                Required Schema
              </h3>
              <div className="space-y-3">
                {REQUIRED_COLS.map(col => (
                  <div key={col.key} className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-foreground shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-mono font-bold text-foreground">{col.key}</span>
                      <span className="text-[10px] text-muted-foreground ml-1.5">— {col.desc}</span>
                      <div className="text-[9px] text-muted-foreground/60 mt-0.5">e.g. {col.example}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Optional Parameters</p>
                {OPTIONAL_COLS.map(col => (
                  <div key={col.key} className="flex items-center gap-2 mb-1.5">
                    <div className="h-3.5 w-3.5 shrink-0 rounded-full border border-border" />
                    <span className="text-[10px] font-mono text-muted-foreground font-semibold">{col.key}</span>
                    <span className="text-[9px] text-muted-foreground/50 ml-2">e.g. {col.example}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Danger zone */}
            <div className="rounded-xl border border-border bg-card/60 p-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-foreground mb-2 flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Danger Zone
              </h3>
              <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">
                Manually wipe all product indices and sales tables from Neon replica.
              </p>
              <button
                onClick={handleClear}
                disabled={clearing}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-secondary/20 py-2 text-xs font-bold uppercase tracking-widest text-foreground hover:bg-secondary transition-colors"
              >
                {clearing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                {clearing ? 'Clearing…' : 'Clear Data Tables'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
