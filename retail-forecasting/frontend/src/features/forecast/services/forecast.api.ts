
export const fetchForecastSummaryAPI = async () => {
  const res = await fetch('http://localhost:8000/api/forecast-data/categories');
  return res.json();
};

export const fetchWeeklyTrendAPI = async () => {
  const res = await fetch('http://localhost:8000/api/forecast-data/weekly');
  return res.json();
};

export const fetchRadarDataAPI = async () => {
  const res = await fetch('http://localhost:8000/api/forecast-data/radar');
  return res.json();
};
