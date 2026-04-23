import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Zap
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { signInWithGoogle } from '../../firebase';

const API_URL = 'http://localhost:5000/api/auth';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  // Handle Email Login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      toast.success('Login successful! Welcome back.');
      // TODO: Navigate to dashboard
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle Email Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/signup`, { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      toast.success('Account created successfully!');
      // TODO: Navigate to dashboard
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const googleUser = await signInWithGoogle();
      // Send Google user info to our backend to create/find user
      const res = await axios.post(`${API_URL}/google`, {
        email: googleUser.email,
        uid: googleUser.uid,
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      toast.success(`Welcome, ${googleUser.displayName || googleUser.email}!`);
      // TODO: Navigate to dashboard
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = isLogin ? handleLogin : handleSignup;

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row font-sans overflow-hidden bg-white">
      {/* Left Side - Branding & Inspiration */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden md:flex md:w-[45%] lg:w-[40%] shrink-0 indigo-gradient p-12 flex-col justify-between relative"
      >
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 rounded-full bg-white/20 blur-3xl animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 rounded-full bg-indigo-400/30 blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-20">
            <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center shadow-xl shadow-indigo-900/20">
              <Zap className="text-indigo-600 fill-indigo-600" size={28} />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight font-outfit">PayFlow</span>
          </div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h1 className="text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 font-outfit">
              The Atelier <br /> of Payroll.
            </h1>
            <p className="text-indigo-100 text-xl max-w-md font-light leading-relaxed">
              Elevating your financial operations with precision and effortless clarity.
            </p>
          </motion.div>
        </div>

        <div className="relative z-10">
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 w-10 rounded-full border-2 border-indigo-600 overflow-hidden bg-indigo-200 shadow-sm">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} 
                      alt="User avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="text-white/90">
                <p className="text-sm font-semibold">Trusted by 12k+ active firms</p>
                <p className="text-[10px] uppercase tracking-widest text-indigo-200">Industry Standard Choice</p>
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full status-pill text-white/90 text-sm backdrop-blur-sm">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="font-medium tracking-wide">99.9% VERIFIED UPTIME</span>
          </div>
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 lg:p-12 bg-slate-50 relative overflow-hidden">
        {/* Abstract shapes for decoration */}
        <div className="absolute top-[15%] right-[-5%] w-64 h-64 border-[30px] border-indigo-100/30 rounded-full blur-sm" />
        <div className="absolute bottom-[10%] left-[-5%] w-40 h-40 border-[20px] border-slate-200/50 rounded-full blur-sm" />

        <motion.div 
          layout
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[750px] glass-card rounded-3xl p-6 md:p-10 relative z-10 shadow-2xl shadow-indigo-900/5"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2 font-outfit">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-slate-500 text-sm font-light">
              {isLogin ? "Enter your details to access your dashboard." : "Join the Atelier and simplify your payroll today."}
            </p>
          </div>

          {/* Login/Signup Toggle */}
          <div className="flex bg-slate-100/80 p-1 rounded-xl mb-10 w-fit mx-auto border border-slate-200">
            <button 
              onClick={() => setIsLogin(true)}
              className={`px-8 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${isLogin ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Login
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`px-8 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${!isLogin ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Sign up
            </button>
          </div>

          <button 
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3.5 px-4 bg-white border border-slate-200 rounded-xl flex items-center justify-center gap-3 text-slate-700 font-semibold hover:bg-slate-50 transition-all duration-300 shadow-sm hover:shadow-md mb-8 group disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
            <span>{isLogin ? "Sign in with Google" : "Sign up with Google"}</span>
          </button>

          <div className="flex items-center gap-4 mb-8">
            <div className="h-[1px] flex-1 bg-slate-200" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              {isLogin ? "Professional Login" : "Email Registration"}
            </span>
            <div className="h-[1px] flex-1 bg-slate-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label 
                htmlFor="email" 
                className="text-xs font-bold text-slate-500 uppercase tracking-widest flex justify-between items-center px-1"
              >
                Work Email Address
              </label>
              <div className="relative group">
                <input 
                  type="email" 
                  id="email"
                  placeholder="name@company.com" 
                  className="input-field group-focus-within:shadow-indigo-500/10 group-focus-within:shadow-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-400 transition-colors duration-300" size={18} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
                {isLogin && <button type="button" className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:text-indigo-700 transition-colors">Reset Access</button>}
              </div>
              <div className="relative group">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="input-field group-focus-within:shadow-indigo-500/10 group-focus-within:shadow-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-400 transition-colors duration-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center gap-3 group px-1">
                <div className="relative flex items-center">
                  <input 
                    type="checkbox" 
                    id="remember" 
                    className="peer h-4 w-4 appearance-none rounded border-2 border-slate-200 bg-white checked:bg-indigo-500 checked:border-indigo-500 transition-all duration-300 cursor-pointer"
                  />
                  <div className="absolute opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-300">
                    <svg className="h-2.5 w-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <label htmlFor="remember" className="text-xs font-medium text-slate-600 cursor-pointer group-hover:text-slate-800 transition-colors">
                  Keep me logged in for 30 days
                </label>
              </div>
            )}

            <motion.button 
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden group disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="z-10 group-hover:translate-x-[-1px] transition-transform duration-300">
                {loading ? 'Please wait...' : (isLogin ? "Enter Dashboard" : "Register Agency")}
              </span>
              {!loading && <ArrowRight className="z-10 group-hover:translate-x-[4px] transition-transform duration-300" size={18}/>}
              <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:left-[100%] transition-all duration-1000 ease-in-out" />
            </motion.button>
          </form>

          <p className="text-center mt-10 text-xs font-medium text-slate-500">
            {isLogin ? "New to the Atelier?" : "Already have an account?"} 
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-indigo-600 hover:text-indigo-700 font-bold ml-1 transition-colors group"
            >
              {isLogin ? "Request Access" : "Sign In"} 
              <ChevronRight className="inline-block group-hover:translate-x-1 transition-transform" size={12} />
            </button>
          </p>
        </motion.div>

        {/* Support Chat Badge (bottom right) */}
        <div className="fixed bottom-8 right-8 h-14 w-14 rounded-2xl bg-white shadow-2xl border border-slate-100 flex items-center justify-center cursor-pointer hover:shadow-indigo-500/20 hover:scale-110 transition-all duration-300 group">
          <div className="relative">
            <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <div className="absolute top-[-2px] right-[-2px] h-3 w-3 bg-indigo-500 rounded-full border-2 border-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
