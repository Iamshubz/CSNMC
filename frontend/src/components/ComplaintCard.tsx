import React from 'react';
import { motion } from 'motion/react';
import { Trash2, CheckCircle2, Clock, AlertCircle, MapPin, User as UserIcon, Image as ImageIcon } from 'lucide-react';
import { Complaint } from '../types';
import { cn } from '../lib/utils';

interface ComplaintCardProps {
  complaint: Complaint;
  onUpdateStatus?: (id: number, status: string) => void;
  isAdmin?: boolean;
  isWorker?: boolean;
  workers?: { id: number; name: string }[];
  onAssign?: (id: number, workerId: number) => void;
}

const statusColors = {
  PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
  ASSIGNED: 'bg-blue-100 text-blue-700 border-blue-200',
  IN_PROGRESS: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  RESOLVED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const statusIcons = {
  PENDING: <AlertCircle className="w-4 h-4" />,
  ASSIGNED: <UserIcon className="w-4 h-4" />,
  IN_PROGRESS: <Clock className="w-4 h-4" />,
  RESOLVED: <CheckCircle2 className="w-4 h-4" />,
};

export const ComplaintCard: React.FC<ComplaintCardProps> = ({ 
  complaint, 
  onUpdateStatus, 
  isAdmin, 
  isWorker,
  workers,
  onAssign
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className={cn(
            "px-2.5 py-0.5 rounded-full text-xs font-medium border flex items-center gap-1 w-fit mb-2",
            statusColors[complaint.status]
          )}>
            {statusIcons[complaint.status]}
            {complaint.status.replace('_', ' ')}
          </span>
          <h3 className="text-lg font-semibold text-slate-900">{complaint.title}</h3>
          <p className="text-xs text-slate-500 font-mono mt-1">ID: #{complaint.id} • {new Date(complaint.created_at).toLocaleDateString()}</p>
        </div>
        <div className="text-right">
           <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{complaint.category}</span>
        </div>
      </div>

      <p className="text-slate-600 text-sm mb-4 line-clamp-3">{complaint.description}</p>

      <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
        <MapPin className="w-4 h-4 shrink-0" />
        <span className="truncate">{complaint.location}</span>
      </div>

      {complaint.image_url && (
        <div className="mb-4 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 aspect-video flex items-center justify-center">
          <img 
            src={complaint.image_url} 
            alt="Complaint" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <UserIcon className="w-3.5 h-3.5" />
          <span>Reported by: {complaint.citizen_name || 'Citizen'}</span>
        </div>

        {isAdmin && complaint.status === 'PENDING' && workers && (
          <div className="flex items-center gap-2">
            <select 
              className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              onChange={(e) => onAssign?.(complaint.id, parseInt(e.target.value))}
              defaultValue=""
            >
              <option value="" disabled>Assign Worker</option>
              {workers.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>
        )}

        {isWorker && complaint.status !== 'RESOLVED' && (
          <div className="flex gap-2">
            {complaint.status === 'ASSIGNED' && (
              <button 
                onClick={() => onUpdateStatus?.(complaint.id, 'IN_PROGRESS')}
                className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Start Work
              </button>
            )}
            {complaint.status === 'IN_PROGRESS' && (
              <button 
                onClick={() => onUpdateStatus?.(complaint.id, 'RESOLVED')}
                className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-md hover:bg-emerald-700 transition-colors"
              >
                Mark Resolved
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
