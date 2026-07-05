import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import {
  ArrowRight, CheckCircle2, Loader2, Sparkles, Brain, Zap,
  Activity, Database, ShieldAlert, LineChart, ChevronDown, ChevronUp
} from 'lucide-react';
import { API_BASE_URL } from '../../../services/api';
import { cn } from '../../../lib/utils';
import FlowingMenu from '../../../components/ui/FlowingMenu';

const BRAND_LOGOS = [
  { name: 'Open AI', code: 'OA' },
  { name: 'Character AI', code: 'CA' },
  { name: 'Granola', code: 'GR' },
  { name: 'Oracle', code: 'OR' },
  { name: 'Hello Patient', code: 'HP' },
  { name: 'Portola', code: 'PR' },
];

const BAR_VALUES = [25, 40, 30, 60, 50, 75, 90, 80, 95];

export default function Home() {
  const navigate = useNavigate();
  const [productCount, setProductCount] = useState(0);
  const [alertCount, setAlertCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  // Interactive micro-interaction states for hero screens
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [hoveredThreshold, setHoveredThreshold] = useState<string | null>(null);

  // 3D Tilt Spring motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [42, 28]), springConfig); // Centered around 35deg
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [12, 28]), springConfig); // Centered around 20deg
  const glowX = useSpring(useTransform(mouseX, [-0.5, 0.5], ['-10%', '110%']), springConfig);
  const glowY = useSpring(useTransform(mouseY, [-0.5, 0.5], ['-10%', '110%']), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXVal = (e.clientX - rect.left) / width - 0.5;
    const mouseYVal = (e.clientY - rect.top) / height - 0.5;
    mouseX.set(mouseXVal);
    mouseY.set(mouseYVal);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Pipeline step loop
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 5);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then(r => r.json())
      .then((data: { id: number; current_stock: number; category: string }[]) => {
        setProductCount(data.length);
        setAlertCount(data.filter(p => p.current_stock <= 20).length);
        setCategoryCount(new Set(data.map(p => p.category)).size);
      })
      .catch(() => { });
  }, []);

  const toggleFaq = (idx: number) => {
    setFaqOpen(faqOpen === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">

      {/* ══════════════════════════════════════════════
          1. HERO SECTION (Overlapping 3D Screens - B&W Style)
          ══════════════════════════════════════════════ */}
      <section className="pt-10 md:pt-10 lg:pt-20 pb-28 relative border-b border-border bg-background dot-bg">
        <div className="absolute inset-0 glow-amber opacity-10 pointer-events-none" />

        <div className="max-w-7xl px-4 md:px-8 mx-auto grid grid-cols-2 lg:grid-cols-[1.1fr_1fr] gap-4 md:gap-16 items-center">

          {/* Left Column Text */}
          <div className="space-y-4 sm:space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card text-muted-foreground text-[8px] sm:text-[10px] font-bold uppercase tracking-widest"
            >
              <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-foreground" />
              <span>Cooperative Retail AI Agents</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-xl sm:text-5xl lg:text-7xl tracking-tight font-black leading-[1.1] sm:leading-[1.05]"
            >
              Forecasts that <br /> run themselves. <br />
              <span className="text-muted-foreground font-light">Optimization that keeps you safe.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="hidden sm:block text-sm sm:text-base text-muted-foreground max-w-lg leading-relaxed pt-2"
            >
              Deploy autonomous AI agents that plan demand, inspect inventory pipelines, and trigger restocking alerts—without changing how your retail teams operate.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-wrap items-center gap-2 sm:gap-4 pt-2 sm:pt-4"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/login')}
                className="inline-flex cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-[9px] sm:text-xs font-bold uppercase tracking-widest bg-foreground text-background hover:bg-foreground/90 h-9 sm:h-11 px-4 sm:px-8 shadow-brand transition-all"
              >
                Start Free Trial
                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/documentation')}
                className="inline-flex cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-[9px] sm:text-xs font-bold uppercase tracking-widest border border-border bg-background/50 hover:bg-secondary h-9 sm:h-11 px-4 sm:px-8 transition-all"
              >
                Read Guide
              </motion.button>
            </motion.div>
          </div>

          {/* Right Column: Overlapping Rotated Screens with Mouse Interactive Tilt */}
          <div className="relative min-h-[220px] sm:min-h-[450px] lg:min-h-[550px] w-full flex items-center justify-center scale-[0.65] sm:scale-100 origin-center translate-x-2 sm:translate-x-12 z-10">

            {/* Dynamic Spotlight tracker behind screens */}
            <motion.div
              style={{
                left: glowX,
                top: glowY,
              }}
              className="absolute w-80 h-80 rounded-full bg-foreground/[0.04] blur-[80px] pointer-events-none -translate-x-1/2 -translate-y-1/2 z-0"
            />

            <div className="relative w-full h-full perspective-distant">

              <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                  rotateX,
                  rotateY,
                  rotateZ: -20,
                  transformStyle: 'preserve-3d',
                }}
                className="relative w-full h-full"
              >

                {/* Back Overlapping Screen (Screen 4 Layout) */}
                <motion.div
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 w-[85%] h-fit bg-card border border-border/80 rounded-xl shadow-2xl p-5 select-none mask-b-20 mask-r-20 z-0 cursor-default"
                >
                  {/* Mock Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-border/40 mb-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-border" />
                      <span className="w-2 h-2 rounded-full bg-border" />
                      <span className="w-2 h-2 rounded-full bg-border" />
                    </div>
                    <span className="text-[9px] text-muted-foreground font-mono">clearshelf.ai/metrics</span>
                  </div>

                  {/* Dashboard mock list */}
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold font-mono">CRITICAL SAFETY THRESHOLDS</p>
                    {[
                      { sku: 'AP-002', name: 'Organic Cotton Tee', qty: '45 items left', alert: 'Medium Risk' },
                      { sku: 'SH-001', name: 'Premium Leather Boots', qty: '14 items left', alert: 'Critical Alert' },
                    ].map(item => (
                      <motion.div
                        key={item.sku}
                        onHoverStart={() => setHoveredThreshold(item.sku)}
                        onHoverEnd={() => setHoveredThreshold(null)}
                        animate={{
                          backgroundColor: hoveredThreshold === item.sku ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                          borderColor: hoveredThreshold === item.sku ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.08)'
                        }}
                        className="p-2.5 rounded-lg border flex justify-between items-center transition-colors cursor-pointer"
                      >
                        <div>
                          <p className="text-xs font-bold text-foreground">{item.name}</p>
                          <p className="text-[9px] text-muted-foreground font-mono">{item.sku} • {item.qty}</p>
                        </div>
                        <span className={cn(
                          "text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 border border-border bg-card rounded-md transition-all",
                          item.alert === 'Critical Alert' && hoveredThreshold === item.sku ? 'text-background bg-foreground' : 'text-foreground'
                        )}>{item.alert}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Front Overlapping Screen (Screen 3 Layout, Translated X/Y) */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.15 }}
                  className="absolute inset-0 w-[85%] h-fit bg-card border border-border rounded-xl shadow-2xl p-5 translate-x-12 -translate-y-12 md:translate-x-20 md:-translate-y-20 z-10 cursor-default"
                >
                  {/* Mock Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-border/40 mb-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-border" />
                      <span className="w-2 h-2 rounded-full bg-border" />
                      <span className="w-2 h-2 rounded-full bg-border" />
                    </div>
                    <span className="text-[9px] text-muted-foreground font-mono">clearshelf.ai/analytics</span>
                  </div>

                  {/* Stat grid */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <motion.div whileHover={{ y: -1 }} className="bg-secondary/40 border border-border/60 rounded-lg p-2 text-center transition-all">
                      <p className="text-[9px] uppercase tracking-wider text-muted-foreground">SKUs</p>
                      <p className="text-xs font-bold mt-0.5">{productCount || 'Active'}</p>
                    </motion.div>
                    <motion.div whileHover={{ y: -1 }} className="bg-secondary/40 border border-border/60 rounded-lg p-2 text-center transition-all">
                      <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Alerts</p>
                      <p className="text-xs font-bold text-foreground mt-0.5">{alertCount || '0'}</p>
                    </motion.div>
                    <motion.div whileHover={{ y: -1 }} className="bg-secondary/40 border border-border/60 rounded-lg p-2 text-center transition-all">
                      <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Categories</p>
                      <p className="text-xs font-bold text-foreground mt-0.5">{categoryCount || '0'}</p>
                    </motion.div>
                  </div>

                  {/* Mini Graph with Hover Interaction */}
                  <div className="bg-secondary/20 border border-border/40 rounded-lg p-3 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-[9px] font-mono text-muted-foreground">SEASONALITY REGRESSION INDEX</p>
                      <AnimatePresence>
                        {hoveredBar !== null && (
                          <motion.span
                            initial={{ opacity: 0, x: 5 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-[9px] font-mono text-foreground font-black uppercase tracking-wider"
                          >
                            Index: {BAR_VALUES[hoveredBar]}%
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="h-16 flex items-end justify-between gap-1 pt-2">
                      {BAR_VALUES.map((h, i) => (
                        <motion.div
                          key={i}
                          onHoverStart={() => setHoveredBar(i)}
                          onHoverEnd={() => setHoveredBar(null)}
                          animate={{
                            height: `${h}%`,
                            backgroundColor: hoveredBar === i ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.25)'
                          }}
                          className="flex-1 rounded-t-sm cursor-pointer"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>

              </motion.div>

            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          2. LOGO CLOUD (Black & White style)
          ══════════════════════════════════════════════ */}
      <section className="py-12 border-b border-border bg-secondary/15">
        <div className="max-w-7xl px-4 md:px-8 mx-auto text-center">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-8">
            Trusted by modern retail operators
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-center">
            {BRAND_LOGOS.map((brand) => (
              <motion.div
                key={brand.name}
                whileHover={{ scale: 1.05, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="flex items-center justify-center gap-1.5 cursor-pointer opacity-35 hover:opacity-100 transition-opacity duration-300"
              >
                <span className="w-5 h-5 flex items-center justify-center rounded bg-foreground text-background font-black text-[10px]">{brand.code}</span>
                <span className="font-bold text-foreground text-sm tracking-tight">{brand.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          3. FEATURE GRID (Three columns, monochrome details)
          ══════════════════════════════════════════════ */}
      <section id="features" className="py-20 lg:py-28 bg-background border-b border-border scroll-mt-16">
        <div className="max-w-7xl px-4 md:px-8 mx-auto">

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl tracking-tight font-black leading-none uppercase">
                Built for Scale. <br /> Tuned for precision.
              </h2>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              ClearShelf operates using isolated local databases, fitting demand algorithms to transaction sheets without manual inventory auditing.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Feature 1 */}
            <motion.div
              whileHover={{ y: -4, borderColor: 'rgba(255, 255, 255, 0.18)' }}
              transition={{ duration: 0.2 }}
              className="bg-card border border-border rounded-xl p-6 flex flex-col justify-between transition-colors"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-secondary border border-border flex items-center justify-center text-foreground mb-6">
                  <Brain className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-3">Prebuilt Retail Agents</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                  Verify specific automated agents as they calculate regional seasonality, alerts, and replenishment points.
                </p>
              </div>

              <div className="space-y-2">
                {[
                  { name: 'Seasonality Indexer', role: 'Aligns holiday spikes', icon: <Activity className="h-3.5 w-3.5 text-foreground" /> },
                  { name: 'Restock Sentinel', role: 'Flags stockout windows', icon: <ShieldAlert className="h-3.5 w-3.5 text-muted-foreground" /> },
                  { name: 'Linear Predictor', role: 'Computes regression curves', icon: <LineChart className="h-3.5 w-3.5 text-foreground" /> },
                ].map(agent => (
                  <div key={agent.name} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/30 border border-border/50">
                    <div className="p-1 rounded bg-background border border-border">{agent.icon}</div>
                    <div>
                      <p className="text-xs font-bold text-foreground">{agent.name}</p>
                      <p className="text-[9px] text-muted-foreground">{agent.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              whileHover={{ y: -4, borderColor: 'rgba(255, 255, 255, 0.18)' }}
              transition={{ duration: 0.2 }}
              className="bg-card border border-border rounded-xl p-6 flex flex-col justify-between transition-colors"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-secondary border border-border flex items-center justify-center text-foreground mb-6">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-3">Workflow Pipelines</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                  Track files dynamically as transactions are indexed, aligned, and converted into structured reports.
                </p>
              </div>

              <div className="space-y-2">
                {[
                  { title: 'Injest CSV Logs', desc: 'Validates columns & headers', time: '1s' },
                  { title: 'Deduplicate SKUs', desc: 'Isolates distinct codes', time: '2s' },
                  { title: 'Fit Seasonality', desc: 'Identifies holiday trends', time: '4s' },
                  { title: 'Apply Regression', desc: 'Calculates predicted demand', time: '3s' },
                ].map((step, idx) => {
                  const isDone = idx < activeStep;
                  const isCurrent = idx === activeStep;
                  return (
                    <div
                      key={step.title}
                      className={cn(
                        "flex items-center justify-between p-2 rounded-lg border transition-all duration-300",
                        isCurrent
                          ? "border-foreground bg-foreground/5 scale-[1.01]"
                          : isDone
                            ? "border-border/60 bg-secondary/15"
                            : "border-border/20 opacity-40 bg-transparent"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {isDone ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-foreground" />
                        ) : isCurrent ? (
                          <Loader2 className="h-3.5 w-3.5 text-foreground animate-spin" />
                        ) : (
                          <span className="w-3.5 h-3.5 rounded-full border border-border flex items-center justify-center text-[8px] font-bold">{idx + 1}</span>
                        )}
                        <div>
                          <p className="text-[10px] font-bold text-foreground leading-tight">{step.title}</p>
                          <p className="text-[8px] text-muted-foreground">{step.desc}</p>
                        </div>
                      </div>
                      <span className="text-[8px] font-mono text-muted-foreground">{step.time}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              whileHover={{ y: -4, borderColor: 'rgba(255, 255, 255, 0.18)' }}
              transition={{ duration: 0.2 }}
              className="bg-card border border-border rounded-xl p-6 flex flex-col justify-between transition-colors"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-secondary border border-border flex items-center justify-center text-foreground mb-6">
                  <Database className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-3">Structured Database</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                  Keep transaction lines and safety limits fully synchronized. Your records sit in secure PostgreSQL instances.
                </p>
              </div>

              <div className="h-44 border border-border rounded-lg bg-secondary/20 p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <span className="text-[9px] font-mono font-bold text-foreground">DB SYNCHRONIZER STATUS</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground animate-ping" />
                </div>
                <div className="space-y-1.5 py-2 grow flex flex-col justify-center text-[10px]">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Sync State</span>
                    <span className="font-mono text-foreground font-bold">Active</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">SSL Encrypted</span>
                    <span className="font-mono text-foreground font-bold">Enabled</span>
                  </div>
                </div>
                <div className="w-full bg-border h-1 rounded-full overflow-hidden">
                  <div className="bg-foreground h-full w-[94%]" />
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          INTERACTIVE DIRECTORY (FlowingMenu Component)
          ══════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 border-b border-border bg-background">
        <div className="max-w-7xl px-4 md:px-8 mx-auto">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-4">
              <Zap className="h-3.5 w-3.5 text-foreground" />
              <span>Interactive Navigation Directory</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-foreground leading-none">
              Explore capabilities.
            </h2>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mt-2">
              Hover over each option to reveal visual guides and navigate ClearShelf resources.
            </p>
          </div>

          <div className="border border-border rounded-xl overflow-hidden shadow-2xl relative" style={{ height: '400px' }}>
            <FlowingMenu
              items={[
                { link: '/upload', text: 'Data Ingestion', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=60' },
                { link: '/products', text: 'Product Catalog', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=60' },
                { link: '/forecast', text: 'Demand Predict', image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=60' },
                { link: '/documentation', text: 'System Guide', image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=60' }
              ]}
              speed={12}
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          4. FAQS SECTION (B&W Accordion Style)
          ══════════════════════════════════════════════ */}
      <section id="faqs" className="py-20 lg:py-28 bg-background border-b border-border scroll-mt-16">
        <div className="max-w-4xl px-4 md:px-8 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mt-2">
              Everything you need to know about retail forecasting
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How does the linear regression predictor calculate stock levels?",
                a: "It fits a weekly demand curve using local sales data, factoring in current safety stock parameters. Every regression is computed dynamically upon CSV upload."
              },
              {
                q: "Is my CSV transactional data secured?",
                a: "Yes, all data remains client-side or sits in a dedicated, isolated database replica. Your credentials and store tokens are authenticated via Clerk."
              },
              {
                q: "Can I manage alerts for multiple store categories?",
                a: "Yes, category filters let you isolate footwear, electronics, apparel, and custom lines instantly, generating custom replenishment levels for each."
              }
            ].map((faq, idx) => {
              const isOpen = faqOpen === idx;
              return (
                <div
                  key={idx}
                  className="border border-border rounded-lg bg-card/40 overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-foreground hover:bg-secondary/20 transition-colors uppercase tracking-wider"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="p-5 pt-0 border-t border-border/40 text-xs text-muted-foreground leading-relaxed">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          5. CTA CALL-TO-ACTION (B&W split layout)
          ══════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-secondary/10 relative overflow-hidden">
        <div className="max-w-4xl px-4 mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-foreground leading-[1.1] mb-6">
            Ready to optimize your retail supply chain?
          </h2>
          <p className="text-xs text-muted-foreground max-w-md mx-auto mb-10 leading-relaxed uppercase tracking-wider">
            Sign up in seconds, drop your transactional sales spreadsheets, and unlock automated shelf forecasts instantly.
          </p>
          <div className="flex justify-center items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/login')}
              className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-xs font-bold uppercase tracking-widest bg-foreground text-background hover:bg-foreground/90 h-11 px-8 shadow-brand transition-all"
            >
              Sign Up Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/documentation')}
              className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-xs font-bold uppercase tracking-widest border border-border bg-background hover:bg-secondary h-11 px-8 transition-all"
            >
              Read Docs
            </motion.button>
          </div>
        </div>
      </section>
    </div>
  );
}
