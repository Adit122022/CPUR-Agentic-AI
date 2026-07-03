
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchForecastData } from '../forecast.slice';

export const useForecastData = () => {
  const dispatch = useDispatch();
  const { categories, weekly, radar, loading } = useSelector((state: any) => state.forecast);

  useEffect(() => {
    if (categories.length === 0) dispatch(fetchForecastData() as any);
  }, [dispatch, categories.length]);

  return { categories, weekly, radar, loading, dispatch, fetchForecastData };
};
