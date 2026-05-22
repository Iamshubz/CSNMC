export type Role = 'CITIZEN' | 'ADMIN' | 'WORKER';

export interface User {
  id: number;
  email: string;
  name: string;
  role: Role;
}

export interface Complaint {
  id: number;
  title: string;
  description: string;
  location: string;
  category: string;
  status: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED';
  citizen_id: number;
  worker_id?: number;
  image_url?: string;
  proof_image_url?: string;
  created_at: string;
  citizen_name?: string;
  worker_name?: string;
}

export interface Analytics {
  total: number;
  resolved: number;
  pending: number;
  byCategory: { name: string; value: number }[];
}
