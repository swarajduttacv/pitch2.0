

export interface ScoreMetric {
  score: number;
  justification: string;
}

export interface EvaluationScores {
  clarity: ScoreMetric;
  feasibility: ScoreMetric;
  innovation: ScoreMetric;
  marketUnderstanding: ScoreMetric;
  financialViability: ScoreMetric;
}

export interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface MarketAnalysis {
    targetAudience: string;
    marketSize: string;
    growthPotential: string;
}

export interface CompetitiveLandscape {
    keyCompetitors: string[];
    competitiveAdvantage: string;
}

export interface Suggestions {
  tone: string[];
  flow: string[];
  visuals: string[];
}

export interface KeyQuestions {
  summary: string[];
  swot: string[];
  market: string[];
  suggestions: string[];
}

export interface EvaluationResult {
  scores: EvaluationScores;
  swotAnalysis: SWOTAnalysis;
  marketAnalysis: MarketAnalysis;
  competitiveLandscape: CompetitiveLandscape;
  suggestions: Suggestions;
  keyQuestions: KeyQuestions;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface PitchRecord {
  id: string;
  date: string;
  pitchText: string;
  persona: string;
  result: EvaluationResult;
}