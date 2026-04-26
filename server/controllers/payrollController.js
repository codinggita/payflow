const Payroll = require('../models/Payroll');
const Employee = require('../models/Employee');

// POST /api/payroll/process
exports.processPayroll = async (req, res) => {
  try {
    const { taxPercent = 10, month, year } = req.body;

    // Fetch all employees
    const employees = await Employee.find({});

    if (!employees || employees.length === 0) {
      return res.status(400).json({ msg: 'No employees found to process payroll.' });
    }

    let totalSalary = 0;
    let totalDeductions = 0;
    let totalBonus = 0;
    
    // Default to current month/year if not provided
    const currentDate = new Date();
    const currentMonth = month || currentDate.toLocaleString('default', { month: 'long' }) + ' ' + currentDate.getFullYear();
    const currentYear = year || currentDate.getFullYear();

    // Map employees to snapshot schema and calculate values
    const employeeSnapshots = employees.map(emp => {
      // Calculate deductions
      const deductions = (emp.baseSalary * taxPercent) / 100;
      const bonus = 0; // Default bonus
      const netPay = emp.baseSalary - deductions + bonus;

      // Add to totals
      totalSalary += emp.baseSalary;
      totalDeductions += deductions;
      totalBonus += bonus;

      return {
        employeeId: emp._id,
        name: emp.name,
        role: emp.role,
        avatar: emp.avatar,
        baseSalary: emp.baseSalary,
        deductions: deductions,
        bonus: bonus,
        netPay: netPay,
        status: 'Pending'
      };
    });

    const netPayroll = totalSalary - totalDeductions + totalBonus;

    // Calculate next pay cycle (15th of next month)
    let nextMonth = currentDate.getMonth() + 1;
    let nextYear = currentDate.getFullYear();
    if (nextMonth > 11) {
      nextMonth = 0;
      nextYear++;
    }
    const nextPayCycle = new Date(nextYear, nextMonth, 15);

    // Create the Payroll document
    const payroll = new Payroll({
      month: currentMonth,
      year: currentYear,
      cycleDate: currentDate,
      totalSalary,
      totalDeductions,
      totalBonus,
      netPayroll,
      estimatedOutflow: netPayroll,
      status: 'Processing',
      employees: employeeSnapshots,
      nextPayCycle,
      complianceStatus: 'Standard Regional Policy Applied'
    });

    await payroll.save();

    res.status(201).json(payroll);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
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
