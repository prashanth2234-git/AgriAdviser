import { getDb } from '../../db';
import { env } from '../../config/env';
import { getGeminiClient } from '../gemini/geminiClient';
import { SYSTEM_PROMPT, buildAdvisoryPrompt } from '../gemini/promptBuilder';
import { parseAndValidateAIResponse } from '../gemini/responseParser';
import { AdvisoryRequestInput, AIAdvisoryResponse } from '../../../../shared/schemas/advisory';
import { AdvisoryRecord, DashboardSummary } from '../../../../shared/types';

export class AdvisoryEngine {
  /**
   * Generates and persists a new advisory for a farmer
   */
  static async createAdvisory(userId: string, input: AdvisoryRequestInput): Promise<AdvisoryRecord> {
    const db = await getDb();

    // 1. Fetch user context
    const userRes = await db.query(
      `SELECT full_name, farming_experience_years, farm_size_acres, preferred_language
       FROM users WHERE id = $1`,
      [userId]
    );

    const userProfile = userRes.rows[0]
      ? {
          fullName: userRes.rows[0].full_name,
          farmingExperienceYears: userRes.rows[0].farming_experience_years,
          farmSizeAcres: userRes.rows[0].farm_size_acres,
          preferredLanguage: userRes.rows[0].preferred_language,
        }
      : undefined;

    // 2. Generate Prompt
    const promptText = buildAdvisoryPrompt(input, userProfile);

    // 3. Call Gemini API with resilient fallback models and transient error handling
    const aiClient = getGeminiClient();
    const candidateModels = [
      env.GEMINI_MODEL || 'gemini-3.8-flash',
      'gemini-3-flash',
    ];

    let rawAiText = '';
    let parsedAdvisory: AIAdvisoryResponse | null = null;
    let lastError: any = null;
    let selectedModel = candidateModels[0];

    for (const model of candidateModels) {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          console.log(`[AI] Requesting advisory from ${model} (attempt ${attempt}) for crop: ${input.cropName}, domain: ${input.domain}`);
          const isRetry = attempt > 1;
          const currentPrompt = isRetry
            ? `${promptText}\n\nIMPORTANT: The previous output failed schema validation. Please adhere strictly to the JSON schema format specified and output ONLY a raw valid JSON object without surrounding commentary.`
            : promptText;

          const response = await aiClient.models.generateContent({
            model: model,
            contents: currentPrompt,
            config: {
              systemInstruction: SYSTEM_PROMPT,
              temperature: isRetry ? 0.1 : 0.2,
            },
          });

          rawAiText = response.text || '';
          parsedAdvisory = parseAndValidateAIResponse(rawAiText);
          selectedModel = model;
          break; // successfully parsed and validated
        } catch (err: any) {
          lastError = err;
          console.warn(`[AI] Attempt ${attempt} on ${model} failed: ${err.message}`);
          // Wait briefly before retry if transient 503/429
          if (attempt === 1) {
            await new Promise((resolve) => setTimeout(resolve, 1500));
          }
        }
      }

