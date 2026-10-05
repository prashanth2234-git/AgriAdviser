import { z } from 'zod';
import {
  ADVISORY_DOMAINS,
  CROP_STAGES,
  WATER_AVAILABILITIES,
  FARMING_METHODS,
  CONFIDENCE_LEVELS,
  RISK_LEVELS,
  SUITABILITY_LEVELS,
} from '../constants';

export const AdvisoryDomainSchema = z.enum(ADVISORY_DOMAINS);
export const CropStageSchema = z.enum(CROP_STAGES);
export const WaterAvailabilitySchema = z.enum(WATER_AVAILABILITIES);
export const FarmingMethodSchema = z.enum(FARMING_METHODS);
export const ConfidenceLevelSchema = z.enum(CONFIDENCE_LEVELS);
export const RiskLevelSchema = z.enum(RISK_LEVELS);
export const SuitabilityLevelSchema = z.enum(SUITABILITY_LEVELS);

export const AdvisoryRequestInputSchema = z.object({
  domain: AdvisoryDomainSchema,
  cropName: z
    .string()
    .trim()
    .min(1, 'Crop name is required')
    .max(100, 'Crop name too long'),
  cropStage: CropStageSchema,
  location: z
    .string()
    .trim()
    .min(2, 'Location is required')
    .max(200, 'Location too long'),
  soilType: z
    .string()
    .trim()
    .min(2, 'Soil type is required')
    .max(100, 'Soil type too long'),
  soilPH: z
    .preprocess((val) => {
      if (val === '' || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    }, z.number().min(0, 'Soil pH must be >= 0').max(14, 'Soil pH must be <= 14').optional())
    .optional(),
  soilFertility: z.string().trim().max(200).optional().or(z.literal('')),
  season: z
    .string()
    .trim()
    .min(2, 'Season is required')
    .max(100, 'Season too long'),
  irrigationMethod: z
    .string()
    .trim()
    .min(2, 'Irrigation method is required')
    .max(100, 'Irrigation method too long'),
  waterAvailability: WaterAvailabilitySchema,
  farmSize: z
    .preprocess((val) => {
      if (val === '' || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    }, z.number().positive('Farm size must be greater than 0').max(100000, 'Farm size too large').optional())
    .optional(),
  farmingMethod: FarmingMethodSchema,
  previousCrop: z.string().trim().max(100).optional().or(z.literal('')),
  symptoms: z.string().trim().max(2000).optional().or(z.literal('')),
  pestObservations: z.string().trim().max(2000).optional().or(z.literal('')),
  diseaseObservations: z.string().trim().max(2000).optional().or(z.literal('')),
  weatherObservations: z.string().trim().max(2000).optional().or(z.literal('')),
  question: z
    .string()
    .trim()
    .min(5, 'Question must be at least 5 characters')
    .max(1000, 'Question must be under 1000 characters'),
  additionalContext: z.string().trim().max(2000).optional().or(z.literal('')),
});

export type AdvisoryRequestInput = z.infer<typeof AdvisoryRequestInputSchema>;

// AI Response Schemas
export const CropAssessmentSchema = z.object({
  summary: z.string().min(1),
  suitability: SuitabilityLevelSchema,
  positive_factors: z.array(z.string()).default([]),
  limiting_factors: z.array(z.string()).default([]),
  recommendations: z.array(z.string()).default([]),
  confidence: ConfidenceLevelSchema,
});

export const SoilAssessmentSchema = z.object({
  summary: z.string().min(1),
  suitability: SuitabilityLevelSchema,
  observations: z.array(z.string()).default([]),
  potential_constraints: z.array(z.string()).default([]),
  improvement_actions: z.array(z.string()).default([]),
  confidence: ConfidenceLevelSchema,
});

export const IrrigationRecommendationSchema = z.object({
  summary: z.string().min(1),
  water_status: WaterAvailabilitySchema,
  recommendations: z.array(z.string()).default([]),
  conservation_actions: z.array(z.string()).default([]),
  warning_signs: z.array(z.string()).default([]),
});

export const NutrientRecommendationSchema = z.object({
  summary: z.string().min(1),
  possible_issues: z.array(z.string()).default([]),
  recommended_actions: z.array(z.string()).default([]),
  soil_testing_recommendation: z.string().default('Periodic laboratory soil analysis is recommended for accurate NPK balancing.'),
  warnings: z.array(z.string()).default([]),
});

export const PossibleCauseSchema = z.object({
  name: z.string(),
  reasoning: z.string(),
  likelihood: z.enum(['high', 'medium', 'low', 'unknown']),
});

export const PestDiseaseAssessmentSchema = z.object({
  summary: z.string().min(1),
  possible_causes: z.array(PossibleCauseSchema).default([]),
  immediate_actions: z.array(z.string()).default([]),
  preventive_actions: z.array(z.string()).default([]),
  professional_verification_recommended: z.boolean().default(true),
});

export const ActionPlanSchema = z.object({
  immediate: z.array(z.string()).default([]),
  next_7_days: z.array(z.string()).default([]),
  next_30_days: z.array(z.string()).default([]),
  long_term: z.array(z.string()).default([]),
});

export const RiskAssessmentSchema = z.object({
  overall: RiskLevelSchema,
  water_risk: RiskLevelSchema,
  soil_risk: RiskLevelSchema,
  pest_risk: RiskLevelSchema,
  disease_risk: RiskLevelSchema,
  management_risk: RiskLevelSchema,
  explanation: z.string().min(1),
});

export const AIAdvisoryResponseSchema = z.object({
  summary: z.string().min(10, 'Advisory summary is required'),
  crop_assessment: CropAssessmentSchema,
  soil_assessment: SoilAssessmentSchema,
  irrigation_recommendation: IrrigationRecommendationSchema,
  nutrient_recommendation: NutrientRecommendationSchema,
  pest_disease_assessment: PestDiseaseAssessmentSchema,
  action_plan: ActionPlanSchema,
  risk_assessment: RiskAssessmentSchema,
  assumptions: z.array(z.string()).default([]),
  follow_up_questions: z.array(z.string()).default([]),
  confidence: ConfidenceLevelSchema,
});

export type AIAdvisoryResponse = z.infer<typeof AIAdvisoryResponseSchema>;

// Auth schemas
export const RegisterSchema = z.object({
  email: z.string().trim().email('Invalid email address').toLowerCase(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long'),
  fullName: z
    .string()
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name too long'),
  phone: z.string().trim().max(30).optional().or(z.literal('')),
  preferredLanguage: z.string().trim().min(2).max(20).default('en'),
  location: z.string().trim().max(200).optional().or(z.literal('')),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.string().trim().email('Invalid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const ProfileUpdateSchema = z.object({
  fullName: z.string().trim().min(2).max(100).optional(),
  phone: z.string().trim().max(30).optional().or(z.literal('')),
  preferredLanguage: z.string().trim().min(2).max(20).optional(),
  location: z.string().trim().max(200).optional().or(z.literal('')),
  farmingExperienceYears: z
    .preprocess((v) => (v === '' || v === null ? undefined : Number(v)), z.number().int().min(0).max(100).optional())
    .optional(),
  farmSizeAcres: z
    .preprocess((v) => (v === '' || v === null ? undefined : Number(v)), z.number().min(0).max(100000).optional())
    .optional(),
  primaryCrops: z.array(z.string()).optional(),
  irrigationType: z.string().max(100).optional().or(z.literal('')),
  farmingMethod: z.string().max(100).optional().or(z.literal('')),
});

export type ProfileUpdateInput = z.infer<typeof ProfileUpdateSchema>;

export const PreferencesUpdateSchema = z.object({
  preferredLanguage: z.string().trim().min(2).max(20).optional(),
  notificationsEnabled: z.boolean().optional(),
  emailNotifications: z.boolean().optional(),
});

export type PreferencesUpdateInput = z.infer<typeof PreferencesUpdateSchema>;
