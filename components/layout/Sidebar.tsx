'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { UserRole } from '@/types';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Gift, History, User, Building2, Package, Users, FileText, BarChart3, Heart, ClipboardList } from 'lucide-react';

interface SidebarLink { href: string; label: string; icon: React.ReactNode; }

const donorLinks: SidebarLink[] = [
  { href: '/donor/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
  { href: '/donor/donate', label: 'Donate Items', icon: <Gift className="h-4 w-4" /> },
  { href: '/donor/history', label: 'History', icon: <History className="h-4 w-4" /> },
  { href: '/donor/profile', label: 'Profile', icon: <User className="h-4 w-4" /> },
];

const ngoLinks: SidebarLink[] = [
  { href: '/ngo/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
  { href: '/ngo/donations', label: 'Donations', icon: <Gift className="h-4 w-4" /> },
  { href: '/ngo/inventory', label: 'Inventory', icon: <Package className="h-4 w-4" /> },
  { href: '/ngo/beneficiaries', label: 'Beneficiaries', icon: <Users className="h-4 w-4" /> },
];

const adminLinks: SidebarLink[] = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
  { href: '/admin/users', label: 'Users', icon: <Users className="h-4 w-4" /> },
  { href: '/admin/ngos', label: 'NGOs', icon: <Building2 className="h-4 w-4" /> },
  { href: '/admin/donations', label: 'Donations', icon: <Gift className="h-4 w-4" /> },
  { href: '/admin/reports', label: 'Reports', icon: <BarChart3 className="h-4 w-4" /> },
];

const beneficiaryLinks: SidebarLink[] = [
  { href: '/beneficiary/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
  { href: '/beneficiary/requests', label: 'My Requests', icon: <ClipboardList className="h-4 w-4" /> },
];

function getLinks(role: UserRole): SidebarLink[] {
  switch (role) {
    case UserRole.DONOR: return donorLinks;
    case UserRole.NGO: return ngoLinks;
    case UserRole.ADMIN: return adminLinks;
    case UserRole.BENEFICIARY: return beneficiaryLinks;
    default: return [];
  }
}

export default function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user) return null;
  const links = getLinks(user.role);

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-muted min-h-[calc(100vh-4rem)]">
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
            <Heart className="h-5 w-5 text-white" fill="white" />
          </div>
          <div>
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user.role.toLowerCase()}</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <Link key={link.href} href={link.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors',
              pathname === link.href
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-background hover:text-foreground'
            )}>
            {link.icon}
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
