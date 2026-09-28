import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../lib/utils';
import { AuthShell } from '../components/AuthShell';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await fetchApi('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      login(data.token, data.user);
      
      if (data.user.role === 'ADMIN') navigate('/admin');
      else if (data.user.role === 'WORKER') navigate('/worker');
      else navigate('/citizen');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell eyebrow="Welcome back" title="Welcome Back" subtitle="Login to continue to your civic dashboard and stay connected with your municipal team." footer={<>Don't have an account? <Link to="/register" className="font-bold text-[#087443] hover:underline">Register here</Link></>}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>

        {error && (
          <div className="mb-6 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-bold text-[#374d43]">Email / Mobile Number</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-[#dce9e1] py-3 pl-10 pr-4 text-sm focus:outline-none"
                placeholder="Enter email or mobile number"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-[#374d43]">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-[#dce9e1] py-3 pl-10 pr-4 text-sm focus:outline-none"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#087443] py-3 font-bold text-white transition-colors hover:bg-[#075431] disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
            Sign In
          </button>
        </form>

      </motion.div>
    </AuthShell>
  );
};
