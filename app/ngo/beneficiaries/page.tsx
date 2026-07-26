'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Beneficiary } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Users, User } from 'lucide-react';

export default function NgoBeneficiariesPage() {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/beneficiaries').then((res) => setBeneficiaries(res.data.data || [])).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20" />)}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Beneficiaries</h1>
      <p className="text-muted-foreground">People and families served by your organization</p>
      {beneficiaries.length === 0 ? (
        <Card><CardContent className="py-12 text-center"><Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><h3 className="text-lg font-semibold">No beneficiaries yet</h3></CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {beneficiaries.map((b) => (
            <Card key={b.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <User className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{b.user?.name || 'Unknown'}</p>
                  <div className="flex gap-1 mt-1 flex-wrap">{b.needCategory?.map((c) => <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>)}</div>
                </div>
                <Badge variant="outline">{b._count?.requests || 0} requests</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
