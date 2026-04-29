import { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/dashboardService';

const useDashboard = (month, year) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await getDashboardStats(month, year);
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [month, year]);

  return { stats, loading, error, fetchStats };
};

export default useDashboard;
