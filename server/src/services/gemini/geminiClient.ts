import { GoogleGenAI } from '@google/genai';
import { env } from '../../config/env';

let genAIClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (!genAIClient) {
    if (!env.apiKey) {
      throw new Error(
        'GEMINI_API_KEY (or GOOGLE_API_KEY) is not configured in the server environment. Please set this variable to generate AI advisories.'
      );
    }
    genAIClient = new GoogleGenAI({ apiKey: env.apiKey });
  }
  return genAIClient;
}
