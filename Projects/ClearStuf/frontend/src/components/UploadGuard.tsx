import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import type { RootState } from '../store';

interface UploadGuardProps {
  children: React.ReactNode;
}

export default function UploadGuard({ children }: UploadGuardProps) {
  const { products, loading } = useSelector((state: RootState) => state.products);
  const location = useLocation();

  if (loading && products.length === 0) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
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
