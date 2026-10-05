# 🌾 AI-Powered Agriculture Crop Advisory Assistant

A production-grade, full-stack agricultural decision-support web platform engineered with **React (TypeScript)**, **Node.js (Express)**, **PostgreSQL**, and **Google Gemini AI (`@google/genai`)** with strict **Zod** validation and user-level data isolation.

---

## 🌟 Key Capabilities

1. **Multi-Domain Agronomic Guidance**: Supports 10 specialized advisory domains:
   - *Crop Selection*, *Crop Management*, *Soil Health & Fertility*, *Irrigation & Water Scheduling*, *Integrated Pest Management*, *Disease Control*, *Nutrient & Fertilization*, *Harvest Planning*, *Regenerative / Eco Farming*, and *Climate Risk Assessment*.
2. **Server-Side AI Reasoning**: Powered securely via Google Gemini (`gemini-3.8-flash` / `@google/genai`) on the backend. The API key is never exposed to the client.
3. **Strict Structured Output & Zod Validation**: AI responses and client inputs are strictly parsed and schema-validated before database persistence. No hallucinations or malformed responses reach the database.
4. **Zero-Fabrication Safety Directive**: Built to function as a cautious agricultural decision-support assistant. Distinguishes symptoms from verified facts, avoids hazardous chemical dosing, and recommends local extension officer verification for critical cases.
5. **PostgreSQL Persistence & Row-Level Data Isolation**: Multi-tenant database design with parameterized queries and strict user scoping (`WHERE user_id = $1`) ensuring complete isolation of farm records.
6. **Zero-Config Local Deployment**: Features embedded PostgreSQL out-of-the-box (`@electric-sql/pglite`) for local operation with zero external database dependencies, while providing full production support for remote PostgreSQL via `DATABASE_URL` (Replit Postgres, Neon, Supabase, RDS).
7. **Actionable Farmer Action Plans**: Every advisory generates immediate (24-48h), next 7 days, next 30 days, and long-term post-harvest tasks.
8. **Interactive Dashboard & Searchable History**: Dynamic crop metrics, risk spectrum breakdown, historical search, crop filters, and report viewing/printing.

---

## 🏗️ Architecture

```
                    ┌─────────────────────────────────┐
                    │       React Client (Vite)       │
                    │   Tailwind CSS + Lucide Icons   │
                    └────────────────┬────────────────┘
                                     │ HTTP / REST (/api)
                                     ▼
                    ┌─────────────────────────────────┐
                    │      Node.js Express Server     │
                    │  Helmet + CORS + Rate Limiting  │
                    │      JWT Auth Middleware        │
                    └────────┬───────────────┬────────┘
                             │               │
            Server-Side Only │               │ Parameterized Queries
            @google/genai    │               │ WHERE user_id = $1
                             ▼               ▼
                ┌──────────────────┐    ┌───────────────────────────┐
                │ Google Gemini AI │    │        PostgreSQL         │
                │  System Prompt   │    │  (Embedded / Remote Pool) │
                │  Zod Validation  │    │  UUIDs, JSONB, Migrations │
                └──────────────────┘    └───────────────────────────┘
```

---

## 📦 Tech Stack

- **Frontend**: React 18, TypeScript, Vite, React Router 7, Tailwind CSS, Lucide React, Zod
- **Backend**: Node.js, Express 4/5, TypeScript, `tsx`, `@google/genai`, `pg`, `@electric-sql/pglite`, `bcryptjs`, `jsonwebtoken`, `helmet`, `cors`, `express-rate-limit`, `zod`
- **Database**: PostgreSQL with UUIDs, JSONB columns, indexes, and parameterized queries
- **Testing**: Automated backend test suites covering authentication, authorization, user data isolation, and end-to-end Gemini generation

---

## 📋 Prerequisites

