import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error('VITE_GEMINI_API_KEY is not set');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Gemini Experimental 1206 - Gemini 3.0 with advanced reasoning capabilities
const model = genAI.getGenerativeModel({ model: 'gemini-exp-1206' });

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: string;
}

export interface GeminiAnalysisResult {
  content: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  flags: string[];
  suggestions: string[];
}

/**
 * Analyze text content for PII, sensitive data, and potential risks
 */
export async function analyzeContent(
  content: string,
  context?: string
): Promise<GeminiAnalysisResult> {
  const prompt = `
You are an AI safety guardian analyzing content for potential risks.

Context: ${context || 'General content analysis'}

Content to analyze:
"${content}"

Analyze this content and identify:
1. Any Personally Identifiable Information (PII) like names, emails, phone numbers, addresses
2. Sensitive business information
3. Potential legal or compliance risks
4. Harmful or inappropriate content
5. Data that should be redacted or filtered

Provide your analysis in JSON format:
{
  "content": "summary of the content",
  "riskLevel": "low|medium|high|critical",
  "flags": ["list of specific issues found"],
  "suggestions": ["list of recommendations"]
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // Fallback if JSON parsing fails
    return {
      content: text,
      riskLevel: 'low',
      flags: [],
      suggestions: []
    };
  } catch (error) {
    console.error('Gemini analysis error:', error);
    throw error;
  }
}

/**
 * Generate AI-powered suggestions for content improvement
 */
export async function generateSuggestions(
  prompt: string,
  conversationHistory?: GeminiMessage[]
): Promise<string> {
  try {
    const chat = model.startChat({
      history: conversationHistory?.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.parts }]
      })) || []
    });
    
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini suggestion error:', error);
    throw error;
  }
}

/**
 * Detect and redact PII from text
 */
export async function detectAndRedactPII(text: string): Promise<{
  redactedText: string;
  detectedPII: string[];
}> {
  const prompt = `
Detect and redact all Personally Identifiable Information (PII) in the following text.
PII includes: names, email addresses, phone numbers, addresses, SSN, credit cards, etc.

Text:
"${text}"

Respond in JSON format:
{
  "redactedText": "text with PII replaced by [REDACTED]",
  "detectedPII": ["list of PII types found"]
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return {
      redactedText: text,
      detectedPII: []
    };
  } catch (error) {
    console.error('PII detection error:', error);
    throw error;
  }
}

export { model as geminiModel, genAI };
