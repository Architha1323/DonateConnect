'use client';

import { useEffect, useState } from 'react';
import { getBeneficiaryRequests, createBeneficiaryRequest } from '@/actions/beneficiaries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Plus, Loader2 } from 'lucide-react';
import { ItemCategory } from '@/types';

export default function BeneficiaryRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [formData, setFormData] = useState({ category: '', quantity: 1, description: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchRequests = async () => {
    const res = await getBeneficiaryRequests();
    if (!res.error) setRequests(res.requests || []);
    setLoading(false);
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await createBeneficiaryRequest(formData);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success('Request submitted');
      setShowForm(false);
      setFormData({ category: '', quantity: 1, description: '' });
      fetchRequests();
    }
    setSubmitting(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Requests</h1>
        <Button onClick={() => setShowForm(!showForm)} className="bg-emerald-500">
          <Plus className="mr-2 h-4 w-4" /> New Request
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle>Create Request</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select required onValueChange={(v: any) => setFormData({ ...formData, category: v })}>
                    <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                    <SelectContent>
                      {Object.values(ItemCategory).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input type="number" min={1} required value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Why do you need this?" />
              </div>
              <Button type="submit" disabled={submitting}>
                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Submit'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {requests.map(req => (
          <Card key={req.id}>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-lg">{req.category}</p>
                <p className="text-muted-foreground">{req.description || 'No description'}</p>
                <p className="text-sm mt-1">Quantity: {req.quantity} · {new Date(req.createdAt).toLocaleDateString()}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${req.status === 'FULFILLED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {req.status}
              </div>
            </CardContent>
          </Card>
        ))}
        {requests.length === 0 && !showForm && (
          <div className="text-center py-12 text-muted-foreground">No requests found. Create one to get started.</div>
        )}
      </div>
    </div>
  );
}
