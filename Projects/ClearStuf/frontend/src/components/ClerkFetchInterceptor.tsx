import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';

interface ClerkFetchInterceptorProps {
  children: React.ReactNode;
}

export default function ClerkFetchInterceptor({ children }: ClerkFetchInterceptorProps) {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    const originalFetch = window.fetch;

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      // If we are signed in, append the Clerk Bearer token to all api requests
      if (isSignedIn) {
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
