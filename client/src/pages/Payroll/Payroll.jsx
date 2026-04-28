import React from 'react';
import { motion } from 'framer-motion';
import {
  Wallet,
  MinusCircle,
  Banknote,
  Filter,
  Download,
  ArrowRight,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import usePayroll from '../../hooks/usePayroll';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const formatDeduction = (amount) => {
  return `(${formatCurrency(amount)})`;
};

const formatDate = (date) => {
  if (!date) return 'Nov 15';
  const d = new Date(date);
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric' });
};

const Payroll = () => {
  const { payrollData, loading, processing, processMonthlyPayroll, getDefaultPayroll } = usePayroll();
  const data = payrollData || getDefaultPayroll();

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Top Header */}
      <div className="flex justify-between items-end mb-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1">Financial Cycle</p>
          <h1 className="text-3xl font-bold text-slate-800 font-outfit">{data.month} Payroll</h1>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-50 border border-slate-200 px-6 py-4 rounded-2xl text-right shadow-sm"
        >
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Estimated Outflow</p>
          <h2 className="text-2xl font-bold text-slate-800 font-outfit">{formatCurrency(data.estimatedOutflow)}</h2>
        </motion.div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Salary */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center justify-between"
        >
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Salary</p>
            <h3 className="text-2xl font-bold text-slate-800 font-outfit">{formatCurrency(data.totalSalary)}</h3>
          </div>
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
            <Wallet size={20} />
          </div>
        </motion.div>

        {/* Total Deductions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center justify-between"
        >
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Deductions</p>
            <h3 className="text-2xl font-bold text-red-500 font-outfit">{formatDeduction(data.totalDeductions)}</h3>
          </div>
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
            <MinusCircle size={20} />
          </div>
        </motion.div>

        {/* Net Payroll */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center justify-between relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-0"></div>
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1">Net Payroll</p>
            <h3 className="text-2xl font-bold text-slate-800 font-outfit">{formatCurrency(data.netPayroll)}</h3>
          </div>
          <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center relative z-10 shadow-lg shadow-indigo-600/30">
            <Banknote size={20} />
          </div>
        </motion.div>
      </div>

      {/* Main Table Section */}
      <div className="mb-6 flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-800 font-outfit">Employee Remuneration</h3>
        <div className="flex gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm text-slate-400 hover:text-slate-600 transition-colors">
            <Filter size={16} />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm text-slate-400 hover:text-slate-600 transition-colors">
            <Download size={16} />
          </button>
        </div>
      </div>

      <div className="mb-10">
        <div className="px-8 flex text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
          <div className="w-[30%]">Employee</div>
          <div className="w-[14%] text-center">Base Salary</div>
          <div className="w-[14%] text-center">Deductions</div>
          <div className="w-[14%] text-center">Bonus</div>
          <div className="w-[14%] text-center">Net Pay</div>
          <div className="w-[14%] text-right">Status</div>
        </div>

        <div className="space-y-4">
          {!(data.employees && data.employees.length) ? (
            <div className="bg-white px-8 py-4 rounded-[2rem] shadow-sm text-center text-sm text-slate-400">
              No employees in payroll yet. Click Process Payroll to begin.
            </div>
          ) : (
            data.employees.map((emp, idx) => (
              <motion.div
                key={emp._id || idx}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 + (idx * 0.1) }}
                className="bg-white px-8 py-4 rounded-[2rem] shadow-sm flex items-center justify-between"
              >
                <div className="w-[30%] flex items-center gap-4">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.avatar || emp._id}`} alt={emp.name} className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200" />
                  <div>
                    <p className="text-sm font-bold text-slate-800">{emp.name}</p>
                    <p className={`text-[9px] font-bold uppercase tracking-wider ${emp.status === 'Error' ? 'text-red-500' : 'text-slate-400'}`}>
                      {emp.role}
                    </p>
                  </div>
                </div>
                <div className="w-[14%] text-center">
                  <p className="text-xs font-bold text-slate-600">{formatCurrency(emp.baseSalary)}</p>
                </div>
                <div className="w-[14%] text-center">
                  <p className="text-xs font-bold text-red-500 bg-red-50/80 py-1 px-3 rounded-xl inline-block">
                    {formatDeduction(emp.deductions)}
                  </p>
                </div>
                <div className="w-[14%] text-center">
                  <p className="text-xs font-bold text-slate-600">{formatCurrency(emp.bonus)}</p>
                </div>
                <div className="w-[14%] text-center">
                  <p className="text-xs font-bold text-indigo-600">{formatCurrency(emp.netPay)}</p>
                </div>
                <div className="w-[14%] flex justify-end">
                  <span className={`px-3 py-1.5 rounded-full text-[9px] font-bold tracking-widest uppercase inline-flex items-center gap-1.5 ${
                    emp.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' :
                    emp.status === 'Pending' ? 'bg-amber-50 text-amber-600' :
                    'bg-red-50 text-red-600'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      emp.status === 'Paid' ? 'bg-emerald-500' :
                      emp.status === 'Pending' ? 'bg-amber-500' :
                      'bg-red-500'
                    }`}></div>
                    {emp.status}
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Bottom Summary Row */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-10"
      >
        <div className="bg-white rounded-[2rem] shadow-sm p-2 pr-2 flex flex-wrap sm:flex-nowrap items-center justify-between w-full lg:w-auto">
          <div className="px-8 py-4">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Gross Total</p>
            <p className="text-xl font-bold text-slate-800 font-outfit">{formatCurrency(data.totalSalary)}</p>
          </div>
          <div className="px-8 py-4">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Deductions</p>
            <p className="text-xl font-bold text-red-500 font-outfit">{formatDeduction(data.totalDeductions)}</p>
          </div>
          <div className="bg-indigo-50/80 rounded-[1.5rem] py-4 px-10">
            <p className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest mb-1">Final Disbursable</p>
            <p className="text-2xl font-bold text-slate-800 font-outfit">{formatCurrency(data.netPayroll)}</p>
          </div>
        </div>

        <button
          onClick={processMonthlyPayroll}
          disabled={processing}
          className="flex items-center justify-center gap-3 bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-5 rounded-[2rem] font-bold text-sm transition-colors shadow-lg shadow-indigo-500/30 w-full lg:w-auto shrink-0 h-[88px] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {processing ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Wallet size={18} />
              Process Monthly Payroll
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </motion.div>

      {/* Bottom Cards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-8">
        {/* Compliance Check */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="lg:col-span-2 bg-[#F8FAFC] rounded-3xl p-8 border border-slate-100 flex flex-col justify-between shadow-sm"
        >
          <div className="max-w-md">
            <h3 className="text-xl font-bold text-slate-800 font-outfit mb-2">Compliance Check</h3>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">
              Automated audit of tax filings and benefit contributions for the current fiscal period.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 mt-auto">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-[9px] font-bold text-indigo-600 border-2 border-slate-50 z-30">IRS</div>
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-[9px] font-bold text-emerald-600 border-2 border-slate-50 z-20">W2</div>
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[9px] font-bold text-slate-600 border-2 border-slate-50 z-10">+2</div>
            </div>
            <div className="flex items-center gap-2 text-emerald-600">
              <ShieldCheck size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">All regulatory updates applied</span>
            </div>
          </div>
        </motion.div>

        {/* Next Pay Cycle */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="bg-indigo-600 rounded-3xl p-8 shadow-lg shadow-indigo-600/30 text-white flex flex-col justify-between"
        >
          <div>
            <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-2">Next Pay Cycle</p>
            <h3 className="text-4xl font-bold font-outfit mb-8">{formatDate(data.nextPayCycle)}</h3>
          </div>
          <button className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-6 py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition-colors">
            Adjust Schedule
          </button>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Payroll;
