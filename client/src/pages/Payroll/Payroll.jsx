import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  MinusCircle,
  Banknote,
  Filter,
  Download,
  ArrowRight,
  ShieldCheck,
  Loader2,
  Pencil,
  Check,
  X,
  Calendar,
  Search,
  ChevronDown,
  Clock,
  ExternalLink
} from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import usePayroll from '../../hooks/usePayroll';

/* ─── Formatters ─────────────────────────────────────────── */
const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount || 0);

const formatDeduction = (amount) => `-${formatCurrency(amount)}`;

const formatDate = (date) => {
  if (!date) return 'TBD';
  return new Date(date).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

/* ─── Constants ──────────────────────────────────────────── */
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const YEARS = [2024, 2025, 2026];

/* ─── Main Component ─────────────────────────────────────── */
const Payroll = () => {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[now.getMonth()]);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [searchTerm, setSearchTerm] = useState('');

  const {
    payrollData,
    loading,
    processing,
    processMonthlyPayroll,
    updateEmployeeStatus,
    updateEmployeePayrollFields,
    fetchPayrollByMonth,
    fetchPayrollHistory,
    payrollHistory,
    getDefaultPayroll,
  } = usePayroll(selectedMonth, selectedYear);

  // Local data or default
  const data = payrollData || {
    ...getDefaultPayroll(),
    month: selectedMonth,
    year: selectedYear,
    employees: []
  };
  
  const payrollId = payrollData?._id;

  // Row-level edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [modalValues, setModalValues] = useState({
    baseSalary: '',
    bonus: '',
    deductions: ''
  });
  const [isModalSaving, setIsModalSaving] = useState(false);
  const [payingId, setPayingId]   = useState(null);

  const handleProcessPayroll = async () => {
    await processMonthlyPayroll({ month: selectedMonth, year: selectedYear });
    fetchPayrollHistory();
  };

  const openEditModal = (emp) => {
    setEditingEmployee(emp);
    setModalValues({
      baseSalary: emp.baseSalary,
      bonus: emp.bonus,
      deductions: emp.deductions
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingEmployee(null);
  };

  const handleSaveFields = async (e) => {
    e.preventDefault();
    if (!payrollId || !editingEmployee) return;
    
    setIsModalSaving(true);
    try {
      await updateEmployeePayrollFields(payrollId, editingEmployee.employeeId, {
        baseSalary: parseFloat(modalValues.baseSalary),
        bonus: parseFloat(modalValues.bonus),
        deductions: parseFloat(modalValues.deductions)
      });
      closeEditModal();
    } catch (err) {
      // handled in hook
    } finally {
      setIsModalSaving(false);
    }
  };

  const handlePay = async (emp) => {
    const empId = emp.employeeId || emp._id;
    if (!payrollId) return;
    setPayingId(empId);
    await updateEmployeeStatus(payrollId, emp.employeeId, 'Paid');
    setPayingId(null);
  };

  const filteredEmployees = data.employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Paid': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Processing': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      default: return 'bg-amber-50 text-amber-600 border-amber-100';
    }
  };

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        
        {/* ── Main Content: Full Width ── */}
        <div className="w-full min-w-0">
          
          {/* ── Header & Controls ── */}
          <div className="mb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 font-outfit mb-2">Monthly Payroll</h1>
                <p className="text-sm text-slate-500">Manage and review employee salary payments by month</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative group">
                  <select 
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="appearance-none bg-white border border-slate-200 rounded-xl px-5 py-3 pr-10 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer shadow-sm hover:border-slate-300"
                  >
                    {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>

                <div className="relative group">
                  <select 
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="appearance-none bg-white border border-slate-200 rounded-xl px-5 py-3 pr-10 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer shadow-sm hover:border-slate-300"
                  >
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>

                <button 
                  onClick={handleProcessPayroll}
                  disabled={processing}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2"
                >
                  {processing ? <Loader2 size={16} className="animate-spin" /> : <Wallet size={16} />}
                  Process Monthly Payroll
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Search employee by name or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all shadow-sm"
                />
              </div>
              <div className="flex gap-2 shrink-0">
                <button className="p-3 bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-100 rounded-xl transition-all shadow-sm"><Filter size={20} /></button>
                <button className="p-3 bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-100 rounded-xl transition-all shadow-sm"><Download size={20} /></button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 bg-white/50 backdrop-blur-sm rounded-[2.5rem] border border-slate-100">
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
              <p className="text-slate-400 font-medium">Fetching payroll records...</p>
            </div>
          ) : !payrollId ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[2.5rem] p-20 text-center shadow-sm border border-slate-100"
            >
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                <Calendar size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">No records found for {selectedMonth} {selectedYear}</h3>
              <p className="text-slate-500 max-w-xs mx-auto mb-8 leading-relaxed">
                Start by processing the payroll for this month to generate employee salary details.
              </p>
              <button 
                onClick={handleProcessPayroll}
                className="bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white px-8 py-4 rounded-2xl font-bold transition-all"
              >
                Process {selectedMonth} Payroll
              </button>
            </motion.div>
          ) : (
            <>
              {/* ── Summary Cards ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Total Employees', value: data.employees.length, icon: <Clock className="text-blue-500" />, bg: 'bg-blue-50' },
                  { label: 'Gross Salary', value: formatCurrency(data.totalSalary), icon: <Wallet className="text-indigo-500" />, bg: 'bg-indigo-50' },
                  { label: 'Total Deductions', value: formatDeduction(data.totalDeductions), icon: <MinusCircle className="text-red-500" />, bg: 'bg-red-50' },
                  { label: 'Net Payroll', value: formatCurrency(data.netPayroll), icon: <Banknote className="text-emerald-500" />, bg: 'bg-emerald-50' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                      <h3 className="text-xl font-bold text-slate-800 font-outfit">{stat.value}</h3>
                    </div>
                    <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center`}>
                      {React.cloneElement(stat.icon, { size: 20 })}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* ── Main Table ── */}
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden mb-8">
                <div className="overflow-x-auto hide-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-50">
                        <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Employee</th>
                        <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Gross</th>
                        <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Deductions</th>
                        <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Bonus</th>
                        <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Net Salary</th>
                        <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredEmployees.map((emp, idx) => (
                        <tr key={emp.employeeId || idx} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-8 py-4">
                            <div className="flex items-center gap-3">
                              <img 
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.name}`} 
                                className="w-10 h-10 rounded-full bg-slate-100 shrink-0" 
                                alt=""
                              />
                              <div>
                                <p className="text-sm font-bold text-slate-800">{emp.name}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{emp.role}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center font-bold text-xs text-slate-600">{formatCurrency(emp.baseSalary)}</td>
                          <td className="px-6 py-4 text-center font-bold text-xs text-red-500">{formatDeduction(emp.deductions)}</td>
                          <td className="px-6 py-4 text-center font-bold text-xs text-indigo-500">{formatCurrency(emp.bonus)}</td>
                          <td className="px-6 py-4 text-center font-bold text-sm text-slate-800 font-outfit">{formatCurrency(emp.netPay)}</td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-3 py-1.5 rounded-full text-[9px] font-bold tracking-widest uppercase inline-flex items-center gap-1.5 border ${getStatusStyle(emp.status)}`}>
                              <div className={`w-1.5 h-1.5 rounded-full bg-current`} />
                              {emp.status}
                            </span>
                          </td>
                          <td className="px-8 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => openEditModal(emp)}
                                className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all"
                                title="Edit Details"
                              >
                                <Pencil size={16} />
                              </button>
                              {emp.status !== 'Paid' ? (
                                <button 
                                  onClick={() => handlePay(emp)}
                                  disabled={payingId === emp.employeeId}
                                  className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50"
                                >
                                  {payingId === emp.employeeId ? <Loader2 size={12} className="animate-spin" /> : 'Pay Now'}
                                </button>
                              ) : (
                                <button className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all">
                                  <ExternalLink size={16} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Bottom Section: Expanded Insights & History ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        
        {/* Cycle Info */}
        <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-600/20 flex flex-col justify-between min-h-[220px]">
          <div>
            <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-3">Next Payroll Cycle</p>
            <h3 className="text-4xl font-bold font-outfit mb-2">{formatDate(data.nextPayCycle)}</h3>
            <p className="text-xs text-indigo-100 opacity-80 leading-relaxed">
              Payments will be automatically initiated for all pending employees on this date.
            </p>
          </div>
          <div className="flex items-center gap-2 mt-8 text-[10px] font-bold uppercase tracking-widest bg-white/10 w-fit px-4 py-2 rounded-lg backdrop-blur-sm">
            <ShieldCheck size={14} />
            Compliance Verified
          </div>
        </div>

        {/* Compliance Card */}
        <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-500" />
              Tax Compliance
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Tax filings for Q1 2026 are ready for submission. Regional standards applied.
            </p>
          </div>
          <button className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:translate-x-1 transition-transform">
            Review Report <ArrowRight size={14} />
          </button>
        </div>

        {/* History Timeline */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 font-outfit mb-6 flex items-center gap-2">
            <Clock size={20} className="text-indigo-500" />
            Recent Cycles
          </h3>
          <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
            {payrollHistory.slice(0, 3).map((h, i) => (
              <div key={h._id} className="relative pl-8 group">
                <div className={`absolute left-0 top-1.5 w-[23px] h-[23px] rounded-full border-4 border-white shadow-sm transition-colors ${i === 0 ? 'bg-indigo-500' : 'bg-slate-200'}`} />
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-slate-800 mb-0.5">{h.month} {h.year}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{h.status}</p>
                  </div>
                  <p className="text-[10px] font-bold text-indigo-600">{formatCurrency(h.netPayroll)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Edit Modal ── */}
      <AnimatePresence>
        {isEditModalOpen && editingEmployee && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeEditModal}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="px-8 pt-8 pb-6 border-b border-slate-50">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${editingEmployee.name}`} 
                      className="w-12 h-12 rounded-2xl bg-slate-100" 
                      alt=""
                    />
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 font-outfit">Adjust Salary</h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{editingEmployee.name}</p>
                    </div>
                  </div>
                  <button onClick={closeEditModal} className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
                </div>

                <form onSubmit={handleSaveFields} className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Base Salary</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</div>
                      <input 
                        type="number" 
                        value={modalValues.baseSalary}
                        onChange={(e) => setModalValues({...modalValues, baseSalary: e.target.value})}
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-8 pr-4 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Bonus</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</div>
                        <input 
                          type="number" 
                          value={modalValues.bonus}
                          onChange={(e) => setModalValues({...modalValues, bonus: e.target.value})}
                          className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-8 pr-4 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2 px-1">Deductions</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-red-300 font-bold text-sm">₹</div>
                        <input 
                          type="number" 
                          value={modalValues.deductions}
                          onChange={(e) => setModalValues({...modalValues, deductions: e.target.value})}
                          className="w-full bg-red-50/30 border-none rounded-2xl py-4 pl-8 pr-4 text-sm font-bold text-red-600 focus:ring-2 focus:ring-red-500/10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button type="button" onClick={closeEditModal} className="flex-1 py-4 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors">Cancel</button>
                    <button 
                      type="submit" 
                      disabled={isModalSaving}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                    >
                      {isModalSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default Payroll;
