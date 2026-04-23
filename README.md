# 💸 PayFlow
### Automate Salaries. Eliminate Errors. Simplify Payroll.

![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-007FFF?style=for-the-badge&logo=mui&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

---

## 📖 About the Project

**PayFlow** is a modern, full-stack payroll management system designed to simplify and automate salary processing for small teams and organizations. Many small businesses still rely on manual methods — spreadsheets, paper calculations, and disconnected tools — which lead to errors, inefficiencies, and a lack of transparency.

PayFlow replaces that chaos with a centralized, intelligent, and user-friendly platform. From onboarding employees to generating payslips, everything happens in one place with complete accuracy and zero manual effort.
https://payflow-drab.vercel.app/
---

## ❗ Problem Statement

Small teams and businesses face critical challenges in managing payroll:

| Challenge | Impact |
|---|---|
| Manual salary calculations | High risk of costly errors |
| No centralized employee data | Inconsistency across records |
| Time-consuming processes | Reduced team productivity |
| Tax & deduction confusion | Compliance risks |
| No payslip automation | Poor employee transparency |

> There is no simple, affordable, and automated payroll solution built specifically for small teams — **PayFlow solves exactly that.**

---

## 💡 Our Solution

PayFlow provides a unified payroll automation platform that delivers:

- ✅ **Automated salary calculation** with configurable deductions
- ✅ **Centralized employee management** replacing Excel sheets
- ✅ **Real-time payroll processing** with instant net pay calculation
- ✅ **Auto-generated payslips** with full earnings/deductions breakdown
- ✅ **Tax & PF configuration** with live salary preview
- ✅ **Analytics dashboard** for financial insights and trends

---

## ✨ Key Features

### 🔐 Authentication
- Google Sign-In via Firebase
- Role-based access (Admin / Employee)
- Secure JWT session management

### 🏠 Dashboard
- Monthly payroll expenditure overview
- Total employees & pending payments at a glance
- Payroll trend graph (6 months / 1 year)
- Department salary split (donut chart)
- Recent activity feed

### 👥 Employee Management
- Add & edit employee profiles with avatar upload
- Store role, department, base salary, joining date
- Status tracking: Active, Onboarding, Leave
- Search & filter by name, department, status
- Paginated employee directory

### 💰 Payroll Processing
- Automated salary calculation per employee
- Handles: base salary, bonus, tax, PF deductions
- Real-time net pay calculation
- Status tracking: Paid, Pending, Error
- One-click "Process Monthly Payroll"
- Compliance check with regulatory alerts

### 📄 Payslip Generator
- Auto-generated payslips per pay cycle
- Detailed earnings & deductions breakdown
- Net pay with payment destination info
- Download as PDF
- Print support

### ⚙️ Tax & Salary Configuration
- Configure performance bonus (fixed or percentage)
- Set income tax (%) with toggle enable/disable
- Set Provident Fund (PF %) 
- Other miscellaneous deductions
- **Live salary breakdown preview** in real-time
- Jurisdiction / country selector
- Compliance status indicator

### 📊 Reports & Analytics
- Total payroll, employees, avg salary, total deductions
- Payroll trend chart (monthly / quarterly)
- Expense breakdown (salaries, taxes, benefits)
- Filter by date range, department, paid status
- Recent payroll history table
- Export report to PDF

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | UI Framework |
| Tailwind CSS | Utility-first styling |
| Material UI (MUI) | Component library |
| React Router v6 | Client-side navigation |
| Redux Toolkit | Global state management |
| Recharts | Charts & data visualization |
| Formik + Yup | Form handling & validation |
| jsPDF | Payslip PDF generation |
| React Hot Toast | Notifications |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | REST API framework |
| MongoDB + Mongoose | Database |
| JWT | Authentication tokens |
| Bcrypt | Password hashing |
| Helmet | Security headers |

### Integrations
| Service | Purpose |
|---|---|
| Firebase / Google Auth | Social login |
| jsPDF | Payslip download |

---

## 📂 Project Structure

```
payflow/
├── client/                        # Frontend application
│   ├── public/
│   ├── src/
│   │   ├── assets/                # Images, icons, fonts
│   │   ├── components/
│   │   │   ├── common/            # Buttons, inputs, cards
│   │   │   ├── layout/            # Sidebar, Navbar, Footer
│   │   │   └── features/          # Feature-specific components
│   │   ├── pages/
│   │   │   ├── Auth/              # Login / Register
│   │   │   ├── Dashboard/         # Main dashboard
│   │   │   ├── Employees/         # Employee directory & forms
│   │   │   ├── Payroll/           # Payroll processing
│   │   │   ├── Payslip/           # Payslip generator
│   │   │   ├── Configuration/     # Tax & salary config
│   │   │   └── Reports/           # Analytics & reports
│   │   ├── redux/                 # Redux store & slices
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── services/              # API calls (axios)
│   │   ├── utils/                 # Helper functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                        # Backend application
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/               # Route logic
│   ├── middlewares/               # Auth, validation
│   ├── models/
│   │   ├── User.js
│   │   ├── Employee.js
│   │   ├── Payroll.js
│   │   └── Payslip.js
│   ├── routes/                    # API routes
│   ├── utils/                     # Helper functions
│   ├── .env.example
│   └── index.js
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Firebase project (for Google Auth)
- npm or yarn

### Clone the Repository
```bash
git clone https://github.com/vishvpatel210/payflow.git
cd payflow
```

### Backend Setup
```bash
cd server
npm install
npm run dev
```
Server runs on: `http://localhost:5000`

### Frontend Setup
```bash
cd client
npm install
npm run dev
```
Client runs on: `http://localhost:5173`

---

## 🔐 Environment Variables

### Server `.env`
```env
PORT=5000
MONGODB_URI=your_mongodb_url
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
```

### Client `.env`
```env
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
```

---

## 🚀 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| GET | `/api/employees` | List all employees |
| POST | `/api/employees` | Add new employee |
| PUT | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Remove employee |
| GET | `/api/payroll` | Get payroll records |
| POST | `/api/payroll/process` | Process monthly payroll |
| GET | `/api/payslip/:id` | Get payslip by ID |
| GET | `/api/config` | Get tax configuration |
| PUT | `/api/config` | Update tax/salary config |
| GET | `/api/reports` | Get analytics data |

---

## 🎨 UI/UX Design

PayFlow follows a clean **modern SaaS design** with an indigo/purple color theme.

| Element | Value |
|---|---|
| Primary Color | `#4F46E5` (Indigo) |
| Background | `#F8FAFC` (Light) |
| Sidebar | `#FFFFFF` with shadow |
| Text Primary | `#111827` |
| Text Secondary | `#6B7280` |
| Success | `#10B981` (Green) |
| Warning | `#F59E0B` (Amber) |
| Error | `#EF4444` (Red) |

---

## 🚀 Roadmap

### Phase 1 — Foundation ✅
- [x] Project setup (React + Vite + Tailwind + MUI)
- [x] Authentication (Google + JWT)
- [x] Sidebar layout & routing

### Phase 2 — Core Features 🔄
- [ ] Dashboard with charts
- [ ] Employee management (CRUD)
- [ ] Payroll processing engine

### Phase 3 — Automation 📄
- [ ] Payslip auto-generation
- [ ] PDF download
- [ ] Tax & salary configuration

### Phase 4 — Analytics 📊
- [ ] Reports & analytics page
- [ ] Export functionality
- [ ] Payroll history

### Phase 5 — Polish 🚀
- [ ] Email payslip delivery
- [ ] Attendance integration
- [ ] Multi-company support

---

## 🤝 Contributing

Contributions are welcome!

```bash
# Create a feature branch
git checkout -b feat/your-feature-name

# Commit your changes
git add .
git commit -m "feat: your feature description"

# Push and raise PR
git push origin feat/your-feature-name
```

**Coding Standards:**
- Follow existing component structure
- Write clean, readable code with comments
- Test your changes before raising a PR
- One feature per PR — keep PRs focused

---

## 📜 License

This project is for educational and hackathon purposes.

---

## 👨‍💻 Author

**Vishv Patel**
Full-Stack Developer | B.Tech Student
Coding Gita

| Skill | Technology |
|---|---|
| Frontend | React.js, Tailwind CSS, MUI |
| Backend | Node.js, Express.js, MongoDB |
| Tools | Vite, Firebase, Git |

[![GitHub](https://img.shields.io/badge/GitHub-vishvpatel210-181717?style=for-the-badge&logo=github)](https://github.com/vishvpatel210/payflow)

---

> Built with ❤️ for small teams who deserve better than spreadsheets.

[⬆ Back to Top](#-payflow)