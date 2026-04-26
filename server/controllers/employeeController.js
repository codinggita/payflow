const Employee = require('../models/Employee');

// GET /api/employees
exports.getAllEmployees = async (req, res) => {
  try {
    const { search, department, status, page = 1, limit = 10 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (department) query.department = department;
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const employees = await Employee.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
    
    // Return total count for pagination
    const total = await Employee.countDocuments(query);

    res.status(200).json({
      employees,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalEmployees: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/employees/:id
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/employees
exports.createEmployee = async (req, res) => {
  try {
    const { name, email, role, baseSalary } = req.body;
    
    // Validate required
    if (!name || !email || !role || !baseSalary) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check duplicate email
    const duplicate = await Employee.findOne({ email });
    if (duplicate) return res.status(400).json({ message: 'Email already exists' });

    const newEmployee = new Employee(req.body);
    const savedEmployee = await newEmployee.save();
    
    res.status(201).json(savedEmployee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/employees/:id
exports.updateEmployee = async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!updatedEmployee) return res.status(404).json({ message: 'Employee not found' });
    
    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/employees/:id
exports.deleteEmployee = async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) return res.status(404).json({ message: 'Employee not found' });
    
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/employees/stats
exports.getEmployeeStats = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const activeEmployees = await Employee.countDocuments({ status: 'Active' });
    const onboardingEmployees = await Employee.countDocuments({ status: 'Onboarding' });
    
    const employees = await Employee.find({});
    
    const totalPayroll = employees.reduce((acc, emp) => acc + (emp.baseSalary || 0), 0);
    
    const departmentCounts = {};
    employees.forEach(emp => {
      if (emp.department) {
        departmentCounts[emp.department] = (departmentCounts[emp.department] || 0) + 1;
      }
    });

    const departmentSplit = {};
    for (const [dept, count] of Object.entries(departmentCounts)) {
      departmentSplit[dept] = totalEmployees > 0 ? ((count / totalEmployees) * 100).toFixed(2) : 0;
    }

    res.status(200).json({
      totalEmployees,
      activeEmployees,
      onboardingEmployees,
      totalPayroll,
      departmentSplit
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
