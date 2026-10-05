import React from 'react';
import { Select } from '../ui/Select';
import {
  IRRIGATION_METHODS,
  WATER_AVAILABILITIES,
  WaterAvailability,
} from '@shared/constants';

export interface IrrigationFormProps {
  irrigationMethod: string;
  waterAvailability: WaterAvailability;
  errors?: Record<string, string>;
  onChange: (field: string, value: any) => void;
}

export const IrrigationForm: React.FC<IrrigationFormProps> = ({
  irrigationMethod,
  waterAvailability,
  errors = {},
  onChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-stone-900">Irrigation Infrastructure & Water Status</h3>
        <p className="text-xs text-stone-500 mt-0.5">
          Specify your delivery method and current seasonal reservoir/groundwater availability.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Irrigation Method"
          value={irrigationMethod}
          onChange={(e) => onChange('irrigationMethod', e.target.value)}
          options={IRRIGATION_METHODS as unknown as string[]}
          error={errors.irrigationMethod}
          required
        />

        <Select
          label="Water Availability Level"
          value={waterAvailability}
          onChange={(e) => onChange('waterAvailability', e.target.value)}
          options={WATER_AVAILABILITIES.map((w) => ({
            value: w,
            label: w.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) + ' Water Availability',
          }))}
          error={errors.waterAvailability}
          required
        />
      </div>
    </div>
  );
};
