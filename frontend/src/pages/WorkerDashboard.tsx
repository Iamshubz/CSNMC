import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, CheckCircle2, Clock, AlertCircle, Loader2, LogOut, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../lib/utils';
import { Complaint } from '../types';
import { ComplaintCard } from '../components/ComplaintCard';

export const WorkerDashboard = () => {
  const { user, logout } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      const data = await fetchApi('/api/complaints');
      setComplaints(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await fetchApi(`/api/complaints/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      loadComplaints();
    } catch (err) {
      console.error(err);
    }
  };

  const stats = [
    { label: 'Assigned', value: complaints.filter(c => c.status === 'ASSIGNED').length, icon: <AlertCircle className="w-5 h-5" />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'In Progress', value: complaints.filter(c => c.status === 'IN_PROGRESS').length, icon: <Clock className="w-5 h-5" />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Completed', value: complaints.filter(c => c.status === 'RESOLVED').length, icon: <CheckCircle2 className="w-5 h-5" />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
            <Briefcase className="w-6 h-6" />
            EcoTrack Worker
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 bg-indigo-50 text-indigo-700 rounded-lg font-medium">
            <LayoutDashboard className="w-5 h-5" />
            My Tasks
          </button>
        </nav>
        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <header className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Worker Portal</h1>
            <p className="text-slate-500">Manage your assigned waste collection tasks.</p>
          </header>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {stats.map((stat, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
                  >
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", stat.bg, stat.color)}>
                      {stat.icon}
                    </div>
                    <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {complaints.length === 0 ? (
                  <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-2xl border border-dashed border-slate-200">
                    You have no assigned tasks at the moment.
                  </div>
                ) : (
                  complaints.map(complaint => (
                    <ComplaintCard 
                      key={complaint.id} 
                      complaint={complaint} 
                      isWorker
                      onUpdateStatus={handleUpdateStatus}
                    />
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

import { cn } from '../lib/utils';
