import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart2, Package, Shield, TrendingUp, Sparkles, Brain, Zap, Eye, CheckCircle, ShoppingBag, Store, Boxes } from 'lucide-react';
import { useEffect } from 'react';
import { API_BASE_URL } from '../../../services/api';
import AnimatedCounter from '../../../components/AnimatedCounter';

/* ─── tiny floating dot for hero bg ─── */
function StarField() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 1.5 + 0.5,
    opacity: Math.random() * 0.4 + 0.1,
    delay: Math.random() * 4,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {stars.map(s => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, opacity: s.opacity }}
          animate={{ opacity: [s.opacity, s.opacity * 2.5, s.opacity] }}
          transition={{ duration: 3 + s.delay, repeat: Infinity, ease: 'easeInOut', delay: s.delay }}
        />
      ))}
    </div>
  );
}

/* ─── animated number stat card ─── */
function StatCard({ value, label, icon, isText }: { value: number | string; label: string; icon: React.ReactNode; isText?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card/60 px-6 py-5 backdrop-blur-sm text-center"
    >
      <div className="mb-2 text-brand">{icon}</div>
      <p className="text-2xl font-bold text-foreground">
        {isText ? value : <AnimatedCounter value={value as number} />}
      </p>
      <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
    </motion.div>
  );
}

const features = [
  { title: 'Real-Time Insights',     desc: 'Demand patterns emerge instantly.', icon: <Eye className="h-5 w-5" /> },
  { title: 'Smart Recommendations',  desc: 'AI-powered restocking suggestions.', icon: <Brain className="h-5 w-5" /> },
  { title: 'Zero Stockouts',         desc: 'Automated low-stock alerts.',        icon: <Zap className="h-5 w-5" /> },
  { title: 'Reduce Waste',           desc: 'Precision overstock forecasting.',    icon: <CheckCircle className="h-5 w-5" /> },
];

const useCases = [
  { title: 'Fashion Stores',        desc: 'Plan seasonal inventory smartly.',    icon: <ShoppingBag className="h-4 w-4" /> },
  { title: 'Local Retailers',       desc: 'Never run out of top sellers.',       icon: <Store className="h-4 w-4" /> },
  { title: 'Grocery & Essentials',  desc: 'Catch demand spikes early.',          icon: <Package className="h-4 w-4" /> },
  { title: 'Electronics & Home',    desc: 'Track fast-moving SKUs.',             icon: <Boxes className="h-4 w-4" /> },
];

const testimonials = [
  { name: 'Rajesh Kumar',  role: 'Fashion Store Owner, Delhi',    text: 'ClearShelf helped us reduce overstock by 35% while keeping bestsellers always available.' },
  { name: 'Priya Sharma',  role: 'Supermarket Manager, Mumbai',   text: 'The forecast accuracy is incredible. We plan orders with confidence — zero stockouts in months.' },
  { name: 'Amit Patel',    role: 'Retail Chain Owner, Kota',      text: 'Managing inventory across multiple stores is now effortless. The platform pays for itself in reduced waste.' },
];

const steps = [
  { num: '01', title: 'Connect Your Store',   desc: 'Link your sales data and inventory systems in minutes.' },
  { num: '02', title: 'Let AI Learn',         desc: 'Analyzes patterns, trends, seasonality and local factors.' },
  { num: '03', title: 'Get Smart Forecasts',  desc: 'Daily demand predictions with actionable recommendations.' },
  { num: '04', title: 'Optimize & Earn',      desc: 'Watch waste drop and profits rise from smarter decisions.' },
];

