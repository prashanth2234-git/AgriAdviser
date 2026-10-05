import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className }) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  };

  return <Loader2 className={clsx('animate-spin text-agri-600', sizeMap[size], className)} />;
};

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => {
  return <div className={clsx('animate-pulse bg-stone-200/70 rounded-lg', className)} />;
};
