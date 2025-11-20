export interface RitualResponse {
  acknowledgment: string;
  understanding: string;
  apology: string;
  soothing: string;
  closure: string;
  safeImageKeyword: string;
  encouragement: string;
}

export enum AppView {
  INTRO = 'INTRO',
  INPUT = 'INPUT',
  PROCESSING = 'PROCESSING',
  RITUAL = 'RITUAL',
  AFTERCARE = 'AFTERCARE',
  COMPLETED = 'COMPLETED'
}

export interface StageConfig {
  title: string;
  subtitle: string;
  key: keyof RitualResponse;
  icon?: string;
}
