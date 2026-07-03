import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Leaf, Trash2, ShieldCheck, Users, ArrowRight, CheckCircle2, MapPin, BarChart3 } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-4 py-4 sm:h-20 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-emerald-600 font-bold text-2xl">
          <Leaf className="w-8 h-8" />
          EcoTrack
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-6">
          <Link to="/login" className="text-slate-600 font-medium hover:text-emerald-600 transition-colors text-center">Login</Link>
          <Link to="/register" className="bg-emerald-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-emerald-700 transition-colors text-center">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-12 sm:py-16 lg:py-32 grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold mb-6">
            SMART CITY INITIATIVE
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            Keeping our city <span className="text-emerald-600">clean</span> and <span className="text-emerald-600">green</span>.
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-slate-500 mb-10 max-w-lg">
            A modern waste management system that connects citizens, municipal authorities, and workers to resolve waste issues faster than ever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/register" className="bg-emerald-600 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 flex items-center justify-center gap-2 w-full sm:w-auto">
              Report an Issue <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="bg-white text-slate-900 border border-slate-200 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-slate-50 transition-all text-center w-full sm:w-auto">
              View Dashboard
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-emerald-100 rounded-[2rem] -rotate-2"></div>
          <div className="relative bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl aspect-[4/3] sm:aspect-video lg:aspect-square flex items-center justify-center">
             <img 
               src="https://picsum.photos/seed/city-clean/800/800" 
               alt="Clean City" 
               className="w-full h-full object-cover opacity-80"
               referrerPolicy="no-referrer"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex flex-col justify-end p-8">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-4">
                   <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                      <CheckCircle2 className="w-6 h-6" />
                   </div>
                   <div>
                      <p className="text-white font-bold">1,240+ Issues Resolved</p>
                      <p className="text-white/60 text-sm">In the last 30 days</p>
                   </div>
                </div>
             </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">How it works</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Our platform streamlines the entire waste management process from reporting to resolution.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <MapPin className="w-6 h-6" />, title: 'Report', desc: 'Citizens report waste issues with location and photos.', color: 'bg-blue-500' },
              { icon: <ShieldCheck className="w-6 h-6" />, title: 'Manage', desc: 'Authorities assign tasks to workers and track progress.', color: 'bg-emerald-500' },
              { icon: <Trash2 className="w-6 h-6" />, title: 'Resolve', desc: 'Workers clean up and mark issues as resolved.', color: 'bg-indigo-500' },
            ].map((f, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg", f.color)}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 sm:py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 text-center md:text-left">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xl">
            <Leaf className="w-6 h-6" />
            EcoTrack
          </div>
          <p className="text-slate-400 text-sm">© 2024 EcoTrack Smart Waste Management. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-emerald-600 transition-colors">Privacy</a>
            <a href="#" className="text-slate-400 hover:text-emerald-600 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

import { cn } from '../lib/utils';
