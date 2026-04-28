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
  FileBarChart
} from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import usePayroll from '../../hooks/usePayroll';

/* ─── Formatters ─────────────────────────────────────────── */
const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount || 0);

const formatDeduction = (amount) => `(${formatCurrency(amount)})`;

const formatDate = (date) => {
  if (!date) return 'May 15';
  return new Date(date).toLocaleString('en-US', { month: 'short', day: 'numeric' });
};

/* ─── Reusable inline-edit cell ──────────────────────────── */
const EditCell = ({
  value,
  displayNode,
  isEditing,
  isSaving,
  canEdit,
  onStart,
  onSave,
  onCancel,
  editValue,
  setEditValue,
}) => {
  if (isEditing) {
    return (
      <div className="flex items-center justify-center gap-1">
        <input
          type="number"
          min="0"
          step="0.01"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="w-20 text-xs border border-indigo-300 rounded-lg px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-indigo-400"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSave();
            if (e.key === 'Escape') onCancel();
          }}
        />
        <button
          onClick={onSave}
          disabled={isSaving}
          className="w-5 h-5 flex items-center justify-center rounded-md bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-50 transition-colors"
          title="Save"
        >
          {isSaving ? <Loader2 size={10} className="animate-spin" /> : <Check size={10} />}
        </button>
        <button
          onClick={onCancel}
          className="w-5 h-5 flex items-center justify-center rounded-md bg-slate-200 hover:bg-slate-300 text-slate-600 transition-colors"
          title="Cancel"
        >
          <X size={10} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-1 group">
      {displayNode}
      {canEdit && (
        <button
          onClick={onStart}
          className="w-5 h-5 flex items-center justify-center rounded-md bg-white shadow-sm border border-slate-200 text-slate-400 hover:text-indigo-500 hover:border-indigo-300 transition-all opacity-0 group-hover:opacity-100"
          title="Edit"
        >
          <Pencil size={10} />
        </button>
      )}
    </div>
  );
};

