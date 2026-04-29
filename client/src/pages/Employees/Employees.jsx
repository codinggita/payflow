import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Search, Plus, ChevronLeft, ChevronRight, Briefcase, 
  ChevronDown, Filter, TrendingUp, Trash2, Loader2 
} from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import useEmployees from '../../hooks/useEmployees';
import useDashboard from '../../hooks/useDashboard';

const Employees = () => {
  const { employees, pagination, loading, fetchEmployees, removeEmployee } = useEmployees();
  const { stats, loading: statsLoading } = useDashboard();
  const [filters, setFilters] = useState({ search: '', department: '', status: '', page: 1 });

  // Debounced fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEmployees(filters);
    }, 400);
    return () => clearTimeout(timer);
  }, [filters, fetchEmployees]);

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to permanently remove ${name} from the directory?`)) {
      removeEmployee(id);
    }
  };

  const formatCurrency = (val) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <Layout>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 font-outfit mb-2">Employee Directory</h1>
          <p className="text-slate-500 font-medium text-sm">Manage your atelier's talent and organizational structure.</p>
        </div>
        <Link to="/employees/new" className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-md shadow-indigo-500/20 text-sm">
          <Plus size={18} /> Add New Employee
        </Link>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Filter by name, role or email..." 
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
          />
        </div>
        
        <div className="relative">
          <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <select 
            className="appearance-none pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 hover:bg-white text-slate-600 rounded-xl font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer transition-colors"
            value={filters.department}
            onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value, page: 1 }))}
          >
            <option value="">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Design Ops">Design Ops</option>
            <option value="Operations">Operations</option>
            <option value="Marketing">Marketing</option>
          </select>
          <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
        </div>

        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-slate-300 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
          </div>
          <select 
            className="appearance-none pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 hover:bg-white text-slate-600 rounded-xl font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer transition-colors"
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Onboarding">Onboarding</option>
            <option value="Leave">Leave</option>
          </select>
          <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
        </div>
        
        <button className="px-4 py-3 bg-slate-50 border border-slate-200 hover:bg-white text-slate-600 rounded-xl font-semibold flex items-center gap-2 transition-colors text-sm">
          <Filter size={16} /> Sort
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-8">
        <div className="bg-slate-50 border-b border-slate-100 px-8 py-4 flex text-xs font-bold text-slate-400 uppercase tracking-widest">
          <div className="flex-[2]">EMPLOYEE</div>
          <div className="flex-1">ROLE & DEPT</div>
          <div className="flex-1">COMPENSATION</div>
          <div className="w-32">STATUS</div>
          <div className="w-10"></div>
        </div>
        
        <div className="divide-y divide-slate-50 relative min-h-[300px]">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10 backdrop-blur-[1px]">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
          )}

          {!loading && employees.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-center absolute inset-0">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-400 border border-slate-100">
                 <Search size={24} />
               </div>
               <h3 className="text-lg font-bold text-slate-700">No employees found</h3>
               <p className="text-sm text-slate-500 mt-1 max-w-sm">We couldn't find any employees matching your current filters. Try adjusting your search criteria.</p>
            </div>
          )}

          {employees.map((emp) => (
            <div key={emp._id} className="flex items-center px-8 py-6 hover:bg-slate-50/50 transition-colors group">
              <div className="flex-[2] flex items-center gap-4">
                <img 
                  src={emp.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.name}`} 
                  alt={emp.name} 
                  className="w-12 h-12 rounded-full border-2 border-slate-100 bg-slate-50 object-cover" 
                />
                <div>
                  <h3 className="text-base font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{emp.name}</h3>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">{emp.email}</p>
                </div>
              </div>
              
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-700">{emp.role}</p>
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-1">{emp.department}</p>
              </div>
              
              <div className="flex-1">
                <p className="text-base font-bold text-slate-800">
                  {formatCurrency(emp.baseSalary)}
                </p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">ANNUAL SALARY</p>
              </div>
              
              <div className="w-32">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase ${
                  emp.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 
                  emp.status === 'Onboarding' ? 'bg-amber-50 text-amber-600' : 
                  'bg-slate-100 text-slate-500'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    emp.status === 'Active' ? 'bg-emerald-500' : 
                    emp.status === 'Onboarding' ? 'bg-amber-500' : 
                    'bg-slate-400'
                  }`}></span>
                  {emp.status}
                </span>
              </div>
              
              <div className="w-10 flex justify-end">
                <button 
                  onClick={() => handleDelete(emp._id, emp.name)}
                  className="text-slate-300 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {pagination.totalEmployees > 0 && (
          <div className="px-8 py-5 border-t border-slate-100 flex items-center justify-between bg-white relative z-20">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              SHOWING {(pagination.currentPage - 1) * 10 + 1}-{Math.min(pagination.currentPage * 10, pagination.totalEmployees)} OF {pagination.totalEmployees} EMPLOYEES
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setFilters(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                disabled={pagination.currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
              >
                <ChevronLeft size={14} />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-500 text-white font-bold text-xs shadow-sm shadow-indigo-500/30">
                {pagination.currentPage}
              </button>
              <button 
                onClick={() => setFilters(prev => ({ ...prev, page: Math.min(pagination.totalPages, prev.page + 1) }))}
                disabled={pagination.currentPage === pagination.totalPages || pagination.totalPages === 0}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between"
        >
          <div>
            <h3 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-4">TEAM VITALITY</h3>
            <div className="text-4xl font-bold text-slate-800 font-outfit mb-2">
              {statsLoading ? '...' : `${stats?.retentionRate || 0}%`}
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">Current employee retention rate across all atelier departments.</p>
          </div>
          <div className="mt-8">
            <div className="w-full h-2.5 bg-indigo-50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 rounded-full transition-all duration-1000" 
                style={{ width: `${stats?.retentionRate || 0}%` }}
              ></div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between"
        >
          <div>
            <h3 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-4">PENDING HIRES</h3>
            <div className="text-4xl font-bold text-slate-800 font-outfit mb-2">
              {statsLoading ? '...' : stats?.onboardingCount || 0}
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">Offers extended for the Engineering and Design expansion.</p>
          </div>
          <div className="mt-8 flex items-center">
            <div className="flex -space-x-3">
              {[...Array(Math.min(3, stats?.onboardingCount || 0))].map((_, i) => (
                <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=p${i}`} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-white bg-slate-100" />
              ))}
              {stats?.onboardingCount > 3 && (
                <div className="w-10 h-10 rounded-full border-2 border-white bg-indigo-500 text-white flex items-center justify-center text-[10px] font-bold z-10">
                  +{stats.onboardingCount - 3}
                </div>
              )}
              {stats?.onboardingCount === 0 && <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No pending hires</p>}
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between"
        >
          <div>
            <h3 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-4">TOTAL PAYROLL</h3>
            <div className="text-4xl font-bold text-slate-800 font-outfit mb-2">
              {statsLoading ? '...' : formatCurrency(stats?.totalPayroll || 0)}
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">Projected annual compensation for the current headcount.</p>
          </div>
          <div className="mt-8 flex items-center gap-2">
            <div className="flex items-center text-emerald-500 text-[10px] font-bold tracking-widest uppercase">
              <TrendingUp size={14} className="mr-1" /> +{stats?.growth || 0}% VS LAST YEAR
            </div>
          </div>
        </motion.div>
      </div>

    </Layout>
  );
};

export default Employees;
