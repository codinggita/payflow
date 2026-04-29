import api from '../config/axios';

export const getDashboardStats = async (month, year) => {
  const params = (month && year) ? { month, year } : {};
  const response = await api.get('/dashboard/stats', { params });
  return response.data;
};
