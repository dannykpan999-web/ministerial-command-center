import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    positive: boolean;
  };
  className?: string;
  loading?: boolean;
}

export function KpiCard({ title, value, icon: Icon, trend, className, loading }: KpiCardProps) {
  if (loading) {
    return (
      <div className={cn('kpi-card', className)}>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-muted skeleton-shimmer" />
            <div className="h-8 w-16 rounded bg-muted skeleton-shimmer" />
          </div>
          <div className="h-10 w-10 rounded-lg bg-muted skeleton-shimmer" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn('kpi-card group', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight">{value}</p>
          {trend && (
            <p className={cn(
              'mt-1 text-xs font-medium',
              trend.positive ? 'text-success' : 'text-destructive'
            )}>
              {trend.positive ? '+' : ''}{trend.value}% vs. ayer
            </p>
          )}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
