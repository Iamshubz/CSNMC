import React, { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, LayoutDashboard, Loader2, LogOut, Menu, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../lib/utils';
import { Complaint, User } from '../types';
import { BrandLockup } from '../components/AuthShell';
import { MobileSidebar } from '../components/MobileSidebar';

export const AdminWorkersPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [workers, setWorkers] = useState<User[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedWorkerId, setSelectedWorkerId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [workersData, complaintsData] = await Promise.all([
          fetchApi('/api/workers'),
          fetchApi('/api/complaints'),
        ]);
        setWorkers(workersData);
        setComplaints(complaintsData);
        setSelectedWorkerId(workersData[0]?.id ?? null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const selectedWorker = workers.find((worker) => worker.id === selectedWorkerId) ?? workers[0];
  const assignedComplaints = selectedWorker
    ? complaints.filter((complaint) => complaint.worker_id === selectedWorker.id)
    : [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:hidden">
        <button type="button" onClick={() => setIsMobileNavOpen(true)} className="rounded-full border border-slate-200 p-2 text-slate-700" aria-label="Open navigation menu"><Menu className="h-5 w-5" /></button>
        <div className="text-center"><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">EcoTrack</p><h1 className="text-lg font-bold">Active Workers</h1></div>
        <button type="button" onClick={logout} className="rounded-full border border-slate-200 p-2 text-slate-700" aria-label="Logout"><LogOut className="h-4 w-4" /></button>
      </header>

      <MobileSidebar
        open={isMobileNavOpen}
        title="EcoTrack Admin"
        subtitle="Worker management"
        icon={<Users className="h-6 w-6" />}
        navItems={[{ label: 'Admin Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, onClick: () => navigate('/admin') }]}
        onClose={() => setIsMobileNavOpen(false)}
        onLogout={logout}
      />

      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
          <div className="border-b border-slate-100 p-6"><BrandLockup compact /><p className="mt-3 text-xs font-bold text-slate-500">Admin · Worker management</p></div>
          <nav className="flex-1 space-y-2 p-4"><button type="button" onClick={() => navigate('/admin')} className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 font-medium text-slate-600 transition hover:bg-slate-50"><ArrowLeft className="h-5 w-5" /> Admin Dashboard</button><div className="flex w-full items-center gap-3 rounded-lg bg-emerald-50 px-4 py-2.5 font-medium text-emerald-700"><Users className="h-5 w-5" /> Active Workers</div></nav>
          <div className="border-t border-slate-100 p-4"><button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 font-medium text-red-600 transition hover:bg-red-50"><LogOut className="h-5 w-5" /> Logout</button></div>
        </aside>

        <main className="min-w-0 flex-1 p-4 md:p-8">
          <div className="mx-auto max-w-6xl">
            <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-600">Staff dashboard</p><h1 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">Active Registered Workers</h1><p className="mt-2 text-sm text-slate-500">Review active staff and their assigned complaints.</p></div><button type="button" onClick={() => navigate('/admin')} className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 sm:self-auto"><ArrowLeft className="h-4 w-4" /> Back to dashboard</button></header>

            {loading ? <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-emerald-600" /></div> : <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <section><div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-bold text-slate-900">Registered Workers</h2><span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">{workers.length} active</span></div><div className="space-y-3">{workers.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">No registered workers found.</div> : workers.map((worker) => { const activeTasks = complaints.filter((complaint) => complaint.worker_id === worker.id && complaint.status !== 'RESOLVED').length; return <button key={worker.id} type="button" onClick={() => setSelectedWorkerId(worker.id)} className={`flex w-full items-center justify-between rounded-2xl border bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${selectedWorker?.id === worker.id ? 'border-emerald-400 ring-2 ring-emerald-100' : 'border-slate-200'}`}><span className="flex min-w-0 items-center gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-sm font-black text-emerald-700">{worker.name.slice(0, 1).toUpperCase()}</span><span className="min-w-0"><span className="block truncate font-bold text-slate-900">{worker.name}</span><span className="block truncate text-xs text-slate-500">{worker.email}</span></span></span><span className="ml-3 shrink-0 text-right"><span className="flex items-center justify-end gap-1 text-xs font-bold text-emerald-600"><CheckCircle2 className="h-3.5 w-3.5" /> Active</span><span className="mt-1 block text-[11px] text-slate-400">{activeTasks} active tasks</span></span></button>; })}</div></section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">{selectedWorker ? <><div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4"><div><p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">Assigned complaints</p><h2 className="mt-1 text-xl font-bold text-slate-900">{selectedWorker.name}</h2><p className="text-xs text-slate-500">{selectedWorker.email}</p></div><span className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-700">Active</span></div><div className="mt-5 space-y-2">{assignedComplaints.length === 0 ? <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No complaints assigned yet.</p> : assignedComplaints.map((complaint) => <div key={complaint.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3"><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-800">{complaint.title}</p><p className="mt-1 truncate text-xs text-slate-500">{complaint.location}</p></div><span className="shrink-0 rounded-md bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700">{complaint.status.replace('_', ' ')}</span></div>)}</div><div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-xl bg-emerald-50 p-3"><p className="text-xs text-emerald-700">Completed</p><p className="mt-1 text-xl font-black text-emerald-800">{assignedComplaints.filter((complaint) => complaint.status === 'RESOLVED').length}</p></div><div className="rounded-xl bg-blue-50 p-3"><p className="text-xs text-blue-700">Active tasks</p><p className="mt-1 text-xl font-black text-blue-800">{assignedComplaints.filter((complaint) => complaint.status !== 'RESOLVED').length}</p></div></div></> : <p className="text-sm text-slate-500">Select a worker to view their dashboard.</p>}</section>
            </div>}
          </div>
        </main>
      </div>
    </div>
  );
};
