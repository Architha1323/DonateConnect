'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { Donation } from '@/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { StatusTimeline } from '@/components/shared/StatusTimeline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Calendar, Phone, Package, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function DonationDetailPage() {
  const { id } = useParams();
  const [donation, setDonation] = useState<Donation | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this donation?')) return;
    setCancelling(true);
    try {
      await api.patch(`/donations/${id}/status`, { status: 'CANCELLED' });
      toast.success('Donation cancelled successfully');
      const res = await api.get(`/donations/${id}`);
      setDonation(res.data.data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel donation');
    } finally {
      setCancelling(false);
    }
  };

  useEffect(() => {
    api.get(`/donations/${id}`).then((res) => setDonation(res.data.data)).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="space-y-4">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)}</div>;
  if (!donation) return <div className="text-center py-20"><h2 className="text-xl font-bold">Donation not found</h2></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Donation Details</h1>
          <p className="text-sm text-muted-foreground">ID: {donation.id.slice(0, 8)}...</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={donation.status} />
          {donation.status === 'PENDING' && (
            <Button variant="destructive" size="sm" onClick={handleCancel} disabled={cancelling}>
              {cancelling ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
              Cancel Donation
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Items & Pickup */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Package className="h-5 w-5" /> Items ({donation.items.length})</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {donation.items.map((item) => (
                <div key={item.id} className="flex justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">{item.itemName}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="secondary">{item.category}</Badge>
                      <Badge variant="outline">{item.condition}</Badge>
                    </div>
                    {item.description && <p className="text-sm text-muted-foreground mt-2">{item.description}</p>}
                  </div>
                  <p className="font-semibold text-lg">×{item.quantity}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {donation.pickupRequest && (
            <Card>
              <CardHeader><CardTitle>Pickup Information</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3"><MapPin className="h-4 w-4 mt-1 text-muted-foreground shrink-0" /><div><p className="font-medium">{donation.pickupRequest.address}</p><p className="text-sm text-muted-foreground">{donation.pickupRequest.city}, {donation.pickupRequest.state} {donation.pickupRequest.zipCode}</p></div></div>
                <div className="flex items-center gap-3"><Calendar className="h-4 w-4 text-muted-foreground" /><p>{new Date(donation.pickupRequest.scheduledDate).toLocaleDateString()} at {donation.pickupRequest.scheduledTime}</p></div>
                <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-muted-foreground" /><p>{donation.pickupRequest.contactPhone}</p></div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Status Timeline */}
        <div>
          <Card>
            <CardHeader><CardTitle>Status Tracking</CardTitle></CardHeader>
            <CardContent>
              <StatusTimeline currentStatus={donation.status} history={donation.statusHistory} />
            </CardContent>
          </Card>
          {donation.ngo && (
            <Card className="mt-4">
              <CardHeader><CardTitle>Assigned NGO</CardTitle></CardHeader>
              <CardContent>
                <p className="font-semibold">{donation.ngo.ngoName}</p>
                {donation.ngo.city && <p className="text-sm text-muted-foreground">{donation.ngo.city}</p>}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
