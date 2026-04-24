const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const Activity = require('../models/Activity');
const auth = require('../middleware/auth');

// @route   GET /api/employees
// @desc    Get all employees (with pagination, search, filter)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, department, status, sort } = req.query;

    const query = {};

    // Search by name, email, or role
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by department
    if (department) {
      query.department = department;
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Sort options
    let sortOption = { createdAt: -1 }; // default: newest first
    if (sort === 'name_asc') sortOption = { name: 1 };
    if (sort === 'name_desc') sortOption = { name: -1 };
    if (sort === 'salary_asc') sortOption = { baseSalary: 1 };
    if (sort === 'salary_desc') sortOption = { baseSalary: -1 };
    if (sort === 'date_asc') sortOption = { joiningDate: 1 };
    if (sort === 'date_desc') sortOption = { joiningDate: -1 };

    const total = await Employee.countDocuments(query);
    const employees = await Employee.find(query)
      .sort(sortOption)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json({
      employees,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      totalEmployees: total,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/employees/:id
// @desc    Get single employee by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ msg: 'Employee not found' });
    }
    res.json(employee);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Employee not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/employees
// @desc    Create a new employee
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { name, email, avatar, role, department, baseSalary, status, joiningDate, taxPercent } = req.body;

    // Check if employee with this email already exists
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ msg: 'Employee with this email already exists' });
    }

    const employee = new Employee({
      name,
      email,
      avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      role,
      department,
      baseSalary,
      status: status || 'Active',
      joiningDate: joiningDate || Date.now(),
      taxPercent: taxPercent || 20,
    });

    await employee.save();

    // Log activity
    await new Activity({
      employeeId: employee._id,
      action: 'New Hire Added',
      description: `${name} joined as ${role}`,
      status: 'Completed',
    }).save();

    res.status(201).json(employee);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT /api/employees/:id
// @desc    Update an employee
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ msg: 'Employee not found' });
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    // Log activity
    await new Activity({
      employeeId: updatedEmployee._id,
      action: 'Employee Updated',
      description: `${updatedEmployee.name}'s profile was updated`,
      status: 'Completed',
    }).save();

    res.json(updatedEmployee);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Employee not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   DELETE /api/employees/:id
// @desc    Delete an employee
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ msg: 'Employee not found' });
    }

    // Log activity before deleting
    await new Activity({
      employeeId: employee._id,
      action: 'Employee Removed',
      description: `${employee.name} was removed from the system`,
      status: 'Completed',
    }).save();

    await Employee.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Employee removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Employee not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
