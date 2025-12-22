export type Tier = 'standard' | 'enterprise';
export type QueueType = 'standard-queue' | 'vip-queue';
export type ActiveTab = 'dashboard' | 'reviews' | 'ghost-reports' | 'settings';
export type UserRole = 'admin' | 'viewer' | 'auditor';

export interface Task {
  id: string;
  clientId: string;
  tier: Tier;
  input: string;
  aiDraft: string;
  confidence: number;
  status: 'pending' | 'approved' | 'rejected';
  riskFlag: boolean;
  timestamp: Date;
}

export interface Log {
  id: string;
  date: string;
  taskSnippet: string;
  riskDetected: string;
  outcome: string;
  savedLiability: number;
}

export interface Stats {
  totalRuns: number;
  risksCaught: number;
  moneySaved: number;
  activeWorkers: number;
}

export interface Tier {
  name: string;
  price: string;
  confidence: string;
  queueTime: string;
  features: string[];
}

export interface PricingTierOption {
  tier: 'standard' | 'vip' | 'enterprise';
  name: string;
  price: string;
  features: string[];
}
