import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import type { RootState, AppDispatch } from '../store';
import { fetchProducts } from '../features/products/products.slice';

interface UploadGuardProps {
  children: React.ReactNode;
}

export default function UploadGuard({ children }: UploadGuardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, initialized } = useSelector((state: RootState) => state.products);
  const location = useLocation();

  useEffect(() => {
    if (!initialized && !loading) {
      dispatch(fetchProducts());
    }
  }, [dispatch, initialized, loading]);

  if (!initialized || (loading && products.length === 0)) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-foreground border-t-transparent"></div>
      </div>
    );
  }

  if (products.length === 0) {
    // Redirect to upload page with state to explain why they were redirected
    return (
      <Navigate 
        to="/upload" 
        state={{ 
          from: location, 
          redirectReason: 'Please upload a CSV data file first to unlock the dashboard sections.' 
        }} 
        replace 
      />
    );
  }

  return <>{children}</>;
}
