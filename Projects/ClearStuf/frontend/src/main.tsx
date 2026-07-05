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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <ClerkProvider 
          publishableKey={PUBLISHABLE_KEY} 
          afterSignOutUrl="/"
          appearance={{
            layout: {
              socialButtonsPlacement: 'top',
              socialButtonsVariant: 'blockButton',
            },
            variables: {
              colorPrimary: '#ffffff',
              colorBackground: '#0a0a0a',
              colorText: '#ffffff',
              colorTextSecondary: '#a3a3a3',
              colorInputBackground: '#171717',
              colorInputText: '#ffffff',
              borderRadius: '0.5rem',
            },
            elements: {
              card: 'border border-neutral-800 bg-[#0a0a0a] p-6 shadow-2xl rounded-xl w-full max-w-md',
              headerTitle: 'text-white font-black uppercase tracking-tight text-xl text-center',
              headerSubtitle: 'text-neutral-400 uppercase text-[9px] tracking-widest text-center mt-1',
              socialButtonsBlockButton: 'border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-white transition-all h-11 w-full flex items-center justify-center gap-2 rounded-md font-bold text-[10px] uppercase tracking-wider',
              socialButtonsBlockButtonText: 'text-white font-bold',
              socialButtonsBlockButtonArrow: 'hidden',
              formButtonPrimary: 'bg-white text-black hover:bg-neutral-200 font-black uppercase tracking-widest text-[10px] py-3 rounded-md transition-all',
              footerAction: 'hidden',
              footerActionText: 'hidden',
              footerActionLink: 'hidden',
              dividerLine: 'bg-neutral-800',
              dividerText: 'text-neutral-500 uppercase text-[9px] tracking-widest font-bold',
              formFieldLabel: 'text-[9px] font-bold text-neutral-300 mb-1 uppercase tracking-widest',
              formFieldInput: 'border border-neutral-800 bg-neutral-900 focus:border-white focus:ring-1 focus:ring-white transition-all rounded-md text-xs py-2.5 px-3 text-white',
            }
          }}
        >
          <ClerkFetchInterceptor>
            <SmoothScroll>
              <App />
            </SmoothScroll>
          </ClerkFetchInterceptor>
        </ClerkProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
