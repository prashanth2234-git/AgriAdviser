import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, ShieldCheck, Sprout, Brain, Layers } from 'lucide-react';

const steps = [
  { label: 'Synthesizing soil, crop stage & water context...', icon: Layers },
  { label: 'Querying Gemini agricultural decision support engine...', icon: Brain },
  { label: 'Evaluating pest, disease & nutritional constraints...', icon: Sprout },
  { label: 'Enforcing Zod agronomic safety & dosage checks...', icon: ShieldCheck },
  { label: 'Assembling prioritized 30-day action plan...', icon: CheckCircle2 },
];

export const AIProcessingState: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="card p-8 sm:p-12 text-center max-w-lg mx-auto my-8 border-agri-200 shadow-xl bg-gradient-to-b from-white to-agri-50/30">
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="absolute inset-0 rounded-full bg-agri-100 animate-ping opacity-30" />
        <div className="relative w-20 h-20 rounded-full bg-agri-50 border-2 border-agri-200 flex items-center justify-center text-agri-600 shadow-inner">
          <Loader2 className="w-10 h-10 animate-spin text-agri-600" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-stone-900 mb-2">Analyzing Agricultural Request</h3>
      <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto mb-8 leading-relaxed">
        Our agronomic reasoning model is evaluating your field parameters against established scientific guidance.
      </p>

      {/* Steps checklist */}
      <div className="space-y-3 text-left max-w-xs mx-auto">
        {steps.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          const Icon = step.icon;

          return (
            <div
              key={step.label}
              className={`flex items-center gap-3 text-xs transition-opacity duration-300 ${
                isCurrent ? 'font-bold text-agri-800' : isDone ? 'text-stone-500 line-through' : 'opacity-40 text-stone-400'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-agri-600 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-4 h-4 animate-spin text-agri-600 shrink-0" />
              ) : (
                <Icon className="w-4 h-4 text-stone-300 shrink-0" />
              )}
              <span className="truncate">{step.label}</span>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-stone-400 mt-8">
        Adhering strictly to safe agricultural decision-support guidelines.
      </p>
    </div>
  );
};
