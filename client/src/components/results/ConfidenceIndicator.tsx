import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { ConfidenceLevel } from '@shared/constants';

export const ConfidenceIndicator: React.FC<{ confidence: ConfidenceLevel }> = ({ confidence }) => {
  const configs: Record<
    ConfidenceLevel,
    { label: string; variant: 'green' | 'amber' | 'stone'; desc: string }
  > = {
    high: {
      label: 'High Confidence',
      variant: 'green',
      desc: 'Based on comprehensive field input, crop stage alignment, and standard regional agronomic baselines.',
    },
    medium: {
      label: 'Moderate Confidence',
      variant: 'amber',
      desc: 'Sufficient context provided for general guidance, but local soil test or weather validation is recommended.',
    },
    low: {
      label: 'Cautious / Low Confidence',
      variant: 'stone',
      desc: 'Limited input parameters provided. Recommendations should be treated as general guidelines requiring field verification.',
    },
  };

  const current = configs[confidence] || configs.medium;

  return (
    <div className="flex items-center gap-2">
      <Badge variant={current.variant} size="md" dot>
        {current.label}
      </Badge>
      <span className="text-[11px] text-stone-500 hidden sm:inline" title={current.desc}>
        ({current.desc})
      </span>
    </div>
  );
};
