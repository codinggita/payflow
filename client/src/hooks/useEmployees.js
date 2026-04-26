import { useState, useCallback } from 'react';
import api from '../config/axios';
import toast from 'react-hot-toast';

const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalEmployees: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEmployees = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.department) queryParams.append('department', filters.department);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.page) queryParams.append('page', filters.page);

      const response = await api.get(`/employees?${queryParams.toString()}`);
      setEmployees(response.data.employees || []);
      setPagination({
        currentPage: response.data.currentPage || 1,
        totalPages: response.data.totalPages || 1,
        totalEmployees: response.data.totalEmployees || 0
      });
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.msg || 'Failed to fetch employees';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addEmployee = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      // Ensure numeric types are passed properly
      const payload = {
        ...formData,
        baseSalary: Number(formData.baseSalary),
        taxPercent: Number(formData.taxPercent)
      };
      await api.post('/employees', payload);
      toast.success('Employee added successfully!');
      
      // Refetch employees after adding
      await fetchEmployees();
      return true;
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.msg || 'Failed to add employee';
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeEmployee = async (id) => {
    try {
      await api.delete(`/employees/${id}`);
      toast.success('Employee removed successfully');
      
      // Update local state without refetching the whole list
      setEmployees((prev) => prev.filter(emp => emp._id !== id));
      return true;
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.msg || 'Failed to remove employee';
      toast.error(message);
      return false;
    }
  };

  return {
    employees,
    pagination,
    loading,
    error,
    fetchEmployees,
    addEmployee,
    removeEmployee
  };
};

export default useEmployees;
