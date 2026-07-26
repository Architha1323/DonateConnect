'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { DonorStats, Donation } from '@/types';
import { StatsCard } from '@/components/shared/StatsCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Gift, Package, CheckCircle2, XCircle, ArrowRight, Plus } from 'lucide-react';

export default function DonorDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DonorStats | null>(null);
  const [recentDonations, setRecentDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, donationsRes] = await Promise.all([
          api.get('/donations/stats'),
          api.get('/donations?limit=5'),
        ]);
        setStats(statsRes.data.data);
        setRecentDonations(donationsRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-muted-foreground mt-1">Here&apos;s an overview of your donation activity</p>
        </div>
        <Button asChild className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/25">
          <Link href="/donor/donate"><Plus className="mr-2 h-4 w-4" /> New Donation</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Donations" value={stats?.totalDonations || 0} icon={<Gift className="h-6 w-6" />} />
        <StatsCard title="Active Donations" value={stats?.activeDonations || 0} icon={<Package className="h-6 w-6" />} />
        <StatsCard title="Completed" value={stats?.completedDonations || 0} icon={<CheckCircle2 className="h-6 w-6" />} />
        <StatsCard title="Items Donated" value={stats?.totalItemsDonated || 0} icon={<Gift className="h-6 w-6" />} />
      </div>

      {/* Recent Donations */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Donations</CardTitle>
            <CardDescription>Your latest donation activities</CardDescription>
          </div>
          <Button variant="ghost" asChild><Link href="/donor/history">View All <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
        </CardHeader>
        <CardContent>
          {recentDonations.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Gift className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <h3 className="text-lg font-semibold">No donations yet</h3>
              <p className="text-muted-foreground">Start making a difference by donating your unused items!</p>
              <Button asChild className="bg-gradient-to-r from-emerald-500 to-teal-600">
                <Link href="/donor/donate">Create Your First Donation</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentDonations.map((donation) => (
                <Link key={donation.id} href={`/donor/donations/${donation.id}`}
                  className="flex items-center justify-between p-4 rounded-xl border hover:bg-muted/50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                      <Package className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-medium">{donation.items?.[0]?.itemName || 'Donation'}{donation.items?.length > 1 ? ` +${donation.items.length - 1} more` : ''}</p>
                      <p className="text-sm text-muted-foreground">{donation.totalItems} items · {new Date(donation.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={donation.status} />
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
