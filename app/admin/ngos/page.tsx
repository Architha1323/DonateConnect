'use client';

import { useEffect, useState } from 'react';
import { getNgos, verifyNgo } from '@/actions/ngos';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AdminNgosPage() {
  const [ngos, setNgos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNgos = async () => {
    const res = await getNgos({ limit: 100 });
    if (!res.error) setNgos(res.ngos);
    setLoading(false);
  };

  useEffect(() => { fetchNgos(); }, []);

  const handleVerify = async (id: string, status: 'VERIFIED' | 'REJECTED') => {
    await verifyNgo(id, status);
    toast.success(`NGO ${status.toLowerCase()}`);
    fetchNgos();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Manage NGOs</h1>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NGO Name</TableHead>
                <TableHead>Reg. Number</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ngos.map((ngo) => (
                <TableRow key={ngo.id}>
                  <TableCell className="font-medium">{ngo.ngoName}</TableCell>
                  <TableCell>{ngo.registrationNumber}</TableCell>
                  <TableCell>{ngo.user.email}</TableCell>
                  <TableCell>
                    <Badge variant={ngo.verificationStatus === 'VERIFIED' ? 'default' : ngo.verificationStatus === 'REJECTED' ? 'destructive' : 'secondary'}>
                      {ngo.verificationStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {ngo.verificationStatus === 'PENDING' && (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleVerify(ngo.id, 'VERIFIED')} className="bg-emerald-500">Approve</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleVerify(ngo.id, 'REJECTED')}>Reject</Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
