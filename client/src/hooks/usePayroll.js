import { useState, useEffect } from 'react';
import api from '../config/axios';
import toast from 'react-hot-toast';

const usePayroll = () => {
  const [payrollData, setPayrollData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const getDefaultPayroll = () => {
    const now = new Date();
    const month = now.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    const nextPayCycle = new Date(now.getFullYear(), now.getMonth() + 1, 15);
    return {
      month,
      totalSalary: 0,
      totalDeductions: 0,
      netPayroll: 0,
      estimatedOutflow: 0,
      employees: [],
      nextPayCycle,
    };
  };

  const fetchCurrentPayroll = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/payroll/current');
      if (response.data) {
        const defaultPayroll = getDefaultPayroll();
        const payroll = {
          ...defaultPayroll,
          ...response.data,
          employees: response.data.employees || defaultPayroll.employees,
        };
        setPayrollData(payroll);
      } else {
        setPayrollData(getDefaultPayroll());
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setPayrollData(getDefaultPayroll());
      } else {
        setError(err.message || 'Failed to fetch payroll');
        toast.error('Failed to load payroll data');
      }
    } finally {
      setLoading(false);
    }
  };

  const processMonthlyPayroll = async () => {
    setProcessing(true);
    try {
      const response = await api.post('/payroll/process', {});
      setPayrollData(response.data);
      toast.success('Payroll processed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.msg || err.response?.data?.message || 'Failed to process payroll');
    } finally {
      setProcessing(false);
    }
  };

  const updateEmployeeStatus = async (payrollId, employeeId, status) => {
    try {
      await api.put(`/payroll/${payrollId}/employee/${employeeId}`, { status });
      toast.success('Status updated!');
      await fetchCurrentPayroll();
    } catch (err) {
      toast.error(err.response?.data?.msg || err.response?.data?.message || 'Failed to update employee status');
    }
  };

  useEffect(() => {
    fetchCurrentPayroll();
  }, []);

  return {
    payrollData,
    loading,
    processing,
    error,
    fetchCurrentPayroll,
    processMonthlyPayroll,
    updateEmployeeStatus,
    getDefaultPayroll,
  };
};

export default usePayroll;
