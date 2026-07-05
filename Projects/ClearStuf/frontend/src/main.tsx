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
        <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
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

