import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BarChart2, Shield, TrendingUp, Package, Database, HardDrive, Network } from 'lucide-react';
import AnimatedCounter from '../../../components/AnimatedCounter';
import heroBg from '../../../assets/hero_bg.png';
import analysisBg from '../../../assets/analysis_bg.png';

export default function Home() {
  const navigate = useNavigate();

  const metrics = [
    { label: 'Products Tracked', value: 12450, icon: <Package className="h-6 w-6 text-[var(--color-olive-300)]" /> },
    { label: 'Forecast Accuracy', value: 94, suffix: '%', icon: <TrendingUp className="h-6 w-6 text-[var(--color-olive-400)]" /> },
    { label: 'Stock Alerts', value: 12, icon: <Shield className="h-6 w-6 text-[var(--color-olive-500)]" /> },
    { label: 'Retailers Analyzed', value: 3, icon: <BarChart2 className="h-6 w-6 text-[var(--color-olive-600)]" /> },
  ];

  const capabilities = [
    { title: 'Data Lake Integration', desc: 'Seamlessly ingest POS data, weather patterns, and regional demographics.', icon: <Database className="w-6 h-6 text-[var(--color-olive-300)]" /> },
    { title: 'Neural Engine', desc: 'Process millions of rows of time-series data using multi-agent ML models.', icon: <HardDrive className="w-6 h-6 text-[var(--color-olive-400)]" /> },
    { title: 'Supply Chain Sync', desc: 'Direct webhook integrations into your existing ERP and warehouse systems.', icon: <Network className="w-6 h-6 text-[var(--color-olive-500)]" /> },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-color)]">
      {/* Hero Section */}
      <section className="relative flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 py-32 overflow-hidden border-b border-[var(--border-color)]">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img src={heroBg} alt="Retail Dashboard" className="w-full h-full object-cover opacity-15 grayscale mix-blend-multiply dark:opacity-30 dark:mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-color)] via-transparent to-[var(--bg-color)] opacity-60" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1 mb-6 border border-[var(--color-olive-300)] rounded-full bg-[var(--color-olive-100)] dark:bg-[#1a1a14]/50"
          >
            <span className="font-pixel text-[var(--color-olive-600)] dark:text-[var(--color-olive-300)] text-sm tracking-widest uppercase">System v2.4 Online</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl md:text-8xl font-gothic tracking-tight mb-6 text-text-primary uppercase"
          >
            ClearShelf <span className="text-[var(--color-olive-400)]">Intelligence</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-xl md:text-2xl text-text-secondary max-w-2xl mx-auto font-light"
          >
            Precision forecasting for modern retail. Optimize inventory, understand local markets, and make data-driven decisions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
          >
            <button
              onClick={() => navigate('/forecast')}
              className="px-10 py-5 bg-[var(--text-primary)] hover:bg-[var(--color-olive-500)] text-[var(--bg-color)] rounded-none font-bold text-lg tracking-widest uppercase transition-colors shadow-xl"
            >
              Access Dashboard
            </button>
          </motion.div>
        </div>
      </section>

      {/* Real-time Metrics Section */}
      <section className="py-12 bg-black dark:bg-[#0a0a08] border-b border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {metrics.map((metric) => (
              <div key={metric.label} className="text-center flex flex-col items-center">
                <div className="mb-3">{metric.icon}</div>
                <p className="font-pixel text-4xl text-[var(--color-olive-300)] mb-1">
                  <AnimatedCounter value={metric.value} />
                  {metric.suffix && <span>{metric.suffix}</span>}
                </p>
                <p className="font-gothic text-sm text-gray-400 uppercase tracking-widest">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Split Section: Image & Features */}
      <section className="py-24 bg-white dark:bg-[#2b2a22]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            <div className="order-2 lg:order-1 relative rounded-sm overflow-hidden shadow-2xl border border-[var(--color-olive-200)] dark:border-[var(--color-olive-500)]">
              <img src={analysisBg} alt="AI Analysis Data Center" className="w-full h-auto object-cover opacity-90 hover:scale-105 transition-transform duration-1000" />
              <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md p-4 border border-[var(--color-olive-400)]">
                <p className="font-pixel text-[var(--color-olive-300)] text-xs mb-1">NODE: SYNC_COMPLETE</p>
                <div className="w-full bg-gray-800 h-1 mt-2">
                  <div className="bg-[var(--color-olive-300)] h-1 w-3/4 animate-pulse"></div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="text-4xl md:text-5xl font-gothic text-text-primary mb-6 uppercase">Enterprise Infrastructure</h2>
              <p className="text-lg text-text-secondary mb-10">
                Built on a multi-agent AI architecture, our platform ingests massive datasets to deliver predictive analytics tailored to your hyper-local retail environments.
              </p>

              <div className="space-y-8">
                {capabilities.map((cap) => (
                  <div key={cap.title} className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {cap.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-text-primary mb-1">{cap.title}</h3>
                      <p className="text-text-secondary">{cap.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
