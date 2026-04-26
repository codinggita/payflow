import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  UploadCloud, UserPlus, Shield, RefreshCw, Bell, 
  User, Mail, Briefcase, Calendar, DollarSign, Percent, AlertCircle 
} from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import api from '../../config/axios';
import toast from 'react-hot-toast';

const AddEmployee = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    role: '',
    baseSalary: '',
    joiningDate: '',
    status: 'Active',
    taxPercent: '20'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.role) newErrors.role = 'Role is required';
    if (!formData.baseSalary) newErrors.baseSalary = 'Base salary is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      await api.post('/employees', {
        ...formData,
        baseSalary: Number(formData.baseSalary),
        taxPercent: Number(formData.taxPercent)
      });
      toast.success('Employee added successfully!');
      navigate('/employees');
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.msg || 'Failed to add employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 pl-2">
          <h1 className="text-3xl font-bold text-slate-800 font-outfit flex items-center gap-4">
            <UserPlus size={24} className="text-indigo-600" />
            Add New Employee
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-2 ml-10">Enter employee details to onboard into the payroll system</p>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-3xl shadow-sm border border-slate-100 p-10 mb-8 relative overflow-hidden"
        >
           <div className="absolute top-8 right-8 w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center border border-slate-100">
             <UserPlus size={20} />
           </div>

           <form onSubmit={handleSubmit}>
              <div className="mb-10">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Employee Avatar</label>
                <div className="border-2 border-dashed border-indigo-200 rounded-2xl bg-[#F8FAFC] p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-50 transition-colors">
                  <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center text-indigo-500 mb-4 border border-indigo-50">
                    <UploadCloud size={24} />
                  </div>
                  <p className="text-sm font-bold text-slate-700">Click to upload or drag and drop</p>
                  <p className="text-[11px] text-slate-400 font-medium mt-1">PNG, JPG or SVG (max. 800x800px)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 mb-10">
                {/* Full Name */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2.5">Full Name</label>
                  <div className="relative">
                    <User className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.name ? 'text-red-400' : 'text-slate-400'}`} size={18} />
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Sarah Jenkins" 
                      className={`w-full pl-11 pr-4 py-3.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all font-semibold text-slate-700 placeholder-slate-300 ${errors.name ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'}`}
                    />
                  </div>
                  {errors.name && <p className="text-[10px] text-red-500 font-bold mt-2 flex items-center gap-1"><AlertCircle size={12} /> {errors.name}</p>}
                </div>

                {/* Email Address */}
                <div>
                  <label className={`block text-[10px] font-bold uppercase tracking-widest mb-2.5 ${errors.email ? 'text-red-500' : 'text-slate-500'}`}>Email Address</label>
                  <div className="relative">
                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.email ? 'text-red-400' : 'text-slate-400'}`} size={18} />
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. sarah.jenkins@atelier.com" 
                      className={`w-full pl-11 pr-4 py-3.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all font-semibold text-slate-700 placeholder-slate-300 ${errors.email ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500 text-red-600 bg-red-50/10' : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'}`}
                    />
                  </div>
                  {errors.email && <p className="text-[10px] text-red-500 font-bold mt-2 flex items-center gap-1"><AlertCircle size={12} /> {errors.email}</p>}
                </div>

                {/* Department */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2.5">Department</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select 
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className={`w-full pl-11 pr-4 py-3.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all font-semibold text-slate-700 appearance-none ${errors.department ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'} ${!formData.department && 'text-slate-400'}`}
                    >
                      <option value="" disabled>Select Department</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Design Ops">Design Ops</option>
                      <option value="Operations">Operations</option>
                      <option value="Marketing">Marketing</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </div>
                  {errors.department && <p className="text-[10px] text-red-500 font-bold mt-2 flex items-center gap-1"><AlertCircle size={12} /> {errors.department}</p>}
                </div>

                {/* Role */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2.5">Role</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      placeholder="e.g. Senior Designer" 
                      className={`w-full pl-11 pr-4 py-3.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all font-semibold text-slate-700 placeholder-slate-300 ${errors.role ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'}`}
                    />
                  </div>
                  {errors.role && <p className="text-[10px] text-red-500 font-bold mt-2 flex items-center gap-1"><AlertCircle size={12} /> {errors.role}</p>}
                </div>

                {/* Base Salary */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2.5">Base Salary</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="number" 
                      name="baseSalary"
                      value={formData.baseSalary}
                      onChange={handleChange}
                      placeholder="0.00" 
                      className={`w-full pl-11 pr-4 py-3.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all font-semibold text-slate-700 placeholder-slate-300 ${errors.baseSalary ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'}`}
                    />
                  </div>
                  <p className="text-[10px] italic text-slate-400 mt-2 font-medium">Annual gross salary before taxes</p>
                  {errors.baseSalary && <p className="text-[10px] text-red-500 font-bold mt-2 flex items-center gap-1"><AlertCircle size={12} /> {errors.baseSalary}</p>}
                </div>

                {/* Joining Date */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2.5">Joining Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="date" 
                      name="joiningDate"
                      value={formData.joiningDate}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-slate-700 text-slate-500"
                    />
                  </div>
                </div>

                {/* Employment Status */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2.5">Employment Status</label>
                  <div className="relative">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center justify-center">
                       <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-400"></div>
                    </div>
                    <select 
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-slate-700 appearance-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Onboarding">Onboarding</option>
                      <option value="Leave">Leave</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </div>
                </div>

                {/* Tax Percentage */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2.5">Tax Percentage</label>
                  <div className="relative">
                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="number" 
                      name="taxPercent"
                      value={formData.taxPercent}
                      onChange={handleChange}
                      placeholder="20" 
                      className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-slate-700 placeholder-slate-300"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-5 pt-6 mt-4">
                <button type="button" onClick={() => navigate('/employees')} className="px-6 py-3.5 text-sm font-bold text-slate-700 hover:text-slate-900 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="px-8 py-3.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/30 flex items-center gap-2 transition-all disabled:opacity-70">
                  <UserPlus size={18} />
                  {loading ? 'Adding...' : 'Add Employee'}
                </button>
              </div>
           </form>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-[#F8FAFC] rounded-3xl p-7 border border-transparent hover:border-slate-200 transition-colors">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-5">
              <Shield size={20} />
            </div>
            <h3 className="text-[13px] font-bold text-slate-800 mb-2.5">Encrypted Records</h3>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">All employee sensitive data is encrypted with enterprise-grade security protocols.</p>
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-[#F8FAFC] rounded-3xl p-7 border border-transparent hover:border-slate-200 transition-colors">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-5">
              <RefreshCw size={20} />
            </div>
            <h3 className="text-[13px] font-bold text-slate-800 mb-2.5">Auto-Tax Sync</h3>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Taxes are calculated and filed automatically based on the department and role specified.</p>
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-[#F8FAFC] rounded-3xl p-7 border border-transparent hover:border-slate-200 transition-colors">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-5">
              <Bell size={20} />
            </div>
            <h3 className="text-[13px] font-bold text-slate-800 mb-2.5">Onboarding Alert</h3>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">An automated welcome email will be sent once the profile is officially confirmed.</p>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default AddEmployee;
