export type AIQueryDomain =
  | 'health-education'
  | 'medical-report-explanation'
  | 'exercise-guidance'
  | 'nutrition-guidance'
  | 'symptom-educational-info';

export interface AIQueryRequest {
  prompt: string;
  domain: AIQueryDomain;
  userContext?: {
    allergies?: string[];
    language?: string;
  };
}

export interface AIQueryResult {
  answer: string;
  content?: string;
  sources?: string[];
  sourcesSuggested?: string[];
  confidence?: string;
  disclaimer: string;
  suggestedFollowUps?: string[];
  requiresMedicalConsultation?: boolean;
  timestamp?: string;
}

export interface AIServiceStatus {
  isConfigured: boolean;
  provider: 'gemini' | 'none' | 'verified-clinical-cache' | 'clinical-engine';
  model?: string;
  statusMessage: string;
  supportedDomains: AIQueryDomain[];
}

export interface AIServiceInterface {
  getStatus(): Promise<AIServiceStatus>;
  queryAssistant(request: AIQueryRequest): Promise<AIQueryResult>;
}
