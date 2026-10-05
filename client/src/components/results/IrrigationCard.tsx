import React from 'react';
import { Droplets, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { WaterAvailability } from '@shared/constants';

export interface IrrigationData {
  summary: string;
  water_status: WaterAvailability;
  recommendations: string[];
  conservation_actions: string[];
  warning_signs: string[];
}

export const IrrigationCard: React.FC<{ data: IrrigationData }> = ({ data }) => {
  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900">Irrigation & Water Scheduling</h3>
            <p className="text-xs text-stone-500">Water status, moisture retention, and conservation guidelines</p>
          </div>
        </div>

        <Badge variant="blue" size="md" dot>
          STATUS: {data.water_status?.replace(/_/g, ' ').toUpperCase()}
        </Badge>
      </div>

      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
        {data.summary}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
        {data.recommendations && data.recommendations.length > 0 && (
          <div className="p-3.5 rounded-xl bg-sky-50/40 border border-sky-100/80 space-y-2">
            <h4 className="text-xs font-bold text-sky-950 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
              <span>Irrigation Scheduling Actions</span>
            </h4>
            <ul className="space-y-1.5">
              {data.recommendations.map((r, i) => (
                <li key={i} className="text-xs text-sky-950 flex items-start gap-1.5">
                  <span className="text-sky-500 mt-1">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.conservation_actions && data.conservation_actions.length > 0 && (
          <div className="p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-100/80 space-y-2">
            <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-emerald-600" />
              <span>Water Conservation Measures</span>
            </h4>
            <ul className="space-y-1.5">
              {data.conservation_actions.map((c, i) => (
                <li key={i} className="text-xs text-emerald-950 flex items-start gap-1.5">
                  <span className="text-emerald-500 mt-1">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {data.warning_signs && data.warning_signs.length > 0 && (
        <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 flex items-start gap-2.5 text-xs text-amber-950">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Watch for Stress Signals: </span>
            <span>{data.warning_signs.join('; ')}</span>
          </div>
        </div>
      )}
    </div>
  );
};
