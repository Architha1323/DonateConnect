'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { submitComplaint } from '@/actions/complaints';
import { Loader2 } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await submitComplaint(formData);
      if (res.error) throw new Error(res.error);
      toast.success('Your message has been sent successfully. We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Contact Us</CardTitle>
          <CardDescription>Have a question or feedback? We&apos;d love to hear from you.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" required value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" required rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-emerald-500 to-teal-600">
              {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : 'Send Message'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