      if (parsedAdvisory) {
        break; // Successfully obtained advisory
      }
    }

    if (!parsedAdvisory) {
      console.error('[AI] Fatal Gemini advisory error after fallbacks:', lastError);
      throw new Error(
        `Unable to generate a verified agricultural advisory: ${lastError?.message || 'AI service unavailable'}. No fabricated data was substituted. Please review your input parameters and retry in a few moments.`
      );
    }

    // 4. Persist in database within a transaction
    return await db.transaction(async (tx) => {
      // Insert advisory request
      const reqInsert = await tx.query(
        `INSERT INTO advisory_requests (
          user_id, domain, crop_name, crop_stage, location,
          soil_type, soil_ph, soil_fertility, season, irrigation_method,
          water_availability, farm_size_acres, farming_method, previous_crop,
          symptoms, pest_observations, disease_observations, weather_observations,
          question, additional_context, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, 'completed')
        RETURNING *`,
        [
          userId,
          input.domain,
          input.cropName,
          input.cropStage,
          input.location,
          input.soilType,
          input.soilPH ?? null,
          input.soilFertility ?? null,
          input.season,
          input.irrigationMethod,
          input.waterAvailability,
          input.farmSize ?? null,
          input.farmingMethod,
          input.previousCrop ?? null,
          input.symptoms ?? null,
          input.pestObservations ?? null,
          input.diseaseObservations ?? null,
          input.weatherObservations ?? null,
          input.question,
          input.additionalContext ?? null,
        ]
      );

      const requestRecord = reqInsert.rows[0];

      // Insert advisory
      const advInsert = await tx.query(
        `INSERT INTO advisories (
          request_id, user_id, summary, crop_assessment, soil_assessment,
          irrigation_recommendation, nutrient_recommendation, pest_disease_assessment,
          action_plan, risk_assessment, assumptions, follow_up_questions,
          confidence, ai_model, ai_generated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW())
        RETURNING *`,
        [
          requestRecord.id,
          userId,
          parsedAdvisory.summary,
          JSON.stringify(parsedAdvisory.crop_assessment),
          JSON.stringify(parsedAdvisory.soil_assessment),
          JSON.stringify(parsedAdvisory.irrigation_recommendation),
          JSON.stringify(parsedAdvisory.nutrient_recommendation),
          JSON.stringify(parsedAdvisory.pest_disease_assessment),
          JSON.stringify(parsedAdvisory.action_plan),
          JSON.stringify(parsedAdvisory.risk_assessment),
          JSON.stringify(parsedAdvisory.assumptions),
          JSON.stringify(parsedAdvisory.follow_up_questions),
          parsedAdvisory.confidence,
          selectedModel,
        ]
      );

      const advisoryRecord = advInsert.rows[0];
      return {
        ...advisoryRecord,
        request: requestRecord,
      };
    });
  }

  /**
   * Retrieves all advisories for the authenticated user with optional filtering
   */
  static async getAdvisories(
    userId: string,
    filters: {
      crop?: string;
      domain?: string;
      search?: string;
      sort?: 'newest' | 'oldest';
    } = {}
  ): Promise<AdvisoryRecord[]> {
    const db = await getDb();
    const params: any[] = [userId];
    const conditions: string[] = ['a.user_id = $1'];

    if (filters.crop && filters.crop.trim().length > 0) {
      params.push(`%${filters.crop.trim()}%`);
      conditions.push(`r.crop_name ILIKE $${params.length}`);
    }

    if (filters.domain && filters.domain.trim().length > 0) {
      params.push(filters.domain.trim());
      conditions.push(`r.domain = $${params.length}`);
    }

    if (filters.search && filters.search.trim().length > 0) {
      params.push(`%${filters.search.trim()}%`);
      const searchParamIdx = params.length;
      conditions.push(
        `(r.crop_name ILIKE $${searchParamIdx} OR a.summary ILIKE $${searchParamIdx} OR r.question ILIKE $${searchParamIdx})`
      );
    }

    const sortOrder = filters.sort === 'oldest' ? 'ASC' : 'DESC';

    const sql = `
      SELECT
        a.id, a.request_id, a.user_id, a.summary,
        a.crop_assessment, a.soil_assessment, a.irrigation_recommendation,
        a.nutrient_recommendation, a.pest_disease_assessment, a.action_plan,
        a.risk_assessment, a.assumptions, a.follow_up_questions, a.confidence,
        a.ai_model, a.ai_generated_at, a.created_at,
        r.domain, r.crop_name, r.crop_stage, r.location, r.soil_type,
        r.soil_ph, r.soil_fertility, r.season, r.irrigation_method,
        r.water_availability, r.farm_size_acres, r.farming_method,
        r.previous_crop, r.symptoms, r.pest_observations, r.disease_observations,
        r.weather_observations, r.question, r.additional_context, r.status
      FROM advisories a
      JOIN advisory_requests r ON a.request_id = r.id
      WHERE ${conditions.join(' AND ')}
      ORDER BY a.created_at ${sortOrder}
    `;

    const result = await db.query(sql, params);

    return result.rows.map((row: any) => ({
      id: row.id,
      request_id: row.request_id,
      user_id: row.user_id,
      summary: row.summary,
      crop_assessment: typeof row.crop_assessment === 'string' ? JSON.parse(row.crop_assessment) : row.crop_assessment,
      soil_assessment: typeof row.soil_assessment === 'string' ? JSON.parse(row.soil_assessment) : row.soil_assessment,
      irrigation_recommendation: typeof row.irrigation_recommendation === 'string' ? JSON.parse(row.irrigation_recommendation) : row.irrigation_recommendation,
      nutrient_recommendation: typeof row.nutrient_recommendation === 'string' ? JSON.parse(row.nutrient_recommendation) : row.nutrient_recommendation,
      pest_disease_assessment: typeof row.pest_disease_assessment === 'string' ? JSON.parse(row.pest_disease_assessment) : row.pest_disease_assessment,
      action_plan: typeof row.action_plan === 'string' ? JSON.parse(row.action_plan) : row.action_plan,
      risk_assessment: typeof row.risk_assessment === 'string' ? JSON.parse(row.risk_assessment) : row.risk_assessment,
      assumptions: typeof row.assumptions === 'string' ? JSON.parse(row.assumptions) : row.assumptions,
      follow_up_questions: typeof row.follow_up_questions === 'string' ? JSON.parse(row.follow_up_questions) : row.follow_up_questions,
      confidence: row.confidence,
      ai_model: row.ai_model,
      ai_generated_at: row.ai_generated_at,
      created_at: row.created_at,
      request: {
        id: row.request_id,
        user_id: row.user_id,
        domain: row.domain,
        crop_name: row.crop_name,
        crop_stage: row.crop_stage,
        location: row.location,
        soil_type: row.soil_type,
        soil_ph: row.soil_ph,
        soil_fertility: row.soil_fertility,
        season: row.season,
        irrigation_method: row.irrigation_method,
        water_availability: row.water_availability,
        farm_size_acres: row.farm_size_acres,
        farming_method: row.farming_method,
        previous_crop: row.previous_crop,
        symptoms: row.symptoms,
        pest_observations: row.pest_observations,
        disease_observations: row.disease_observations,
        weather_observations: row.weather_observations,
        question: row.question,
        additional_context: row.additional_context,
        status: row.status,
        created_at: row.created_at,
        updated_at: row.created_at,
      },
    }));
  }

  /**
   * Retrieves a single advisory by ID strictly scoped to user_id
   */
  static async getAdvisoryById(userId: string, id: string): Promise<AdvisoryRecord | null> {
    const db = await getDb();
    const sql = `
      SELECT
        a.id, a.request_id, a.user_id, a.summary,
        a.crop_assessment, a.soil_assessment, a.irrigation_recommendation,
        a.nutrient_recommendation, a.pest_disease_assessment, a.action_plan,
        a.risk_assessment, a.assumptions, a.follow_up_questions, a.confidence,
        a.ai_model, a.ai_generated_at, a.created_at,
        r.domain, r.crop_name, r.crop_stage, r.location, r.soil_type,
        r.soil_ph, r.soil_fertility, r.season, r.irrigation_method,
        r.water_availability, r.farm_size_acres, r.farming_method,
        r.previous_crop, r.symptoms, r.pest_observations, r.disease_observations,
        r.weather_observations, r.question, r.additional_context, r.status
      FROM advisories a
      JOIN advisory_requests r ON a.request_id = r.id
      WHERE a.id = $1 AND a.user_id = $2
    `;

    const result = await db.query(sql, [id, userId]);
    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      id: row.id,
      request_id: row.request_id,
      user_id: row.user_id,
      summary: row.summary,
      crop_assessment: typeof row.crop_assessment === 'string' ? JSON.parse(row.crop_assessment) : row.crop_assessment,
      soil_assessment: typeof row.soil_assessment === 'string' ? JSON.parse(row.soil_assessment) : row.soil_assessment,
      irrigation_recommendation: typeof row.irrigation_recommendation === 'string' ? JSON.parse(row.irrigation_recommendation) : row.irrigation_recommendation,
      nutrient_recommendation: typeof row.nutrient_recommendation === 'string' ? JSON.parse(row.nutrient_recommendation) : row.nutrient_recommendation,
      pest_disease_assessment: typeof row.pest_disease_assessment === 'string' ? JSON.parse(row.pest_disease_assessment) : row.pest_disease_assessment,
      action_plan: typeof row.action_plan === 'string' ? JSON.parse(row.action_plan) : row.action_plan,
      risk_assessment: typeof row.risk_assessment === 'string' ? JSON.parse(row.risk_assessment) : row.risk_assessment,
      assumptions: typeof row.assumptions === 'string' ? JSON.parse(row.assumptions) : row.assumptions,
      follow_up_questions: typeof row.follow_up_questions === 'string' ? JSON.parse(row.follow_up_questions) : row.follow_up_questions,
      confidence: row.confidence,
      ai_model: row.ai_model,
      ai_generated_at: row.ai_generated_at,
      created_at: row.created_at,
      request: {
        id: row.request_id,
        user_id: row.user_id,
        domain: row.domain,
        crop_name: row.crop_name,
        crop_stage: row.crop_stage,
        location: row.location,
        soil_type: row.soil_type,
        soil_ph: row.soil_ph,
        soil_fertility: row.soil_fertility,
        season: row.season,
        irrigation_method: row.irrigation_method,
        water_availability: row.water_availability,
        farm_size_acres: row.farm_size_acres,
        farming_method: row.farming_method,
        previous_crop: row.previous_crop,
        symptoms: row.symptoms,
        pest_observations: row.pest_observations,
        disease_observations: row.disease_observations,
        weather_observations: row.weather_observations,
        question: row.question,
        additional_context: row.additional_context,
        status: row.status,
        created_at: row.created_at,
        updated_at: row.created_at,
      },
    };
  }

  /**
   * Deletes an advisory strictly scoped to user_id
   */
  static async deleteAdvisory(userId: string, id: string): Promise<boolean> {
    const db = await getDb();
    // Cascades to request because advisory references request, or delete request directly
    const res = await db.query(
      `DELETE FROM advisories WHERE id = $1 AND user_id = $2 RETURNING id`,
      [id, userId]
    );
    return res.rows.length > 0;
  }

  /**
   * Aggregates dashboard metrics for the user
   */
  static async getDashboardSummary(userId: string): Promise<DashboardSummary> {
    const allAdvisories = await this.getAdvisories(userId, {});

    const totalAdvisories = allAdvisories.length;
    const recentAdvisories = allAdvisories.slice(0, 5);

    const cropsSet = new Set<string>();
    let highRiskCount = 0;
    const riskBreakdown = { low: 0, medium: 0, high: 0 };

    allAdvisories.forEach((adv) => {
      if (adv.request?.crop_name) {
        cropsSet.add(adv.request.crop_name);
      }
      const overallRisk = adv.risk_assessment?.overall;
      if (overallRisk === 'high') {
        highRiskCount++;
        riskBreakdown.high++;
      } else if (overallRisk === 'medium') {
        riskBreakdown.medium++;
      } else if (overallRisk === 'low') {
        riskBreakdown.low++;
      }
    });

    const latestRecommendations = recentAdvisories.map((adv) => ({
      id: adv.id,
      crop: adv.request?.crop_name || 'Crop Advisory',
      domain: adv.request?.domain || 'General',
      summary: adv.summary,
      risk: adv.risk_assessment?.overall || 'unknown',
      date: adv.created_at,
    }));

    return {
      totalAdvisories,
      recentAdvisories,
      cropsAnalyzed: Array.from(cropsSet),
      highRiskAdvisoriesCount: highRiskCount,
      latestRecommendations,
      riskBreakdown,
    };
  }
}
