# スキル習得状況可視化アプリ 設計書

## 1. アプリケーション概要

このアプリケーションは、社員のスキル習得状況を可視化するためのスマホアプリです。ユーザーはスワイプ操作で各スキル項目に対して回答し、結果をレーダーチャートと一覧で確認できます。履歴管理機能により継続的なスキル成長を追跡し、AsyncStorage によるデータ永続化でユーザー体験を向上させています。

## 2. 要件定義

### 2.1 機能要件

#### 基本機能

- CSV ファイルに記載された 133 のスキル項目を評価
- スワイプ操作で回答（右：スキルあり、左：スキルなし）
- 分野ごとに休憩カードを表示
- 結果を一覧表示とレーダーチャート（11 角形）で表示
- レーダーチャートは初級・中級・上級の 3 レベルを積み上げ表示
- レーダーチャートは水平方向にスクロール可能
- スキル習得状況一覧は垂直方向にスクロール可能
- デジタル庁のデザインガイドラインに準拠した UI

#### 履歴・進捗管理機能

- **AsyncStorage 永続化**: 評価結果と進捗データの自動保存
- **履歴管理**: 過去の評価結果を日付付きで保存・閲覧
- **成長追跡**: 前回結果との比較による成長メトリクス表示
- **途中再開**: 評価の中断・再開機能（進捗保存）
- **手動保存**: 意図的な保存操作（自動保存は無効化）
- **重複保存防止**: 同一結果の重複保存を防ぐシステム

#### ナビゲーション機能

- **ホーム画面**: アプリの起点となるメインエントリーポイント
- **画面遷移**: 直感的なナビゲーションフロー
- **保存確認**: 重要な操作時の確認ダイアログ
- **データ共有**: クリップボードコピーと画像共有機能

### 2.2 非機能要件

- 操作性：直感的なスワイプ操作で簡単に回答できること
- パフォーマンス：スムーズなアニメーションとレスポンシブな動作
- データ永続化：AsyncStorage による信頼性の高いデータ保存
- ユーザー体験：継続的な利用を促進する履歴管理と UI/UX
- デザイン：デジタル庁のデザインガイドラインに準拠
- アクセシビリティ：様々なユーザーが使いやすいインターフェース
- スクロール：大量のデータを効率的に表示・閲覧できること

## 3. アプリケーション構造

### 3.1 画面構成

1. **ホーム画面（HomeScreen）**

   - アプリのメインエントリーポイント
   - 新規評価開始・途中再開・履歴閲覧の選択肢
   - 現在の進捗状況表示

2. **説明画面（InstructionScreen）**

   - アプリの使い方説明
   - スワイプ操作の説明
   - 途中再開オプション（該当時）

3. **スキル評価画面（AssessmentScreen）**

   - スワイプでスキルの有無を回答
   - 分野ごとに休憩カードを表示
   - 進捗状況の表示
   - 手動保存・ホーム戻り機能

4. **結果画面（ResultScreen）**

   - スキル一覧表示（分野・項目・レベル別）
   - 11 角形レーダーチャート（3 レベル積み上げ表示）
   - 水平スクロール可能なレーダーチャート
   - 垂直スクロール可能なスキル一覧
   - 詳細情報・統計データの表示
   - 保存・共有機能（重複保存防止）

5. **履歴画面（HistoryScreen）**
   - 過去の評価結果一覧（日付付き）
   - 成長トレンドの可視化
   - 詳細結果の再閲覧機能
   - 統計データの比較表示

### 3.2 データ構造

```typescript
// スキルデータの型定義
interface Skill {
  id: number;
  分野: string;
  項目: string;
  レベル: "初級" | "中級" | "上級";
  スキル: string;
}

// ユーザー回答の型定義
interface UserAnswer {
  skillId: number;
  hasSkill: boolean;
}

// 集計結果の型定義
interface SkillSummary {
  category: string;
  item: string;
  beginnerCount: number;
  beginnerTotal: number;
  intermediateCount: number;
  intermediateTotal: number;
  advancedCount: number;
  advancedTotal: number;
}

// 休憩カードの型定義
interface BreakCard {
  id: string;
  title: string;
  message: string;
}

// 評価履歴の型定義
interface AssessmentHistory {
  id: string;
  date: Date;
  answers: UserAnswer[];
  summary: SkillSummary[];
  completedAt: Date;
  totalSkills: number;
  acquiredSkills: number;
}

// 進捗データの型定義
interface ProgressData {
  currentSkillIndex: number;
  answers: UserAnswer[];
  startedAt: Date;
  lastUpdated: Date;
}

// 成長メトリクスの型定義
interface GrowthMetrics {
  previousTotal: number;
  currentTotal: number;
  growth: number;
  growthPercentage: number;
  categoryGrowth: { [category: string]: number };
}
```

### 3.3 状態管理

React Context API を使用して、以下の状態を管理します：

- **スキルデータ（SkillContext）**

  - スキルリスト
  - ユーザーの回答
  - 現在表示中のスキル
  - 評価の進捗状況
  - 結果データ
  - **履歴データ**：過去の評価結果
  - **進捗データ**：途中保存された評価状態
  - **成長メトリクス**：前回比較データ

