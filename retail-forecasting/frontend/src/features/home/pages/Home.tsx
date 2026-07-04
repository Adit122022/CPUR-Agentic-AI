import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BarChart2, Shield, TrendingUp, Package, Database, HardDrive, Network, ArrowRight, Sparkles } from 'lucide-react';
import AnimatedCounter from '../../../components/AnimatedCounter';
import heroBg from '../../../assets/hero_bg.png';
import analysisBg from '../../../assets/analysis_bg.png';

export default function Home() {
  const navigate = useNavigate();

  const metrics = [
    { label: 'Products Tracked', value: 12450, icon: <Package className="h-6 w-6 text-olive-300" /> },
    { label: 'Forecast Accuracy', value: 94, suffix: '%', icon: <TrendingUp className="h-6 w-6 text-olive-400" /> },
    { label: 'Stock Alerts', value: 12, icon: <Shield className="h-6 w-6 text-olive-500" /> },
    { label: 'Retailers Analyzed', value: 3, icon: <BarChart2 className="h-6 w-6 text-olive-600" /> },
  ];

  const capabilities = [
    { title: 'Data Lake Integration', desc: 'Seamlessly ingest POS data, weather patterns, and regional demographics.', icon: <Database className="h-6 w-6 text-olive-300" /> },
    { title: 'Neural Engine', desc: 'Process millions of rows of time-series data using multi-agent ML models.', icon: <HardDrive className="h-6 w-6 text-olive-400" /> },
    { title: 'Supply Chain Sync', desc: 'Direct webhook integrations into your existing ERP and warehouse systems.', icon: <Network className="h-6 w-6 text-olive-500" /> },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-color)]">
      <section className="relative isolate overflow-hidden border-b border-border-color/70">
        <div className="absolute inset-0 z-0">
          <img src={heroBg} alt="Retail Dashboard" className="h-full w-full object-cover opacity-15 grayscale dark:opacity-30 dark:mix-blend-overlay" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(240,227,88,0.16),transparent_30%),linear-gradient(130deg,rgba(255,255,255,0.85),transparent_55%),linear-gradient(180deg,var(--bg-color)_0%,transparent_52%,var(--bg-color)_100%)]" />
        </div>

        <div className="relative z-10 page-shell py-24 sm:py-28 lg:py-32">
          <div className="mx-auto max-w-5xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="eyebrow mx-auto"
            >
              <Sparkles className="h-3.5 w-3.5" />
              System v2.4 Online
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 text-5xl font-gothic uppercase tracking-[0.08em] text-text-primary sm:text-6xl md:text-7xl lg:text-8xl"
            >
              ClearShelf <span className="text-olive-400">Intelligence</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary md:text-xl"
            >
              Precision forecasting for modern retail. Optimize inventory, understand local markets, and make data-driven decisions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-10 flex flex-col justify-center gap-3 sm:flex-row"
            >
              <button
                onClick={() => navigate('/forecast')}
                className="inline-flex items-center justify-center rounded-full bg-text-primary px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--bg-color)] transition-colors hover:bg-olive-500"
              >
                Launch Forecast
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <button
                onClick={() => navigate('/products')}
                className="inline-flex items-center justify-center rounded-full border border-border-color/70 bg-white/70 px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.2em] text-text-primary transition-colors hover:bg-white dark:bg-[#23211d]/70 dark:hover:bg-[#2b2a22]"
              >
                Explore Products
              </button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mt-16 grid gap-4 md:grid-cols-4"
          >
            {metrics.map((metric) => (
              <div key={metric.label} className="glass-card rounded-2xl border border-border-color/60 p-5 text-center">
                <div className="mb-3 flex justify-center">{metric.icon}</div>
                <p className="mb-1 font-pixel text-3xl text-olive-300">
                  <AnimatedCounter value={metric.value} />
                  {metric.suffix && <span>{metric.suffix}</span>}
                </p>
                <p className="font-gothic text-xs uppercase tracking-[0.25em] text-text-secondary">{metric.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="page-shell">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="glass-card rounded-[2rem] border border-border-color/70 p-8 shadow-sm sm:p-10">
              <div className="eyebrow">Live Operations</div>
              <h2 className="section-title mt-5">From raw retail signals to confident decisions.</h2>
              <p className="mt-4 text-lg text-text-secondary">
                Built on a multi-agent AI architecture, our platform ingests massive datasets to deliver predictive analytics tailored to your hyper-local retail environments.
              </p>

              <div className="mt-8 space-y-4">
                {capabilities.map((cap) => (
                  <div key={cap.title} className="flex gap-4 rounded-2xl border border-border-color/50 bg-white/70 p-4 shadow-sm dark:bg-[#23211d]/60">
                    <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border-color/60 bg-olive-100/60 dark:bg-[#2b2a22]">
                      {cap.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary">{cap.title}</h3>
                      <p className="mt-1 text-sm text-text-secondary">{cap.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-border-color/70 bg-[var(--card-bg)] shadow-xl">
              <img src={analysisBg} alt="AI Analysis Data Center" className="h-full w-full object-cover transition-transform duration-1000 hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/25 bg-black/60 p-4 backdrop-blur-md">
                <div className="flex items-center justify-between text-sm text-white/80">
                  <span className="font-pixel uppercase tracking-[0.3em]">NODE: SYNC_COMPLETE</span>
                  <span className="rounded-full border border-white/20 bg-white/10 px-2 py-1 text-xs">Ready</span>
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-3/4 animate-pulse rounded-full bg-olive-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
