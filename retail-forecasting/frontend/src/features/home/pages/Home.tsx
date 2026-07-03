import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, BarChart2, Zap, Shield, Cpu, Users, Search, BrainCircuit, ArrowRight } from 'lucide-react';
import ParticlesBackground from '../../../components/ParticlesBackground';
import AnimatedCounter from '../../../components/AnimatedCounter';

export default function Home() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  
  const [text, setText] = useState('');
  const fullText = "Predict the future of retail with AI agents that think, analyze, and collaborate.";

  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);
    return () => clearInterval(typingInterval);
  }, []);

  const metrics = [
    { label: 'Products Tracked', value: 12450, icon: <BarChart2 className="h-6 w-6 text-indigo-500" /> },
    { label: 'Active Forecasts', value: 892, icon: <Zap className="h-6 w-6 text-pink-500" /> },
    { label: 'Stock Alerts Resolved', value: 4521, icon: <Shield className="h-6 w-6 text-purple-500" /> },
    { label: 'AI Agents Active', value: 4, icon: <Cpu className="h-6 w-6 text-blue-500" /> },
  ];

  const steps = [
    { title: "Data Collection", desc: "Gathering sales, weather, and market trends.", icon: <Search className="w-8 h-8" /> },
    { title: "AI Council", desc: "Agents debate and analyze to find optimal predictions.", icon: <Users className="w-8 h-8" /> },
    { title: "Synthesized Forecast", desc: "A unified, highly accurate demand prediction.", icon: <BrainCircuit className="w-8 h-8" /> },
  ];

  const agents = [
    { name: 'Data Analyst', emoji: '📊', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
    { name: 'Market Scout', emoji: '🔍', color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400' },
    { name: 'Weather Analyst', emoji: '🌤️', color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
    { name: 'Synthesizer', emoji: '🧠', color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
  ];

  const features = [
    { title: 'Product Catalog', desc: 'Manage your entire inventory with rich analytics.' },
    { title: 'Stock Dashboard', desc: 'Real-time alerts for low stock and reordering.' },
    { title: 'AI Forecasting', desc: 'Predictive models powered by agent consensus.' },
    { title: 'Agent Console', desc: 'Watch AI agents debate in real-time.' },
    { title: 'Model Comparison', desc: 'Compare traditional models vs AI consensus.' },
    { title: 'External Signals', desc: 'Incorporate weather and market data automatically.' },
  ];

  const techStack = ['React 19', 'TypeScript', 'Tailwind', 'Framer Motion', 'FastAPI', 'CrewAI', 'PostgreSQL', 'GPT-4o'];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <ParticlesBackground />

      {/* Floating Orbs */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute top-20 left-10 w-64 h-64 bg-purple-500/30 rounded-full blur-[100px] -z-10"
      />
      <motion.div 
        style={{ y: y2 }}
        className="absolute bottom-40 right-20 w-96 h-96 bg-indigo-500/30 rounded-full blur-[120px] -z-10"
      />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6"
        >
          <span className="text-gradient">Demand Forecasting</span>
          <br /> Reimagined.
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto min-h-[4rem]"
        >
          {text}<span className="animate-pulse">_</span>
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <button 
            onClick={() => navigate('/forecast')}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-indigo-500/50 flex items-center justify-center gap-2 group relative overflow-hidden"
          >
            <span className="relative z-10">Launch Forecast</span>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button 
            onClick={() => navigate('/agents')}
            className="px-8 py-4 bg-white dark:bg-slate-800 text-text-primary border border-border-color rounded-xl font-semibold text-lg transition-all hover:bg-gray-50 dark:hover:bg-slate-700 shadow-sm"
          >
            Meet the Agents
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce"
        >
          <ChevronDown className="h-8 w-8 text-text-secondary" />
        </motion.div>
      </section>

      {/* Metrics Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, idx) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-6 rounded-2xl flex items-center gap-4 hover:-translate-y-1 transition-transform"
            >
              <div className="p-3 bg-gray-100 dark:bg-slate-800 rounded-lg">
                {metric.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-text-secondary">{metric.label}</p>
                <p className="text-3xl font-bold text-text-primary">
                  <AnimatedCounter value={metric.value} />
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50 dark:bg-slate-900/50 relative z-10 border-y border-border-color">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text-primary">How It Works</h2>
            <p className="mt-4 text-text-secondary max-w-2xl mx-auto">A seamless pipeline from raw data to actionable insights.</p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-4 relative">
            {steps.map((step, idx) => (
              <div key={step.title} className="flex-1 flex flex-col items-center text-center relative w-full md:w-auto">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 }}
                  className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center shadow-xl mb-6 z-10"
                >
                  {step.icon}
                </motion.div>
                <h3 className="text-xl font-bold mb-2 text-text-primary">{step.title}</h3>
                <p className="text-text-secondary text-sm">{step.desc}</p>
                
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-indigo-500/50 to-purple-500/50 z-0">
                    <motion.div 
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + idx * 0.2, duration: 0.8 }}
                      className="w-full h-full bg-indigo-500 origin-left"
                    />
                  </div>
                )}
                {idx < steps.length - 1 && (
                  <ArrowRight className="md:hidden my-4 text-indigo-500" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Your AI Agents */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-text-primary">Meet Your AI Council</h2>
          <p className="mt-4 text-text-secondary">Specialized agents working together to provide the best forecasts.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {agents.map((agent, idx) => (
            <motion.div
              key={agent.name}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="flex flex-col items-center p-6 glass-card rounded-2xl text-center cursor-pointer group"
              onClick={() => navigate('/agents')}
            >
              <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl mb-4 shadow-lg group-hover:scale-110 transition-transform ${agent.color}`}>
                <motion.span
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2, delay: idx * 0.2 }}
                >
                  {agent.emoji}
                </motion.span>
              </div>
              <h3 className="font-semibold text-text-primary">{agent.name}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50 dark:bg-slate-900/50 relative z-10 border-t border-border-color">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text-primary">Comprehensive Features</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card p-6 rounded-2xl hover:border-indigo-500/50 transition-colors"
              >
                <h3 className="text-lg font-bold text-text-primary mb-2">{feature.title}</h3>
                <p className="text-text-secondary text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-10 border-y border-border-color relative z-10 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 overflow-hidden">
          <p className="text-center text-sm font-semibold text-text-secondary mb-6 tracking-wider uppercase">Powered By</p>
          <div className="flex flex-wrap justify-center gap-4">
            {techStack.map((tech) => (
              <span key={tech} className="px-4 py-2 rounded-full glass-card text-sm font-medium text-text-primary">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-gradient-shift p-12 text-center text-white shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-6">Ready to transform your retail planning?</h2>
            <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
              Experience the power of multi-agent AI forecasting today.
            </p>
            <button 
              onClick={() => navigate('/forecast')}
              className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-lg"
            >
              Get Started Now
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
