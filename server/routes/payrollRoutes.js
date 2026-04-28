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
router.get('/filter', auth, payrollController.getPayrollByMonth);

// @route   GET /api/payroll/history
// @desc    Get all historical payroll records
// @access  Private
router.get('/history', auth, payrollController.getPayrollHistory);

// @route   PUT /api/payroll/:payrollId/employee/:employeeId/deduction
// @desc    Update deduction of a specific employee and recalculate totals
// @access  Private
router.put('/:payrollId/employee/:employeeId/deduction', auth, payrollController.updateEmployeeDeduction);

// @route   PUT /api/payroll/:payrollId/employee/:employeeId/bonus
// @desc    Update bonus of a specific employee and recalculate totals
// @access  Private
router.put('/:payrollId/employee/:employeeId/bonus', auth, payrollController.updateEmployeeBonus);

// @route   PUT /api/payroll/:payrollId/employee/:employeeId/salary
// @desc    Update base salary of a specific employee and recalculate totals
// @access  Private
router.put('/:payrollId/employee/:employeeId/salary', auth, payrollController.updateEmployeeBaseSalary);

// @route   PUT /api/payroll/:payrollId/employee/:employeeId
// @desc    Update payment status of a specific employee
// @access  Private
router.put('/:payrollId/employee/:employeeId', auth, payrollController.updateEmployeePayrollStatus);

// @route   PUT /api/payroll/:payrollId/employee/:employeeId/fields
// @desc    Update multiple fields (salary, bonus, deductions) and recalculate totals
// @access  Private
router.put('/:payrollId/employee/:employeeId/fields', auth, payrollController.updateEmployeePayrollFields);

module.exports = router;
