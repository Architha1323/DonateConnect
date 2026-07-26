'use client';

import { useEffect, useState } from 'react';
import { getAdminStats } from '@/actions/admin';
import { AdminStats } from '@/types';
import { StatsCard } from '@/components/shared/StatsCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Building2, Gift, Package, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats().then((data) => {
      setStats(data as AdminStats);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="space-y-4"><Skeleton className="h-32 w-full" /><Skeleton className="h-64 w-full" /></div>;
  if (!stats) return <div>Failed to load stats</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Platform overview and statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Users" value={stats.totalUsers} icon={<Users className="h-6 w-6" />} />
        <StatsCard title="Verified NGOs" value={stats.totalNgos} icon={<Building2 className="h-6 w-6" />} />
        <StatsCard title="Pending NGOs" value={stats.pendingNgos} icon={<Building2 className="h-6 w-6" />} trend={{ value: stats.pendingNgos, positive: false }} />
        <StatsCard title="Beneficiaries" value={stats.totalBeneficiaries} icon={<Users className="h-6 w-6" />} />
        
        <StatsCard title="Total Donations" value={stats.totalDonations} icon={<Gift className="h-6 w-6" />} />
        <StatsCard title="Completed Donations" value={stats.completedDonations} icon={<CheckCircle2 className="h-6 w-6" />} />
        <StatsCard title="Items Donated" value={stats.totalItemsDonated} icon={<Package className="h-6 w-6" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Donations over time (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.donationsByMonth}>
                <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.1)' }} />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
