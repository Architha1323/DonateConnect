'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: { value: number; positive: boolean };
  className?: string;
}

export function StatsCard({ title, value, description, icon, trend, className }: StatsCardProps) {
  return (
    <Card className={cn('overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
            {trend && (
              <p className={cn('text-xs font-medium', trend.positive ? 'text-emerald-600' : 'text-red-600')}>
                {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}% from last month
              </p>
            )}
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
