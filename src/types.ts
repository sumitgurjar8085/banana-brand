export interface Product {
  id: string;
  name: string;
  brandName: string;
  tagline: string;
  category: string;
  imageUrl: string;
  colorPalette: string[];
  description: string;
  isSample?: boolean;
}

export type MediumCategory = 'all' | 'essentials' | 'outdoor' | 'apparel' | 'packaging' | 'digital' | 'retail';

export interface MarketingMedium {
  id: string;
  name: string;
  category: 'essentials' | 'outdoor' | 'apparel' | 'packaging' | 'digital' | 'retail';
  description: string;
  iconName: string;
  defaultPrompt: string;
  suggestedAspect: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  badge: string;
}

export interface ConsistencyAuditReport {
  consistencyScore: number;
  brandFidelitySummary: string;
  logoAssessment: string;
  colorPaletteAssessment: string;
  materialRealismAssessment: string;
  strengths: string[];
  suggestions: string[];
}

export interface MockupFrame {
  id: string;
  productId: string;
  mediumId: string;
  mediumName: string;
  imageUrl?: string;
  promptUsed: string;
  aspectRatio: string;
  timestamp: number;
  modelUsed: string;
  notes?: string;
  status: 'idle' | 'generating' | 'completed' | 'failed';
  error?: string;
  consistencyScore?: number;
  auditReport?: ConsistencyAuditReport;
  isAuditing?: boolean;
}
