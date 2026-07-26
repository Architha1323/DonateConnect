'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { NgoStats } from '@/types';
import { StatsCard } from '@/components/shared/StatsCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, Package, CheckCircle2, Users, Gift } from 'lucide-react';

export default function NgoDashboard() {
  const [stats, setStats] = useState<NgoStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/ngos/stats').then((res) => setStats(res.data.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)}</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">NGO Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage donations, inventory, and beneficiaries</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard title="Available Donations" value={stats?.pendingDonations || 0} icon={<Clock className="h-6 w-6" />} />
        <StatsCard title="Accepted" value={stats?.acceptedDonations || 0} icon={<Package className="h-6 w-6" />} />
        <StatsCard title="Completed" value={stats?.completedDonations || 0} icon={<CheckCircle2 className="h-6 w-6" />} />
        <StatsCard title="Beneficiaries" value={stats?.totalBeneficiaries || 0} icon={<Users className="h-6 w-6" />} />
        <StatsCard title="Items Distributed" value={stats?.totalItemsDistributed || 0} icon={<Gift className="h-6 w-6" />} />
      </div>
    </div>
  );
}
