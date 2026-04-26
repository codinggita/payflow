const mongoose = require('mongoose');

const employeeSnapshotSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  baseSalary: {
    type: Number,
    required: true
  },
  deductions: {
    type: Number,
    default: 0
  },
  bonus: {
    type: Number,
    default: 0
  },
  netPay: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Paid', 'Pending', 'Error'],
    default: 'Pending'
  }
});

const payrollSchema = new mongoose.Schema({
  month: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  cycleDate: {
    type: Date,
    required: true
  },
  totalSalary: {
    type: Number,
    default: 0
  },
  totalDeductions: {
    type: Number,
    default: 0
  },
  totalBonus: {
    type: Number,
    default: 0
  },
  netPayroll: {
    type: Number,
    default: 0
  },
  estimatedOutflow: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Draft', 'Processing', 'Completed'],
    default: 'Draft'
  },
  employees: [employeeSnapshotSchema],
  nextPayCycle: {
    type: Date
  },
  complianceStatus: {
    type: String,
    default: "Standard Regional Policy Applied"
  }
}, { timestamps: true });

module.exports = mongoose.model('Payroll', payrollSchema);
