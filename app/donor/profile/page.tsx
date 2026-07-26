'use client';

import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, Calendar } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-3xl font-bold">My Profile</h1>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20 border-4 border-emerald-500/20">
              <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-2xl font-bold">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <Badge variant="secondary" className="mt-1 capitalize">{user.role.toLowerCase()}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-muted-foreground" /><span>{user.email}</span></div>
          {user.phone && <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-muted-foreground" /><span>{user.phone}</span></div>}
          {user.city && <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-muted-foreground" /><span>{user.city}{user.state ? `, ${user.state}` : ''}</span></div>}
          <div className="flex items-center gap-3"><Calendar className="h-4 w-4 text-muted-foreground" /><span>Joined {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span></div>
        </CardContent>
      </Card>
    </div>
  );
}
