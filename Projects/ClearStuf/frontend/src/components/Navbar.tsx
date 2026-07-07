import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { SignedIn, SignedOut, UserButton, useAuth } from '@clerk/clerk-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { useTheme } from './ThemeProvider';
import { cn } from '../lib/utils';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const products = useSelector((state: RootState) => state.products.products);
  const hasUploaded = products && products.length > 0;

  const handleNavClick = (path: string) => {
    setIsOpen(false);
    if (path.startsWith('/#')) {
      const targetId = path.substring(2);
      if (location.pathname === '/') {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        navigate('/');
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    } else {
      navigate(path);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Upload Data', path: '/upload', show: isSignedIn },
    { name: 'Products', path: '/products', show: isSignedIn && hasUploaded },
    { name: 'Stock', path: '/stock', show: isSignedIn && hasUploaded },
    { name: 'Forecast', path: '/forecast', show: isSignedIn && hasUploaded },
    { name: 'AI Agents', path: '/agents', show: isSignedIn && hasUploaded },
    { name: 'History', path: '/history', show: isSignedIn },
    { name: 'Features', path: '/#features', show: !hasUploaded },
    { name: 'FAQs', path: '/#faqs', show: !hasUploaded },
    { name: 'Documentation', path: '/documentation' },
  ].filter(link => link.show !== false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl transition-all duration-300">
      <div className="max-w-7xl px-4 md:px-8 mx-auto">
        <div className="flex h-16 items-center justify-between">

          {/* Logo (B&W Geometric Grid Logo) */}
          <NavLink to="/" className="flex items-center gap-2 group">
            <svg width="18" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-foreground transition-transform duration-300 group-hover:scale-105">
              <path d="M4.92285 14.8848H0V9.96191H4.92285V14.8848ZM19.6924 14.8848H9.84668V9.96191H4.92383V5.03809H9.84668V0.115234H19.6924V14.8848ZM9.84668 9.96191H14.7695V5.03906H9.84668V9.96191ZM4.92285 5.03809H0V0.115234H4.92285V5.03809Z" fill="currentColor"></path>
            </svg>
            <span className="text-sm font-semibold tracking-tight text-foreground">
              Clear<span className="text-foreground font-black">Shelf</span>
            </span>
          </NavLink>

          {/* Centered Desktop Nav Links (Clean Monochrome style) */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isHash = link.path.startsWith('/#');
              const isActive = isHash
                ? false
                : location.pathname === link.path;

              return (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.path)}
                  className={cn(
                    'text-[10px] font-bold tracking-widest transition-colors duration-200 uppercase pb-0.5 border-b border-transparent hover:border-foreground/50 hover:text-foreground',
                    isActive
                      ? 'text-foreground border-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  {link.name}
                </button>
              );
            })}
          </nav>

          {/* Right Area: Theme + Auth buttons */}
          <div className="flex items-center gap-4">

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background/50 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === 'dark' ? (
                  <motion.span key="sun" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.15 }}>
                    <Sun className="h-4 w-4" />
                  </motion.span>
                ) : (
                  <motion.span key="moon" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }} transition={{ duration: 0.15 }}>
                    <Moon className="h-4 w-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Clerk User Avatar (SignedIn) */}
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: 'h-9 w-9 rounded-md border border-border bg-background',
                    userButtonTrigger: 'focus:shadow-none focus:outline-none focus:ring-0',
                  }
                }}
              />
            </SignedIn>

            {/* Auth CTAs (SignedOut) */}
            <SignedOut>
              <NavLink to="/login">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-xs font-bold uppercase tracking-widest bg-foreground text-background hover:bg-foreground/90 h-9 px-5 shadow-brand transition-all"
                >
                  Login
                </motion.button>
              </NavLink>
            </SignedOut>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary transition-colors"
            >
              {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border bg-background md:hidden overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.path)}
                  className="block w-full text-left rounded-md px-3 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  {link.name}
                </button>
              ))}

              <div className="pt-4 border-t border-border/50">
                <SignedIn>
                  <div className="flex items-center gap-3 px-3 py-1.5">
                    <UserButton
                      appearance={{
                        elements: {
                          userButtonAvatarBox: 'h-8 w-8',
                        }
                      }}
                    />
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground">My Account</span>
                  </div>
                </SignedIn>
                <SignedOut>
                  <div className="pt-2">
                    <NavLink
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="w-full block rounded-md px-3 py-2 text-xs font-bold uppercase tracking-wider text-center bg-foreground text-background hover:bg-foreground/90 transition-all shadow-brand"
                    >
                      Login / Get Started
                    </NavLink>
                  </div>
                </SignedOut>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
