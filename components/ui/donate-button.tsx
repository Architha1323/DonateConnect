'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { UserRole } from '@/types';
import { ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function getDashboardPath(role?: UserRole): string {
  if (!role) return '/';
  switch (role) {
    case UserRole.DONOR: return '/donor/dashboard';
    case UserRole.NGO: return '/ngo/dashboard';
    case UserRole.ADMIN: return '/admin/dashboard';
    case UserRole.BENEFICIARY: return '/beneficiary/dashboard';
    default: return '/';
  }
}

interface DonateButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  className?: string;
  showIcon?: boolean;
}

export function DonateButton({ size = 'lg', variant = 'default', className, showIcon = true, ...props }: DonateButtonProps) {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsNavigating(true);

    if (isAuthenticated && user) {
      router.push(getDashboardPath(user.role));
    } else {
      router.push('/login?redirect=donate');
    }
  };

  const isLoading = authLoading || isNavigating;

  return (
    <Button 
      size={size} 
      variant={variant}
      className={cn("transition-all duration-300 font-bold", className)}
      onClick={handleClick}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...</>
      ) : (
        <>
          Donate Now {showIcon && <ArrowRight className="ml-2 h-5 w-5" />}
        </>
      )}
    </Button>
  );
}