export default function Home() {
  const navigate = useNavigate();
  const [productCount, setProductCount] = useState(0);
  const [alertCount,   setAlertCount]   = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then(r => r.json())
      .then((data: { id: number; current_stock: number; category: string }[]) => {
        setProductCount(data.length);
        setAlertCount(data.filter(p => p.current_stock <= 20).length);
        setCategoryCount(new Set(data.map(p => p.category)).size);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ══════════════════════════════════════════════
          HERO — Aceternity split layout
      ══════════════════════════════════════════════ */}
      <section className="relative isolate overflow-hidden min-h-[calc(100vh-4rem)] flex items-center">
        {/* dot grid */}
        <div className="absolute inset-0 dot-bg opacity-40 dark:opacity-20 pointer-events-none" aria-hidden />
        {/* glow orb */}
        <div className="absolute inset-0 glow-amber pointer-events-none" aria-hidden />
        {/* bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent pointer-events-none" aria-hidden />
        <StarField />

        <div className="relative z-10 page-shell w-full py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* LEFT — big heading */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="brand-pill mb-6 w-fit"
              >
                <Sparkles className="h-3 w-3" />
                System v2.4 — Live
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-[clamp(2.8rem,6vw,5.5rem)] font-extrabold leading-[1.02] tracking-tight text-foreground"
              >
                The smartest way to{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #f59e0b 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  forecast
                </span>{' '}
                retail demand.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="mt-6 text-lg text-muted-foreground max-w-md leading-relaxed"
              >
                Precision inventory forecasting powered by multi-agent AI. Reduce stockouts, cut waste, and make data-driven decisions — instantly.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="mt-10 flex flex-wrap gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/forecast')}
                  className="inline-flex h-11 items-center gap-2 rounded-lg bg-brand px-6 text-sm font-semibold text-background shadow-[0_0_24px_rgba(245,158,11,0.3)] transition-all hover:shadow-[0_0_32px_rgba(245,158,11,0.45)]"
                >
                  Launch Forecast
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/products')}
                  className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-secondary px-6 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                >
                  Explore Products
                </motion.button>
              </motion.div>
            </div>

            {/* RIGHT — description + stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col gap-6"
            >
              <p className="text-muted-foreground leading-relaxed text-base">
                We built ClearShelf to give every retailer — from small neighborhood shops to multi-store chains — the same inventory intelligence that enterprise giants use. No calls. No guesswork. Just clear forecasts.
              </p>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3">
                <StatCard value={productCount} label="Products Tracked" icon={<Package className="h-5 w-5" />} />
                <StatCard value="Linear" label="Forecast Model" icon={<TrendingUp className="h-5 w-5" />} isText />
                <StatCard value={alertCount} label="Stock Alerts" icon={<Shield className="h-5 w-5" />} />
                <StatCard value={categoryCount} label="Categories" icon={<BarChart2 className="h-5 w-5" />} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          USE CASES
      ══════════════════════════════════════════════ */}
      <section className="border-t border-border py-24">
        <div className="page-shell">
          <div className="mb-12 text-center">
            <span className="eyebrow mb-4 mx-auto">Built for any retailer</span>
            <h2 className="section-title mt-4 max-w-2xl mx-auto">
              Whether you run one store or twenty, ClearShelf scales with you.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {useCases.map((uc, i) => (
              <motion.div
                key={uc.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="rounded-2xl border border-border bg-card p-6 hover:border-brand/40 transition-colors"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  {uc.icon}
                </div>
                <h3 className="font-semibold text-foreground">{uc.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{uc.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════════ */}
      <section className="border-t border-border py-24 bg-card/30">
        <div className="page-shell">
          <div className="mb-12 text-center">
            <span className="eyebrow mb-4 mx-auto">Why retailers love ClearShelf</span>
            <h2 className="section-title mt-4">Intelligent inventory that works.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="gradient-border rounded-2xl bg-card p-6"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════ */}
      <section className="border-t border-border py-24">
        <div className="page-shell">
          <div className="mb-12 text-center">
            <span className="eyebrow mb-4 mx-auto">Simple & effective</span>
            <h2 className="section-title mt-4">How it works.</h2>
          </div>
          <div className="mx-auto max-w-2xl space-y-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="flex items-start gap-6 rounded-2xl border border-border bg-card p-6"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand font-bold text-sm">
                  {step.num}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════ */}
      <section className="border-t border-border py-24 bg-card/30">
        <div className="page-shell">
          <div className="mb-12 text-center">
            <span className="eyebrow mb-4 mx-auto">Success stories</span>
            <h2 className="section-title mt-4">Trusted by retailers across India.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex flex-col justify-between rounded-2xl border border-border bg-card p-7"
              >
                <div>
                  <div className="mb-3 flex gap-0.5 text-brand">{'★★★★★'.split('').map((s, j) => <span key={j}>{s}</span>)}</div>
                  <p className="text-sm leading-relaxed text-muted-foreground">"{t.text}"</p>
                </div>
                <div className="mt-6">
                  <p className="font-semibold text-foreground text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════ */}
      <section className="border-t border-border py-24">
        <div className="page-shell">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl border border-border bg-card p-12 text-center"
          >
            {/* inner glow */}
            <div className="absolute inset-0 glow-amber-sm pointer-events-none" />
            <div className="absolute inset-0 dot-bg opacity-20 pointer-events-none" />
            <div className="relative">
              <h2 className="section-title mb-4">Ready to transform your retail?</h2>
              <p className="mb-8 text-muted-foreground max-w-md mx-auto">
                Join retailers who have reduced stockouts, minimized waste, and increased profits with AI forecasting.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/forecast')}
                  className="inline-flex h-11 items-center gap-2 rounded-lg bg-brand px-7 text-sm font-semibold text-background shadow-[0_0_24px_rgba(245,158,11,0.3)] hover:shadow-[0_0_40px_rgba(245,158,11,0.45)] transition-all"
                >
                  Start Your Free Forecast
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/agents')}
                  className="inline-flex h-11 items-center rounded-lg border border-border bg-secondary px-7 text-sm font-medium text-foreground hover:bg-accent transition-colors"
                >
                  Meet the AI Agents
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
