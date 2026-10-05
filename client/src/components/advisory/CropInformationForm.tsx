import React from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { CROP_STAGES, CropStage } from '@shared/constants';

export interface CropInformationFormProps {
  cropName: string;
  cropStage: CropStage;
  previousCrop?: string;
  errors?: Record<string, string>;
  onChange: (field: string, value: any) => void;
}

export const CropInformationForm: React.FC<CropInformationFormProps> = ({
  cropName,
  cropStage,
  previousCrop = '',
  errors = {},
  onChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-stone-900">Crop Details & Phenological Stage</h3>
        <p className="text-xs text-stone-500 mt-0.5">
          Specify the crop variety and its exact physiological development stage.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Crop Name & Variety"
          placeholder="e.g. Wheat (HD-2967) or Tomato (Roma VF)"
          value={cropName}
          onChange={(e) => onChange('cropName', e.target.value)}
          error={errors.cropName}
          required
          helperText="Specify the crop and variety if known for precise growth cycle tracking."
        />

        <Select
          label="Current Growth Stage"
          value={cropStage}
          onChange={(e) => onChange('cropStage', e.target.value)}
          options={CROP_STAGES.map((s) => ({
            value: s,
            label: s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          }))}
          error={errors.cropStage}
          required
        />

        <div className="sm:col-span-2">
          <Input
            label="Preceding Crop in This Field (Rotation History)"
            placeholder="e.g. Basmati Rice, Mustard, or Fallow"
            value={previousCrop}
            onChange={(e) => onChange('previousCrop', e.target.value)}
            error={errors.previousCrop}
            helperText="Optional. Preceding crops influence soil nitrogen residual, hardpan formation, and carryover pest cycles."
          />
        </div>
      </div>
    </div>
  );
};
