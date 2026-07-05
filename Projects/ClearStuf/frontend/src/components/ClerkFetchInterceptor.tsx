import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { API_BASE_URL } from '../services/api';

interface ClerkFetchInterceptorProps {
  children: React.ReactNode;
}

export default function ClerkFetchInterceptor({ children }: ClerkFetchInterceptorProps) {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    const originalFetch = window.fetch;

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      // Determine request URL string
      let requestUrl = '';
      if (typeof input === 'string') {
        requestUrl = input;
      } else if (input instanceof URL) {
        requestUrl = input.href;
      } else {
        requestUrl = input.url;
      }

      // Check if URL is aimed at our backend API
      const isApiRequest = 
        requestUrl.startsWith('/api') || 
        requestUrl.startsWith('/') || 
        requestUrl.startsWith(API_BASE_URL);

      // If we are signed in and requesting our API, append the Clerk Bearer token
      if (isSignedIn && isApiRequest) {
        try {
          const token = await getToken();
          if (token) {
            init = init || {};
            const headers = new Headers(init.headers || {});
            
            // Only set Authorization header if not already specified
            if (!headers.has('Authorization')) {
              headers.set('Authorization', `Bearer ${token}`);
            }
            
            init.headers = headers;
          }
        } catch (error) {
          console.error('Error fetching Clerk token:', error);
        }
      }
      return originalFetch(input, init);
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, [getToken, isSignedIn]);

  return <>{children}</>;
}