- **休憩状態（BreakContext）**

  - 休憩カードデータ
  - 現在の休憩カードインデックス
  - 休憩表示状態

- **ナビゲーション状態**
  - 現在の画面状態
  - 画面遷移履歴
  - 保存確認状態

## 4. コンポーネント設計

### 4.1 共通コンポーネント

- **Button**: 標準ボタンコンポーネント
- **Card**: カード表示コンポーネント
- **Typography**: テキスト表示コンポーネント
- **ProgressBar**: 進捗表示コンポーネント
- **Icon**: アイコン表示コンポーネント
- **ConfirmDialog**: 確認ダイアログコンポーネント

### 4.2 画面固有コンポーネント

- **SwipeCard**: スワイプ操作可能なカードコンポーネント
- **BreakCard**: 休憩表示用カードコンポーネント
- **RadarChart**: レーダーチャート表示コンポーネント（水平スクロール対応）
- **SkillList**: スキル一覧表示コンポーネント（垂直スクロール対応）
- **HistoryItem**: 履歴項目表示コンポーネント
- **GrowthMetrics**: 成長指標表示コンポーネント
- **StatisticsPanel**: 統計データ表示コンポーネント

## 5. データ永続化設計

### 5.1 AsyncStorage 構造

```typescript
// 保存されるデータキー
const STORAGE_KEYS = {
  ASSESSMENT_HISTORY: "assessmentHistory",
  PROGRESS_DATA: "progressData",
  USER_PREFERENCES: "userPreferences",
};

// storageManager.ts
class StorageManager {
  // 履歴データの保存・読み込み
  static async saveAssessmentHistory(
    history: AssessmentHistory[]
  ): Promise<void>;
  static async loadAssessmentHistory(): Promise<AssessmentHistory[]>;

  // 進捗データの保存・読み込み
  static async saveProgressData(progress: ProgressData): Promise<void>;
  static async loadProgressData(): Promise<ProgressData | null>;
  static async clearProgressData(): Promise<void>;

  // データ検証・エラーハンドリング
  static async validateData<T>(
    data: T,
    validator: (data: T) => boolean
  ): Promise<boolean>;
}
```

### 5.2 データ同期戦略

- **自動保存無効化**: 手動保存のみを許可
- **重複保存防止**: 同一結果の検出と防止
- **データ整合性**: 保存前の検証とエラーハンドリング
- **バックアップ機能**: データ共有によるバックアップ支援

## 6. デザイン仕様

デジタル庁のデザインガイドラインに基づき、以下の要素を適用します：

- カラーパレット
- タイポグラフィ
- コンポーネントスタイル
- アイコン
- スペーシング
- アクセシビリティ対応
- **新規追加**: 履歴・統計データの視覚化デザイン

## 7. 実装計画

### Phase 1: 基盤機能

1. プロジェクト初期設定
2. データ読み込み機能の実装
3. 共通コンポーネントの実装
4. 基本的な画面遷移の実装

### Phase 2: 評価機能

5. スワイプカード機能の実装
6. 休憩カード機能の実装
7. 結果集計ロジックの実装
8. レーダーチャートの実装
9. 結果一覧表示の実装

### Phase 3: 永続化・履歴機能（実装済み）

10. **AsyncStorage 統合**
11. **履歴管理システム**
12. **ホーム画面実装**
13. **進捗保存・再開機能**
14. **成長追跡機能**

### Phase 4: UI/UX 改善（実装済み）

15. **保存確認ダイアログ**
16. **ナビゲーション改善**
17. **統計データ表示**
18. **重複保存防止**

### Phase 5: 最適化・テスト

19. スクロール機能の実装と最適化
20. デザイン調整と UI 改善
21. テストとバグ修正
22. パフォーマンス最適化

## 8. 技術的考慮事項

- CSV ファイルの読み込みと解析
- スワイプジェスチャーの実装
- レーダーチャートの描画と水平スクロール
- スキル一覧の垂直スクロール
- ネストされたスクロールビューの適切な実装
- 状態管理の最適化
- アニメーションのパフォーマンス
- **AsyncStorage のデータ容量管理**
- **Date 型のシリアライゼーション対応**
- **バックグラウンド・フォアグラウンド切り替え時のデータ整合性**

## 9. 改善点と今後の展望

### 実装済み機能

- ✅ データ永続化（AsyncStorage の活用）
- ✅ 複数の評価履歴管理
- ✅ 結果の共有機能の拡張
- ✅ 時系列での成長トラッキング

### 今後の展望

- オフライン対応の強化
- 複数ユーザーのデータ管理
- チーム全体のスキルマップ表示
- クラウド同期機能
- AI による学習推奨機能
- 詳細な分析レポート機能

## 10. App Store 対応

本アプリは以下の機能追加により、iOS App Store「Guideline 4.2 - Minimum Functionality」要件を満たしています：

- **継続的利用価値**: 履歴管理による長期的なスキル追跡
- **データ永続化**: ユーザーデータの確実な保存
- **成長可視化**: 時系列での進歩確認機能
- **豊富な UI/UX**: 直感的な操作と包括的な情報表示
