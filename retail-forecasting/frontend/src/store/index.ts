import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../features/products/products.slice';
import forecastReducer from '../features/forecast/forecast.slice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    forecast: forecastReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
