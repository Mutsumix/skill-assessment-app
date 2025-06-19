import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  AssessmentHistory,
  UserProfile,
  SavedProgress,
  UserAnswer,
  SkillSummary,
} from "../types";

// ストレージキー
const STORAGE_KEYS = {
  USER_PROFILE: "@user_profile",
  SAVED_PROGRESS: "@saved_progress",
  ASSESSMENT_HISTORY: "@assessment_history",
  FIRST_LAUNCH: "@first_launch",
} as const;

// ユーザープロフィールの管理
export const UserProfileManager = {
  async save(profile: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_PROFILE,
        JSON.stringify(profile)
      );
    } catch (error) {
      console.error("ユーザープロフィールの保存に失敗しました:", error);
      throw error;
    }
  },

  async load(): Promise<UserProfile | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (!data) return null;

      const profile = JSON.parse(data);
      // Date オブジェクトの復元
      profile.assessmentHistory = profile.assessmentHistory.map(
        (history: any) => ({
          ...history,
          date: new Date(history.date),
        })
      );

      return profile;
    } catch (error) {
      console.error("ユーザープロフィールの読み込みに失敗しました:", error);
      return null;
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    } catch (error) {
      console.error("ユーザープロフィールの削除に失敗しました:", error);
      throw error;
    }
  },
};

// 評価履歴の管理
export const AssessmentHistoryManager = {
  async save(history: AssessmentHistory): Promise<void> {
    try {
      const profile = await UserProfileManager.load();
      if (profile) {
        // 既存の履歴に追加
        profile.assessmentHistory.push(history);
        await UserProfileManager.save(profile);
      } else {
        // 新しいプロフィールを作成
        const newProfile: UserProfile = {
          id: Date.now().toString(),
          assessmentHistory: [history],
        };
        await UserProfileManager.save(newProfile);
      }
    } catch (error) {
      console.error("評価履歴の保存に失敗しました:", error);
      throw error;
    }
  },

  async getAll(): Promise<AssessmentHistory[]> {
    try {
      const profile = await UserProfileManager.load();
      return profile?.assessmentHistory || [];
    } catch (error) {
      console.error("評価履歴の取得に失敗しました:", error);
      return [];
    }
  },

  async getLatest(): Promise<AssessmentHistory | null> {
    try {
      const histories = await this.getAll();
      if (histories.length === 0) return null;

      // 日付でソートして最新を取得
      return histories.sort((a, b) => b.date.getTime() - a.date.getTime())[0];
    } catch (error) {
      console.error("最新の評価履歴の取得に失敗しました:", error);
      return null;
    }
  },

  async delete(historyId: string): Promise<void> {
    try {
      const profile = await UserProfileManager.load();
      if (profile) {
        profile.assessmentHistory = profile.assessmentHistory.filter(
          (h) => h.id !== historyId
        );
        await UserProfileManager.save(profile);
      }
    } catch (error) {
      console.error("評価履歴の削除に失敗しました:", error);
      throw error;
    }
  },

  async clearAll(): Promise<void> {
    try {
      const profile = await UserProfileManager.load();
      if (profile) {
        profile.assessmentHistory = [];
        await UserProfileManager.save(profile);
      }
    } catch (error) {
      console.error("全評価履歴の削除に失敗しました:", error);
      throw error;
    }
  },
};

// 進捗の途中保存管理
export const ProgressManager = {
  async save(progress: SavedProgress): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.SAVED_PROGRESS,
        JSON.stringify(progress)
      );
    } catch (error) {
      console.error("進捗の保存に失敗しました:", error);
      throw error;
    }
  },

  async load(): Promise<SavedProgress | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SAVED_PROGRESS);
      if (!data) return null;

      const progress = JSON.parse(data);
      // Date オブジェクトの復元
      progress.lastSavedDate = new Date(progress.lastSavedDate);

      return progress;
    } catch (error) {
      console.error("進捗の読み込みに失敗しました:", error);
      return null;
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.SAVED_PROGRESS);
    } catch (error) {
      console.error("進捗の削除に失敗しました:", error);
      throw error;
    }
  },

  async hasSavedProgress(): Promise<boolean> {
    try {
      const progress = await this.load();
      return progress !== null;
    } catch (error) {
      return false;
    }
  },
};

// 初回起動管理
export const FirstLaunchManager = {
  async isFirstLaunch(): Promise<boolean> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.FIRST_LAUNCH);
      return data === null; // データがなければ初回起動
    } catch (error) {
      console.error("初回起動フラグの確認に失敗しました:", error);
      return true; // エラーの場合は安全のため初回として扱う
    }
  },

  async markLaunchComplete(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.FIRST_LAUNCH, "completed");
    } catch (error) {
      console.error("初回起動フラグの設定に失敗しました:", error);
      throw error;
    }
  },

  async reset(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.FIRST_LAUNCH);
    } catch (error) {
      console.error("初回起動フラグのリセットに失敗しました:", error);
      throw error;
    }
  },
};

// ユーティリティ関数
export const StorageUtils = {
  // 評価履歴から統計情報を計算
  calculateProgressStats(histories: AssessmentHistory[]) {
    if (histories.length === 0) return null;

    const latest = histories[histories.length - 1];
    const previous =
      histories.length > 1 ? histories[histories.length - 2] : null;

    return {
      totalAssessments: histories.length,
      latestCompletionRate: latest.completionRate,
      latestSkillCounts: latest.skillCounts,
      improvementSinceLastAssessment: previous
        ? {
            beginnerImprovement:
              latest.skillCounts.beginnerAcquired -
              previous.skillCounts.beginnerAcquired,
            intermediateImprovement:
              latest.skillCounts.intermediateAcquired -
              previous.skillCounts.intermediateAcquired,
            advancedImprovement:
              latest.skillCounts.advancedAcquired -
              previous.skillCounts.advancedAcquired,
          }
        : null,
    };
  },

  // 履歴をエクスポート用JSONに変換
  exportHistoryAsJSON(histories: AssessmentHistory[]): string {
    return JSON.stringify(histories, null, 2);
  },

  // 全てのストレージをクリア（デバッグ用）
  async clearAllStorage(): Promise<void> {
    try {
      await Promise.all([
        UserProfileManager.clear(),
        ProgressManager.clear(),
        FirstLaunchManager.reset(),
      ]);
    } catch (error) {
      console.error("全ストレージのクリアに失敗しました:", error);
      throw error;
    }
  },
};
