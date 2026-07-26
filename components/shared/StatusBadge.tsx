'use client';

import { DonationStatus } from '@/types';
import { Badge } from '@/components/ui/badge';

const statusConfig: Record<DonationStatus, { label: string; className: string }> = {
  [DonationStatus.PENDING]: { label: 'Pending', className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800' },
  [DonationStatus.ACCEPTED]: { label: 'Accepted', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800' },
  [DonationStatus.PICKUP_SCHEDULED]: { label: 'Pickup Scheduled', className: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800' },
  [DonationStatus.COLLECTED]: { label: 'Collected', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800' },
  [DonationStatus.RECEIVED]: { label: 'Received', className: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800' },
  [DonationStatus.DISTRIBUTED]: { label: 'Distributed', className: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400 border-teal-200 dark:border-teal-800' },
  [DonationStatus.COMPLETED]: { label: 'Completed', className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' },
  [DonationStatus.CANCELLED]: { label: 'Cancelled', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800' },
};

export function StatusBadge({ status }: { status: DonationStatus }) {
  const config = statusConfig[status] || { label: status, className: '' };
  return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
}
