import { AdvisoryRequestInput } from '../../../../shared/schemas/advisory';
import { ADVISORY_DOMAIN_METADATA } from '../../../../shared/constants';

export const SYSTEM_PROMPT = `You are an AI-powered agricultural crop advisory assistant.

Your role is to provide practical, cautious, understandable agricultural decision-support guidance based only on the information provided by the farmer.

You are NOT a substitute for:
- A qualified agronomist.
- A soil scientist.
- A plant pathologist.
- A local agricultural extension officer.
- A licensed pesticide professional.
- A veterinarian.
- A government agricultural authority.

Your recommendations must prioritize farmer safety, environmental sustainability, and practical feasibility.

IMPORTANT RULES:
1. Never fabricate soil, weather, laboratory, satellite, or field data.
2. Never claim certainty when the available information is insufficient.
3. Clearly distinguish observations, likely possibilities, assumptions, and recommendations.
4. Do not provide dangerous chemical mixing instructions.
5. Do not recommend pesticide dosages unless the required product label/local regulatory context is explicitly available.
6. Encourage users to follow registered product labels and local agricultural regulations.
7. For disease or pest identification based only on textual symptoms, describe possibilities rather than claiming definitive diagnosis.
8. Recommend professional/local agricultural verification when risk is high or information is insufficient.
9. Consider water availability and sustainability.
10. Avoid recommendations that could cause significant crop, financial, environmental, or human harm.
11. Use simple language suitable for farmers.
12. Give practical prioritized actions.
13. Explain why important recommendations are being made.
14. Do not invent scientific citations or sources.
15. Do not claim that you accessed live weather, soil sensors, satellite imagery, market prices, or government databases unless such tools/data are actually available.
16. Respect the farmer's stated crop, location, soil, season, and constraints.
17. If critical information is missing, include follow-up questions.
18. Always return valid JSON matching the required schema.
19. Do NOT include markdown backticks like \`\`\`json or \`\`\` around your output. Return raw JSON string only.
20. Return only the requested JSON object.`;

export function buildAdvisoryPrompt(input: AdvisoryRequestInput, farmerProfile?: {
  fullName?: string;
  farmingExperienceYears?: number | null;
  farmSizeAcres?: number | null;
  preferredLanguage?: string;
}): string {
  const domainMeta = ADVISORY_DOMAIN_METADATA[input.domain];

  return `
TARGET ADVISORY DOMAIN:
Domain: ${input.domain} (${domainMeta?.label || input.domain})
Domain Focus: ${domainMeta?.description || 'General agricultural advisory'}

FARMER CONTEXT:
${farmerProfile?.fullName ? `- Farmer Name: ${farmerProfile.fullName}` : ''}
${farmerProfile?.farmingExperienceYears ? `- Experience: ${farmerProfile.farmingExperienceYears} years` : ''}
${farmerProfile?.preferredLanguage ? `- Preferred Language: ${farmerProfile.preferredLanguage}` : ''}

FARM & CROP INFORMATION:
- Crop Name: ${input.cropName}
- Current Stage: ${input.cropStage}
- Geographic Location: ${input.location}
- Farm Size: ${input.farmSize ? `${input.farmSize} acres` : 'Not specified'}
- Farming Method: ${input.farmingMethod}
- Current Season: ${input.season}
- Previous Crop / Preceding Rotation: ${input.previousCrop || 'None stated'}

SOIL & WATER CONTEXT:
- Soil Type: ${input.soilType}
- Soil pH: ${input.soilPH !== undefined && input.soilPH !== null ? input.soilPH : 'Unknown / not measured'}
- Soil Fertility Details: ${input.soilFertility || 'Not specified'}
- Irrigation Method: ${input.irrigationMethod}
- Water Availability: ${input.waterAvailability}

OBSERVATIONS & SYMPTOMS:
- Symptoms Observed: ${input.symptoms || 'None reported'}
- Pest Observations: ${input.pestObservations || 'None reported'}
- Disease Observations: ${input.diseaseObservations || 'None reported'}
- Weather Observations: ${input.weatherObservations || 'None reported'}
- Additional Field Context: ${input.additionalContext || 'None'}

FARMER'S SPECIFIC QUESTION / OBJECTIVE:
"${input.question}"

INSTRUCTIONS FOR OUTPUT:
Provide an in-depth, structured agricultural decision support advisory addressing the farmer's question and context.
Adhere strictly to the agricultural safety and decision-support guidelines.
Return a single JSON object with EXACTLY the following structure and valid enum values:

{
  "summary": "Clear, concise high-level overview of the findings and primary advice for the farmer (2-4 sentences).",
  "crop_assessment": {
    "summary": "Assessment of current crop stage, vigor, and context.",
    "suitability": "high | medium | low | unknown",
    "positive_factors": ["string"],
    "limiting_factors": ["string"],
    "recommendations": ["string"],
    "confidence": "high | medium | low"
  },
  "soil_assessment": {
    "summary": "Analysis of the soil type, pH, fertility and interaction with this crop.",
    "suitability": "high | medium | low | unknown",
    "observations": ["string"],
    "potential_constraints": ["string"],
    "improvement_actions": ["string"],
    "confidence": "high | medium | low"
  },
  "irrigation_recommendation": {
    "summary": "Specific irrigation advice tailored to method and water status.",
    "water_status": "very_low | low | moderate | high | very_high | unknown",
    "recommendations": ["string"],
    "conservation_actions": ["string"],
    "warning_signs": ["string"]
  },
  "nutrient_recommendation": {
    "summary": "Nutrient balancing advice considering symptoms and soil context.",
    "possible_issues": ["string"],
    "recommended_actions": ["string"],
    "soil_testing_recommendation": "string",
    "warnings": ["string"]
  },
  "pest_disease_assessment": {
    "summary": "Prudent assessment of observations without definitive textual diagnosis.",
    "possible_causes": [
      {
        "name": "string",
        "reasoning": "string",
        "likelihood": "high | medium | low | unknown"
      }
    ],
    "immediate_actions": ["string"],
    "preventive_actions": ["string"],
    "professional_verification_recommended": true
  },
  "action_plan": {
    "immediate": ["Prioritized tasks for the next 24-48 hours"],
    "next_7_days": ["Key agronomic tasks for the coming week"],
    "next_30_days": ["Tasks for the upcoming month / stage transition"],
    "long_term": ["Post-harvest and regenerative soil/water practices"]
  },
  "risk_assessment": {
    "overall": "low | medium | high | unknown",
    "water_risk": "low | medium | high | unknown",
    "soil_risk": "low | medium | high | unknown",
    "pest_risk": "low | medium | high | unknown",
    "disease_risk": "low | medium | high | unknown",
    "management_risk": "low | medium | high | unknown",
    "explanation": "Clear explanation of risk drivers and mitigating conditions."
  },
  "assumptions": [
    "Explicit assumptions made in this advisory (e.g. regarding weather, water quality, or pest thresholds)"
  ],
  "follow_up_questions": [
    "Clarifying questions for the farmer to narrow down uncertainties"
  ],
  "confidence": "high | medium | low"
}
`;
}
