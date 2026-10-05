import React from 'react';
import { FlaskConical, AlertCircle, ArrowRight, ShieldAlert } from 'lucide-react';

export interface NutrientData {
  summary: string;
  possible_issues: string[];
  recommended_actions: string[];
  soil_testing_recommendation: string;
  warnings: string[];
}

export const NutrientCard: React.FC<{ data: NutrientData }> = ({ data }) => {
  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <FlaskConical className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900">Nutrient Balancing & Fertilization</h3>
            <p className="text-xs text-stone-500">Deficiency diagnostics, organic split-dose fertilization, and foliar support</p>
          </div>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
        {data.summary}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
        {data.possible_issues && data.possible_issues.length > 0 && (
          <div className="p-3.5 rounded-xl bg-purple-50/40 border border-purple-100/80 space-y-2">
            <h4 className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-purple-600" />
              <span>Suspected Nutrient Imbalances</span>
            </h4>
            <ul className="space-y-1.5">
              {data.possible_issues.map((issue, i) => (
                <li key={i} className="text-xs text-purple-950 flex items-start gap-1.5">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.recommended_actions && data.recommended_actions.length > 0 && (
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-2">
            <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5 text-stone-600" />
              <span>Fertilizer & Amendment Schedule</span>
            </h4>
            <ul className="space-y-1.5">
              {data.recommended_actions.map((act, i) => (
                <li key={i} className="text-xs text-stone-800 flex items-start gap-1.5">
                  <span className="text-agri-600 font-bold mt-1">→</span>
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {data.warnings && data.warnings.length > 0 && (
        <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200/60 space-y-1 text-xs text-rose-950">
          <div className="flex items-center gap-1.5 font-bold text-rose-900">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>Application Safety Warnings:</span>
          </div>
          <ul className="space-y-1 pl-5 list-disc text-[11px]">
            {data.warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {data.soil_testing_recommendation && (
        <p className="text-[11px] text-stone-500 italic pt-1">
          📌 Note: {data.soil_testing_recommendation}
        </p>
      )}
    </div>
  );
};
