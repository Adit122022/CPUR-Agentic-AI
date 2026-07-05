
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchForecastSummaryAPI, fetchWeeklyTrendAPI, fetchRadarDataAPI } from './services/forecast.api';

export const fetchForecastData = createAsyncThunk('forecast/fetchAll', async () => {
  const [categories, weekly, radar] = await Promise.all([
    fetchForecastSummaryAPI(),
    fetchWeeklyTrendAPI(),
    fetchRadarDataAPI()
  ]);
  return { categories, weekly, radar };
});

const initialState = {
  categories: [],
  weekly: [],
  radar: [],
  loading: false,
};

const forecastSlice = createSlice({
  name: 'forecast',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchForecastData.pending, (state) => { state.loading = true; })
           .addCase(fetchForecastData.fulfilled, (state, action) => {
             state.loading = false;
             state.categories = action.payload.categories;
             state.weekly = action.payload.weekly;
             state.radar = action.payload.radar;
           });
  }
});

export default forecastSlice.reducer;
