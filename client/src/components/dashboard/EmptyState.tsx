import React from 'react';
import { Sprout, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Crop Advisories Found',
  description = 'You have not submitted any agricultural advisory requests yet. Submit your crop details to receive AI-powered recommendations.',
  actionText = 'Create New Advisory',
  actionHref = '/advisory/new',
}) => {
  return (
    <div className="card p-10 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-8 border-dashed">
      <div className="w-16 h-16 rounded-2xl bg-agri-50 text-agri-600 flex items-center justify-center mb-4 border border-agri-100 shadow-sm">
        <Sprout className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-stone-900 mb-2">{title}</h3>
      <p className="text-xs sm:text-sm text-stone-500 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionHref && (
        <Link to={actionHref}>
          <Button variant="primary" leftIcon={<PlusCircle className="w-4 h-4" />}>
            {actionText}
          </Button>
        </Link>
      )}
    </div>
  );
};
