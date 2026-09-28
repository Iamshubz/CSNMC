import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Leaf, Recycle } from 'lucide-react';

type AuthShellProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
};

const MunicipalMark = () => (
  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-[3px] border-[#b88a25] bg-[#fffdf2] shadow-[0_4px_12px_rgba(54,91,57,0.12)]">
    <img src="/csnlogo.jpeg" alt="Chhatrapati Sambhajinagar municipal logo" className="h-full w-full object-contain" />
  </div>
);

export const BrandLockup = ({ compact = false }: { compact?: boolean }) => (
  <Link to="/" className="inline-flex items-center gap-3" aria-label="EcoTrack home">
    <MunicipalMark />
    <span className="leading-none">
      <span className="block text-xl font-black tracking-[0.02em] text-[#075431]">EcoTrack</span>
      <span className="mt-1 block text-[10px] font-semibold leading-4 text-[#374d43]">Chhatrapati Sambhajinagar</span>
      {!compact && <span className="block text-[9px] font-bold uppercase tracking-[0.08em] text-[#7a8b82]">Municipal Corporation</span>}
    </span>
  </Link>
);

export const AuthShell = ({ eyebrow, title, subtitle, children, footer }: AuthShellProps) => (
  <main className="min-h-screen bg-[#eef8f1] p-3 text-[#17352a] sm:p-6 lg:p-10">
    <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl overflow-hidden rounded-[26px] border border-white/80 bg-white shadow-[0_20px_70px_rgba(40,93,59,0.14)] lg:min-h-[680px] lg:grid-cols-[0.98fr_1.02fr]">
      <section className="flex flex-col px-6 py-7 sm:px-12 sm:py-10 lg:px-14 lg:py-12">
        <div className="flex items-center justify-between">
          <BrandLockup />
          <Link to="/" className="inline-flex items-center gap-1 text-xs font-bold text-[#6e8177] transition hover:text-[#087443]"><ArrowLeft className="h-3.5 w-3.5" /> Home</Link>
        </div>
        <div className="my-auto max-w-md py-12 lg:py-16">
          <p className="mb-4 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#087443]"><Leaf className="h-3.5 w-3.5" /> {eyebrow}</p>
          <h1 className="text-4xl font-black leading-[1.06] tracking-[-0.03em] text-[#17352a] sm:text-5xl">{title}</h1>
          <p className="mt-4 text-sm leading-6 text-[#71837a]">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-7 text-center text-xs text-[#71837a]">{footer}</div>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#9aaa9f]"><Recycle className="h-3.5 w-3.5 text-[#087443]" /> Clean streets, shared responsibility</div>
      </section>
      <aside className="relative min-h-[300px] overflow-hidden bg-[#bfe4cb] lg:min-h-full">
        <img src="/city.png" alt="Municipal waste collection vehicle in a clean city" className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#075431]/80 via-[#075431]/15 to-white/20" />
        <div className="absolute bottom-7 left-6 right-6 text-white sm:bottom-10 sm:left-10 sm:right-10">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#c9f0d3]">SafaiSetu civic portal</p>
          <h2 className="mt-2 max-w-sm text-2xl font-black leading-tight sm:text-3xl">A cleaner city begins with one responsible action.</h2>
          <p className="mt-3 max-w-sm text-xs leading-5 text-white/80">Report, track, and resolve neighborhood waste issues with your municipal team.</p>
        </div>
      </aside>
    </div>
  </main>
);
