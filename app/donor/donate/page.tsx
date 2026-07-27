'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { ItemCategory, ItemCondition } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus, Trash2, Gift, Truck, Check, Building2, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface DonationItemForm {
  itemName: string; category: ItemCategory; quantity: number; condition: ItemCondition; description: string;
}

const emptyItem: DonationItemForm = { itemName: '', category: ItemCategory.CLOTHES, quantity: 1, condition: ItemCondition.GOOD, description: '' };

const categoryLabels: Record<ItemCategory, string> = {
  CLOTHES: '👕 Clothes', BOOKS: '📚 Books', TOYS: '🧸 Toys', FURNITURE: '🪑 Furniture',
  KITCHEN: '🍳 Kitchen', ELECTRONICS: '📱 Electronics', STATIONERY: '✏️ Stationery',
  HOUSEHOLD: '🏠 Household', OTHER: '📦 Other',
};
const conditionLabels: Record<ItemCondition, string> = {
  NEW: 'New', LIKE_NEW: 'Like New', GOOD: 'Good', FAIR: 'Fair', WORN: 'Worn',
};

export default function DonatePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [items, setItems] = useState<DonationItemForm[]>([{ ...emptyItem }]);
  const [notes, setNotes] = useState('');
  const [pickup, setPickup] = useState({ address: '', city: '', state: '', zipCode: '', landmark: '', scheduledDate: '', scheduledTime: '', contactPhone: '' });
  const [selectedNgoId, setSelectedNgoId] = useState<string>('');
  const [ngos, setNgos] = useState<any[]>([]);
  const [loadingNgos, setLoadingNgos] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (step === 3 && ngos.length === 0) {
      setLoadingNgos(true);
      api.get('/ngos', { params: { status: 'VERIFIED' } })
        .then((res: any) => setNgos(res.data.data || []))
        .catch((err: any) => console.error(err))
        .finally(() => setLoadingNgos(false));
    }
  }, [step, ngos.length]);

  const updateItem = (index: number, field: keyof DonationItemForm, value: any) => {
    const updated = [...items];
    (updated[index] as any)[field] = value;
    setItems(updated);
  };

  const addItem = () => setItems([...items, { ...emptyItem }]);
  const removeItem = (index: number) => { if (items.length > 1) setItems(items.filter((_, i) => i !== index)); };

  const handleSubmit = async () => {
    if (items.some((item) => !item.itemName)) { toast.error('Please fill in all item names'); return; }
    if (!pickup.address || !pickup.city || !pickup.scheduledDate || !pickup.contactPhone) { toast.error('Please fill in all pickup details'); return; }
    setIsLoading(true);
    try {
      const payload: any = { notes, items, pickup: { ...pickup, scheduledDate: new Date(pickup.scheduledDate).toISOString() } };
      if (selectedNgoId) {
        payload.ngoId = selectedNgoId;
      }
      await api.post('/donations', payload);
      toast.success('Donation created successfully!');
      router.push('/donor/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create donation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Donate Items</h1>
        <p className="text-muted-foreground mt-1">List the items you&apos;d like to donate and schedule a pickup</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2">
        {[{ n: 1, label: 'Items' }, { n: 2, label: 'Pickup' }, { n: 3, label: 'Select NGO' }, { n: 4, label: 'Review' }].map((s, i) => (
          <div key={s.n} className="flex items-center gap-2 flex-1">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold shrink-0 ${step >= s.n ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'}`}>
              {step > s.n ? <Check className="h-4 w-4" /> : s.n}
            </div>
            <span className={`text-sm font-medium hidden sm:inline ${step >= s.n ? 'text-foreground' : 'text-muted-foreground'}`}>{s.label}</span>
            {i < 3 && <div className={`flex-1 h-0.5 ${step > s.n ? 'bg-emerald-500' : 'bg-muted'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Items */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Gift className="h-5 w-5" /> Item Details</CardTitle>
            <CardDescription>Add the items you want to donate</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {items.map((item, index) => (
              <div key={index} className="space-y-4 p-4 rounded-xl border bg-muted/20">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Item {index + 1}</h4>
                  {items.length > 1 && <Button variant="ghost" size="sm" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Item Name *</Label>
                    <Input placeholder="e.g., Winter Jacket" value={item.itemName} onChange={(e) => updateItem(index, 'itemName', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select value={item.category} onValueChange={(v) => updateItem(index, 'category', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{Object.entries(categoryLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Quantity *</Label>
                    <Input type="number" min={1} value={item.quantity} onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Condition *</Label>
                    <Select value={item.condition} onValueChange={(v) => updateItem(index, 'condition', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{Object.entries(conditionLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Brief description of the item..." value={item.description} onChange={(e) => updateItem(index, 'description', e.target.value)} rows={2} />
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={addItem} className="w-full border-dashed"><Plus className="mr-2 h-4 w-4" /> Add Another Item</Button>
            <div className="space-y-2">
              <Label>Additional Notes</Label>
              <Textarea placeholder="Any special instructions..." value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setStep(2)} className="bg-gradient-to-r from-emerald-500 to-teal-600">Next: Schedule Pickup <Check className="ml-2 h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Pickup */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Truck className="h-5 w-5" /> Pickup Details</CardTitle>
            <CardDescription>Where and when should we pick up the items?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Address *</Label><Input placeholder="Street address" value={pickup.address} onChange={(e) => setPickup({ ...pickup, address: e.target.value })} /></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2"><Label>City *</Label><Input placeholder="City" value={pickup.city} onChange={(e) => setPickup({ ...pickup, city: e.target.value })} /></div>
              <div className="space-y-2"><Label>State *</Label><Input placeholder="State" value={pickup.state} onChange={(e) => setPickup({ ...pickup, state: e.target.value })} /></div>
              <div className="space-y-2"><Label>ZIP Code</Label><Input placeholder="ZIP" value={pickup.zipCode} onChange={(e) => setPickup({ ...pickup, zipCode: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label>Landmark</Label><Input placeholder="Near landmark" value={pickup.landmark} onChange={(e) => setPickup({ ...pickup, landmark: e.target.value })} /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Pickup Date *</Label><Input type="date" value={pickup.scheduledDate} onChange={(e) => setPickup({ ...pickup, scheduledDate: e.target.value })} /></div>
              <div className="space-y-2"><Label>Preferred Time *</Label><Input placeholder="e.g., 10:00 AM" value={pickup.scheduledTime} onChange={(e) => setPickup({ ...pickup, scheduledTime: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label>Contact Phone *</Label><Input placeholder="+91-9876543210" value={pickup.contactPhone} onChange={(e) => setPickup({ ...pickup, contactPhone: e.target.value })} /></div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => setStep(3)} className="bg-gradient-to-r from-emerald-500 to-teal-600">Next: Select NGO</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Select NGO */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" /> Select an NGO (Optional)</CardTitle>
            <CardDescription>Choose a specific NGO to receive your donation, or leave it unselected to open it to all nearby NGOs.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {loadingNgos ? (
              <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-emerald-500" /></div>
            ) : ngos.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No verified NGOs found in your area. Your donation will be open to all.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                <div 
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedNgoId === '' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 shadow-sm' : 'hover:border-emerald-500/50'}`}
                  onClick={() => setSelectedNgoId('')}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                      <Gift className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-base">Open Pool (Recommended)</h4>
                      <p className="text-sm text-muted-foreground">Any verified NGO can view and accept your donation</p>
                    </div>
                  </div>
                </div>

                <div className="text-sm font-medium text-muted-foreground px-1 mt-2">Or select a specific NGO:</div>
                
                {ngos.map((ngo) => (
                  <div 
                    key={ngo.id} 
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedNgoId === ngo.id ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 shadow-sm' : 'hover:border-emerald-500/50'}`}
                    onClick={() => setSelectedNgoId(ngo.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                        <Building2 className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-base line-clamp-1">{ngo.ngoName}</h4>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span className="line-clamp-1">{ngo.city}, {ngo.state}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button onClick={() => setStep(4)} className="bg-gradient-to-r from-emerald-500 to-teal-600">Next: Review</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Review */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Review Your Donation</CardTitle>
            <CardDescription>Please confirm the details before submitting</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <h3 className="font-semibold">Items ({items.length})</h3>
              {items.map((item, i) => (
                <div key={i} className="flex justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">{item.itemName}</p>
                    <p className="text-sm text-muted-foreground">{categoryLabels[item.category]} · {conditionLabels[item.condition]}</p>
                  </div>
                  <p className="font-medium">x{item.quantity}</p>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Pickup Details</h3>
                <div className="p-3 rounded-lg bg-muted/50 text-sm space-y-1 h-full">
                  <p>{pickup.address}, {pickup.city}, {pickup.state} {pickup.zipCode}</p>
                  <p>Date: {pickup.scheduledDate} at {pickup.scheduledTime}</p>
                  <p>Phone: {pickup.contactPhone}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">Selected NGO</h3>
                <div className="p-3 rounded-lg bg-muted/50 text-sm h-full flex flex-col justify-center">
                  {selectedNgoId ? (
                    <>
                      <p className="font-medium">{ngos.find(n => n.id === selectedNgoId)?.ngoName}</p>
                      <p className="text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {ngos.find(n => n.id === selectedNgoId)?.city}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-medium text-emerald-600 dark:text-emerald-400">Open Pool</p>
                      <p className="text-muted-foreground mt-1">Available to all verified NGOs</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
              <Button onClick={handleSubmit} disabled={isLoading} className="bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25">
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : 'Submit Donation'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
