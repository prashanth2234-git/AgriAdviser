import React from 'react';
import { Info, HelpCircle } from 'lucide-react';

export const AssumptionsCard: React.FC<{ assumptions: string[] }> = ({ assumptions }) => {
  if (!assumptions || assumptions.length === 0) return null;

  return (
    <div className="card p-5 space-y-3 bg-stone-50/70 border-stone-200">
      <div className="flex items-center gap-2 text-stone-800 font-semibold text-sm">
        <Info className="w-4 h-4 text-stone-500" />
        <span>Model Assumptions & Baselines</span>
      </div>

      <ul className="space-y-1.5 pl-5 list-disc text-xs text-stone-600 leading-relaxed">
        {assumptions.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export const FollowUpQuestionsCard: React.FC<{ questions: string[] }> = ({ questions }) => {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="card p-5 space-y-3 bg-amber-50/40 border-amber-200/80">
      <div className="flex items-center gap-2 text-amber-900 font-semibold text-sm">
        <HelpCircle className="w-4 h-4 text-amber-600" />
        <span>Follow-up Field Checks For Higher Precision</span>
      </div>
      <p className="text-xs text-amber-800 leading-relaxed">
        To narrow down uncertainties, consider verifying the following observations during your next field walkthrough:
      </p>

      <ul className="space-y-1.5 pl-5 list-decimal text-xs text-amber-950 font-medium leading-relaxed">
        {questions.map((q, idx) => (
          <li key={idx}>{q}</li>
        ))}
      </ul>
    </div>
  );
};
