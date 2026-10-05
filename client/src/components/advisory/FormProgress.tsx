import React from 'react';
import { Check } from 'lucide-react';
import { clsx } from 'clsx';

export interface FormProgressProps {
  steps: string[];
  currentStep: number;
  onStepClick: (stepIndex: number) => void;
}

export const FormProgress: React.FC<FormProgressProps> = ({
  steps,
  currentStep,
  onStepClick,
}) => {
  return (
    <div className="w-full py-4">
      {/* Mobile progress indicator */}
      <div className="md:hidden flex items-center justify-between text-xs font-medium text-stone-500 mb-2">
        <span>Step {currentStep + 1} of {steps.length}</span>
        <span className="font-semibold text-agri-700">{steps[currentStep]}</span>
      </div>

      {/* Mobile bar */}
      <div className="md:hidden w-full h-2 bg-stone-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-agri-600 transition-all duration-300 rounded-full"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Desktop breadcrumb steps */}
      <nav aria-label="Form Progress" className="hidden md:block">
        <ol className="flex items-center justify-between w-full">
          {steps.map((label, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;

            return (
              <li
                key={label}
                className={clsx(
                  'flex items-center relative',
                  index !== steps.length - 1 ? 'flex-1' : ''
                )}
              >
                <button
                  type="button"
                  onClick={() => onStepClick(index)}
                  className="flex items-center gap-2 group focus:outline-none"
                  disabled={index > currentStep}
                >
                  <span
                    className={clsx(
                      'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                      isCompleted
                        ? 'bg-agri-600 text-white shadow-sm'
                        : isCurrent
                        ? 'bg-agri-100 text-agri-800 ring-2 ring-agri-600 ring-offset-2'
                        : 'bg-stone-100 text-stone-400 group-hover:bg-stone-200'
                    )}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                  </span>
                  <span
                    className={clsx(
                      'text-xs font-semibold whitespace-nowrap transition-colors',
                      isCurrent
                        ? 'text-agri-800 font-bold'
                        : isCompleted
                        ? 'text-stone-700'
                        : 'text-stone-400'
                    )}
                  >
                    {label}
                  </span>
                </button>

                {index !== steps.length - 1 && (
                  <div
                    className={clsx(
                      'h-0.5 w-full mx-3 transition-colors',
                      isCompleted ? 'bg-agri-600' : 'bg-stone-200'
                    )}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};
