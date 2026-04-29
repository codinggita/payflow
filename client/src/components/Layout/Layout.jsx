import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  FileBarChart, 
  Settings2, 
  Settings, 
  HelpCircle, 
  LogOut,
  Search,
  Bell,
  UserPlus,
  Zap
} from 'lucide-react';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userName = user?.name || 'User Account';
  const userEmail = user?.email || 'admin@payflow.com';
  const avatarSeed = user?.name || user?.email || 'User Account';
  const avatarUrl = user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(avatarSeed)}&background=random`;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#F8FAFC] border-r border-slate-200 flex flex-col justify-between hidden md:flex shrink-0">
        <div className="p-6">
          <div className="mb-10">
            <h1 className="text-xl font-bold text-slate-800 font-outfit">The Atelier</h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mt-1">Admin Workspace</p>
          </div>

          <nav className="space-y-1">
            <Link to="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/dashboard') ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}>
              <LayoutDashboard size={18} />
              <span className="text-sm">Dashboard</span>
            </Link>
            <Link to="/employees" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/employees') ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}>
              <Users size={18} />
              <span className="text-sm">Employees</span>
            </Link>
            <Link to="/payroll" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/payroll') ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}>
              <Wallet size={18} />
              <span className="text-sm">Payroll</span>
            </Link>
            <Link to="/reports" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/reports') ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}>
              <FileBarChart size={18} />
              <span className="text-sm">Reports</span>
            </Link>
            <Link to="/configuration" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/configuration') ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}>
              <Settings2 size={18} />
              <span className="text-sm">Configuration</span>
            </Link>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-100 hover:text-slate-700 rounded-xl font-medium transition-colors">
              <Settings size={18} />
              <span className="text-sm">Settings</span>
            </a>
          </nav>
        </div>

        <div className="p-6 space-y-3">
          <button className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-md shadow-indigo-500/20 text-sm">
            <Zap size={16} /> Process Payroll
          </button>
          <button className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm text-sm">
            <UserPlus size={16} /> Add Employee
          </button>
          <div className="pt-4 border-t border-slate-200 mt-4">
            <a href="#" className="flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold uppercase tracking-wider transition-colors">
              <HelpCircle size={14} /> Help Center
            </a>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-red-500 text-xs font-semibold uppercase tracking-wider transition-colors text-left">
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-white rounded-l-3xl shadow-[-10px_0_30px_rgba(0,0,0,0.02)] border-l border-slate-100">
        
        {/* Top Header */}
        <header className="h-20 border-b border-slate-100 flex items-center justify-between px-8 bg-white shrink-0">
          <div className="relative w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="SEARCH DIRECTORY..." 
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-xs font-semibold tracking-wider text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all uppercase placeholder-slate-400"
            />
          </div>

          <div className="flex gap-8 items-center h-full">
            <div className="flex gap-6 h-full text-sm font-bold text-slate-400 tracking-wider uppercase">
              <div className="relative flex items-center h-full text-indigo-800 border-b-2 border-indigo-600">
                DIRECTORY
              </div>
              <div className="flex items-center h-full hover:text-slate-600 cursor-pointer transition-colors">
                HISTORY
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                <Settings2 size={20} />
              </button>
              
              <div className="h-8 w-px bg-slate-200 mx-2"></div>
              
              <div className="flex items-center gap-3 cursor-pointer">
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-800">{userName}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{userEmail}</p>
                </div>
                <img src={avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-indigo-100 bg-indigo-50 object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-auto hide-scrollbar p-8 bg-[#F8FAFC]">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
