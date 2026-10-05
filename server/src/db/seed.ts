import bcrypt from 'bcryptjs';
import { getDb } from './index';

async function seed() {
  try {
    const db = await getDb();
    console.log('[SEED] Seeding database with initial demo data...');

    // 1. Check if demo farmer already exists
    const existingUser = await db.query(
      'SELECT id FROM users WHERE email = $1',
      ['farmer@agri-advisor.org']
    );

    let userId: string;

    if (existingUser.rows.length === 0) {
      const passwordHash = await bcrypt.hash('Password123!', 10);
      const userRes = await db.query(
        `INSERT INTO users (
          email, password_hash, full_name, phone, preferred_language,
          location, farming_experience_years, farm_size_acres, primary_crops,
          irrigation_type, farming_method
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id`,
        [
          'farmer@agri-advisor.org',
          passwordHash,
          'Rajesh Patel',
          '+91 98765 43210',
          'en',
          'Ludhiana, Punjab',
          12,
          15.5,
          ['Wheat', 'Basmati Rice', 'Mustard'],
          'Borewell / Tube Well',
          'integrated',
        ]
      );
      userId = userRes.rows[0].id;
      console.log('[SEED] Created demo farmer user with ID:', userId);

      // Create preferences
      await db.query(
        `INSERT INTO user_preferences (user_id, preferred_language, notifications_enabled, email_notifications)
         VALUES ($1, 'en', true, true)
         ON CONFLICT (user_id) DO NOTHING`,
        [userId]
      );
    } else {
      userId = existingUser.rows[0].id;
      console.log('[SEED] Demo user already exists:', userId);
    }

    // 2. Check if sample advisory exists
    const existingAdvisory = await db.query(
      'SELECT id FROM advisories WHERE user_id = $1 LIMIT 1',
      [userId]
    );

    if (existingAdvisory.rows.length === 0) {
      console.log('[SEED] Creating sample advisory for demo farmer...');
      // Insert advisory request
      const reqRes = await db.query(
        `INSERT INTO advisory_requests (
          user_id, domain, crop_name, crop_stage, location,
          soil_type, soil_ph, soil_fertility, season, irrigation_method,
          water_availability, farm_size_acres, farming_method, previous_crop,
          symptoms, pest_observations, disease_observations, weather_observations,
          question, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
        RETURNING id`,
        [
          userId,
          'crop_management',
          'Wheat (HD-2967)',
          'vegetative',
          'Ludhiana, Punjab',
          'Alluvial Soil',
          7.2,
          'Moderate organic matter, slightly deficient in zinc',
          'Rabi (Winter Sowing)',
          'Borewell / Tube Well',
          'moderate',
          15.5,
          'integrated',
          'Basmati Rice',
          'Intermittent yellowing of lower leaf margins and mild stunting',
          'Occasional aphid clusters on lower leaf surface',
          'No visible fungal rust pustules yet',
          'Morning fog followed by dry sunny afternoons (18-22C)',
          'What corrective nutrition and irrigation schedule should I follow before heading stage?',
          'completed',
        ]
      );

      const requestId = reqRes.rows[0].id;

      // Insert advisory
      const cropAssessment = {
        summary: 'Wheat crop is in early tillering to jointing vegetative stage with generally favorable vigor, though slight nutrient and micro-pest stress is evident.',
        suitability: 'high',
        positive_factors: [
          'Optimal temperature range for wheat vegetative development',
          'Favorable alluvial soil with near-neutral pH (7.2)',
          'Adequate winter sun exposure for tillering'
        ],
        limiting_factors: [
          'Emerging aphid population requiring threshold monitoring',
          'Lower leaf margin chlorosis suggesting nitrogen or zinc deficiency'
        ],
        recommendations: [
          'Ensure crown root initiation irrigation was thoroughly absorbed',
          'Avoid excessive waterlogging in alluvial soil'
        ],
        confidence: 'high'
      };

      const soilAssessment = {
        summary: 'Alluvial soil exhibits high fertility retention with pH 7.2. Zinc availability might be marginally locked due to neutral-to-alkaline tendency.',
        suitability: 'high',
        observations: [
          'Soil texture retains moisture well in winter',
          'Previous rice cycle may have depleted available soil zinc'
        ],
        potential_constraints: [
          'Zinc fixation in continuous rice-wheat rotation',
          'Compacted plow pan beneath puddle layer from prior rice'
        ],
        improvement_actions: [
          'Apply 0.5% zinc sulfate heptahydrate foliar spray if deficiency persists',
          'Incorporate organic residue during inter-season fallow'
        ],
        confidence: 'high'
      };

      const irrigationRecommendation = {
        summary: 'Maintain soil moisture at field capacity during the active vegetative/tillering phase without creating ponded conditions.',
        water_status: 'moderate',
        recommendations: [
          'Schedule second irrigation 40-45 days after sowing (tillering stage)',
          'Apply light, uniform flood or furrow irrigation in calm winds'
        ],
        conservation_actions: [
          'Use tensiometers or soil moisture probes to avoid over-irrigation',
          'Check canal/borewell salinity periodically'
        ],
        warning_signs: [
          'Leaf wilting in early afternoon indicating root moisture stress',
          'Standing water exceeding 24 hours which suffocates wheat root aeration'
        ]
      };

      const nutrientRecommendation = {
        summary: 'Top-dress split nitrogen dose prior to first node appearance; complement with micronutrient foliar application.',
        possible_issues: [
          'Nitrogen leaching or delayed top-dressing',
          'Zinc deficiency typical of post-rice alluvial soils'
        ],
        recommended_actions: [
          'Apply remaining 50% nitrogen dose (Urea) just before irrigation',
          'Foliar spray of 0.5% Zinc Sulfate + 2.5% Urea dissolved in 200L water per acre'
        ],
        soil_testing_recommendation: 'Periodic laboratory soil testing recommended every 2-3 crop cycles.',
        warnings: [
          'Do not apply foliar urea in hot mid-day sun to avoid leaf scorch',
          'Never mix zinc sulfate directly with phosphatic fertilizers in the same tank'
        ]
      };

      const pestDiseaseAssessment = {
        summary: 'Low-to-moderate aphid presence observed. Environmental conditions (morning fog and warm afternoons) also warrant alertness for yellow rust.',
        possible_causes: [
          {
            name: 'Corn leaf aphid (Rhopalosiphum maidis)',
            reasoning: 'Cluster colonization on underside of leaf sheaths during temperate winter spells.',
            likelihood: 'medium'
          },
          {
            name: 'Early Nitrogen / Micronutrient Chlorosis',
            reasoning: 'Yellowing leaf margins without necrotic fungal spots.',
            likelihood: 'high'
          }
        ],
        immediate_actions: [
          'Count aphids per tiller across 20 representative spots in the field',
          'Conserve natural predators such as ladybird beetles and hoverfly larvae',
          'If aphid population exceeds 15-20 aphids per tiller, consult local extension for registered bio-control or safe targeted intervention'
        ],
        preventive_actions: [
          'Install yellow sticky traps along field borders',
          'Regularly inspect crop for yellow rust pustules on leaf blades'
        ],
        professional_verification_recommended: true
      };

      const actionPlan = {
        immediate: [
          'Inspect 20 random tillers to establish precise aphid counts',
          'Prepare foliar spray solution of 0.5% Zinc Sulfate if chlorosis spreads'
        ],
        next_7_days: [
          'Execute scheduled top-dress application of nitrogen prior to irrigation',
          'Irrigate crop evenly, ensuring no water stands in field corners'
        ],
        next_30_days: [
          'Monitor flag leaf emergence and initiate pre-booting inspection',
          'Assess weather forecasts for unseasonal rain or wind lodged risks'
        ],
        long_term: [
          'Conduct comprehensive soil test post-harvest to measure residual N-P-K-Zn',
          'Rotate with green manure (Sesbania/Dhaincha) during the summer window'
        ]
      };

      const riskAssessment = {
        overall: 'medium',
        water_risk: 'low',
        soil_risk: 'low',
        pest_risk: 'medium',
        disease_risk: 'medium',
        management_risk: 'low',
        explanation: 'The crop is well established with low water and soil risks. Moderate risk arises from potential aphid escalation and fog-assisted fungal rust incubation if weather remains humid.'
      };

      await db.query(
        `INSERT INTO advisories (
          request_id, user_id, summary, crop_assessment, soil_assessment,
          irrigation_recommendation, nutrient_recommendation, pest_disease_assessment,
          action_plan, risk_assessment, assumptions, follow_up_questions,
          confidence, ai_model, ai_generated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
        [
          requestId,
          userId,
          'Wheat crop in vegetative stage requires balanced split nitrogen top-dressing, micronutrient zinc support, and monitoring of early aphid clusters before heading.',
          JSON.stringify(cropAssessment),
          JSON.stringify(soilAssessment),
          JSON.stringify(irrigationRecommendation),
          JSON.stringify(nutrientRecommendation),
          JSON.stringify(pestDiseaseAssessment),
          JSON.stringify(actionPlan),
          JSON.stringify(riskAssessment),
          JSON.stringify([
            'Assuming sowing occurred within normal November window',
            'Assuming irrigation water has safe electrical conductivity (EC < 2 dS/m)'
          ]),
          JSON.stringify([
            'When exactly was the basal fertilizer applied at sowing?',
            'Are aphids localized to field margins or distributed uniformly across the entire acreage?'
          ]),
          'high',
          'gemini-3.8-flash',
          new Date().toISOString(),
        ]
      );

      console.log('[SEED] Sample advisory inserted successfully.');
    } else {
      console.log('[SEED] Advisories already exist for demo user.');
    }

    console.log('[SEED] Seeding completed.');
    process.exit(0);
  } catch (error) {
    console.error('[SEED] Error during seeding:', error);
    process.exit(1);
  }
}

seed();
