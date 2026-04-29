const Employee = require('../models/Employee');
const Payroll = require('../models/Payroll');

// GET /api/dashboard/stats
exports.getDashboardStats = async (req, res) => {
  try {
    const { month, year } = req.query;
    
    // Fetch all employees for master stats
    const allEmployees = await Employee.find({});
    const totalEmployees = allEmployees.length;
    const activeCount = allEmployees.filter(e => e.status === 'Active').length;
    const onboardingCount = allEmployees.filter(e => e.status === 'Onboarding').length;
    const pendingPayments = onboardingCount;
    
    let totalPayroll = 0;
    let taxOverview = 0;
    let netPayroll = 0;
    let activeInPayroll = 0;
    
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const colors = {
      'ENGINEERING': '#4f46e5',
      'MARKETING': '#818cf8',
      'OPERATIONS': '#e0e7ff',
      'DESIGN OPS': '#a5b4fc'
    };

    // Try to find processed payroll for the selected month/year
    let payrollRecord = null;
    if (month && year) {
      payrollRecord = await Payroll.findOne({ month, year: parseInt(year) });
    } else {
      // Default to latest processed payroll
      payrollRecord = await Payroll.findOne().sort({ createdAt: -1 });
    }

    if (payrollRecord) {
      // Use processed data as per PRD
      totalPayroll = payrollRecord.totalSalary;
      taxOverview = payrollRecord.totalDeductions;
      netPayroll = payrollRecord.netPayroll;
      activeInPayroll = payrollRecord.employees.length;
    } else {
      // Fallback to projected master data if not processed yet
      allEmployees.forEach(emp => {
        if (emp.status === 'Active') {
          const salary = emp.baseSalary || 0;
          totalPayroll += salary;
          const empTaxRate = emp.taxPercent != null ? emp.taxPercent : 10;
          taxOverview += (salary * empTaxRate) / 100;
          activeInPayroll++;
        }
      });
      netPayroll = totalPayroll - taxOverview;
    }

    const avgSalary = totalEmployees > 0 ? Math.round(totalPayroll / totalEmployees) : 0;
    const retentionRate = totalEmployees > 0 ? Math.round((activeCount / totalEmployees) * 100) : 100;

    // Department Split (Always from current master for headcount widgets)
    const departmentCounts = {};
    allEmployees.forEach(emp => {
      if (emp.department) {
        const deptUpper = emp.department.toUpperCase();
        departmentCounts[deptUpper] = (departmentCounts[deptUpper] || 0) + 1;
      }
    });

    const departmentSplit = Object.keys(departmentCounts).map(key => ({
      name: key,
      value: totalEmployees > 0 ? Math.round((departmentCounts[key] / totalEmployees) * 100) : 0,
      color: colors[key] || '#cbd5e1'
    })).filter(dept => dept.value > 0);

    // Expense breakdown
    const expenseBreakdown = [
      { name: 'Salaries', value: netPayroll, color: '#6366f1' },
      { name: 'Taxes', value: taxOverview, color: '#818cf8' },
      { name: 'Benefits', value: totalPayroll * 0.05, color: '#c7d2fe' },
    ];

    // Trends (From historical payroll records)
    const last6Payrolls = await Payroll.find().sort({ createdAt: -1 }).limit(6);
    const payrollTrends = last6Payrolls.map(p => ({
      name: p.month.substring(0, 3).toUpperCase(),
      value: p.totalSalary
    })).reverse();

    // If no trends found, use projected current
    if (payrollTrends.length === 0) {
      const currentMonthStr = monthNames[new Date().getMonth()].substring(0, 3).toUpperCase();
      payrollTrends.push({ name: currentMonthStr, value: totalPayroll });
    }

    // Recent activity (Last 5 employees from Master)
    const recentActivityRaw = await Employee.find().sort({ createdAt: -1 }).limit(5);
    const recentActivity = recentActivityRaw.map(emp => {
      let action = 'New Hire Added';
      let cycle = 'Onboarding Process';
      let status = 'PROCESSING';
      
      if (emp.status === 'Active') {
        action = 'Profile Verified';
        cycle = 'Added to Payroll';
        status = 'COMPLETED';
      } else if (emp.status === 'Leave') {
        action = 'Status Updated';
        cycle = 'Leave of Absence';
        status = 'PAUSED';
      }

      const timeDiff = new Date() - new Date(emp.createdAt);
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      let timeStr = hours < 1 ? 'JUST NOW' : `${hours} HOURS AGO`;
      if (hours > 24) timeStr = `${Math.floor(hours/24)} DAYS AGO`;

      return {
        id: emp._id,
        name: emp.name,
        role: emp.role,
        action,
        cycle,
        status,
        time: timeStr,
        avatar: emp.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.name}`
      };
    });

    res.status(200).json({
      totalPayroll,
      totalEmployees,
      pendingPayments,
      taxOverview,
      avgSalary,
      retentionRate,
      onboardingCount,
      activeCount,
      activeInPayroll,
      expenseBreakdown,
      growth: 0,
      departmentSplit,
      payrollTrends,
      recentActivity,
      isProcessed: !!payrollRecord
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
