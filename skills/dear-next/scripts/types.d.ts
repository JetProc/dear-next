export interface Evidence { id: string; source: string; date: string; excerpt: string; }
export interface Discovery { id: string; title: string; body: string; confidence: 'supported' | 'tentative' | 'conflicted'; evidence: string[]; counterpoint: string; }
export interface Action { title: string; why: string; evidence: string[]; }
export interface Report {
  version: 1;
  year: number;
  asOf: string;
  synthetic: boolean;
  coverage: string;
  title: string;
  subtitle: string;
  words: string[];
  evidence: Evidence[];
  discoveries: Discovery[];
  keep: Action[];
  change: Action[];
  plan: { direction: string; why: string; evidence: string[]; firstMonth: string; firstWeek: Action[] };
  limitations: string[];
}
export interface Schema {
  type?: string; const?: unknown; enum?: unknown[]; minimum?: number; maximum?: number;
  minLength?: number; maxLength?: number; pattern?: string; minItems?: number; maxItems?: number;
  items?: Schema; properties?: Record<string, Schema>; required?: string[];
  additionalProperties?: boolean; $schema?: string; title?: string;
}
