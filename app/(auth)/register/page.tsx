'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signInWithGoogle } from '@/actions/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const roleOptions = [
  { value: UserRole.DONOR, label: 'Donor', description: 'I want to donate items' },
  { value: UserRole.NGO, label: 'NGO', description: 'I represent an NGO' },
  { value: UserRole.BENEFICIARY, label: 'Beneficiary', description: 'I need items' },
];

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.DONOR);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setIsLoading(true);
    try {
      await register({ name, email, password, phone: phone || undefined, role });
      toast.success('Account created successfully!');
      const paths: Record<string, string> = { DONOR: '/donor/dashboard', NGO: '/ngo/dashboard', ADMIN: '/admin/dashboard', BENEFICIARY: '/beneficiary/dashboard' };
      router.push(paths[role] || '/');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const res = await signInWithGoogle(window.location.origin);
      if (res?.error) {
        toast.error(res.error);
        setIsLoading(false);
      } else if (res?.url) {
        window.location.href = res.url;
      }
    } catch (error: any) {
      toast.error('Google signup failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-emerald-50/50 via-background to-teal-50/50 dark:from-emerald-950/20 dark:via-background dark:to-teal-950/20">
      <Card className="w-full max-w-md border-0 shadow-2xl shadow-emerald-500/5">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25">
              <Heart className="h-7 w-7 text-white" fill="white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>Join DonateConnect and start making a difference</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div className="space-y-2">
              <Label>I am a</Label>
              <div className="grid grid-cols-3 gap-2">
                {roleOptions.map((opt) => (
                  <button key={opt.value} type="button" onClick={() => setRole(opt.value)}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${role === opt.value ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400' : 'border-border hover:border-emerald-300'}`}>
                    <p className="text-sm font-semibold">{opt.label}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{opt.description}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input id="phone" type="tel" placeholder="+91-9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Min 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-11 pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" disabled={isLoading} className="w-full h-11 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/25">
              {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...</> : 'Create Account'}
            </Button>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <Button type="button" variant="outline" className="w-full h-11 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800" onClick={handleGoogleLogin} disabled={isLoading}>
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-emerald-600 hover:text-emerald-700">Sign in</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
