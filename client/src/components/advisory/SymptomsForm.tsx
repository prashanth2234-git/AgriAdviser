import React from 'react';
import { Textarea } from '../ui/Textarea';

export interface SymptomsFormProps {
  symptoms?: string;
  pestObservations?: string;
  diseaseObservations?: string;
  weatherObservations?: string;
  errors?: Record<string, string>;
  onChange: (field: string, value: any) => void;
}

export const SymptomsForm: React.FC<SymptomsFormProps> = ({
  symptoms = '',
  pestObservations = '',
  diseaseObservations = '',
  weatherObservations = '',
  errors = {},
  onChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-stone-900">Symptoms, Pests & Weather Observations</h3>
        <p className="text-xs text-stone-500 mt-0.5">
          Record physical plant abnormalities, visible insect vectors, fungal cues, and recent micro-climates.
        </p>
      </div>

      <div className="space-y-4">
        <Textarea
          label="Visual Symptoms Observed on Crop"
          placeholder="e.g. Yellowing on margin of older leaves, leaf curling, tip burn, stunting, wilting in early afternoon"
          value={symptoms}
          onChange={(e) => onChange('symptoms', e.target.value)}
          error={errors.symptoms}
          rows={2}
          helperText="Describe color alterations, texture, wilting, or necrotic spots."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Textarea
            label="Pest Observations (Insects / Caterpillars / Mites)"
            placeholder="e.g. Aphids clustered on lower stem, whiteflies rising on disturbance, pinholes in leaves"
            value={pestObservations}
            onChange={(e) => onChange('pestObservations', e.target.value)}
            error={errors.pestObservations}
            rows={2}
          />

          <Textarea
            label="Disease Signs / Lesions"
            placeholder="e.g. Powdery white residue on top leaves, dark concentric rings on stems, water-soaked lesions"
            value={diseaseObservations}
            onChange={(e) => onChange('diseaseObservations', e.target.value)}
            error={errors.diseaseObservations}
            rows={2}
          />
        </div>

        <Textarea
          label="Weather & Microclimate Observations"
          placeholder="e.g. Continuous morning dew/fog for last 5 days, sudden temperature drop to 12C, or dry heatwave 38C"
          value={weatherObservations}
          onChange={(e) => onChange('weatherObservations', e.target.value)}
          error={errors.weatherObservations}
          rows={2}
          helperText="Fog, high humidity, or sudden heatwaves accelerate fungal spore germination and pest surges."
        />
      </div>
    </div>
  );
};
