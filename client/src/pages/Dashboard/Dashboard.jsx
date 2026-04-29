import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  WalletCards,
  Clock,
  TrendingUp,
  FileBarChart,
  ChevronRight,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import Layout from '../../components/Layout/Layout';
import useDashboard from '../../hooks/useDashboard';

const Dashboard = () => {
  const now = new Date();
  const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const YEARS = [2024, 2025, 2026];

  const [selectedMonth, setSelectedMonth] = useState(MONTHS[now.getMonth()]);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const { stats, loading, error } = useDashboard(selectedMonth, selectedYear);
  const [timeRange, setTimeRange] = useState('6 MONTHS');

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);

  if (loading || !stats) {
    return (
      <Layout>
        <div className="flex-1 flex flex-col items-center justify-center h-full min-h-[60vh]">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
          <h2 className="text-lg font-bold text-slate-700">Loading Dashboard...</h2>
          <p className="text-sm text-slate-400">Aggregating payroll metrics for {selectedMonth} {selectedYear}</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex-1 flex flex-col items-center justify-center h-full min-h-[60vh]">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-lg font-bold text-slate-700">Failed to load dashboard</h2>
          <p className="text-sm text-slate-400">{error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header with Selectors */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 font-outfit">Financial Dashboard</h1>
          <p className="text-sm text-slate-500">Real-time insights across your atelier</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-transparent text-sm font-bold text-slate-600 px-3 py-1.5 focus:outline-none cursor-pointer"
          >
            {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <div className="w-px h-6 bg-slate-100"></div>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="bg-transparent text-sm font-bold text-slate-600 px-3 py-1.5 focus:outline-none cursor-pointer"
          >
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          {stats.isProcessed ? (
            <div className="ml-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Processed
            </div>
          ) : (
            <div className="ml-2 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Projected
            </div>
          )}
        </div>
      </div>

      {/* Top Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Primary Stat Card */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="col-span-1 md:col-span-1 lg:col-span-1 rounded-3xl p-6 relative overflow-hidden bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-500/30"
            >
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-2 bg-white/20 rounded-xl">
                  <WalletCards className="text-white" size={24} />
                </div>
                <div className="flex items-center gap-1 bg-white/20 px-2.5 py-1 rounded-full text-white text-[10px] font-bold tracking-wider">
                  <TrendingUp size={12} /> {stats.growth}% GROWTH
                </div>
              </div>
              <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest mb-1 relative z-10">Monthly Payroll Expenditure</p>
              <h2 className="text-4xl font-bold text-white font-outfit relative z-10">{formatCurrency(stats.totalPayroll)}</h2>
            </motion.div>

            {/* Secondary Cards Column */}
            <div className="col-span-2 grid grid-cols-2 gap-6">
              {/* Card 2 */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-center"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Users size={20} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 font-outfit">{stats.activeInPayroll.toLocaleString()}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Active Employees in Payroll</p>
              </motion.div>

              {/* Card 3 */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-center relative overflow-hidden"
              >
                <div className="absolute right-0 bottom-0 w-32 h-32 bg-orange-50 rounded-tl-full -z-0"></div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="p-2 bg-orange-50 text-orange-500 rounded-xl">
                    <Clock size={20} />
                  </div>
                  {stats.onboardingCount > 0 && (
                    <div className="bg-orange-100 text-orange-600 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider">
                      URGENT
                    </div>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-slate-800 font-outfit relative z-10">{stats.onboardingCount}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 relative z-10">Pending Onboarding</p>
              </motion.div>

              {/* Wide Card spanning 2 cols */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="col-span-2 bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                    <FileBarChart size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{formatCurrency(stats.taxOverview)}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total Tax & Deductions</p>
                  </div>
                </div>
                <ChevronRight className="text-slate-300" size={20} />
              </motion.div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Line Chart */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 font-outfit">Payroll Trends</h3>
                  <p className="text-xs text-slate-400">Monthly expenditure breakdown</p>
                </div>
                <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
                  <button 
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold ${timeRange === '6 MONTHS' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                    onClick={() => setTimeRange('6 MONTHS')}
                  >
                    6 MONTHS
                  </button>
                  <button 
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold ${timeRange === '1 YEAR' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                    onClick={() => setTimeRange('1 YEAR')}
                  >
                    1 YEAR
                  </button>
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.payrollTrends} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} dy={10} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value) => [formatCurrency(value), 'Expenditure']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#4f46e5" 
                      strokeWidth={4}
                      dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#4f46e5' }}
                      activeDot={{ r: 6, fill: '#4f46e5', stroke: '#fff', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Donut Chart */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col"
            >
              <div>
                <h3 className="text-lg font-bold text-slate-800 font-outfit">Department Split</h3>
                <p className="text-xs text-slate-400">Headcount allocation</p>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center relative my-4">
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.departmentSplit}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {stats.departmentSplit.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl font-bold text-slate-800 font-outfit">{formatCurrency(stats.totalPayroll)}</span>
                  <span className="text-[8px] font-bold text-slate-400 tracking-widest uppercase">Total Base</span>
                </div>
              </div>
              
              <div className="space-y-3">
                {stats.departmentSplit.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{item.name}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-800">{item.value}%</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Activity Table */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800 font-outfit">Recent Activity</h3>
              <button className="px-4 py-2 bg-white border border-slate-200 text-indigo-600 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                View Full History
              </button>
            </div>
            
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Employee</th>
                      <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Activity Type</th>
                      <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {stats.recentActivity.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <img src={row.avatar} alt={row.name} className="w-10 h-10 rounded-full bg-slate-100 object-cover" />
                              <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${row.status === 'COMPLETED' ? 'bg-emerald-400' : 'bg-indigo-400'}`}></div>
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800">{row.name}</p>
                              <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">{row.role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-sm font-medium text-slate-700">{row.action}</p>
                          <p className="text-xs text-slate-400">{row.cycle}</p>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase ${
                            row.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' : 
                            row.status === 'PAUSED' ? 'bg-slate-100 text-slate-600' : 'bg-indigo-50 text-indigo-600'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{row.time}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {stats.recentActivity.length === 0 && (
                  <div className="py-10 text-center">
                    <p className="text-sm text-slate-400 font-medium">No recent activity found.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
    </Layout>
  );
};

export default Dashboard;
