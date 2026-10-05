import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, Droplets, Layers, Bug, Activity, Sliders } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { RiskLevel } from '@shared/constants';

export interface RiskAssessmentData {
  overall: RiskLevel;
  water_risk: RiskLevel;
  soil_risk: RiskLevel;
  pest_risk: RiskLevel;
  disease_risk: RiskLevel;
  management_risk: RiskLevel;
  explanation: string;
}

export const RiskAssessmentCard: React.FC<{ riskData: RiskAssessmentData }> = ({ riskData }) => {
  const getBadgeVariant = (level: RiskLevel): 'green' | 'amber' | 'rose' | 'stone' => {
    switch (level) {
      case 'low':
        return 'green';
      case 'medium':
        return 'amber';
      case 'high':
        return 'rose';
      default:
        return 'stone';
    }
  };

  const categories = [
    { label: 'Water Risk', value: riskData.water_risk, icon: Droplets },
    { label: 'Soil Risk', value: riskData.soil_risk, icon: Layers },
    { label: 'Pest Risk', value: riskData.pest_risk, icon: Bug },
    { label: 'Disease Risk', value: riskData.disease_risk, icon: Activity },
    { label: 'Management Risk', value: riskData.management_risk, icon: Sliders },
  ];

  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900">Agronomic Risk Matrix</h3>
            <p className="text-xs text-stone-500">Comprehensive vulnerability assessment across key vectors</p>
          </div>
        </div>

        <Badge variant={getBadgeVariant(riskData.overall)} size="md" dot>
          OVERALL: {riskData.overall.toUpperCase()}
        </Badge>
      </div>

      <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/70 text-xs text-stone-700 leading-relaxed">
        <span className="font-semibold text-stone-900">Risk Drivers & Mitigation: </span>
        {riskData.explanation}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.label}
              className="p-3 rounded-xl border border-stone-100 bg-white shadow-xs flex flex-col justify-between space-y-2"
            >
              <div className="flex items-center justify-between text-stone-400">
                <span className="text-[11px] font-medium text-stone-600">{cat.label}</span>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <Badge variant={getBadgeVariant(cat.value)} size="sm" dot>
                {cat.value.toUpperCase()}
              </Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
};
