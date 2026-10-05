export const ADVISORY_DOMAINS = [
  'crop_selection',
  'crop_management',
  'soil_management',
  'irrigation',
  'pest_management',
  'disease_management',
  'nutrient_management',
  'harvest_planning',
  'sustainable_farming',
  'risk_assessment',
] as const;

export type AdvisoryDomain = (typeof ADVISORY_DOMAINS)[number];

export const ADVISORY_DOMAIN_METADATA: Record<
  AdvisoryDomain,
  { label: string; description: string; icon: string }
> = {
  crop_selection: {
    label: 'Crop Selection',
    description: 'Determine optimal crops based on soil, season, climate, and water availability.',
    icon: 'Sprout',
  },
  crop_management: {
    label: 'Crop Management',
    description: 'Stage-specific growth advice, cultural operations, and yield optimization.',
    icon: 'SlidersHorizontal',
  },
  soil_management: {
    label: 'Soil Health & Fertility',
    description: 'Soil pH, texture constraints, organic matter improvement, and conditioning.',
    icon: 'Layers',
  },
  irrigation: {
    label: 'Irrigation & Water Scheduling',
    description: 'Water scheduling, drought mitigation, conservation, and drip/furrow techniques.',
    icon: 'Droplets',
  },
  pest_management: {
    label: 'Integrated Pest Management',
    description: 'Identify insect threats, threshold levels, bio-controls, and targeted actions.',
    icon: 'Bug',
  },
  disease_management: {
    label: 'Plant Disease Control',
    description: 'Symptom analysis, fungal/bacterial assessments, and preventive containment.',
    icon: 'ShieldAlert',
  },
  nutrient_management: {
    label: 'Nutrient & Fertilizer Planning',
    description: 'Detect deficiencies (NPK, micronutrients) and balanced fertilization plans.',
    icon: 'FlaskConical',
  },
  harvest_planning: {
    label: 'Harvest & Post-Harvest Planning',
    description: 'Maturity indicators, optimal harvest timing, handling, and storage guidelines.',
    icon: 'CalendarCheck',
  },
  sustainable_farming: {
    label: 'Regenerative & Eco Farming',
    description: 'Green manuring, cover cropping, organic alternatives, and biodiversity support.',
    icon: 'Leaf',
  },
  risk_assessment: {
    label: 'Climate & Agronomic Risk Analysis',
    description: 'Evaluate drought, pest outbreak risks, and climate vulnerability factors.',
    icon: 'AlertTriangle',
  },
};

export const CROP_STAGES = [
  'seed_selection',
  'land_preparation',
  'sowing',
  'germination',
  'vegetative',
  'flowering',
  'fruiting',
  'maturity',
  'harvest',
  'post_harvest',
  'unknown',
] as const;

export type CropStage = (typeof CROP_STAGES)[number];

export const WATER_AVAILABILITIES = [
  'very_low',
  'low',
  'moderate',
  'high',
  'very_high',
  'unknown',
] as const;

export type WaterAvailability = (typeof WATER_AVAILABILITIES)[number];

export const FARMING_METHODS = [
  'conventional',
  'organic',
  'natural',
  'integrated',
  'mixed',
  'unknown',
] as const;

export type FarmingMethod = (typeof FARMING_METHODS)[number];

export const CONFIDENCE_LEVELS = ['high', 'medium', 'low'] as const;
export type ConfidenceLevel = (typeof CONFIDENCE_LEVELS)[number];

export const RISK_LEVELS = ['low', 'medium', 'high', 'unknown'] as const;
export type RiskLevel = (typeof RISK_LEVELS)[number];

export const SUITABILITY_LEVELS = ['high', 'medium', 'low', 'unknown'] as const;
export type SuitabilityLevel = (typeof SUITABILITY_LEVELS)[number];

export const SOIL_TYPES = [
  'Alluvial Soil',
  'Black Soil (Regur)',
  'Red & Yellow Soil',
  'Laterite Soil',
  'Arid / Desert Sandy Soil',
  'Loamy Soil',
  'Clay Loam',
  'Sandy Loam',
  'Silty Clay',
  'Peaty / Marshy Soil',
  'Saline / Alkaline Soil',
  'Other / Mixed',
] as const;

export const IRRIGATION_METHODS = [
  'Drip Irrigation',
  'Sprinkler System',
  'Furrow / Flood Irrigation',
  'Basin Irrigation',
  'Canal Gravity Flow',
  'Borewell / Tube Well',
  'Rainfed Only',
  'Manual / Hand Watering',
  'Sub-surface Drip',
  'Other',
] as const;

export const SEASONS = [
  'Kharif (Monsoon / Summer Sowing)',
  'Rabi (Winter Sowing)',
  'Zaid (Summer Short Season)',
  'Spring',
  'Summer',
  'Autumn / Fall',
  'Winter',
  'Year-Round / Perennial',
] as const;
