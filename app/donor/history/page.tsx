'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Donation, DonationStatus } from '@/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, ArrowRight, Search } from 'lucide-react';

export default function DonationHistory() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const params: any = { limit: 50 };
        if (statusFilter !== 'all') params.status = statusFilter;
        if (search) params.search = search;
        const res = await api.get('/donations', { params });
        setDonations(res.data.data || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchDonations();
  }, [statusFilter, search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Donation History</h1>
        <p className="text-muted-foreground mt-1">Track all your past and current donations</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search donations..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={(val: any) => setStatusFilter(val)}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Filter by status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {Object.values(DonationStatus).map((s) => <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
      ) : donations.length === 0 ? (
        <Card><CardContent className="py-12 text-center">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No donations found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter</p>
        </CardContent></Card>
      ) : (
        <div className="space-y-3">
          {donations.map((donation) => (
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
    </div>
  );
}
