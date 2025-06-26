// スキルデータの型定義
export interface Skill {
  分野: string;
  項目: string;
  レベル: "初級" | "中級" | "上級";
  スキル: string;
  解説: string; // スキルの詳細な説明
  id: number; // 一意のID
}

// ユーザー回答の型定義
export interface UserAnswer {
  skillId: number;
  hasSkill: boolean;
}

// 集計結果の型定義
export interface SkillSummary {
  category: string;
  item: string;
  beginnerCount: number;
  beginnerTotal: number;
  intermediateCount: number;
  intermediateTotal: number;
  advancedCount: number;
  advancedTotal: number;
}

// スキルカテゴリーの型定義
export interface SkillCategory {
  category: string;
  items: string[];
}

// 休憩カードの型定義
export interface BreakCard {
  id: string;
  title: string;
  message: string;
}

// 評価履歴の型定義
export interface AssessmentHistory {
  id: string;
  date: Date;
  results: SkillSummary[];
  userAnswers: UserAnswer[];
  totalSkills: number;
  completionRate: number;
  skillCounts: {
    beginnerTotal: number;
    intermediateTotal: number;
    advancedTotal: number;
    beginnerAcquired: number;
    intermediateAcquired: number;
    advancedAcquired: number;
  };
}

// 進捗比較の型定義
export interface ProgressComparison {
  category: string;
  item: string;
  previousTotal: number;
  currentTotal: number;
  improvement: number; // 改善されたスキル数
  isImproved: boolean;
}

// 途中保存状態の型定義
export interface SavedProgress {
  currentSkillIndex: number;
  userAnswers: UserAnswer[];
  progress: number;
  lastSavedDate: Date;
}

// ユーザープロフィールの型定義
export interface UserProfile {
  id: string;
  name?: string;
  department?: string;
  role?: string;
  assessmentHistory: AssessmentHistory[];
  savedProgress?: SavedProgress;
}

// 評価タイプの定義
export type AssessmentType = 'full' | 'field-specific';

// 分野の定義
export type FieldType = 'インフラエンジニア' | '開発エンジニア（プログラマー）' | '開発エンジニア（SE）' | 'マネジメント';

// 評価設定の型定義
export interface AssessmentConfig {
  type: AssessmentType;
  selectedFields?: FieldType[];
}

// 分野別集計結果の型定義
export interface FieldSummary {
  field: FieldType;
  beginnerCount: number;
  beginnerTotal: number;
  intermediateCount: number;
  intermediateTotal: number;
  advancedCount: number;
  advancedTotal: number;
}
