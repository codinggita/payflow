const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  action: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['Completed', 'Processing', 'Failed'],
    default: 'Completed',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Activity', ActivitySchema);
