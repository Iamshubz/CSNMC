import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, Users, FileText, CheckCircle2, Clock, AlertCircle, Filter, Loader2, LogOut, BarChart3, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchApi, cn } from '../lib/utils';
import { Complaint, Analytics, User } from '../types';
import { ComplaintCard } from '../components/ComplaintCard';
import { AnalyticsCharts } from '../components/AnalyticsCharts';

export const AdminDashboard = () => {
  const { logout } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [workers, setWorkers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [complaintsData, analyticsData, workersData] = await Promise.all([
        fetchApi('/api/complaints'),
        fetchApi('/api/analytics'),
        fetchApi('/api/workers')
      ]);
      setComplaints(complaintsData);
      setAnalytics(analyticsData);
      setWorkers(workersData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (id: number, workerId: number) => {
    try {
      await fetchApi(`/api/complaints/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'ASSIGNED', worker_id: workerId }),
      });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredComplaints = filter === 'ALL' 
    ? complaints 
    : complaints.filter(c => c.status === filter);

  const stats = [
    { label: 'Total Reports', value: analytics?.total || 0, icon: <FileText className="w-5 h-5" />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending', value: analytics?.pending || 0, icon: <AlertCircle className="w-5 h-5" />, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Resolved', value: analytics?.resolved || 0, icon: <CheckCircle2 className="w-5 h-5" />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Workers', value: workers.length, icon: <Users className="w-5 h-5" />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xl">
            <ShieldCheck className="w-6 h-6" />
            EcoTrack Admin
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 bg-emerald-50 text-emerald-700 rounded-lg font-medium">
            <LayoutDashboard className="w-5 h-5" />
            Overview
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors">
            <BarChart3 className="w-5 h-5" />
            Analytics
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors">
            <Users className="w-5 h-5" />
            Workers
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
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Municipal Dashboard</h1>
            <p className="text-slate-500">Manage city-wide waste reports and worker assignments.</p>
          </header>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

              {/* Charts */}
              {analytics && (
                <div className="mb-8">
                  <AnalyticsCharts data={analytics.byCategory} />
                </div>
              )}

              {/* Complaints Section */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4">
                  <h2 className="text-lg font-bold text-slate-900">Recent Complaints</h2>
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <select 
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="ALL">All Status</option>
                      <option value="PENDING">Pending</option>
                      <option value="ASSIGNED">Assigned</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="RESOLVED">Resolved</option>
                    </select>
                  </div>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredComplaints.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-slate-500">
                      No complaints found matching the criteria.
                    </div>
                  ) : (
                    filteredComplaints.map(complaint => (
                      <ComplaintCard 
                        key={complaint.id} 
                        complaint={complaint} 
                        isAdmin 
                        workers={workers}
                        onAssign={handleAssign}
                      />
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};
