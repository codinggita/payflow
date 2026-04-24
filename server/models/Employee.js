const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  avatar: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    required: true,
    trim: true,
  },
  department: {
    type: String,
    required: true,
    enum: ['Engineering', 'Marketing', 'Operations', 'Design Ops', 'Finance', 'HR'],
    trim: true,
  },
  baseSalary: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['Active', 'Onboarding', 'Leave', 'Pending', 'Terminated'],
    default: 'Active',
  },
  joiningDate: {
    type: Date,
    default: Date.now,
  },
  taxPercent: {
    type: Number,
    default: 20,
    min: 0,
    max: 100,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Employee', EmployeeSchema);
