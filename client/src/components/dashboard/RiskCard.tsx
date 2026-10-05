import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

export interface RiskCardProps {
  breakdown: {
    low: number;
    medium: number;
    high: number;
  };
}

export const RiskCard: React.FC<RiskCardProps> = ({ breakdown }) => {
  const total = breakdown.low + breakdown.medium + breakdown.high;
  const lowPct = total > 0 ? Math.round((breakdown.low / total) * 100) : 0;
  const medPct = total > 0 ? Math.round((breakdown.medium / total) * 100) : 0;
  const highPct = total > 0 ? Math.round((breakdown.high / total) * 100) : 0;

  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-stone-900">Crop Health & Risk Spectrum</h3>
        <span className="text-xs text-stone-500 font-medium">{total} Assessments</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden flex">
        {lowPct > 0 && <div style={{ width: `${lowPct}%` }} className="bg-emerald-500 h-full" title={`Low Risk: ${lowPct}%`} />}
        {medPct > 0 && <div style={{ width: `${medPct}%` }} className="bg-amber-500 h-full" title={`Medium Risk: ${medPct}%`} />}
        {highPct > 0 && <div style={{ width: `${highPct}%` }} className="bg-rose-500 h-full" title={`High Risk: ${highPct}%`} />}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-100 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="font-semibold text-stone-900">{breakdown.low}</p>
            <p className="text-[11px] text-stone-500">Low Risk</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="font-semibold text-stone-900">{breakdown.medium}</p>
            <p className="text-[11px] text-stone-500">Moderate</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="font-semibold text-stone-900">{breakdown.high}</p>
            <p className="text-[11px] text-stone-500">High Risk</p>
          </div>
        </div>
      </div>
    </div>
  );
};
