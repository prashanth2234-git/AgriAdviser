import React from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { SOIL_TYPES } from '@shared/constants';

export interface SoilInformationFormProps {
  soilType: string;
  soilPH?: number;
  soilFertility?: string;
  errors?: Record<string, string>;
  onChange: (field: string, value: any) => void;
}

export const SoilInformationForm: React.FC<SoilInformationFormProps> = ({
  soilType,
  soilPH,
  soilFertility = '',
  errors = {},
  onChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-stone-900">Soil Characteristics & Edaphic Health</h3>
        <p className="text-xs text-stone-500 mt-0.5">
          Soil texture, acidity/alkalinity (pH), and organic fertility dictate nutrient absorption capacity.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Primary Soil Type"
          value={soilType}
          onChange={(e) => onChange('soilType', e.target.value)}
          options={SOIL_TYPES as unknown as string[]}
          error={errors.soilType}
          required
        />

        <Input
          label="Soil pH Level (if measured)"
          type="number"
          step="0.1"
          min="0"
          max="14"
          placeholder="e.g. 6.5 or 7.2"
          value={soilPH !== undefined && soilPH !== null ? soilPH : ''}
          onChange={(e) => onChange('soilPH', e.target.value ? parseFloat(e.target.value) : undefined)}
          error={errors.soilPH}
          helperText="Optional (0 - 14). Neutral is ~6.5 - 7.5. Leave empty if unmeasured."
        />

        <div className="sm:col-span-2">
          <Input
            label="Soil Fertility & Organic Matter Notes"
            placeholder="e.g. Added FYM (farmyard manure) 2 months ago, moderate organic carbon, low available zinc"
            value={soilFertility}
            onChange={(e) => onChange('soilFertility', e.target.value)}
            error={errors.soilFertility}
            helperText="Optional. Mention known soil testing results or organic amendment history."
          />
        </div>
      </div>
    </div>
  );
};
