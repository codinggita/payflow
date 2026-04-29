import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import {
  Download,
  Filter,
  Calendar,
  Users,
  Wallet,
  TrendingUp,
  PieChart as PieChartIcon,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  ChevronRight,
  FileText,
  MinusCircle,
  Check,
  Loader2
} from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import useDashboard from '../../hooks/useDashboard';
import usePayroll from '../../hooks/usePayroll';

/* ─── Components ─────────────────────────────────────────── */
const StatCard = ({ label, value, change, isPositive, icon: Icon, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-between group hover:shadow-md transition-all cursor-default"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10 text-slate-700`}>
        <Icon size={20} className="text-current" />
      </div>
      <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
        {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
        {change}
      </div>
    </div>
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-2xl font-bold text-slate-800 font-outfit">{value}</h3>
    </div>
  </motion.div>
);

const Reports = () => {
  const now = new Date();
  const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const YEARS = [2024, 2025, 2026];

  const [selectedMonth, setSelectedMonth] = useState(MONTHS[now.getMonth()]);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const { stats, loading: statsLoading } = useDashboard(selectedMonth, selectedYear);
  const { payrollHistory, fetchPayrollHistory } = usePayroll();
  const [timeRange, setTimeRange] = useState('Monthly');

  useEffect(() => {
    fetchPayrollHistory();
  }, [fetchPayrollHistory]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);

  if (statsLoading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Generating Intelligence Reports...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 font-outfit mb-2">Reports & Analytics</h1>
              <p className="text-sm text-slate-500">Analyze payroll expenses and employee insights</p>
            </div>
            
            <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100 h-fit">
              <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-transparent text-[11px] font-bold text-slate-600 px-2 py-1 focus:outline-none cursor-pointer"
              >
                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <div className="w-px h-4 bg-slate-100"></div>
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="bg-transparent text-[11px] font-bold text-slate-600 px-2 py-1 focus:outline-none cursor-pointer"
              >
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              {stats?.isProcessed ? (
                <div className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[8px] font-bold tracking-widest uppercase flex items-center gap-1">
                  Processed
                </div>
              ) : (
                <div className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full text-[8px] font-bold tracking-widest uppercase flex items-center gap-1">
                  Projected
                </div>
              )}
            </div>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 w-fit">
            <Download size={18} />
            Export Report
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            label="Total Payroll" 
            value={formatCurrency(stats?.totalPayroll)} 
            change={`+${stats?.growth}%`} 
            isPositive={true} 
            icon={Wallet} 
            color="text-indigo-600" 
          />
          <StatCard 
            label="Total Employees" 
            value={stats?.totalEmployees} 
            change={`+${stats?.onboardingCount}`} 
            isPositive={true} 
            icon={Users} 
            color="text-blue-600" 
          />
          <StatCard 
            label="Avg. Salary" 
            value={formatCurrency(stats?.avgSalary)} 
            change="+2.4%" 
            isPositive={true} 
            icon={TrendingUp} 
            color="text-emerald-600" 
          />
          <StatCard 
            label="Total Deductions" 
            value={formatCurrency(stats?.taxOverview)} 
            change="-5%" 
            isPositive={false} 
            icon={MinusCircle} 
            color="text-red-600" 
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Payroll Trends */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-slate-800 font-outfit">Payroll Trends</h3>
                <p className="text-xs text-slate-400">Expense growth over the last 6 months</p>
              </div>
              <div className="flex bg-slate-50 p-1 rounded-xl">
                {['Monthly', 'Quarterly'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => setTimeRange(opt)}
                    className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${timeRange === opt ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.payrollTrends}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                    tickFormatter={(val) => `₹${val/1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#6366f1', fontWeight: 'bold' }}
                    formatter={(val) => [formatCurrency(val), 'Expenditure']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Expense Breakdown */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 font-outfit mb-2">Expense Breakdown</h3>
            <p className="text-xs text-slate-400 mb-8">Current cycle distribution</p>
            
            <div className="flex-1 flex flex-col items-center justify-center min-h-[250px] relative">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={stats?.expenseBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {stats?.expenseBreakdown?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} cornerRadius={10} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => formatCurrency(val)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-slate-800 font-outfit">
                  {Math.round(((stats?.totalPayroll - stats?.taxOverview) / stats?.totalPayroll) * 100) || 0}%
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Salaries</span>
              </div>
            </div>

            <div className="space-y-3 mt-4">
              {stats?.expenseBreakdown?.map(item => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{item.name}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-800">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Recent Reports Table */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800 font-outfit">Recent Payroll Reports</h3>
            <button className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1 hover:translate-x-1 transition-transform">
              View All History <ChevronRight size={14} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Month / Cycle</th>
                  <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Payroll</th>
                  <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Employees Paid</th>
                  <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {payrollHistory.slice(0, 5).map(report => (
                  <tr key={report._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                          <FileText size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{report.month} {report.year}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Automated Cycle</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 font-bold text-sm text-slate-700 font-outfit">{formatCurrency(report.netPayroll)}</td>
                    <td className="px-6 py-6 text-center font-bold text-xs text-slate-500">{report.employeeCount}</td>
                    <td className="px-6 py-6 text-center">
                      <span className={`px-3 py-1.5 border rounded-full text-[9px] font-bold tracking-widest uppercase inline-flex items-center gap-1.5 ${
                        report.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        <div className="w-1.5 h-1.5 rounded-full bg-current" />
                        {report.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                        <Download size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {payrollHistory.length === 0 && (
                   <tr>
                     <td colSpan="5" className="px-8 py-10 text-center text-slate-400 text-sm font-medium">
                       No payroll history available yet.
                     </td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 pb-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            © 2026 PAYFLOW FINANCIAL ATELIER. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <a href="#" className="hover:text-indigo-600 transition-colors">Compliance</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Terms</a>
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default Reports;

