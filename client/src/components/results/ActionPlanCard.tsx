import React, { useState } from 'react';
import { Clock, Calendar, CheckSquare, ChevronRight, Zap } from 'lucide-react';
import { clsx } from 'clsx';

export interface ActionPlanData {
  immediate: string[];
  next_7_days: string[];
  next_30_days: string[];
  long_term: string[];
}

export const ActionPlanCard: React.FC<{ actionPlan: ActionPlanData }> = ({ actionPlan }) => {
  const [activeTab, setActiveTab] = useState<'immediate' | 'next_7_days' | 'next_30_days' | 'long_term'>('immediate');

  const tabs = [
    {
      id: 'immediate' as const,
      label: 'Immediate (24-48 hrs)',
      count: actionPlan.immediate?.length || 0,
      badgeColor: 'bg-rose-100 text-rose-800',
    },
    {
      id: 'next_7_days' as const,
      label: 'Next 7 Days',
      count: actionPlan.next_7_days?.length || 0,
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'next_30_days' as const,
      label: 'Next 30 Days',
      count: actionPlan.next_30_days?.length || 0,
      badgeColor: 'bg-sky-100 text-sky-800',
    },
    {
      id: 'long_term' as const,
      label: 'Post-Harvest & Long Term',
      count: actionPlan.long_term?.length || 0,
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
  ];

  const currentItems = actionPlan[activeTab] || [];

  return (
    <div className="card p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-agri-100 text-agri-700 flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900">Prioritized Farmer Action Plan</h3>
            <p className="text-xs text-stone-500">Step-by-step roadmap from urgent measures to seasonal sustainability</p>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex flex-wrap gap-1 bg-stone-100 p-1 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5',
                activeTab === tab.id
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              )}
            >
              <span>{tab.label}</span>
              <span className={clsx('px-1.5 py-0.2 rounded-full text-[10px]', tab.badgeColor)}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Action items list */}
      <div className="space-y-2.5">
        {currentItems.length === 0 ? (
          <p className="text-xs text-stone-500 py-4 text-center">No specific actions noted for this timeframe.</p>
        ) : (
          currentItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3.5 rounded-xl border border-stone-100 bg-stone-50/60 hover:bg-stone-50 transition-colors"
            >
              <div className="w-5 h-5 rounded-md bg-white border border-stone-300 flex items-center justify-center shrink-0 mt-0.5 text-stone-500">
                <CheckSquare className="w-3.5 h-3.5 text-agri-600" />
              </div>
              <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-medium">
                {item}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
