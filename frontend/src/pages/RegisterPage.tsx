import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { UserPlus, Mail, Lock, User as UserIcon, Loader2 } from 'lucide-react';
import { fetchApi, cn } from '../lib/utils';
import { AuthShell } from '../components/AuthShell';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CITIZEN'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await fetchApi('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      navigate('/login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell eyebrow="Join the movement" title="Create Account" subtitle="Create your SafaiSetu account to report issues, follow progress, and help keep Sambhajinagar clean." footer={<>Already have an account? <Link to="/login" className="font-bold text-[#087443] hover:underline">Sign in here</Link></>}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>

        {error && (
          <div className="mb-6 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-bold text-[#374d43]">Full Name</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border border-[#dce9e1] py-3 pl-10 pr-4 text-sm focus:outline-none"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-[#374d43]">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-lg border border-[#dce9e1] py-3 pl-10 pr-4 text-sm focus:outline-none"
                placeholder="name@example.com"
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
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full rounded-lg border border-[#dce9e1] py-3 pl-10 pr-4 text-sm focus:outline-none"
                placeholder="Create a password"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-[#374d43]">I am a...</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {['CITIZEN', 'WORKER', 'ADMIN'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setFormData({ ...formData, role })}
                  className={cn(
                    "rounded-lg border py-2.5 text-xs font-semibold transition-all",
                    formData.role === role 
                      ? "border-[#087443] bg-[#087443] text-white"
                      : "border-[#dce9e1] bg-white text-slate-600 hover:border-[#9bcbaa]"
                  )}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#087443] py-3 font-bold text-white transition-colors hover:bg-[#075431] disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
            Create Account
          </button>
        </form>

      </motion.div>
    </AuthShell>
  );
};
