const Payroll = require('../models/Payroll');
const Employee = require('../models/Employee');

// POST /api/payroll/process
exports.processPayroll = async (req, res) => {
  try {
    const { taxPercent: globalTaxPercent = 10, month, year } = req.body || {};

    // Fetch only active employees for payroll processing
    const employees = await Employee.find({ status: 'Active' });

    if (!employees || employees.length === 0) {
      return res.status(400).json({ msg: 'No employees found to process payroll.' });
    }

    let totalSalary = 0;
    let totalDeductions = 0;
    let totalBonus = 0;

    const currentDate = new Date();
    const currentMonth = month || currentDate.toLocaleString('en-US', { month: 'long' });
    const currentYear = year || currentDate.getFullYear();

    // Map employees using their individual taxPercent
    const employeeSnapshots = employees.map(emp => {
      const rate = (emp.taxPercent != null ? emp.taxPercent : globalTaxPercent);
      const deductions = parseFloat(((emp.baseSalary * rate) / 100).toFixed(2));
      const bonus = 0;
      const netPay = parseFloat((emp.baseSalary - deductions + bonus).toFixed(2));

      totalSalary    += emp.baseSalary;
      totalDeductions += deductions;
      totalBonus     += bonus;

      return {
        employeeId: emp._id,
        name:       emp.name,
        role:       emp.role,
        avatar:     emp.avatar || '',
        baseSalary: emp.baseSalary,
        deductions,
        bonus,
        netPay,
        status: 'Pending'
      };
    });

    const netPayroll = parseFloat((totalSalary - totalDeductions + totalBonus).toFixed(2));

    // Next pay cycle → 15th of next month
    const nextPayCycle = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      15
    );

    // Check if payroll for this month already exists
    let payroll = await Payroll.findOne({ month: currentMonth, year: currentYear });

    if (payroll) {
      // Update existing record
      payroll.totalSalary = parseFloat(totalSalary.toFixed(2));
      payroll.totalDeductions = parseFloat(totalDeductions.toFixed(2));
      payroll.totalBonus = parseFloat(totalBonus.toFixed(2));
      payroll.netPayroll = netPayroll;
      payroll.estimatedOutflow = netPayroll;
      payroll.employees = employeeSnapshots;
      payroll.nextPayCycle = nextPayCycle;
      payroll.status = 'Completed'; // Ensure it's marked as completed
    } else {
      // Create new record
      payroll = new Payroll({
        month:           currentMonth,
        year:            currentYear,
        cycleDate:       currentDate,
        totalSalary:     parseFloat(totalSalary.toFixed(2)),
        totalDeductions: parseFloat(totalDeductions.toFixed(2)),
        totalBonus:      parseFloat(totalBonus.toFixed(2)),
        netPayroll,
        estimatedOutflow: netPayroll,
        status:          'Completed',
        employees:       employeeSnapshots,
        nextPayCycle,
        complianceStatus: 'Standard Regional Policy Applied'
      });
    }

    await payroll.save();
    res.status(payroll.isNew ? 201 : 200).json(payroll);
  } catch (err) {
    console.error('processPayroll error:', err.message);
    res.status(500).json({ msg: 'Server error while processing payroll' });
  }
};


