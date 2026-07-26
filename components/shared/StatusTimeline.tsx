'use client';

import { DonationStatus } from '@/types';
import { StatusHistoryEntry } from '@/types';
import { cn } from '@/lib/utils';
import { Check, Clock, Truck, Package, HandHeart, CheckCircle2, XCircle } from 'lucide-react';

const statusSteps = [
  { status: DonationStatus.PENDING, label: 'Pending', icon: Clock },
  { status: DonationStatus.ACCEPTED, label: 'Accepted', icon: Check },
  { status: DonationStatus.PICKUP_SCHEDULED, label: 'Pickup Scheduled', icon: Truck },
  { status: DonationStatus.COLLECTED, label: 'Collected', icon: Package },
  { status: DonationStatus.RECEIVED, label: 'Received', icon: HandHeart },
  { status: DonationStatus.DISTRIBUTED, label: 'Distributed', icon: HandHeart },
  { status: DonationStatus.COMPLETED, label: 'Completed', icon: CheckCircle2 },
];

function getStepIndex(status: DonationStatus) {
  const idx = statusSteps.findIndex((s) => s.status === status);
  return idx >= 0 ? idx : -1;
}

export function StatusTimeline({ currentStatus, history }: { currentStatus: DonationStatus; history?: StatusHistoryEntry[] }) {
  if (currentStatus === DonationStatus.CANCELLED) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
        <XCircle className="h-6 w-6 text-red-500" />
        <div>
          <p className="font-medium text-red-700 dark:text-red-400">Donation Cancelled</p>
          <p className="text-sm text-red-600/70 dark:text-red-400/70">This donation has been cancelled.</p>
        </div>
      </div>
    );
  }

  const currentIndex = getStepIndex(currentStatus);

  return (
    <div className="space-y-0">
      {statusSteps.map((step, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;
        const Icon = step.icon;
        const historyEntry = history?.find((h) => h.toStatus === step.status);

        return (
          <div key={step.status} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all',
                isCompleted ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-muted-foreground/30 bg-background text-muted-foreground/50',
                isCurrent && 'ring-4 ring-emerald-500/20'
              )}>
                <Icon className="h-4 w-4" />
              </div>
              {index < statusSteps.length - 1 && (
                <div className={cn('w-0.5 h-8 my-1', index < currentIndex ? 'bg-emerald-500' : 'bg-muted-foreground/20')} />
              )}
            </div>
            <div className="pb-4 pt-0.5">
              <p className={cn('text-sm font-medium', isCompleted ? 'text-foreground' : 'text-muted-foreground')}>
                {step.label}
              </p>
              {historyEntry && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date(historyEntry.changedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
