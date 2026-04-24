const mongoose = require('mongoose');
require('dotenv').config();
const Employee = require('./models/Employee');
const Activity = require('./models/Activity');

const seedData = [
  {
    name: 'Elena Valerius',
    email: 'elena.v@atelier.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    role: 'Senior Brand Architect',
    department: 'Design Ops',
    baseSalary: 142500,
    status: 'Active',
    joiningDate: new Date('2024-03-15'),
    taxPercent: 22,
  },
  {
    name: 'Julian Thorne',
    email: 'j.thorne@atelier.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    role: 'Lead Frontend Engineer',
    department: 'Engineering',
    baseSalary: 168000,
    status: 'Onboarding',
    joiningDate: new Date('2026-04-01'),
    taxPercent: 25,
  },
  {
    name: 'Amara Okafor',
    email: 'a.okafor@atelier.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    role: 'Product Strategist',
    department: 'Operations',
    baseSalary: 135200,
    status: 'Active',
    joiningDate: new Date('2024-08-20'),
    taxPercent: 20,
  },
  {
    name: 'Marcus Hayes',
    email: 'm.hayes@atelier.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
    role: 'Visual Designer',
    department: 'Design Ops',
    baseSalary: 118000,
    status: 'Leave',
    joiningDate: new Date('2025-01-10'),
    taxPercent: 18,
  },
  {
    name: 'Sarah Jenkins',
    email: 's.jenkins@atelier.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=11',
    role: 'Product Designer',
    department: 'Design Ops',
    baseSalary: 125000,
    status: 'Active',
    joiningDate: new Date('2024-06-01'),
    taxPercent: 20,
  },
  {
    name: 'Michael Chen',
    email: 'm.chen@atelier.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=12',
    role: 'Full-Stack Engineer',
    department: 'Engineering',
    baseSalary: 155000,
    status: 'Active',
    joiningDate: new Date('2024-09-15'),
    taxPercent: 24,
  },
  {
    name: 'Priya Sharma',
    email: 'p.sharma@atelier.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
    role: 'Marketing Manager',
    department: 'Marketing',
    baseSalary: 130000,
    status: 'Active',
    joiningDate: new Date('2024-05-20'),
    taxPercent: 21,
  },
  {
    name: 'David Kim',
    email: 'd.kim@atelier.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6',
    role: 'DevOps Engineer',
    department: 'Engineering',
    baseSalary: 160000,
    status: 'Active',
    joiningDate: new Date('2024-02-01'),
    taxPercent: 25,
  },
  {
    name: 'Sophie Williams',
    email: 's.williams@atelier.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=7',
    role: 'Content Strategist',
    department: 'Marketing',
    baseSalary: 95000,
    status: 'Active',
    joiningDate: new Date('2025-03-10'),
    taxPercent: 18,
  },
  {
    name: 'Alex Rivera',
    email: 'a.rivera@atelier.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=8',
    role: 'Operations Analyst',
    department: 'Operations',
    baseSalary: 110000,
    status: 'Pending',
    joiningDate: new Date('2026-04-10'),
    taxPercent: 19,
  },
  {
    name: 'Lena Frost',
    email: 'l.frost@atelier.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=9',
    role: 'Backend Engineer',
    department: 'Engineering',
    baseSalary: 148000,
    status: 'Active',
    joiningDate: new Date('2024-11-05'),
    taxPercent: 23,
  },
  {
    name: 'Omar Farouk',
    email: 'o.farouk@atelier.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=10',
    role: 'Finance Controller',
    department: 'Finance',
    baseSalary: 140000,
    status: 'Active',
    joiningDate: new Date('2024-07-01'),
    taxPercent: 22,
  },
];

const seedActivities = async (employees) => {
  const activities = [
    {
      employeeId: employees[4]._id, // Sarah Jenkins
      action: 'Payslip Generated',
      description: 'August Cycle #PAY-8821',
      status: 'Completed',
      createdAt: new Date(Date.now() - 2 * 60 * 1000), // 2 mins ago
    },
    {
      employeeId: employees[5]._id, // Michael Chen
      action: 'New Hire Added',
      description: 'Onboarding Process 4/5',
      status: 'Processing',
      createdAt: new Date(Date.now() - 45 * 60 * 1000), // 45 mins ago
    },
    {
      employeeId: employees[0]._id, // Elena
      action: 'Salary Revised',
      description: 'Annual increment applied +8%',
      status: 'Completed',
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    },
    {
      employeeId: employees[7]._id, // David Kim
      action: 'Tax Filing Updated',
      description: 'Q3 tax documents submitted',
      status: 'Completed',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      employeeId: employees[3]._id, // Marcus Hayes
      action: 'Leave Approved',
      description: 'Personal leave — 5 days',
      status: 'Completed',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
  ];

  await Activity.insertMany(activities);
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await Employee.deleteMany({});
    await Activity.deleteMany({});
    console.log('Cleared existing employees and activities.');

    // Insert employees
    const employees = await Employee.insertMany(seedData);
    console.log(`Inserted ${employees.length} employees.`);

    // Insert activities
    await seedActivities(employees);
    console.log('Inserted seed activities.');

    console.log('Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err.message);
    process.exit(1);
  }
};

seed();
