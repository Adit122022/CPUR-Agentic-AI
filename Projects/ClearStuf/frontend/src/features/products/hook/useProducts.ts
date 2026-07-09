
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '@clerk/clerk-react';
import type { AppDispatch, RootState } from '../../../store';
import { fetchProducts } from '../products.slice';

export const useProducts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoaded, isSignedIn } = useAuth();
  const { products, loading, error, initialized } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    if (!initialized && products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, isLoaded, isSignedIn, initialized, products.length]);

  return { products, loading, error };
};
