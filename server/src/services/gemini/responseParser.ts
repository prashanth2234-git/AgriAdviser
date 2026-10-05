import { AIAdvisoryResponse, AIAdvisoryResponseSchema } from '../../../../shared/schemas/advisory';

export function parseAndValidateAIResponse(rawText: string): AIAdvisoryResponse {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error('Empty response received from AI model');
  }

  // 1. Strip markdown fences if present
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '');
  }

  if (cleaned.endsWith('```')) {
    cleaned = cleaned.replace(/```\s*$/, '');
  }
  cleaned = cleaned.trim();

  // Find opening and closing braces if extraneous text surrounds it
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  // 2. Parse JSON
  let parsedObject: unknown;
  try {
    parsedObject = JSON.parse(cleaned);
  } catch (err: any) {
    throw new Error(`Failed to parse AI output as JSON: ${err.message}. Response sample: ${cleaned.substring(0, 150)}...`);
  }

  // 3. Validate against Zod schema
  const validation = AIAdvisoryResponseSchema.safeParse(parsedObject);
  if (!validation.success) {
    const errorDetails = validation.error.errors
      .map((e) => `${e.path.join('.')}: ${e.message}`)
      .join('; ');
    throw new Error(`AI advisory output failed structural schema validation: ${errorDetails}`);
  }

  return validation.data;
}
