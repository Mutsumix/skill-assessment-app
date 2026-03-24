// スキルデータの型定義
export interface Skill {
  ロール: string;
  担当工程: string;
  スキル名: string;
  説明: string;
  id: number;
}

// ユーザー回答の型定義
export interface UserAnswer {
  skillId: number;
  level: number; // 0〜4の整数。未回答は -1
}

// 結果の型定義
export interface SkillResult {
  skillId: number;
  スキル名: string;
  担当工程: string;
  level: number; // 今回のレベル（0〜4）
}

// 評価履歴の型定義
export interface AssessmentHistory {
  id: string;
  date: Date;
  role: string;
  results: SkillResult[];
  userAnswers: UserAnswer[];
  totalSkills: number;
  completionRate: number;
}

// 進捗比較の型定義
export interface ProgressComparison {
  スキル名: string;
  担当工程: string;
  previousLevel: number;
  currentLevel: number;
  improvement: number;
  isImproved: boolean;
}

// 途中保存状態の型定義
export interface SavedProgress {
  currentSkillIndex: number;
  userAnswers: UserAnswer[];
  progress: number;
  lastSavedDate: Date;
  selectedRole: string | null;
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

// ロール一覧（表示順）
export const ROLES = [
  "ジュニアプログラマー",
  "プログラマー",
  "シニアプログラマー",
  "ジュニアSE",
  "システムエンジニア",
  "シニアSE",
  "プロジェクトリーダー",
  "プロジェクトマネージャー",
  "テックリード",
  "アーキテクト",
  "インフラエンジニア",
] as const;

export type RoleType = typeof ROLES[number];

// レベル定義
export const LEVEL_DEFINITIONS = [
  { level: 4, label: "レベル4", description: "自立して対応・指導が可能" },
  { level: 3, label: "レベル3", description: "概ね対応可能" },
  { level: 2, label: "レベル2", description: "一部経験あり・補助があれば対応可能" },
  { level: 1, label: "レベル1", description: "未経験だが学習中または挑戦したい" },
  { level: 0, label: "レベル0", description: "未経験・関心薄" },
] as const;

// ロールの役割説明
export const ROLE_DESCRIPTIONS: Record<string, { short: string; detail: string }> = {
  "ジュニアプログラマー": {
    short: "指示のもとで実装を確実に進める実行者",
    detail: "上位者の指示・レビューのもとで、実装・テスト・修正を担当。限定範囲のコード変更を安全に行い、基本的な開発フローに沿って成果物を出す責任があります。",
  },
  "プログラマー": {
    short: "機能を完成まで担当し、品質を担保する実装主担当",
    detail: "実装（フロント/バック）を主担当として完遂。FW活用、状態管理、SPA、性能最適化、レビュー/静的解析などで品質を担保する。",
  },
  "シニアプログラマー": {
    short: "技術的に難しい問題を解決し、チーム全体のコード品質を引き上げる牽引者",
    detail: "高難度領域の実装・性能改善をリードし、レビューでチームの品質基準を引き上げる。設計にも踏み込み、API設計や構成上の課題について具体的な助言も行う。",
  },
  "ジュニアSE": {
    short: "仕様を整理して設計に落とし込む橋渡し役",
    detail: "先輩の支援下で要件整理・詳細設計書作成などドキュメント化を担当。基本的な開発プロセス理解とコミュニケーションで仕様の取りこぼしを減らす。",
  },
  "システムエンジニア": {
    short: "要件を形にし、チームが迷わず開発できる状態を作る設計者",
    detail: "顧客の要求を要件として具体化し、基本設計（API/非機能/IF/DFD等）詳細設計を整備する。セキュリティやDB設計も含めた設計判断を自立して行える。",
  },
  "シニアSE": {
    short: "システム全体の設計をまとめ、品質・性能・運用まで見通す上流リーダー",
    detail: "大規模アーキ設計・分割方針・非機能（性能/セキュリティ/運用性）を統合し、プロセス改善やDevOps/品質保証の仕組み化まで推進する。",
  },
  "テックリード": {
    short: "チームの技術方針を決め、標準化と育成でチーム全体の開発力を高める人",
    detail: "技術選定・導入判断、アーキ指導、設計レビュー、API標準化、開発標準/CI/CD整備など「技術面の意思決定と育成」を担う。",
  },
  "アーキテクト": {
    short: "システム・インフラ全体の構造を設計し、長期運用に耐える土台を作る",
    detail: "全体アーキテクチャ（サーバ/NW/ストレージ/セキュリティ含む）を設計し、BCP/DR、スケーラビリティや標準アーキを定義する。",
  },
  "プロジェクトリーダー": {
    short: "現場の司令塔として、進捗・課題・調整を行いチームを前に進める人",
    detail: "スコープ内でのタスク配分・進捗/課題の一次管理、チーム内調整、顧客窓口補助など「現場推進の最前線」を担う。PMと役割を分担しながら、チームが止まらないように日々動かし続ける実行責任者。",
  },
  "プロジェクトマネージャー": {
    short: "品質・コスト・納期・リスクと関係者全体を統括し、プロジェクトの成果に対する責任者",
    detail: "WBS/進捗/課題/リスク、ステークホルダー管理、契約・要件変更調整、予算/工数、育成/評価まで含む統合マネジメントを担う。最終的な成果の責任を持つ。",
  },
  "インフラエンジニア": {
    short: "システムが動く土台（サーバー・ネットワーク・クラウド）を作り、安定して動かし続ける人",
    detail: "構築・設定／運用・監視／運用改善・最適化／設計／アーキ設計まで、インフラ領域のライフサイクルを担当（監視・障害・冗長化・性能最適化等）。",
  },
};
