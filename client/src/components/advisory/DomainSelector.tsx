import React from 'react';
import {
  Sprout,
  SlidersHorizontal,
  Layers,
  Droplets,
  Bug,
  ShieldAlert,
  FlaskConical,
  CalendarCheck,
  Leaf,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { ADVISORY_DOMAINS, ADVISORY_DOMAIN_METADATA, AdvisoryDomain } from '@shared/constants';
import { clsx } from 'clsx';

const iconComponents: Record<string, React.FC<{ className?: string }>> = {
  Sprout,
  SlidersHorizontal,
  Layers,
  Droplets,
  Bug,
  ShieldAlert,
  FlaskConical,
  CalendarCheck,
  Leaf,
  AlertTriangle,
};

export interface DomainSelectorProps {
  selectedDomain: AdvisoryDomain;
  onSelect: (domain: AdvisoryDomain) => void;
}

export const DomainSelector: React.FC<DomainSelectorProps> = ({ selectedDomain, onSelect }) => {
  return (
    <div className="space-y-4 text-left">
      <div>
        <h3 className="text-base font-semibold text-stone-900">Select Agriculture Advisory Domain</h3>
        <p className="text-xs text-stone-500 mt-0.5">
          Choose the specialized area for this advisory request. Our AI reasoning adapts directly to your focus.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ADVISORY_DOMAINS.map((domain) => {
          const meta = ADVISORY_DOMAIN_METADATA[domain];
          const isSelected = selectedDomain === domain;
          const Icon = iconComponents[meta.icon] || Sprout;

          return (
            <button
              type="button"
              key={domain}
              onClick={() => onSelect(domain)}
              className={clsx(
                'p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between group cursor-pointer focus:outline-none focus:ring-2 focus:ring-agri-500',
                isSelected
                  ? 'bg-agri-50/70 border-agri-500 shadow-sm ring-1 ring-agri-500'
                  : 'bg-white border-stone-200 hover:border-agri-300 hover:bg-stone-50/50'
              )}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div
                  className={clsx(
                    'w-9 h-9 rounded-lg flex items-center justify-center transition-colors',
                    isSelected
                      ? 'bg-agri-600 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-600 group-hover:bg-agri-100 group-hover:text-agri-700'
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                {isSelected && (
                  <CheckCircle2 className="w-5 h-5 text-agri-600 shrink-0" />
                )}
              </div>

              <div>
                <h4
                  className={clsx(
                    'text-sm font-bold transition-colors',
                    isSelected ? 'text-agri-900' : 'text-stone-900 group-hover:text-agri-700'
                  )}
                >
                  {meta.label}
                </h4>
                <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                  {meta.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
