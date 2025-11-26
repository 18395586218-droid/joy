
export interface RitualResponse {
  acknowledgment: string;  // 阶段1：承认
  understanding: string;   // 阶段2：无责理解
  apology: string;         // 阶段3：模拟反思与道歉 (Repair)
  soothing: string;        // 阶段4：安抚
  closure: string;         // 阶段5：告别与重建
  safeImageKeyword: string; // 用于生成安全画面的关键词
  encouragement: string;   // 简短的鼓励
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
  themeClass: string; // For unique card styling per stage
}
