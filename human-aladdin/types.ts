
export enum LifePhase {
  START = 'Start',
  ADVANCE = 'Advance',
  INFLECTION = 'Inflection',
  MATURE = 'Mature',
  DECLINE = 'Decline'
}

export type RiskCategory = 'business' | 'investment' | 'life';

export interface RiskSignal {
  signal: string;
  description: string;
  riskLevel: '高' | '中' | '低';
}

export interface AladdinAnalysis {
  phase: LifePhase;
  phaseReasoning: string;
  resilience: string; // 系統承受度
  humanState: string; // 人的狀態
  dangerousBehaviors: string[];
  guardrails: string[];
  safeActionRadius: string[];
  survivalMetric: string;
  disclaimer: string;
  riskSignals?: RiskSignal[];
}