// GET /api/payroll/current
exports.getCurrentPayroll = async (req, res) => {
  try {
    const latestPayroll = await Payroll.findOne().sort({ createdAt: -1 });
    
    if (!latestPayroll) {
      return res.status(404).json({ msg: 'No payroll records found.' });
    }

    res.json(latestPayroll);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// GET /api/payroll/filter?month=May&year=2026
exports.getPayrollByMonth = async (req, res) => {
  try {
    const { month, year } = req.query;
    
    if (!month || !year) {
      return res.status(400).json({ msg: 'Month and Year are required' });
    }

    const payroll = await Payroll.findOne({ month, year: parseInt(year) });
    
    if (!payroll) {
      return res.status(404).json({ msg: 'No payroll records found for this month.' });
    }

    res.json(payroll);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// GET /api/payroll/history
exports.getPayrollHistory = async (req, res) => {
  try {
    const history = await Payroll.find()
      .sort({ createdAt: -1 })
      .select('month year totalSalary netPayroll status employees createdAt');
    
    // Map to include employeeCount
    const mappedHistory = history.map(record => ({
      _id: record._id,
      month: record.month,
      year: record.year,
      totalSalary: record.totalSalary,
      netPayroll: record.netPayroll,
      status: record.status,
      employeeCount: record.employees.length,
      createdAt: record.createdAt
    }));

    res.json(mappedHistory);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// PUT /api/payroll/:payrollId/employee/:employeeId
exports.updateEmployeePayrollStatus = async (req, res) => {
  try {
    const { status } = req.body || {};
    const { payrollId, employeeId } = req.params;

    if (!['Paid', 'Pending', 'Error'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status value' });
    }

    const payroll = await Payroll.findById(payrollId);
    if (!payroll) return res.status(404).json({ msg: 'Payroll not found' });

    const empIndex = payroll.employees.findIndex(
      emp => emp.employeeId.toString() === employeeId
    );
    if (empIndex === -1) return res.status(404).json({ msg: 'Employee not found in this payroll cycle' });

    payroll.employees[empIndex].status = status;
    await payroll.save();
    res.json(payroll);
  } catch (err) {
    console.error('updateEmployeePayrollStatus error:', err.message);
    res.status(500).json({ msg: 'Server error while updating status' });
  }
};

// PUT /api/payroll/:payrollId/employee/:employeeId/deduction
exports.updateEmployeeDeduction = async (req, res) => {
  try {
    const { deductions } = req.body || {};
    const { payrollId, employeeId } = req.params;

    const newDeduction = parseFloat(parseFloat(deductions).toFixed(2));
    if (isNaN(newDeduction) || newDeduction < 0) {
      return res.status(400).json({ msg: 'Invalid deduction value' });
    }

    const payroll = await Payroll.findById(payrollId);
    if (!payroll) return res.status(404).json({ msg: 'Payroll not found' });

    const empIndex = payroll.employees.findIndex(
      emp => emp.employeeId.toString() === employeeId
    );
    if (empIndex === -1) return res.status(404).json({ msg: 'Employee not found in this payroll cycle' });

    const emp = payroll.employees[empIndex];
    const oldDeduction = emp.deductions;

    // Update employee snapshot
    emp.deductions = newDeduction;
    emp.netPay = parseFloat((emp.baseSalary - newDeduction + emp.bonus).toFixed(2));

    // Recalculate payroll-level totals
    payroll.totalDeductions = parseFloat((payroll.totalDeductions - oldDeduction + newDeduction).toFixed(2));
    payroll.netPayroll      = parseFloat((payroll.totalSalary - payroll.totalDeductions + payroll.totalBonus).toFixed(2));
    payroll.estimatedOutflow = payroll.netPayroll;

    await payroll.save();
    res.json(payroll);
  } catch (err) {
    console.error('updateEmployeeDeduction error:', err.message);
    res.status(500).json({ msg: 'Server error while updating deduction' });
  }
};

// PUT /api/payroll/:payrollId/employee/:employeeId/bonus
exports.updateEmployeeBonus = async (req, res) => {
  try {
    const { bonus } = req.body || {};
    const { payrollId, employeeId } = req.params;

    const newBonus = parseFloat(parseFloat(bonus).toFixed(2));
    if (isNaN(newBonus) || newBonus < 0) {
      return res.status(400).json({ msg: 'Invalid bonus value' });
    }

    const payroll = await Payroll.findById(payrollId);
    if (!payroll) return res.status(404).json({ msg: 'Payroll not found' });

    const empIndex = payroll.employees.findIndex(
      emp => emp.employeeId.toString() === employeeId
    );
    if (empIndex === -1) return res.status(404).json({ msg: 'Employee not found in this payroll cycle' });

    const emp = payroll.employees[empIndex];
    const oldBonus = emp.bonus;

    emp.bonus  = newBonus;
    emp.netPay = parseFloat((emp.baseSalary - emp.deductions + newBonus).toFixed(2));

    payroll.totalBonus = parseFloat((payroll.totalBonus - oldBonus + newBonus).toFixed(2));
    payroll.netPayroll = parseFloat((payroll.totalSalary - payroll.totalDeductions + payroll.totalBonus).toFixed(2));
    payroll.estimatedOutflow = payroll.netPayroll;

    await payroll.save();
    res.json(payroll);
  } catch (err) {
    console.error('updateEmployeeBonus error:', err.message);
    res.status(500).json({ msg: 'Server error while updating bonus' });
  }
};

// PUT /api/payroll/:payrollId/employee/:employeeId/salary
exports.updateEmployeeBaseSalary = async (req, res) => {
  try {
    const { baseSalary } = req.body || {};
    const { payrollId, employeeId } = req.params;

    const newSalary = parseFloat(parseFloat(baseSalary).toFixed(2));
    if (isNaN(newSalary) || newSalary < 0) {
      return res.status(400).json({ msg: 'Invalid salary value' });
    }

    const payroll = await Payroll.findById(payrollId);
    if (!payroll) return res.status(404).json({ msg: 'Payroll not found' });

    const empIndex = payroll.employees.findIndex(
      emp => emp.employeeId.toString() === employeeId
    );
    if (empIndex === -1) return res.status(404).json({ msg: 'Employee not found in this payroll cycle' });

    const emp = payroll.employees[empIndex];
    const oldSalary = emp.baseSalary;

    emp.baseSalary = newSalary;
    emp.netPay     = parseFloat((newSalary - emp.deductions + emp.bonus).toFixed(2));

    payroll.totalSalary = parseFloat((payroll.totalSalary - oldSalary + newSalary).toFixed(2));
    payroll.netPayroll  = parseFloat((payroll.totalSalary - payroll.totalDeductions + payroll.totalBonus).toFixed(2));
    payroll.estimatedOutflow = payroll.netPayroll;

    await payroll.save();
    res.json(payroll);
  } catch (err) {
    console.error('updateEmployeeBaseSalary error:', err.message);
    res.status(500).json({ msg: 'Server error while updating salary' });
  }
};
// PUT /api/payroll/:payrollId/employee/:employeeId/fields
exports.updateEmployeePayrollFields = async (req, res) => {
  try {
    const { baseSalary, deductions, bonus } = req.body || {};
    const { payrollId, employeeId } = req.params;

    const payroll = await Payroll.findById(payrollId);
    if (!payroll) return res.status(404).json({ msg: 'Payroll not found' });

    const empIndex = payroll.employees.findIndex(
      emp => emp.employeeId.toString() === employeeId
    );
    if (empIndex === -1) return res.status(404).json({ msg: 'Employee not found in this payroll cycle' });

    const emp = payroll.employees[empIndex];
    
    // Track changes for totals
    const oldSalary = emp.baseSalary;
    const oldDeduction = emp.deductions;
    const oldBonus = emp.bonus;

    if (baseSalary !== undefined) emp.baseSalary = parseFloat(parseFloat(baseSalary).toFixed(2));
    if (deductions !== undefined) emp.deductions = parseFloat(parseFloat(deductions).toFixed(2));
    if (bonus !== undefined) emp.bonus = parseFloat(parseFloat(bonus).toFixed(2));

    emp.netPay = parseFloat((emp.baseSalary - emp.deductions + emp.bonus).toFixed(2));

    // Update totals
    payroll.totalSalary = parseFloat((payroll.totalSalary - oldSalary + emp.baseSalary).toFixed(2));
    payroll.totalDeductions = parseFloat((payroll.totalDeductions - oldDeduction + emp.deductions).toFixed(2));
    payroll.totalBonus = parseFloat((payroll.totalBonus - oldBonus + emp.bonus).toFixed(2));
    payroll.netPayroll = parseFloat((payroll.totalSalary - payroll.totalDeductions + payroll.totalBonus).toFixed(2));
    payroll.estimatedOutflow = payroll.netPayroll;

    await payroll.save();
    res.json(payroll);
  } catch (err) {
    console.error('updateEmployeePayrollFields error:', err.message);
    res.status(500).json({ msg: 'Server error while updating payroll fields' });
  }
};
