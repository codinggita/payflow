import { useState, useEffect } from 'react';
import api from '../config/axios';
import toast from 'react-hot-toast';

const usePayroll = (month, year) => {
  const [payrollData, setPayrollData] = useState(null);
  const [payrollHistory, setPayrollHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const getDefaultPayroll = () => {
    const now = new Date();
    const currentMonth = now.toLocaleString('en-US', { month: 'long' });
    const nextPayCycle = new Date(now.getFullYear(), now.getMonth() + 1, 15);
    return {
      month: currentMonth,
      year: now.getFullYear(),
      totalSalary: 0,
      totalDeductions: 0,
      netPayroll: 0,
      estimatedOutflow: 0,
      employees: [],
      nextPayCycle,
    };
  };

  const fetchPayrollByMonth = async (m, y) => {
    const targetMonth = m || month;
    const targetYear = y || year;
    if (!targetMonth || !targetYear) return;

    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/payroll/filter?month=${targetMonth}&year=${targetYear}`);
      setPayrollData(response.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setPayrollData(null);
      } else {
        toast.error('Failed to fetch payroll for selected month');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchPayrollHistory = async () => {
    try {
      const response = await api.get('/payroll/history');
      setPayrollHistory(response.data || []);
    } catch (err) {
      console.error('Failed to fetch payroll history:', err);
    }
  };

  const processMonthlyPayroll = async (period = {}) => {
    setProcessing(true);
    try {
      const response = await api.post('/payroll/process', period);
      setPayrollData(response.data);
      toast.success(`Payroll for ${response.data.month} processed successfully!`);
      fetchPayrollHistory(); // Refresh history
    } catch (err) {
      toast.error(err.response?.data?.msg || err.response?.data?.message || 'Failed to process payroll');
    } finally {
      setProcessing(false);
    }
  };

  const updateEmployeeStatus = async (payrollId, employeeId, status) => {
    try {
      const response = await api.put(`/payroll/${payrollId}/employee/${employeeId}`, { status });
      setPayrollData(response.data);
      toast.success(status === 'Paid' ? '✅ Payment marked as Paid!' : 'Status updated!');
    } catch (err) {
      toast.error(err.response?.data?.msg || err.response?.data?.message || 'Failed to update status');
    }
  };

  const updateEmployeeDeduction = async (payrollId, employeeId, deductions) => {
    try {
      const response = await api.put(
        `/payroll/${payrollId}/employee/${employeeId}/deduction`,
        { deductions: parseFloat(deductions) }
      );
      setPayrollData(response.data);
      toast.success('Deduction updated!');
    } catch (err) {
      toast.error(err.response?.data?.msg || err.response?.data?.message || 'Failed to update deduction');
    }
  };

  const updateEmployeeBonus = async (payrollId, employeeId, bonus) => {
    try {
      const response = await api.put(
        `/payroll/${payrollId}/employee/${employeeId}/bonus`,
        { bonus: parseFloat(bonus) }
      );
      setPayrollData(response.data);
      toast.success('Bonus updated!');
    } catch (err) {
      toast.error(err.response?.data?.msg || err.response?.data?.message || 'Failed to update bonus');
    }
  };

  const updateEmployeeSalary = async (payrollId, employeeId, baseSalary) => {
    try {
      const response = await api.put(
        `/payroll/${payrollId}/employee/${employeeId}/salary`,
        { baseSalary: parseFloat(baseSalary) }
      );
      setPayrollData(response.data);
      toast.success('Salary updated!');
    } catch (err) {
      toast.error(err.response?.data?.msg || err.response?.data?.message || 'Failed to update salary');
    }
  };

  const updateEmployeePayrollFields = async (payrollId, employeeId, fields) => {
    try {
      const response = await api.put(
        `/payroll/${payrollId}/employee/${employeeId}/fields`,
        fields
      );
      setPayrollData(response.data);
      toast.success('Employee payroll updated!');
      return response.data;
    } catch (err) {
      toast.error(err.response?.data?.msg || err.response?.data?.message || 'Failed to update fields');
      throw err;
    }
  };

  useEffect(() => {
    if (month && year) {
      fetchPayrollByMonth(month, year);
      fetchPayrollHistory();
    }
  }, [month, year]);

  return {
    payrollData,
    loading,
    processing,
    error,
    processMonthlyPayroll,
    updateEmployeeStatus,
    updateEmployeeDeduction,
    updateEmployeeBonus,
    updateEmployeeSalary,
    updateEmployeePayrollFields,
    fetchPayrollHistory,
    fetchPayrollByMonth,
    payrollHistory,
    getDefaultPayroll,
  };
};

export default usePayroll;
