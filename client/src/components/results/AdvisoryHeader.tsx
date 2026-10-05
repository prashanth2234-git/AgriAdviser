import React from 'react';
import { Calendar, MapPin, Printer, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdvisoryRecord } from '@shared/types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ADVISORY_DOMAIN_METADATA, AdvisoryDomain } from '@shared/constants';

export const AdvisoryHeader: React.FC<{ advisory: AdvisoryRecord }> = ({ advisory }) => {
  const domainKey = advisory.request?.domain as AdvisoryDomain;
  const domainMeta = ADVISORY_DOMAIN_METADATA[domainKey];

  const formattedDate = new Date(advisory.created_at).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 pb-6 border-b border-stone-200">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/history"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Advisory History</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer className="w-3.5 h-3.5" />}
          >
            Print / Save PDF
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
              {advisory.request?.crop_name}
            </h1>
            <Badge variant="green" size="md">
              {advisory.request?.crop_stage?.replace(/_/g, ' ').toUpperCase()}
            </Badge>
            <Badge variant="blue" size="md">
              {domainMeta?.label || advisory.request?.domain}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              Generated on {formattedDate}
            </span>
            {advisory.request?.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                {advisory.request.location}
              </span>
            )}
            {advisory.ai_model && (
              <span className="px-2 py-0.5 rounded bg-stone-100 font-mono text-[10px] text-stone-600">
                Engine: {advisory.ai_model}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
