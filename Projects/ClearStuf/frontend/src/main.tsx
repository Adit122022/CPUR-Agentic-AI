import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import { ThemeProvider } from './components/ThemeProvider';
import { ClerkProvider } from '@clerk/clerk-react';
import ClerkFetchInterceptor from './components/ClerkFetchInterceptor.tsx';
import SmoothScroll from './components/SmoothScroll.tsx';
import App from './App.tsx';
import './index.css';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

import { useTheme } from './components/ThemeProvider';

function ThemedClerkProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const appearance = {
    layout: {
      socialButtonsPlacement: 'top' as const,
      socialButtonsVariant: 'blockButton' as const,
    },
    variables: {
      colorPrimary: isDark ? '#ffffff' : '#000000',
      colorBackground: isDark ? '#0a0a0a' : '#ffffff',
      colorText: isDark ? '#ffffff' : '#000000',
      colorTextSecondary: isDark ? '#a3a3a3' : '#525252',
      colorInputBackground: isDark ? '#171717' : '#f5f5f5',
      colorInputText: isDark ? '#ffffff' : '#000000',
      borderRadius: '0.5rem',
    },
    elements: {
      card: isDark
        ? 'border border-neutral-800 bg-[#0a0a0a] p-6 shadow-2xl rounded-xl w-full max-w-md'
        : 'border border-neutral-200 bg-[#ffffff] p-6 shadow-2xl rounded-xl w-full max-w-md',
      headerTitle: isDark
        ? 'text-white font-black uppercase tracking-tight text-xl text-center'
        : 'text-black font-black uppercase tracking-tight text-xl text-center',
      headerSubtitle: isDark
        ? 'text-neutral-400 uppercase text-[9px] tracking-widest text-center mt-1'
        : 'text-neutral-500 uppercase text-[9px] tracking-widest text-center mt-1',
      socialButtonsBlockButton: isDark
        ? 'border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-white transition-all h-11 w-full flex items-center justify-center gap-2 rounded-md font-bold text-[10px] uppercase tracking-wider'
        : 'border border-neutral-200 bg-neutral-100 hover:bg-neutral-200 text-black transition-all h-11 w-full flex items-center justify-center gap-2 rounded-md font-bold text-[10px] uppercase tracking-wider',
      socialButtonsBlockButtonText: isDark ? 'text-white font-bold' : 'text-black font-bold',
      socialButtonsBlockButtonArrow: 'hidden',
      formButtonPrimary: isDark
        ? 'bg-white text-black hover:bg-neutral-200 font-black uppercase tracking-widest text-[10px] py-3 rounded-md transition-all'
        : 'bg-black text-white hover:bg-neutral-800 font-black uppercase tracking-widest text-[10px] py-3 rounded-md transition-all',
      footerAction: 'hidden',
      footerActionText: 'hidden',
      footerActionLink: 'hidden',
      dividerLine: isDark ? 'bg-neutral-800' : 'bg-neutral-200',
      dividerText: isDark
        ? 'text-neutral-500 uppercase text-[9px] tracking-widest font-bold'
        : 'text-neutral-400 uppercase text-[9px] tracking-widest font-bold',
      formFieldLabel: isDark
        ? 'text-[9px] font-bold text-neutral-300 mb-1 uppercase tracking-widest'
        : 'text-[9px] font-bold text-neutral-700 mb-1 uppercase tracking-widest',
      formFieldInput: isDark
        ? 'border border-neutral-800 bg-neutral-900 focus:border-white focus:ring-1 focus:ring-white transition-all rounded-md text-xs py-2.5 px-3 text-white'
        : 'border border-neutral-200 bg-neutral-100 focus:border-black focus:ring-1 focus:ring-black transition-all rounded-md text-xs py-2.5 px-3 text-black',
      userButtonPopoverCard: isDark
        ? 'border border-neutral-800 bg-[#0a0a0a] shadow-xl'
        : 'border border-neutral-200 bg-[#ffffff] shadow-xl',
      userButtonPopoverFooter: isDark
        ? 'border-t border-neutral-800 bg-[#0a0a0a]'
        : 'border-t border-neutral-200 bg-[#ffffff]',
      userButtonPopoverActionButton: isDark
        ? 'hover:bg-neutral-900 text-neutral-200 hover:text-white'
        : 'hover:bg-neutral-100 text-neutral-800 hover:text-black',
      userButtonPopoverActionButtonText: isDark ? 'text-white' : 'text-black',
    }
  };

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/" appearance={appearance}>
      {children}
    </ClerkProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <ThemedClerkProvider>
          <ClerkFetchInterceptor>
            <SmoothScroll>
              <App />
            </SmoothScroll>
          </ClerkFetchInterceptor>
        </ThemedClerkProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
