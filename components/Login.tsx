
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Mail, Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { MOCK_USERS } from '../constants';

interface LoginProps {
  onLogin: (user: { name: string; role: string }) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    // Simulate API call
    setTimeout(() => {
      const user = MOCK_USERS.find(u => u.username === email && u.password === password);
      if (user) {
        onLogin(user.profile);
      } else {
        setError('Invalid email or password. Please try again.');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white overflow-hidden">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12">
        <div className="max-w-md w-full mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-12"
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <FileText className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Invoicify<span className="text-indigo-600">Pro</span></h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h2>
            <p className="text-slate-500 mb-8">Enter your credentials to access your dashboard.</p>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onSubmit={handleSubmit} 
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600">
                Remember me for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </motion.form>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 text-center text-sm text-slate-500"
          >
            Don't have an account? <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">Start 14-day free trial</a>
          </motion.p>
        </div>
      </div>

      {/* Right Side - Visual/Marketing */}
      <div className="hidden lg:flex flex-col justify-center bg-slate-900 p-16 relative overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-500 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500 blur-[120px] rounded-full" />
        </div>

        <div className="relative z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <span className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold tracking-widest uppercase rounded-full mb-6">
              New Feature: AI Extraction
            </span>
            <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
              Automate your bookkeeping with AI-powered precision.
            </h2>
            <p className="text-slate-400 text-lg mb-10">
              Stop wasting hours on manual data entry. Upload your invoices and let Invoicify Pro handle the rest.
            </p>

            <div className="space-y-4">
              {[
                '99.9% extraction accuracy',
                'Direct integration with accounting software',
                'Real-time financial insights for SMEs',
                'Secure cloud storage for all documents'
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + (i * 0.1) }}
                  className="flex items-center gap-3 text-slate-300"
                >
                  <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                  <span>{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-16 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl"
          >
            <div className="flex items-center gap-4 mb-4">
              <img src="https://picsum.photos/seed/testimonial/100/100" alt="Testimonial" className="w-12 h-12 rounded-full border-2 border-indigo-500/30" />
              <div>
                <p className="text-white font-semibold">Sarah Chen</p>
                <p className="text-slate-400 text-sm">Founder, TechFlow Solutions</p>
              </div>
            </div>
            <p className="text-slate-300 italic">
              "Invoicify Pro saved us over 20 hours a month on admin work. The AI extraction is scarily accurate."
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
