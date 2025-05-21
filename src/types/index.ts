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
