import React from 'react';
import { clsx } from 'clsx';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  variant?: 'green' | 'amber' | 'rose' | 'earth';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  variant = 'green',
}) => {
  const iconBgs = {
    green: 'bg-agri-50 text-agri-600 border-agri-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    earth: 'bg-earth-100 text-earth-700 border-earth-200',
  };

  return (
    <div className="card p-5 relative overflow-hidden flex items-start justify-between">
      <div className="space-y-1">
        <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">{title}</p>
        <p className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">{value}</p>
        {subtitle && <p className="text-xs text-stone-500 mt-1">{subtitle}</p>}
      </div>
      <div
        className={clsx(
          'w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0',
          iconBgs[variant]
        )}
      >
        {icon}
      </div>
    </div>
  );
};
