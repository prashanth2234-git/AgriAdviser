-- gen_random_uuid() is built-in in PostgreSQL 13+
DO $$
BEGIN
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
EXCEPTION WHEN OTHERS THEN
    -- In PostgreSQL 13+ or PGlite, gen_random_uuid() is already built-in natively
    NULL;
END $$;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    preferred_language TEXT NOT NULL DEFAULT 'en',
    location TEXT,
    farming_experience_years INTEGER CHECK (farming_experience_years >= 0),
    farm_size_acres NUMERIC(12,2) CHECK (farm_size_acres >= 0),
    primary_crops TEXT[],
    irrigation_type TEXT,
    farming_method TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS advisory_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    domain TEXT NOT NULL,
    crop_name TEXT NOT NULL,
    crop_stage TEXT NOT NULL,
    location TEXT NOT NULL,
    soil_type TEXT NOT NULL,
    soil_ph NUMERIC(4,2),
    soil_fertility TEXT,
    season TEXT NOT NULL,
    irrigation_method TEXT NOT NULL,
    water_availability TEXT NOT NULL,
    farm_size_acres NUMERIC(12,2),
    farming_method TEXT NOT NULL,
    previous_crop TEXT,
    symptoms TEXT,
    pest_observations TEXT,
    disease_observations TEXT,
    weather_observations TEXT,
    question TEXT NOT NULL,
    additional_context TEXT,

    status TEXT NOT NULL DEFAULT 'completed',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS advisories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL UNIQUE
        REFERENCES advisory_requests(id) ON DELETE CASCADE,

    user_id UUID NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,

    summary TEXT NOT NULL,

    crop_assessment JSONB NOT NULL,
    soil_assessment JSONB NOT NULL,
    irrigation_recommendation JSONB NOT NULL,
    nutrient_recommendation JSONB NOT NULL,
    pest_disease_assessment JSONB NOT NULL,
    action_plan JSONB NOT NULL,
    risk_assessment JSONB NOT NULL,

    assumptions JSONB NOT NULL DEFAULT '[]'::jsonb,
    follow_up_questions JSONB NOT NULL DEFAULT '[]'::jsonb,

    confidence TEXT NOT NULL,

    ai_model TEXT,
    ai_generated_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    preferred_language TEXT NOT NULL DEFAULT 'en',
    notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    email_notifications BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_advisory_requests_user_id
    ON advisory_requests(user_id);

CREATE INDEX IF NOT EXISTS idx_advisory_requests_created_at
    ON advisory_requests(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_advisories_user_id
    ON advisories(user_id);

CREATE INDEX IF NOT EXISTS idx_advisories_created_at
    ON advisories(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_advisory_requests_crop_name
    ON advisory_requests(crop_name);

CREATE INDEX IF NOT EXISTS idx_advisory_requests_domain
    ON advisory_requests(domain);
