import React from 'react';
import { Sprout, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { SuitabilityLevel } from '@shared/constants';

export interface CropAssessmentData {
  summary: string;
  suitability: SuitabilityLevel;
  positive_factors: string[];
  limiting_factors: string[];
  recommendations: string[];
}

export const CropAssessmentCard: React.FC<{ data: CropAssessmentData }> = ({ data }) => {
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
          <div className="w-8 h-8 rounded-lg bg-agri-50 text-agri-600 flex items-center justify-center">
            <Sprout className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900">Crop Health & Phenology</h3>
            <p className="text-xs text-stone-500">Stage vigor, growth suitability, and development parameters</p>
          </div>
        </div>

        <Badge variant={suitabilityVariants[data.suitability] || 'stone'} size="md" dot>
          SUITABILITY: {data.suitability.toUpperCase()}
        </Badge>
      </div>

      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
        {data.summary}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
        {/* Positive Factors */}
        {data.positive_factors && data.positive_factors.length > 0 && (
          <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100/80 space-y-2">
            <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Positive Factors</span>
            </h4>
            <ul className="space-y-1.5">
              {data.positive_factors.map((f, i) => (
                <li key={i} className="text-xs text-emerald-950 flex items-start gap-1.5">
                  <span className="text-emerald-500 mt-1">•</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Limiting Factors */}
        {data.limiting_factors && data.limiting_factors.length > 0 && (
          <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-100/80 space-y-2">
            <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Limiting Factors</span>
            </h4>
            <ul className="space-y-1.5">
              {data.limiting_factors.map((f, i) => (
                <li key={i} className="text-xs text-amber-950 flex items-start gap-1.5">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {data.recommendations && data.recommendations.length > 0 && (
        <div className="pt-2">
          <h4 className="text-xs font-semibold text-stone-900 mb-2">Stage Recommendations:</h4>
          <ul className="space-y-1.5">
            {data.recommendations.map((rec, i) => (
              <li key={i} className="text-xs text-stone-700 flex items-start gap-2">
                <ArrowRight className="w-3 h-3 text-agri-600 shrink-0 mt-0.5" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
