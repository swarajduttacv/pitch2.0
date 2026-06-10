import { GoogleGenAI, Type, GenerateContentResponse, Chat } from "@google/genai";
import { EvaluationResult } from '../types';

const evaluationSchema = {
  type: Type.OBJECT,
  properties: {
    scores: {
      type: Type.OBJECT,
      description: 'Scores for key metrics from 1 to 100.',
      required: ['clarity', 'feasibility', 'innovation', 'marketUnderstanding', 'financialViability'],
      properties: {
        clarity: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: 'Score for clarity (1-100).' },
            justification: { type: Type.STRING, description: 'Brief justification for the clarity score.' }
          },
          required: ['score', 'justification']
        },
        feasibility: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: 'Score for feasibility (1-100).' },
            justification: { type: Type.STRING, description: 'Brief justification for the feasibility score.' }
          },
          required: ['score', 'justification']
        },
        innovation: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: 'Score for innovation (1-100).' },
            justification: { type: Type.STRING, description: 'Brief justification for the innovation score.' }
          },
          required: ['score', 'justification']
        },
        marketUnderstanding: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: 'Score for market understanding (1-100).' },
            justification: { type: Type.STRING, description: 'Brief justification for the market understanding score.' }
          },
          required: ['score', 'justification']
        },
        financialViability: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: 'Score for financial viability (1-100), based on business model, revenue streams, and projections.' },
            justification: { type: Type.STRING, description: 'Brief justification for the financial viability score.' }
          },
          required: ['score', 'justification']
        },
      }
    },
    swotAnalysis: {
      type: Type.OBJECT,
      description: 'SWOT analysis of the business idea.',
      required: ['strengths', 'weaknesses', 'opportunities', 'threats'],
      properties: {
        strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'List of strengths.' },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'List of weaknesses.' },
        opportunities: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'List of opportunities.' },
        threats: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'List of threats.' }
      }
    },
    marketAnalysis: {
        type: Type.OBJECT,
        description: 'Analysis of the target market.',
        required: ['targetAudience', 'marketSize', 'growthPotential'],
        properties: {
            targetAudience: { type: Type.STRING, description: 'Description of the target audience.' },
            marketSize: { type: Type.STRING, description: 'Estimated market size and its source/logic.' },
            growthPotential: { type: Type.STRING, description: 'Potential for market growth.' }
        }
    },
    competitiveLandscape: {
        type: Type.OBJECT,
        description: 'Analysis of the competitive landscape.',
        required: ['keyCompetitors', 'competitiveAdvantage'],
        properties: {
            keyCompetitors: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'List of key competitors.' },
            competitiveAdvantage: { type: Type.STRING, description: 'The unique selling proposition or competitive advantage.' }
        }
    },
    suggestions: {
      type: Type.OBJECT,
      description: 'Suggestions for improvement.',
      required: ['tone', 'flow', 'visuals'],
      properties: {
        tone: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Suggestions for improving the tone.' },
        flow: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Suggestions for improving the flow and narrative.' },
        visuals: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Suggestions for visuals (even if none are provided, suggest what could be shown).' }
      }
    },
    keyQuestions: {
        type: Type.OBJECT,
        description: 'Context-specific critical questions an investor would ask for each section.',
        required: ['summary', 'swot', 'market', 'suggestions'],
        properties: {
            summary: { type: Type.ARRAY, items: { type: Type.STRING }, description: '3-5 questions about the overall pitch summary and scores.' },
            swot: { type: Type.ARRAY, items: { type: Type.STRING }, description: '3-5 questions specifically about the SWOT analysis.' },
            market: { type: Type.ARRAY, items: { type: Type.STRING }, description: '3-5 questions about the market and competitive landscape.' },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: '3-5 questions related to the actionable suggestions provided.' },
        }
    }
  },
  required: ['scores', 'swotAnalysis', 'marketAnalysis', 'competitiveLandscape', 'suggestions', 'keyQuestions'],
};

const PERSONA_PROMPTS = {
    'default': 'You are an expert Venture Capitalist and MBA professor specializing in entrepreneurship and startup evaluation. Your feedback should be balanced, critical, insightful, and actionable.',
    'aggressive-vc': 'You are an aggressive, high-risk, high-reward Venture Capitalist looking for the next unicorn. Focus on massive market potential, disruptive innovation, and scalability above all else. Be blunt and direct with your feedback.',
    'cautious-angel': 'You are a cautious Angel Investor who invests their own money. You prioritize proven traction, a clear path to profitability, and a strong, defensible business model. Be risk-averse in your analysis and focus on practical feasibility.',
    'data-analyst': 'You are a data-driven analyst. Your evaluation must be highly quantitative. Scrutinize financial projections, market size claims, and user metrics. Demand evidence and data to back up every assertion. Be skeptical of claims without proof.'
};

export async function evaluatePitch(pitchText: string, persona: keyof typeof PERSONA_PROMPTS): Promise<EvaluationResult> {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const systemInstruction = `${PERSONA_PROMPTS[persona]} Your task is to analyze a given pitch deck or business plan text and provide a comprehensive, structured evaluation. Assess financial viability based on the business model, monetization strategy, and any provided financial projections. For the 'keyQuestions' field, you must generate four distinct lists of questions, each tailored to a specific section of your analysis (summary, SWOT, market, suggestions). Return your entire analysis in the specified JSON format.`;

  const userPrompt = `Analyze the following pitch deck text and provide your evaluation.\n\n---\n\n${pitchText}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: evaluationSchema,
        temperature: 0.2,
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return result as EvaluationResult;
  } catch (error) {
    console.error("Error evaluating pitch:", error);
    throw new Error("Failed to get a valid evaluation from the AI. Please check your input and try again.");
  }
}

export function createChat(context: string): Chat {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    return ai.chats.create({
      model: 'gemini-3.1-flash-lite',
      config: {
        systemInstruction: `You are an elite AI strategy consultant for PitchPerfect AI, modeled after a top-tier consultant from a firm like McKinsey or BCG. The user is asking for follow-up advice on a specific part of their pitch evaluation. Your communication style must be direct, data-driven, and highly structured.

Current Context of the discussion: ${context}

**CRITICAL DIRECTIVES**:
1.  **Provide Hyper-Specific, Actionable Advice**: Do not give generic feedback. Offer concrete, quantifiable examples and strategic frameworks. Your advice must be immediately actionable for the user.
2.  **Ensure Complete Analysis**: Your main analysis and recommendations **MUST be fully complete and self-contained** before you proceed to the next step. Do not provide truncated or incomplete answers.
3.  **Structure with Markdown**: Structure your main answer using Markdown. Use **bolding** for emphasis and bullet points (using '*') for lists.
4.  **Provide Exactly 3 Follow-up Questions**: After your complete analysis, you **MUST** provide exactly 3 relevant, strategic follow-up questions to guide the user. Each question **MUST start with a '*' on a new line**.`,
      },
    });
}

export async function getChatbotResponse(chat: Chat, newMessage: string): Promise<string> {
    const response: GenerateContentResponse = await chat.sendMessage({ message: newMessage });
    return response.text;
}
