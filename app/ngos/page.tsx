'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Building2, MapPin } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getNgos } from '@/actions/ngos';
import { Ngo } from '@/types';

export default function NgosPage() {
  const [ngos, setNgos] = useState<Ngo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    const fetchNgos = async () => {
      setLoading(true);
      const res = await getNgos({ status: 'VERIFIED', search, location });
      if (!res.error) setNgos(res.ngos as any);
      setLoading(false);
    };
    const timeoutId = setTimeout(fetchNgos, 500);
    return () => clearTimeout(timeoutId);
  }, [search, location]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Verified NGOs</h1>
          <p className="text-muted-foreground text-lg">Discover and support organizations making a difference in your community.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search by NGO name..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12 text-lg shadow-sm"
            />
          </div>
          <div className="relative flex-1 md:max-w-xs">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Filter by city or state..." 
              value={location} 
              onChange={(e) => setLocation(e.target.value)}
              className="pl-10 h-12 text-lg shadow-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
          </div>
        ) : ngos.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold">No NGOs found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ngos.map((ngo) => (
              <Card key={ngo.id} className="hover:shadow-md transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-emerald-600" />
                    </div>
                    {ngo.ngoName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">{ngo.description || 'No description provided.'}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {ngo.city}, {ngo.state}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{ngo._count?.acceptedDonations || 0} Donations</Badge>
                    <Badge variant="outline">{ngo._count?.beneficiaries || 0} Beneficiaries</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
