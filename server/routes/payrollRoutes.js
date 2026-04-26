const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payrollController');
const auth = require('../middleware/auth');

// @route   POST /api/payroll/process
// @desc    Process a new payroll cycle
// @access  Private
router.post('/process', auth, payrollController.processPayroll);

// @route   GET /api/payroll/current
// @desc    Get the latest payroll data
// @access  Private
router.get('/current', auth, payrollController.getCurrentPayroll);

// @route   GET /api/payroll/history
// @desc    Get all historical payroll records
// @access  Private
router.get('/history', auth, payrollController.getPayrollHistory);

// @route   PUT /api/payroll/:payrollId/employee/:employeeId
// @desc    Update payment status of a specific employee
// @access  Private
router.put('/:payrollId/employee/:employeeId', auth, payrollController.updateEmployeePayrollStatus);

module.exports = router;
