import React from 'react';
import { Sparkles, HelpCircle } from 'lucide-react';
import { ConfidenceIndicator } from './ConfidenceIndicator';
import { ConfidenceLevel } from '@shared/constants';

export const SummaryCard: React.FC<{
  summary: string;
  question: string;
  confidence: ConfidenceLevel;
}> = ({ summary, question, confidence }) => {
  return (
    <div className="card p-6 bg-gradient-to-br from-white via-agri-50/20 to-agri-50/40 border-agri-200 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-agri-100">
        <div className="flex items-center gap-2 text-agri-800 font-bold text-base">
          <Sparkles className="w-5 h-5 text-agri-600" />
          <span>Executive Advisory Summary</span>
        </div>
        <ConfidenceIndicator confidence={confidence} />
      </div>

      <div className="p-3.5 rounded-xl bg-white/80 border border-stone-200/80 text-xs">
        <div className="flex items-start gap-2 text-stone-600">
          <HelpCircle className="w-4 h-4 text-agri-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-stone-800">Farmer's Inquiry: </span>
            <span className="italic">"{question}"</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-stone-800 leading-relaxed font-medium">
        {summary}
      </p>
    </div>
  );
};
