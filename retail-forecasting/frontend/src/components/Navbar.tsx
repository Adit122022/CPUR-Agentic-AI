import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Sun, Moon, Activity } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Stock', path: '/stock' },
    { name: 'Forecast', path: '/forecast' },
    { name: 'AI Agents', path: '/agents' },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border-color/70 bg-[color:var(--card-bg)]/90 backdrop-blur-xl">
      <div className="page-shell">
        <div className="flex h-16 items-center justify-between">
          <NavLink to="/" className="flex items-center gap-3 rounded-full px-2 py-1">
            <div className="rounded-full border border-olive-300/60 bg-olive-100/70 p-2 shadow-sm dark:bg-[#2a281f]">
              <Activity className="h-5 w-5 text-olive-400" />
            </div>
            <div className="flex flex-col">
              <span className="font-gothic text-lg uppercase tracking-[0.25em] text-olive-400">ClearShelf</span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-text-secondary">Retail AI</span>
            </div>
          </NavLink>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center gap-1 rounded-full border border-border-color/50 bg-white/60 p-1 shadow-sm dark:bg-[#23211d]/70">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `relative rounded-full px-3 py-2 text-sm font-medium transition-all ${
                      isActive ? 'bg-olive-100/80 text-olive-600 dark:bg-[#2a281f] dark:text-olive-300' : 'text-text-secondary hover:text-text-primary hover:bg-[#f7f5dd] dark:hover:bg-slate-800'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.name}
                      {isActive && (
                        <motion.div
                          layoutId="navbar-indicator"
                          className="absolute inset-x-1 bottom-1 h-0.5 rounded-full bg-olive-300"
                          initial={false}
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
          
          <div className="hidden md:flex items-center">
            <button
              onClick={() => setIsDark(!isDark)}
              className="rounded-full border border-border-color/60 bg-white/70 p-2 text-text-secondary transition-colors hover:bg-[#f7f5dd] dark:bg-[#23211d]/70 dark:hover:bg-slate-800"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
          
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsDark(!isDark)}
              className="mr-2 rounded-full border border-border-color/60 bg-white/70 p-2 text-text-secondary transition-colors hover:bg-[#f7f5dd] dark:bg-[#23211d]/70 dark:hover:bg-slate-800"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-full border border-border-color/60 bg-white/70 p-2 text-text-secondary transition-colors hover:bg-[#f7f5dd] dark:bg-[#23211d]/70 dark:hover:bg-slate-800"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-border-color/70 bg-[color:var(--card-bg)]/95 md:hidden"
        >
          <div className="page-shell space-y-2 px-4 py-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block rounded-2xl px-3 py-2 text-base font-medium ${
                    isActive ? 'bg-olive-100/80 text-olive-600 dark:bg-[#2a281f] dark:text-olive-300' : 'text-text-secondary hover:text-text-primary hover:bg-[#f7f5dd] dark:hover:bg-slate-800'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  );
}
