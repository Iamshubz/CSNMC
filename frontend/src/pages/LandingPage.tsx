import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  ChevronRight,
  FileText,
  Leaf,
  MapPin,
  Recycle,
  ShieldCheck,
  Truck,
} from 'lucide-react';

const features = [
  { icon: FileText, title: 'Easy Complaint', text: 'Register a waste issue in a few simple steps.', tone: 'green' },
  { icon: MapPin, title: 'Location Based', text: 'Attach the exact location and landmark.', tone: 'blue' },
  { icon: Camera, title: 'Live Photo Proof', text: 'Capture an authentic photo from the field.', tone: 'amber' },
  { icon: CheckCircle2, title: 'Quick Resolution', text: 'Follow progress until the issue is resolved.', tone: 'green' },
];

const steps = [
  { number: '01', title: 'Report', text: 'Share the issue with a live photo and location.' },
  { number: '02', title: 'Manage', text: 'Municipal teams review and assign the complaint.' },
  { number: '03', title: 'Resolve', text: 'Workers complete the task and update its status.' },
];

export const LandingPage = () => {
  return (
    <div className="min-h-screen overflow-hidden bg-[#fbfdfb] text-[#17352a]">
      <header className="relative z-20 border-b border-[#dce9e1] bg-white/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4 sm:px-8 lg:h-[76px] lg:px-10">
          <Link to="/" className="flex items-center gap-3" aria-label="CSMC home">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#bd9635] bg-[#f9f4df] text-[#075431] shadow-sm">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div className="leading-none">
              <div className="text-base font-black tracking-[0.12em] text-[#075431]">CSMC</div>
              <div className="mt-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-slate-500">Chhatrapati Sambhajinagar</div>
              <div className="mt-0.5 text-[8px] font-bold uppercase tracking-[0.1em] text-slate-400">Municipal Corporation</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-[11px] font-semibold text-slate-600 md:flex">
            <Link className="border-b-2 border-[#087443] pb-1 text-[#087443]" to="/">Home</Link>
            <a className="hover:text-[#087443]" href="#about">About Us</a>
            <a className="hover:text-[#087443]" href="#services">Services</a>
            <Link className="hover:text-[#087443]" to="/login">Dashboard</Link>
            <a className="hover:text-[#087443]" href="#contact">Contact</a>
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/login" className="rounded-md border border-[#cfe2d5] px-3.5 py-2 text-xs font-bold text-[#075431] transition hover:bg-[#eef8f0]">Login</Link>
            <Link to="/register" className="rounded-md bg-[#087443] px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#075431]">Register</Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative border-b border-[#d4e9da] bg-[#eaf7ef]">
          <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 pb-0 pt-12 sm:px-8 sm:pt-16 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:pt-20">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative z-10 pb-12 lg:pb-20">
              <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-[#bfe1c8] bg-white/70 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#087443]">
                <Leaf className="h-3.5 w-3.5" /> Smart city initiative
              </div>
              <h1 className="max-w-xl text-4xl font-black leading-[1.04] tracking-[-0.03em] text-[#17352a] sm:text-5xl lg:text-[62px]">
                Together for a <span className="text-[#087443]">cleaner</span> Sambhajinagar.
              </h1>
              <p className="mt-6 max-w-lg text-sm leading-7 text-[#587066] sm:text-base">
                A connected citizen portal for reporting waste issues, tracking municipal action, and building a healthier city together.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/register" className="inline-flex items-center justify-center gap-2 rounded-md bg-[#087443] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#087443]/20 transition hover:-translate-y-0.5 hover:bg-[#075431]">
                  Report an Issue <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/login" className="inline-flex items-center justify-center gap-2 rounded-md border border-[#087443] bg-white/80 px-6 py-3.5 text-sm font-bold text-[#075431] transition hover:bg-white">
                  View Dashboard <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.12 }} className="relative self-end">
              <div className="absolute -right-20 -top-16 h-56 w-56 rounded-full bg-white/60 blur-3xl" />
              <div className="relative overflow-hidden rounded-t-[22px] border-x border-t border-white/80 bg-[#cfead6] shadow-[0_-8px_30px_rgba(30,100,58,0.1)]">
                <img src="/csmc-city.png" alt="Chhatrapati Sambhajinagar clean city initiative" className="h-[300px] w-full object-cover object-center opacity-90 mix-blend-multiply sm:h-[400px] lg:h-[480px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#075431]/35 via-transparent to-white/25" />
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-xl border border-white/50 bg-white/80 p-3 backdrop-blur-sm sm:bottom-7 sm:left-7 sm:right-7 sm:p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dff3e4] text-[#087443]"><Recycle className="h-5 w-5" /></div>
                    <div><p className="text-xs font-extrabold text-[#17352a] sm:text-sm">Cleaner streets start here</p><p className="mt-0.5 text-[10px] text-[#6b7d75]">One report can make a difference.</p></div>
                  </div>
                  <Truck className="hidden h-7 w-7 text-[#087443] sm:block" />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="services" className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const tone = feature.tone === 'blue' ? 'bg-[#edf5fc] text-[#327caf]' : feature.tone === 'amber' ? 'bg-[#fff7df] text-[#ad7b12]' : 'bg-[#eaf7ef] text-[#087443]';
              return <motion.div key={feature.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} className="rounded-xl border border-[#dce9e1] bg-white p-5 shadow-[0_8px_24px_rgba(29,78,53,0.05)]">
                <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-lg ${tone}`}><Icon className="h-5 w-5" /></div>
                <h2 className="text-sm font-extrabold text-[#17352a]">{feature.title}</h2>
                <p className="mt-2 text-xs leading-5 text-[#71837a]">{feature.text}</p>
              </motion.div>;
            })}
          </div>
        </section>

        <section id="about" className="border-y border-[#dce9e1] bg-white py-14 sm:py-18">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
            <div><p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#087443]">How SafaiSetu works</p><h2 className="mt-3 max-w-md text-3xl font-black leading-tight text-[#17352a] sm:text-4xl">From a street-side issue to a tracked resolution.</h2></div>
            <div className="grid gap-4 sm:grid-cols-3">
              {steps.map((step) => <div key={step.number} className="border-l-2 border-[#bfe1c8] pl-4"><span className="text-xs font-black text-[#087443]">{step.number}</span><h3 className="mt-3 text-sm font-extrabold">{step.title}</h3><p className="mt-2 text-xs leading-5 text-[#71837a]">{step.text}</p></div>)}
            </div>
          </div>
        </section>

        <section id="contact" className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-[#075431] px-6 py-8 text-white sm:flex-row sm:items-center sm:px-10">
            <div><p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#a9dfb8]">Citizen participation</p><h2 className="mt-2 text-xl font-black sm:text-2xl">See a waste issue in your neighborhood?</h2><p className="mt-2 max-w-xl text-xs leading-5 text-[#d2f0d9]">Report it with the location and photo. The municipal team can then track the action from assignment to resolution.</p></div>
            <Link to="/register" className="inline-flex shrink-0 items-center gap-2 rounded-md bg-white px-5 py-3 text-xs font-extrabold text-[#075431] transition hover:bg-[#eaf7ef]">Get started <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#dce9e1] bg-[#f4faf5] py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 text-center text-[11px] text-[#71837a] sm:flex-row sm:px-8 sm:text-left lg:px-10"><span className="font-bold text-[#087443]">CSMC · SafaiSetu</span><span>Chhatrapati Sambhajinagar Municipal Corporation</span><span>Clean streets, shared responsibility.</span></div>
      </footer>
    </div>
  );
};
