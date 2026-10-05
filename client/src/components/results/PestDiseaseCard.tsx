import React from 'react';
import { Bug, AlertCircle, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import { Badge } from '../ui/Badge';

export interface PossibleCause {
  name: string;
  reasoning: string;
  likelihood: 'high' | 'medium' | 'low' | 'unknown';
}

export interface PestDiseaseData {
  summary: string;
  possible_causes: PossibleCause[];
  immediate_actions: string[];
  preventive_actions: string[];
  professional_verification_recommended: boolean;
}

export const PestDiseaseCard: React.FC<{ data: PestDiseaseData }> = ({ data }) => {
  const getLikelihoodVariant = (l: string): 'green' | 'amber' | 'rose' | 'stone' => {
    switch (l) {
      case 'high':
        return 'rose';
      case 'medium':
        return 'amber';
      case 'low':
        return 'green';
      default:
        return 'stone';
    }
  };

  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <Bug className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900">Integrated Pest & Disease Assessment</h3>
            <p className="text-xs text-stone-500">Causal possibilities, threshold monitoring, and biological controls</p>
          </div>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
        {data.summary}
      </p>

      {/* Possible Causes Grid */}
      {data.possible_causes && data.possible_causes.length > 0 && (
        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
            Potential Diagnoses & Symptom Correlations
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.possible_causes.map((cause, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 flex flex-col justify-between space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <h5 className="text-xs font-bold text-stone-900">{cause.name}</h5>
                  <Badge variant={getLikelihoodVariant(cause.likelihood)} size="sm">
                    {cause.likelihood.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">{cause.reasoning}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Immediate and Preventive Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
        {data.immediate_actions && data.immediate_actions.length > 0 && (
          <div className="p-3.5 rounded-xl bg-amber-50/40 border border-amber-100/80 space-y-2">
            <h4 className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Targeted Containment Actions</span>
            </h4>
            <ul className="space-y-1.5">
              {data.immediate_actions.map((act, i) => (
                <li key={i} className="text-xs text-amber-950 flex items-start gap-1.5">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.preventive_actions && data.preventive_actions.length > 0 && (
          <div className="p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-100/80 space-y-2">
            <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Preventive & Cultural Controls</span>
            </h4>
            <ul className="space-y-1.5">
              {data.preventive_actions.map((act, i) => (
                <li key={i} className="text-xs text-emerald-950 flex items-start gap-1.5">
                  <span className="text-emerald-500 mt-1">•</span>
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {data.professional_verification_recommended && (
        <div className="p-3 rounded-xl bg-stone-100/80 border border-stone-200 flex items-center gap-2 text-xs text-stone-600">
          <ShieldAlert className="w-4 h-4 text-stone-500 shrink-0" />
          <span>
            Physical verification by a local agricultural extension officer is recommended prior to purchasing synthetic chemicals.
          </span>
        </div>
      )}
    </div>
  );
};
