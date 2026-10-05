import React from 'react';
import { Layers, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { SuitabilityLevel } from '@shared/constants';

export interface SoilAssessmentData {
  summary: string;
  suitability: SuitabilityLevel;
  observations: string[];
  potential_constraints: string[];
  improvement_actions: string[];
}

export const SoilAssessmentCard: React.FC<{ data: SoilAssessmentData }> = ({ data }) => {
  const suitabilityVariants: Record<SuitabilityLevel, 'green' | 'amber' | 'rose' | 'stone'> = {
    high: 'green',
    medium: 'amber',
    low: 'rose',
    unknown: 'stone',
  };

  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-earth-100 text-earth-800 flex items-center justify-center">
            <Layers className="w-4 h-4 text-earth-700" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900">Soil Condition & Edaphic Dynamics</h3>
            <p className="text-xs text-stone-500">Texture response, pH balancing, and organic conditioning</p>
          </div>
        </div>

        <Badge variant={suitabilityVariants[data.suitability] || 'stone'} size="md" dot>
          SOIL: {data.suitability.toUpperCase()}
        </Badge>
      </div>

      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
        {data.summary}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
        {data.observations && data.observations.length > 0 && (
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-2">
            <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-stone-600" />
              <span>Edaphic Observations</span>
            </h4>
            <ul className="space-y-1.5">
              {data.observations.map((obs, i) => (
                <li key={i} className="text-xs text-stone-700 flex items-start gap-1.5">
                  <span className="text-stone-400 mt-1">•</span>
                  <span>{obs}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.potential_constraints && data.potential_constraints.length > 0 && (
          <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-100/80 space-y-2">
            <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Potential Constraints</span>
            </h4>
            <ul className="space-y-1.5">
              {data.potential_constraints.map((c, i) => (
                <li key={i} className="text-xs text-amber-950 flex items-start gap-1.5">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {data.improvement_actions && data.improvement_actions.length > 0 && (
        <div className="pt-2">
          <h4 className="text-xs font-semibold text-stone-900 mb-2">Soil Conditioning Recommendations:</h4>
          <ul className="space-y-1.5">
            {data.improvement_actions.map((act, i) => (
              <li key={i} className="text-xs text-stone-700 flex items-start gap-2">
                <ArrowRight className="w-3 h-3 text-earth-600 shrink-0 mt-0.5" />
                <span>{act}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
