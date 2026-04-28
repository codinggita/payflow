const Payroll = require('../models/Payroll');
const Employee = require('../models/Employee');

// POST /api/payroll/process
exports.processPayroll = async (req, res) => {
  try {
    const { taxPercent: globalTaxPercent = 10, month, year } = req.body || {};

    // Fetch all active employees
    const employees = await Employee.find({});

    if (!employees || employees.length === 0) {
      return res.status(400).json({ msg: 'No employees found to process payroll.' });
    }

    let totalSalary = 0;
    let totalDeductions = 0;
    let totalBonus = 0;

    const currentDate = new Date();
    const currentMonth = month || currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });
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

    const payroll = new Payroll({
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

    await payroll.save();
    res.status(201).json(payroll);
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
    const { status } = req.body;
    const { payrollId, employeeId } = req.params;

    if (!['Paid', 'Pending', 'Error'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status value' });
    }

    const payroll = await Payroll.findById(payrollId);
    
    if (!payroll) {
      return res.status(404).json({ msg: 'Payroll not found' });
    }

    // Find the employee in the snapshots array
    const employeeIndex = payroll.employees.findIndex(
      emp => emp.employeeId.toString() === employeeId
    );

    if (employeeIndex === -1) {
      return res.status(404).json({ msg: 'Employee not found in this payroll cycle' });
    }

    // Update status
    payroll.employees[employeeIndex].status = status;
    
    await payroll.save();

    res.json(payroll);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