- **Node.js**: v18.0.0 or higher (v20+ or v24 recommended)
- **npm**: v9.0.0 or higher
- **Gemini API Key**: Free API key from [Google AI Studio](https://aistudio.google.com/)

---

## 🚀 Quick Start Guide

### 1. Clone & Install Dependencies

From the repository root:

```bash
npm install
```

### 2. Configure Environment Variables

Create or update your `.env` file in the project root:

```env
NODE_ENV=development
PORT=4000

# Optional: Remote PostgreSQL connection string (e.g. Supabase, Neon, AWS RDS, Replit Postgres)
# If left blank, the app runs its built-in embedded PostgreSQL engine with local disk storage in ./database/data
DATABASE_URL=

# Gemini API Configuration (Server-side ONLY)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.8-flash

# JWT Secret for Session Authentication
JWT_SECRET=super_secure_jwt_token_secret_key_change_in_production

# Frontend Client Configuration
CLIENT_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
```

### 3. Initialize & Seed Database

Run the database migration and seed script:

```bash
npm run seed
```

This creates all PostgreSQL tables, indexes, and seeds a demo farmer account:
- **Email**: `farmer@agri-advisor.org`
- **Password**: `Password123!`
- **Sample Advisory**: Wheat (HD-2967) vegetative stage nutrient and aphid advisory.

### 4. Run Development Servers

Start both the backend API and frontend client simultaneously:

```bash
npm run dev
```

- **Frontend Application**: `http://localhost:5173`
- **Backend REST API**: `http://localhost:4000/api`
- **API Health Check**: `http://localhost:4000/api/health`

---

## 🧪 Running Automated Tests

Run the test suite verifying authentication, validation, and data isolation:

```bash
npm run test
```

Test results:
- `GET /api/health` -> 200 OK
- `GET /api/advisories` (unauthenticated) -> 401 Unauthorized
- `POST /api/auth/register` -> Creates user & returns signed JWT
- `POST /api/auth/register` (duplicate email) -> 409 Conflict
- `POST /api/auth/login` -> Authenticates and returns JWT
- `GET /api/auth/me` -> Returns sanitized profile
- `GET /api/preferences` -> Returns isolated preferences
- `PATCH /api/preferences` -> Updates preferences
- Strict Data Isolation Test: User 2 cannot access or view User 1 advisories
- `GET /api/dashboard/summary` -> Returns aggregated metrics

---

## 🗄️ Database Schema & Isolation

The application enforces strict multi-tenant isolation on all database queries:

```sql
-- Schema Highlights
CREATE TABLE users (
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

CREATE TABLE advisory_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    domain TEXT NOT NULL,
    crop_name TEXT NOT NULL,
    crop_stage TEXT NOT NULL,
    ...
);

CREATE TABLE advisories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL UNIQUE REFERENCES advisory_requests(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

Every database lookup enforces:
```sql
WHERE user_id = $1
```
Client-supplied `user_id` values are never trusted. The identity is extracted exclusively from the cryptographically verified JWT payload on the backend.

---

## 🛡️ Security Controls

1. **Zero Secret Leakage**: `GEMINI_API_KEY` is restricted strictly to backend environment variables.
2. **Password Hashing**: Passwords are encrypted with `bcrypt` (10 rounds). Plaintext passwords are never logged or stored.
3. **Rate Limiting**:
   - Authentication endpoints: 30 attempts / 15 min
   - AI Advisory requests: 20 generations / 15 min
   - General API: 200 requests / 15 min
4. **HTTP Security Headers**: Powered by `helmet` with secure defaults.
5. **CORS Allowlist**: Configured strictly to the authorized client origin.
6. **Error Sanitization**: Stack traces and internal database errors are hidden in production responses.

---

## 📱 Application Routes

| Route | Access | Purpose |
|---|---|---|
| `/` | Public | Landing page with value proposition, capabilities & how it works |
| `/login` | Public | Sign in with email, password, and demo auto-fill |
| `/register` | Public | Farmer registration with location & language selection |
| `/dashboard` | Protected | Agronomic metrics, risk distribution, and recent advisories |
| `/advisory/new` | Protected | Multi-step AI advisory request form with dynamic domain selection |
| `/advisory/:id` | Protected | Detailed advisory report, action plan, and risk matrix |
| `/history` | Protected | Searchable, filterable, and sortable historical advisories |
| `/profile` | Protected | Farmer personal background, acreage, and default irrigation type |
| `/settings` | Protected | Language localization, notification alerts, and data isolation status |
| `/404` | Public | Friendly coordinate not found page |

---

## 📜 Production Build & Deployment

To generate production bundles:

```bash
npm run build
```

This compiles both backend TypeScript (`tsc`) and frontend assets with Vite (`vite build`).

To start the production server:

```bash
npm run start
```

---

## 📄 License

MIT License. Designed and built for agricultural communities and farmers worldwide.
