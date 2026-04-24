const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const Activity = require('../models/Activity');
const auth = require('../middleware/auth');

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const employees = await Employee.find();
    const totalEmployees = employees.length;

    // Total Payroll (sum of all base salaries)
    const totalPayroll = employees.reduce((sum, emp) => sum + emp.baseSalary, 0);

    // Pending Payments (employees with 'Pending' or 'Onboarding' status)
    const pendingPayments = employees.filter(
      (emp) => emp.status === 'Pending' || emp.status === 'Onboarding'
    ).length;

    // Tax Overview (total tax amount across all employees)
    const taxOverview = employees.reduce(
      (sum, emp) => sum + (emp.baseSalary * emp.taxPercent) / 100,
      0
    );

    // Growth percentage (simulated — compare current month headcount vs previous)
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthCount = employees.filter(
      (emp) => new Date(emp.joiningDate) < oneMonthAgo
    ).length;
    const growth = previousMonthCount > 0
      ? (((totalEmployees - previousMonthCount) / previousMonthCount) * 100).toFixed(1)
      : 0;

    // Department Split
    const departments = {};
    employees.forEach((emp) => {
      departments[emp.department] = (departments[emp.department] || 0) + 1;
    });
    const departmentSplit = Object.entries(departments).map(([name, count]) => ({
      name: name.toUpperCase(),
      value: totalEmployees > 0 ? Math.round((count / totalEmployees) * 100) : 0,
      count,
    }));

    // Payroll Trends (last 6 months)
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const payrollTrends = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      // Employees active during that month (joined before month end)
      const activeEmps = employees.filter(
        (emp) => new Date(emp.joiningDate) <= monthEnd && emp.status !== 'Terminated'
      );
      const monthlyPayroll = activeEmps.reduce((sum, emp) => sum + emp.baseSalary / 12, 0);

      payrollTrends.push({
        name: months[date.getMonth()],
        value: Math.round(monthlyPayroll),
      });
    }

    // Recent Activity (last 5)
    const recentActivity = await Activity.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('employeeId', 'name role avatar');

    const formattedActivity = recentActivity.map((act) => {
      const timeDiff = Math.floor((Date.now() - new Date(act.createdAt)) / 60000);
      let timeStr;
      if (timeDiff < 1) timeStr = 'JUST NOW';
      else if (timeDiff < 60) timeStr = `${timeDiff} MINS AGO`;
      else if (timeDiff < 1440) timeStr = `${Math.floor(timeDiff / 60)} HOURS AGO`;
      else timeStr = `${Math.floor(timeDiff / 1440)} DAYS AGO`;

      return {
        id: act._id,
        name: act.employeeId?.name || 'Unknown',
        role: act.employeeId?.role || 'N/A',
        avatar: act.employeeId?.avatar || '',
        action: act.action,
        description: act.description,
        status: act.status.toUpperCase(),
        time: timeStr,
      };
    });

    res.json({
      totalPayroll,
      totalEmployees,
      pendingPayments,
      taxOverview: Math.round(taxOverview),
      growth: parseFloat(growth),
      departmentSplit,
      payrollTrends,
      recentActivity: formattedActivity,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
