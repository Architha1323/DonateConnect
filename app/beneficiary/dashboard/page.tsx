'use client';

import { useEffect, useState } from 'react';
import { getBeneficiaryRequests } from '@/actions/beneficiaries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Clock, CheckCircle2 } from 'lucide-react';
import { StatsCard } from '@/components/shared/StatsCard';

export default function BeneficiaryDashboard() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBeneficiaryRequests().then(res => {
      if (!res.error) setRequests(res.requests || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;

  const openReqs = requests.filter(r => r.status === 'OPEN' || r.status === 'IN_PROGRESS').length;
  const fulfilledReqs = requests.filter(r => r.status === 'FULFILLED').length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Beneficiary Dashboard</h1>
        <p className="text-muted-foreground mt-1">Track your requests for items</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard title="Total Requests" value={requests.length} icon={<Package className="h-6 w-6" />} />
        <StatsCard title="Open Requests" value={openReqs} icon={<Clock className="h-6 w-6" />} />
        <StatsCard title="Fulfilled" value={fulfilledReqs} icon={<CheckCircle2 className="h-6 w-6" />} />
      </div>

      <Card>
        <CardHeader><CardTitle>Recent Requests</CardTitle></CardHeader>
        <CardContent>
          {requests.length === 0 ? <p className="text-muted-foreground text-center py-6">No requests found</p> : (
            <div className="space-y-4">
              {requests.slice(0, 5).map(req => (
                <div key={req.id} className="flex justify-between items-center p-4 border rounded-xl">
                  <div>
                    <p className="font-medium">{req.category}</p>
                    <p className="text-sm text-muted-foreground">Qty: {req.quantity} · {new Date(req.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${req.status === 'FULFILLED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
