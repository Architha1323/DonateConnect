'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Heart, Menu, Sun, Moon, LogOut, User, LayoutDashboard, Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types';
import { useState, useEffect } from 'react';
import { DonateButton } from '@/components/ui/donate-button';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';
import { NotificationItem } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/ngos', label: 'NGO Directory' },
  { href: '/contact', label: 'Contact' },
];

function getDashboardPath(role: UserRole) {
  switch (role) {
    case UserRole.DONOR: return '/donor/dashboard';
    case UserRole.NGO: return '/ngo/dashboard';
    case UserRole.ADMIN: return '/admin/dashboard';
    case UserRole.BENEFICIARY: return '/beneficiary/dashboard';
    default: return '/';
  }
}

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async (showToast = false) => {
    try {
      const res = await api.get('/notifications');
      const newNotifs = res.data.data || [];
      
      if (showToast) {
        setNotifications((prev) => {
          const prevIds = new Set(prev.map(n => n.id));
          const trulyNew = newNotifs.filter((n: NotificationItem) => !prevIds.has(n.id) && !n.isRead);
          
          trulyNew.forEach((n: NotificationItem) => {
            toast(n.title, { description: n.message });
          });
          return newNotifs;
        });
      } else {
        setNotifications(newNotifs);
      }
      
      setUnreadCount(res.data.meta?.unreadCount || 0);
    } catch (e) {
      console.error('Failed to fetch notifications', e);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchNotifications(false);
      const interval = setInterval(() => {
        fetchNotifications(true);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user]);

  const handleNotificationClick = async (notif: NotificationItem) => {
    if (!notif.isRead) {
      try {
        await api.patch(`/notifications/${notif.id}/read`);
        setUnreadCount((prev) => Math.max(0, prev - 1));
        setNotifications((prev) => prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n)));
      } catch (e) { console.error(e); }
    }
    if (notif.link) {
      router.push(notif.link);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) { console.error(e); }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105 active:scale-95">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-sm">
            <Heart className="h-5 w-5 text-white" fill="white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent hidden sm:inline-block">
            DonateConnect
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="rounded-full">
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {isAuthenticated && user ? (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground font-medium">
                <Link href={getDashboardPath(user.role)}>Dashboard</Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative" />}>
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-2 flex h-2 w-2 rounded-full bg-red-500 shadow-sm" />
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="flex items-center justify-between p-3 border-b">
                    <p className="font-semibold text-sm">Notifications</p>
                    {unreadCount > 0 && (
                      <button onClick={handleMarkAllRead} className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">Mark all as read</button>
                    )}
                  </div>
                  <ScrollArea className="h-[300px]">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-sm text-muted-foreground flex flex-col items-center">
                        <Bell className="h-8 w-8 mb-2 opacity-20" />
                        No notifications yet
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        {notifications.map((notif) => (
                          <div 
                            key={notif.id} 
                            onClick={() => handleNotificationClick(notif)}
                            className={`p-3 border-b last:border-0 cursor-pointer transition-colors hover:bg-muted/50 ${!notif.isRead ? 'bg-emerald-50/30 dark:bg-emerald-950/20' : ''}`}
                          >
                            <div className="flex gap-3">
                              {!notif.isRead && <div className="mt-1.5 h-2 w-2 rounded-full bg-emerald-500 shrink-0" />}
                              <div className={notif.isRead ? 'ml-0' : ''}>
                                <p className="text-sm font-semibold">{notif.title}</p>
                                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{notif.message}</p>
                                <p className="text-[10px] text-muted-foreground mt-1">{new Date(notif.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </DropdownMenuContent>
              </DropdownMenu>
              <DonateButton size="sm" className="hidden lg:flex rounded-lg px-4" showIcon={false} />

              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="ghost" className="relative h-9 w-9 rounded-full ml-2" />}>
                  <Avatar className="h-9 w-9 border-2 border-emerald-500/30">
                    <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-sm font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center gap-2 p-2">
                    <div className="flex flex-col space-y-0.5">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push(getDashboardPath(user.role))}>
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/donor/profile')}>
                    <User className="mr-2 h-4 w-4" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="outline" asChild><Link href="/login">Sign In</Link></Button>
              <DonateButton />
            </div>
          )}

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="text-lg font-medium py-2 hover:text-emerald-600 transition-colors">
                    {link.label}
                  </Link>
                ))}
                {!isAuthenticated && (
                  <div className="flex flex-col gap-2 mt-4">
                    <Button variant="outline" asChild onClick={() => setOpen(false)}><Link href="/login">Sign In</Link></Button>
                    <DonateButton onClick={() => setOpen(false)} />
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