/* ─── Main Component ─────────────────────────────────────── */
const Payroll = () => {
  const {
    payrollData,
    loading,
    processing,
    processMonthlyPayroll,
    updateEmployeeStatus,
    updateEmployeeDeduction,
    updateEmployeeBonus,
    updateEmployeeSalary,
    updateEmployeePayrollFields,
    fetchPayrollHistory,
    payrollHistory,
    getDefaultPayroll,
  } = usePayroll();

  const data      = payrollData || getDefaultPayroll();
  const payrollId = payrollData?._id;

  const [activeView, setActiveView] = useState('directory'); // 'directory' | 'history'

  // Row-level edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [modalValues, setModalValues] = useState({
    baseSalary: '',
    bonus: '',
    deductions: ''
  });
  const [isModalSaving, setIsModalSaving] = useState(false);

  // { empId: string, field: 'salary'|'deduction'|'bonus' } | null
  const [editState, setEditState] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [savingKey, setSavingKey] = useState(null); // `${empId}-${field}`
  const [payingId, setPayingId]   = useState(null);

  const startEdit = (emp, field) => {
    const empId = emp.employeeId || emp._id;
    const valueMap = { salary: emp.baseSalary, deduction: emp.deductions, bonus: emp.bonus };
    setEditState({ empId, field });
    setEditValue(String(valueMap[field] ?? 0));
  };

  const cancelEdit = () => {
    setEditState(null);
    setEditValue('');
  };

  const handleSave = async (emp) => {
    if (!payrollId || !editState) return;
    const key = `${editState.empId}-${editState.field}`;
    setSavingKey(key);
    const empId = emp.employeeId;
    switch (editState.field) {
      case 'salary':    await updateEmployeeSalary(payrollId, empId, editValue);    break;
      case 'deduction': await updateEmployeeDeduction(payrollId, empId, editValue); break;
      case 'bonus':     await updateEmployeeBonus(payrollId, empId, editValue);     break;
    }
    setSavingKey(null);
    setEditState(null);
  };

  const handlePay = async (emp) => {
    const empId = emp.employeeId || emp._id;
    if (!payrollId) return;
    setPayingId(empId);
    await updateEmployeeStatus(payrollId, emp.employeeId, 'Paid');
    setPayingId(null);
  };
  useEffect(() => {
    if (activeView === 'history') {
      fetchPayrollHistory();
    }
  }, [activeView]);

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
      // toast handled in hook
    } finally {
      setIsModalSaving(false);
    }
  };

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
      {/* ── Tabs ── */}
      <div className="flex gap-8 mb-8 border-b border-slate-200">
        <button
          onClick={() => setActiveView('directory')}
          className={`pb-4 text-sm font-bold tracking-wider uppercase transition-all relative ${
            activeView === 'directory' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Directory
          {activeView === 'directory' && (
            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
          )}
        </button>
        <button
          onClick={() => setActiveView('history')}
          className={`pb-4 text-sm font-bold tracking-wider uppercase transition-all relative ${
            activeView === 'history' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          History
          {activeView === 'history' && (
            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
          )}
        </button>
      </div>

      {activeView === 'directory' ? (
        <>
          {/* ── Header ── */}
          <div className="flex justify-between items-end mb-8">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1">Financial Cycle</p>
              <h1 className="text-3xl font-bold text-slate-800 font-outfit">{data.month} Payroll</h1>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
              className="bg-slate-50 border border-slate-200 px-6 py-4 rounded-2xl text-right shadow-sm"
            >
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Estimated Outflow</p>
              <h2 className="text-2xl font-bold text-slate-800 font-outfit">{formatCurrency(data.estimatedOutflow)}</h2>
            </motion.div>
          </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center justify-between"
        >
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Salary</p>
            <h3 className="text-2xl font-bold text-slate-800 font-outfit">{formatCurrency(data.totalSalary)}</h3>
          </div>
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center"><Wallet size={20} /></div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center justify-between"
        >
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Deductions</p>
            <h3 className="text-2xl font-bold text-red-500 font-outfit">{formatDeduction(data.totalDeductions)}</h3>
          </div>
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center"><MinusCircle size={20} /></div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center justify-between relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-0" />
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1">Net Payroll</p>
            <h3 className="text-2xl font-bold text-slate-800 font-outfit">{formatCurrency(data.netPayroll)}</h3>
          </div>
          <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center relative z-10 shadow-lg shadow-indigo-600/30">
            <Banknote size={20} />
          </div>
        </motion.div>
      </div>

      {/* ── Table Header Row ── */}
      <div className="mb-6 flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-800 font-outfit">Employee Remuneration</h3>
        <div className="flex gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm text-slate-400 hover:text-slate-600 transition-colors"><Filter size={16} /></button>
          <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm text-slate-400 hover:text-slate-600 transition-colors"><Download size={16} /></button>
        </div>
      </div>

      <div className="mb-10">
        {/* Column labels */}
        <div className="px-8 flex text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
          <div className="w-[26%]">Employee</div>
          <div className="w-[14%] text-center">Base Salary</div>
          <div className="w-[15%] text-center">Deductions</div>
          <div className="w-[12%] text-center">Bonus</div>
          <div className="w-[12%] text-center">Net Pay</div>
          <div className="w-[21%] text-right pr-2">Status / Action</div>
        </div>

        {/* Rows */}
        <div className="space-y-3">
          {!(data.employees && data.employees.length) ? (
            <div className="bg-white px-8 py-6 rounded-[2rem] shadow-sm text-center text-sm text-slate-400">
              No employees in payroll yet. Click{' '}
              <span className="font-bold text-indigo-500">Process Payroll</span> to begin.
            </div>
          ) : (
            data.employees.map((emp, idx) => {
              const empKey  = emp.employeeId || emp._id || String(idx);
              const isPaid  = emp.status === 'Paid';
              const canEdit = !!payrollId && !isPaid;

              const isEditingSalary    = editState?.empId === empKey && editState?.field === 'salary';
              const isEditingDeduction = editState?.empId === empKey && editState?.field === 'deduction';
              const isEditingBonus     = editState?.empId === empKey && editState?.field === 'bonus';

              const isSavingSalary    = savingKey === `${empKey}-salary`;
              const isSavingDeduction = savingKey === `${empKey}-deduction`;
              const isSavingBonus     = savingKey === `${empKey}-bonus`;
              const isPaying          = payingId === empKey;

              return (
                <motion.div
                  key={emp._id || idx}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.35 + idx * 0.06 }}
                  className="bg-white px-8 py-4 rounded-[2rem] shadow-sm flex items-center"
                >
                  {/* Employee info */}
                  <div className="w-[26%] flex items-center gap-3">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.avatar || emp._id}`}
                      alt={emp.name}
                      className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 shrink-0"
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-800">{emp.name}</p>
                      <p className={`text-[9px] font-bold uppercase tracking-wider ${emp.status === 'Error' ? 'text-red-500' : 'text-slate-400'}`}>
                        {emp.role}
                      </p>
                    </div>
                  </div>

                  {/* Base Salary */}
                  <div className="w-[14%]">
                    <EditCell
                      isEditing={isEditingSalary}
                      isSaving={isSavingSalary}
                      canEdit={canEdit}
                      editValue={editValue}
                      setEditValue={setEditValue}
                      onStart={() => startEdit(emp, 'salary')}
                      onSave={() => handleSave(emp)}
                      onCancel={cancelEdit}
                      displayNode={
                        <p className="text-xs font-bold text-slate-600">{formatCurrency(emp.baseSalary)}</p>
                      }
                    />
                  </div>

                  {/* Deductions */}
                  <div className="w-[15%]">
                    <EditCell
                      isEditing={isEditingDeduction}
                      isSaving={isSavingDeduction}
                      canEdit={canEdit}
                      editValue={editValue}
                      setEditValue={setEditValue}
                      onStart={() => startEdit(emp, 'deduction')}
                      onSave={() => handleSave(emp)}
                      onCancel={cancelEdit}
                      displayNode={
                        <p className="text-xs font-bold text-red-500 bg-red-50/80 py-1 px-2 rounded-xl inline-block">
                          {formatDeduction(emp.deductions)}
                        </p>
                      }
                    />
                  </div>

                  {/* Bonus */}
                  <div className="w-[12%]">
                    <EditCell
                      isEditing={isEditingBonus}
                      isSaving={isSavingBonus}
                      canEdit={canEdit}
                      editValue={editValue}
                      setEditValue={setEditValue}
                      onStart={() => startEdit(emp, 'bonus')}
                      onSave={() => handleSave(emp)}
                      onCancel={cancelEdit}
                      displayNode={
                        <p className="text-xs font-bold text-slate-600">{formatCurrency(emp.bonus)}</p>
                      }
                    />
                  </div>

                  {/* Net Pay (read-only) */}
                  <div className="w-[12%] text-center">
                    <p className="text-xs font-bold text-indigo-600">{formatCurrency(emp.netPay)}</p>
                  </div>

                  {/* Status + Pay button */}
                  <div className="w-[21%] flex justify-end items-center gap-2">
                    {canEdit && (
                      <button
                        onClick={() => openEditModal(emp)}
                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 transition-all shadow-sm border border-slate-100"
                        title="Edit Row"
                      >
                        <Pencil size={14} />
                      </button>
                    )}
                    {emp.status === 'Pending' && payrollId && (
                      <button
                        onClick={() => handlePay(emp)}
                        disabled={isPaying}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 text-white text-[9px] font-bold tracking-wider rounded-xl transition-colors shadow-sm shadow-indigo-500/30"
                      >
                        {isPaying ? <Loader2 size={10} className="animate-spin" /> : <Wallet size={10} />}
                        {isPaying ? 'Paying…' : 'Pay'}
                      </button>
                    )}
                    <span className={`px-3 py-1.5 rounded-full text-[9px] font-bold tracking-widest uppercase inline-flex items-center gap-1.5 ${
                      emp.status === 'Paid'    ? 'bg-emerald-50 text-emerald-600' :
                      emp.status === 'Pending' ? 'bg-amber-50  text-amber-600'   :
                                                 'bg-red-50    text-red-600'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        emp.status === 'Paid'    ? 'bg-emerald-500' :
                        emp.status === 'Pending' ? 'bg-amber-500'   :
                                                   'bg-red-500'
                      }`} />
                      {emp.status}
                    </span>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Bottom Summary + Process Button ── */}
      <motion.div
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }}
        className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-10"
      >
        <div className="bg-white rounded-[2rem] shadow-sm p-2 flex flex-wrap sm:flex-nowrap items-center w-full lg:w-auto">
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
            <><Loader2 size={18} className="animate-spin" /> Processing...</>
          ) : (
            <><Wallet size={18} /> Process Monthly Payroll <ArrowRight size={18} /></>
          )}
        </button>
      </motion.div>
        </>
      ) : (
        /* ── History View ── */
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800 font-outfit">Payroll History</h3>
            <p className="text-xs text-slate-400">Past {payrollHistory.length} cycles recorded</p>
          </div>

          {payrollHistory.length === 0 ? (
            <div className="bg-white rounded-[2rem] p-20 text-center shadow-sm border border-slate-100">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                <FileBarChart size={32} />
              </div>
              <p className="text-slate-500 font-medium">No payroll history found.</p>
              <p className="text-xs text-slate-400 mt-1">Start by processing your first payroll cycle.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {payrollHistory.map((item, idx) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between group hover:border-indigo-200 transition-all cursor-pointer"
                  onClick={() => {
                    // Logic to load this payroll would go here
                    // For now we just show the summary
                  }}
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold text-xs uppercase tracking-tighter">
                      {item.month.substring(0, 3)}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-800">{item.month}</h4>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{item.employeeCount} Employees Paid</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-12">
                    <div className="text-right">
                      <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold mb-1">Gross Total</p>
                      <p className="text-sm font-bold text-slate-700">{formatCurrency(item.totalSalary)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold mb-1">Disbursed</p>
                      <p className="text-sm font-bold text-indigo-600">{formatCurrency(item.netPayroll)}</p>
                    </div>
                    <div className="bg-slate-50 px-4 py-2 rounded-xl text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      {item.status}
                    </div>
                    <div className="text-slate-300 group-hover:text-indigo-400 transition-colors">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Bottom Cards ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }}
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

        <motion.div
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.9 }}
          className="bg-indigo-600 rounded-3xl p-8 shadow-lg shadow-indigo-600/30 text-white flex flex-col justify-between"
        >
          <div>
            <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-2">Next Pay Cycle</p>
            <h3 className="text-4xl font-bold font-outfit mb-8">{formatDate(data.nextPayCycle)}</h3>
          </div>
          <button className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-6 py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition-colors">
            Every Month
          </button>
        </motion.div>
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
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${editingEmployee.avatar || editingEmployee._id}`}
                      className="w-12 h-12 rounded-2xl bg-slate-100"
                      alt=""
                    />
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 font-outfit">Edit Payroll</h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{editingEmployee.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={closeEditModal}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSaveFields} className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Base Salary</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</div>
                      <input
                        type="number"
                        step="0.01"
                        value={modalValues.baseSalary}
                        onChange={(e) => setModalValues({ ...modalValues, baseSalary: e.target.value })}
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-8 pr-4 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Bonus</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</div>
                        <input
                          type="number"
                          step="0.01"
                          value={modalValues.bonus}
                          onChange={(e) => setModalValues({ ...modalValues, bonus: e.target.value })}
                          className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-8 pr-4 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1 text-red-400">Deductions</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-red-300 font-bold text-sm">$</div>
                        <input
                          type="number"
                          step="0.01"
                          value={modalValues.deductions}
                          onChange={(e) => setModalValues({ ...modalValues, deductions: e.target.value })}
                          className="w-full bg-red-50/30 border-none rounded-2xl py-4 pl-8 pr-4 text-sm font-bold text-red-600 focus:ring-2 focus:ring-red-500/10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={closeEditModal}
                      className="flex-1 py-4 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isModalSaving}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-4 rounded-2xl text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                    >
                      {isModalSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                      {isModalSaving ? 'Saving...' : 'Save Changes'}
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
