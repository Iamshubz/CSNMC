import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, MapPin, FileText, Send, X, Loader2, History, LayoutDashboard, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../lib/utils';
import { Complaint } from '../types';
import { ComplaintCard } from '../components/ComplaintCard';
import { cn } from '../lib/utils';
import { MobileSidebar } from '../components/MobileSidebar';
import { LiveCameraCapture, type CaptureMetadata } from '../components/LiveCameraCapture';

export const CitizenDashboard = () => {
  const { user, logout } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [photoCaptureError, setPhotoCaptureError] = useState('');
  const [activeSection, setActiveSection] = useState<'dashboard' | 'reports'>('dashboard');
  
  const [newComplaint, setNewComplaint] = useState({
    title: '',
    description: '',
    location: '',
    image_url: '',
    captured_at: '',
    capture_latitude: null as number | null,
    capture_longitude: null as number | null,
    capture_accuracy: null as number | null,
  });

  const scrollToSection = (id: string, section: 'dashboard' | 'reports') => {
    setActiveSection(section);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComplaint.image_url) {
      setPhotoCaptureError('Please capture a live photo before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      await fetchApi('/api/complaints', {
        method: 'POST',
        body: JSON.stringify(newComplaint),
      });
      setIsModalOpen(false);
      setNewComplaint({
        title: '',
        description: '',
        location: '',
        image_url: '',
        captured_at: '',
        capture_latitude: null,
        capture_longitude: null,
        capture_accuracy: null,
      });
      setPhotoCaptureError('');
      loadComplaints();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row overflow-x-hidden">
      <header className="md:hidden sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur px-4 py-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setIsMobileNavOpen(true)}
          className="inline-flex items-center justify-center rounded-full border border-slate-200 p-2 text-slate-700"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="min-w-0 flex-1 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">EcoTrack</p>
          <h1 className="text-lg font-bold text-slate-900 truncate">Citizen Dashboard</h1>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700"
        >
          <LogOut className="w-4 h-4" />
          Exit
        </button>
      </header>

      <MobileSidebar
        open={isMobileNavOpen}
        title="EcoTrack"
        subtitle="Citizen navigation"
        icon={<LayoutDashboard className="w-6 h-6" />}
        accentClassName="text-emerald-600"
        navItems={[
          { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, onClick: () => scrollToSection('citizen-top', 'dashboard'), active: activeSection === 'dashboard' },
          { label: 'My Reports', icon: <History className="w-5 h-5" />, onClick: () => scrollToSection('citizen-reports', 'reports'), active: activeSection === 'reports' },
        ]}
        onClose={() => setIsMobileNavOpen(false)}
        onLogout={logout}
        logoutLabel="Logout"
      />

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xl">
            <LayoutDashboard className="w-6 h-6" />
            EcoTrack
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            type="button"
            onClick={() => scrollToSection('citizen-top', 'dashboard')}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors',
              activeSection === 'dashboard'
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-slate-600 hover:bg-slate-50'
            )}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('citizen-reports', 'reports')}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors',
              activeSection === 'reports'
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-slate-600 hover:bg-slate-50'
            )}
          >
            <History className="w-5 h-5" />
            My Reports
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
      <main id="citizen-top" className="flex-1 p-4 md:p-8 overflow-y-auto min-w-0">
        <div className="max-w-5xl mx-auto">
          <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 break-words">Welcome, {user?.name}</h1>
              <p className="text-slate-500">Track and report waste issues in your area.</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 w-full sm:w-auto"
            >
              <Plus className="w-5 h-5" />
              Report Issue
            </button>
          </header>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
          ) : (
            <div id="citizen-reports" className="scroll-mt-24">
              {complaints.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">No reports yet</h3>
                  <p className="text-slate-500 mb-6">Start by reporting a waste-related issue in your neighborhood.</p>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="text-emerald-600 font-semibold hover:underline"
                  >
                    Create your first report
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {complaints.map(complaint => (
                    <ComplaintCard key={complaint.id} complaint={complaint} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Report Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto overflow-x-hidden"
            >
              <div className="p-4 sm:p-6 border-b border-slate-100 flex justify-between items-center gap-4">
                <h2 className="text-xl font-bold text-slate-900">Report Waste Issue</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Live Photo</label>
                  <p className="text-xs text-slate-500 mb-3">Take a fresh picture from the device camera. Gallery uploads are disabled.</p>
                  <LiveCameraCapture
                    value={newComplaint.image_url}
                    onCapture={(metadata: CaptureMetadata) => {
                      setPhotoCaptureError('');
                      setNewComplaint({
                        ...newComplaint,
                        image_url: metadata.imageUrl,
                        captured_at: metadata.capturedAt,
                        capture_latitude: metadata.captureLatitude,
                        capture_longitude: metadata.captureLongitude,
                        capture_accuracy: metadata.captureAccuracy,
                      });
                    }}
                    onClear={() => setNewComplaint({
                      ...newComplaint,
                      image_url: '',
                      captured_at: '',
                      capture_latitude: null,
                      capture_longitude: null,
                      capture_accuracy: null,
                    })}
                  />
                  {photoCaptureError && (
                    <p className="mt-2 text-sm text-red-600">{photoCaptureError}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                  <input 
                    type="text" 
                    required
                    value={newComplaint.title}
                    onChange={(e) => setNewComplaint({ ...newComplaint, title: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g., Garbage Overflow at Main St."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea 
                    required
                    rows={3}
                    value={newComplaint.description}
                    onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Describe the issue in detail..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      required
                      value={newComplaint.location}
                      onChange={(e) => setNewComplaint({ ...newComplaint, location: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Street name, Area, Landmark"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={submitting || !newComplaint.image_url}
                    className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    Submit Report
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
