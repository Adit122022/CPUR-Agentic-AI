import { API_BASE_URL } from '../../../services/api';

export const fetchForecastSummaryAPI = async () => {
  const res = await fetch(`${API_BASE_URL}/api/forecast-data/categories`);
  return res.json();
};

export const fetchWeeklyTrendAPI = async () => {
  const res = await fetch(`${API_BASE_URL}/api/forecast-data/weekly`);
  return res.json();
};

export const fetchRadarDataAPI = async () => {
  const res = await fetch(`${API_BASE_URL}/api/forecast-data/radar`);
  return res.json();
};
