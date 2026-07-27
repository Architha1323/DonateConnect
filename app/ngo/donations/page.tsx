'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { Donation, DonationStatus } from '@/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, Check, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function NgoDonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchDonations = useCallback(async () => {
    try {
      const params: { limit: number; status?: string } = { limit: 50 };
      if (filter !== 'all') params.status = filter;
      const res = await api.get('/donations', { params: params as Record<string, unknown> });
      setDonations(res.data.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [filter]);

  useEffect(() => {
    const timer = setTimeout(() => { fetchDonations(); }, 0);
    return () => clearTimeout(timer);
  }, [fetchDonations]);

  const handleAccept = async (donationId: string) => {
    try {
      await api.post(`/donations/${donationId}/accept`);
      toast.success('Donation accepted!');
      fetchDonations();
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || 'Failed to accept');
    }
  };

  const handleUpdateStatus = async (donationId: string, status: DonationStatus) => {
    try {
      await api.patch(`/donations/${donationId}/status`, { status });
      toast.success('Status updated!');
      fetchDonations();
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || 'Failed to update');
    }
  };

  if (loading) return <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-24" />)}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Donations</h1>
          <p className="text-muted-foreground">Accept and manage donation requests</p>
        </div>
        <Select value={filter} onValueChange={(val) => val && setFilter(val)}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {Object.values(DonationStatus).map((s) => <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {donations.length === 0 ? (
        <Card><CardContent className="py-12 text-center"><Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><h3 className="text-lg font-semibold">No donations found</h3></CardContent></Card>
      ) : (
        <div className="space-y-4">
          {donations.map((d) => (
            <Card key={d.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <Package className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-semibold">{d.items?.[0]?.itemName || 'Donation'}{d.items?.length > 1 ? ` +${d.items.length - 1} more` : ''}</p>
                      <p className="text-sm text-muted-foreground">By {d.donor?.name} · {d.totalItems} items · {d.pickupRequest?.city || 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground">{new Date(d.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={d.status} />
                    {d.status === DonationStatus.PENDING && (
                      <Button size="sm" onClick={() => handleAccept(d.id)} className="bg-emerald-500 hover:bg-emerald-600"><Check className="mr-1 h-4 w-4" /> Accept</Button>
                    )}
                    {d.status === DonationStatus.ACCEPTED && (
                      <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(d.id, DonationStatus.PICKUP_SCHEDULED)}>Schedule Pickup</Button>
                    )}
                    {d.status === DonationStatus.PICKUP_SCHEDULED && (
                      <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(d.id, DonationStatus.COLLECTED)}>Mark Collected</Button>
                    )}
                    {d.status === DonationStatus.COLLECTED && (
                      <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(d.id, DonationStatus.RECEIVED)}>Mark Received</Button>
                    )}
                    {d.status === DonationStatus.RECEIVED && (
                      <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(d.id, DonationStatus.DISTRIBUTED)}>Mark Distributed</Button>
                    )}
                    {d.status === DonationStatus.DISTRIBUTED && (
                      <Button size="sm" className="bg-emerald-500" onClick={() => handleUpdateStatus(d.id, DonationStatus.COMPLETED)}>Complete</Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
