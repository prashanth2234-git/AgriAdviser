import React from 'react';
import { Textarea } from '../ui/Textarea';

export interface QuestionFormProps {
  question: string;
  additionalContext?: string;
  errors?: Record<string, string>;
  onChange: (field: string, value: any) => void;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({
  question,
  additionalContext = '',
  errors = {},
  onChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-stone-900">Your Agricultural Objective & Specific Question</h3>
        <p className="text-xs text-stone-500 mt-0.5">
          Ask exactly what decision or problem you are seeking guidance on.
        </p>
      </div>

      <div className="space-y-4">
        <Textarea
          label="Your Specific Agricultural Question / Objective"
          placeholder="e.g. What is the immediate treatment for these aphid clusters without affecting flowering? Or: How much nitrogen top-dressing should I apply before the next irrigation?"
          value={question}
          onChange={(e) => onChange('question', e.target.value)}
          error={errors.question}
          rows={3}
          required
          helperText="Be as specific as possible. Mention whether you prefer organic bio-controls or integrated management."
        />

        <Textarea
          label="Additional Field Context / Constraints (Optional)"
          placeholder="e.g. Labor is limited for spraying this week; borewell power supply is intermittent (4 hours daily); planned market harvest in 40 days."
          value={additionalContext}
          onChange={(e) => onChange('additionalContext', e.target.value)}
          error={errors.additionalContext}
          rows={2}
          helperText="Any financial, equipment, market timeline, or resource constraints."
        />
      </div>
    </div>
  );
};
