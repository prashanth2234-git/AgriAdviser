import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Calendar, MapPin } from 'lucide-react';
import { AdvisoryRecord } from '@shared/types';
import { Badge } from '../ui/Badge';
import { ADVISORY_DOMAIN_METADATA, AdvisoryDomain } from '@shared/constants';

export const RecentAdvisoryCard: React.FC<{ advisory: AdvisoryRecord }> = ({ advisory }) => {
  const domainKey = advisory.request?.domain as AdvisoryDomain;
  const domainLabel = ADVISORY_DOMAIN_METADATA[domainKey]?.label || advisory.request?.domain || 'Advisory';

  const risk = advisory.risk_assessment?.overall || 'unknown';
  const riskVariants: Record<string, 'green' | 'amber' | 'rose' | 'stone'> = {
    low: 'green',
    medium: 'amber',
    high: 'rose',
    unknown: 'stone',
  };

  const formattedDate = new Date(advisory.created_at).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="card p-5 hover:border-agri-200 transition-all flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div>
            <h3 className="text-base font-bold text-stone-900 group-hover:text-agri-700 transition-colors">
              {advisory.request?.crop_name}
            </h3>
            <span className="text-xs text-stone-500 font-medium capitalize">
              Stage: {advisory.request?.crop_stage?.replace(/_/g, ' ')}
            </span>
          </div>
          <Badge variant={riskVariants[risk] || 'stone'} size="sm" dot>
            {risk.toUpperCase()} RISK
          </Badge>
        </div>

        <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-4">
          {advisory.summary}
        </p>
      </div>

      <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-stone-400" />
            {formattedDate}
          </span>
          {advisory.request?.location && (
            <span className="hidden sm:flex items-center gap-1 truncate max-w-[120px]">
              <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              {advisory.request.location}
            </span>
          )}
        </div>

        <Link
          to={`/advisory/${advisory.id}`}
          className="inline-flex items-center gap-1 font-semibold text-agri-600 hover:text-agri-700 text-xs"
        >
          <span>View Report</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
