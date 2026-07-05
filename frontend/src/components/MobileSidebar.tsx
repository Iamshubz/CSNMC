import React from 'react';
import { motion } from 'motion/react';
import { LogOut, X } from 'lucide-react';
import { cn } from '../lib/utils';

type MobileNavItem = {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  active?: boolean;
};

interface MobileSidebarProps {
  open: boolean;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  navItems: MobileNavItem[];
  onClose: () => void;
  onLogout: () => void;
  logoutLabel?: string;
  accentClassName?: string;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({
  open,
  title,
  subtitle,
  icon,
  navItems,
  onClose,
  onLogout,
  logoutLabel = 'Logout',
  accentClassName = 'text-emerald-600',
}) => {
  if (!open) return null;

  return (
    <div className="md:hidden fixed inset-0 z-50">
      <motion.button
        type="button"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        aria-label="Close navigation overlay"
      />

      <motion.aside
        initial={{ x: -320 }}
        animate={{ x: 0 }}
        exit={{ x: -320 }}
        transition={{ type: 'spring', damping: 28, stiffness: 260 }}
        className="relative h-full w-[85vw] max-w-sm bg-white shadow-2xl border-r border-slate-200 flex flex-col"
      >
        <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className={cn('flex items-center gap-2 font-bold text-lg', accentClassName)}>
            {icon}
            <span className="break-words">{title}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {subtitle && <p className="px-5 pt-4 text-sm text-slate-500">{subtitle}</p>}

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                item.onClick();
                onClose();
              }}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors text-left',
                item.active
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:bg-slate-50'
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>{logoutLabel}</span>
          </button>
        </div>
      </motion.aside>
    </div>
  );
};