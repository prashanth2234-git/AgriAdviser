import React from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { SEASONS, FARMING_METHODS, FarmingMethod } from '@shared/constants';

export interface FarmInformationFormProps {
  location: string;
  farmSize?: number;
  farmingMethod: FarmingMethod;
  season: string;
  errors?: Record<string, string>;
  onChange: (field: string, value: any) => void;
}

export const FarmInformationForm: React.FC<FarmInformationFormProps> = ({
  location,
  farmSize,
  farmingMethod,
  season,
  errors = {},
  onChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-stone-900">Farm & Environmental Context</h3>
        <p className="text-xs text-stone-500 mt-0.5">
          Provide your geographical location, farm acreage, farming methodology, and current season.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Farm Location (District / Region / State)"
          placeholder="e.g. Ludhiana, Punjab or Salinas Valley, CA"
          value={location}
          onChange={(e) => onChange('location', e.target.value)}
          error={errors.location}
          required
          helperText="Required to infer regional climate, solar duration, and agro-climatic zone."
        />

        <Input
          label="Farm Size (in Acres)"
          type="number"
          step="0.1"
          min="0.1"
          placeholder="e.g. 5.5"
          value={farmSize !== undefined ? farmSize : ''}
          onChange={(e) => onChange('farmSize', e.target.value ? parseFloat(e.target.value) : undefined)}
          error={errors.farmSize}
          helperText="Optional. Helps tailor dosage scalability and equipment advice."
        />

        <Select
          label="Current Season"
          value={season}
          onChange={(e) => onChange('season', e.target.value)}
          options={SEASONS as unknown as string[]}
          error={errors.season}
          required
        />

        <Select
          label="Farming Practice / Method"
          value={farmingMethod}
          onChange={(e) => onChange('farmingMethod', e.target.value)}
          options={FARMING_METHODS.map((m) => ({
            value: m,
            label: m.charAt(0).toUpperCase() + m.slice(1) + ' Farming',
          }))}
          error={errors.farmingMethod}
          required
        />
      </div>
    </div>
  );
};
