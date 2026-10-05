export * from '../constants';
export * from '../schemas/advisory';

export interface UserRecord {
  id: string;
  email: string;
  full_name: string;
  phone?: string | null;
  preferred_language: string;
  location?: string | null;
  farming_experience_years?: number | null;
  farm_size_acres?: number | null;
  primary_crops?: string[] | null;
  irrigation_type?: string | null;
  farming_method?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserPreferencesRecord {
  id: string;
  user_id: string;
  preferred_language: string;
  notifications_enabled: boolean;
  email_notifications: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdvisoryRequestRecord {
  id: string;
  user_id: string;
  domain: string;
  crop_name: string;
  crop_stage: string;
  location: string;
  soil_type: string;
  soil_ph?: number | null;
  soil_fertility?: string | null;
  season: string;
  irrigation_method: string;
  water_availability: string;
  farm_size_acres?: number | null;
  farming_method: string;
  previous_crop?: string | null;
  symptoms?: string | null;
  pest_observations?: string | null;
  disease_observations?: string | null;
  weather_observations?: string | null;
  question: string;
  additional_context?: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface AdvisoryRecord {
  id: string;
  request_id: string;
  user_id: string;
  summary: string;
  crop_assessment: any;
  soil_assessment: any;
  irrigation_recommendation: any;
  nutrient_recommendation: any;
  pest_disease_assessment: any;
  action_plan: any;
  risk_assessment: any;
  assumptions: string[];
  follow_up_questions: string[];
  confidence: string;
  ai_model?: string | null;
  ai_generated_at?: string | null;
  created_at: string;

  // Joined fields from advisory_request
  request?: AdvisoryRequestRecord;
}

export interface DashboardSummary {
  totalAdvisories: number;
  recentAdvisories: AdvisoryRecord[];
  cropsAnalyzed: string[];
  highRiskAdvisoriesCount: number;
  latestRecommendations: Array<{
    id: string;
    crop: string;
    domain: string;
    summary: string;
    risk: string;
    date: string;
  }>;
  riskBreakdown: {
    low: number;
    medium: number;
    high: number;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
