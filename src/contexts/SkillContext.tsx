import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  Skill,
  UserAnswer,
  SkillSummary,
  SkillCategory,
  AssessmentHistory,
  SavedProgress,
  ProgressComparison
} from "../types";
import { loadSkillsFromCSV, extractCategories, groupSkillsByCategoryAndItem } from "../utils/csvParser";
import { AssessmentHistoryManager, ProgressManager } from "../utils/storageManager";

interface SkillContextType {
  skills: Skill[];
  categories: SkillCategory[];
  currentSkillIndex: number;
  userAnswers: UserAnswer[];
  isLoading: boolean;
  error: string | null;
  summaries: SkillSummary[];
  progress: number;
  // 新機能
  assessmentHistory: AssessmentHistory[];
  hasSavedProgress: boolean;
  progressComparisons: ProgressComparison[];
  hasUnsavedResult: boolean;
  isSavingResult: boolean; // 保存処理中フラグを追加
  // 部分評価機能
  isPartialAssessment: boolean;
  selectedDomain: string | null;
  filteredSkills: Skill[];
  // メソッド
  answerSkill: (skillId: number, hasSkill: boolean) => void;
  nextSkill: () => void;
  prevSkill: () => void;
  resetAssessment: () => Promise<void>;
  calculateSummaries: () => void;
  // 新メソッド
  saveProgress: () => Promise<void>;
  loadSavedProgress: () => Promise<boolean>;
  clearSavedProgress: () => Promise<void>;
  saveAssessmentResult: () => Promise<void>;
  loadAssessmentHistory: () => Promise<void>;
  compareWithPreviousAssessment: () => ProgressComparison[];
  deleteAssessmentHistory: (historyId: string) => Promise<void>;
  clearAllHistory: () => Promise<void>;
  // 部分評価メソッド
  startPartialAssessment: (domain: string) => void;
  startFullAssessment: () => void;
}

const SkillContext = createContext<SkillContextType | undefined>(undefined);

export const useSkillContext = () => {
  const context = useContext(SkillContext);
  if (context === undefined) {
    throw new Error("useSkillContext must be used within a SkillProvider");
  }
  return context;
};

interface SkillProviderProps {
  children: ReactNode;
}

export const SkillProvider: React.FC<SkillProviderProps> = ({ children }) => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summaries, setSummaries] = useState<SkillSummary[]>([]);
  const [progress, setProgress] = useState(0);
  // 新しい状態
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentHistory[]>([]);
  const [hasSavedProgress, setHasSavedProgress] = useState(false);
  const [progressComparisons, setProgressComparisons] = useState<ProgressComparison[]>([]);
  const [hasUnsavedResult, setHasUnsavedResult] = useState(false); // 未保存の結果があるか
  const [isSavingResult, setIsSavingResult] = useState(false); // 保存処理中フラグ
  // 部分評価関連の状態
  const [isPartialAssessment, setIsPartialAssessment] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([]);

  // CSVからスキルデータを読み込み、保存されたデータも復元
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);

        // スキルデータの読み込み
        const loadedSkills = await loadSkillsFromCSV();
        if (loadedSkills.length === 0) {
          setError("スキルデータが読み込めませんでした");
          return;
        }

        console.log(`読み込まれたスキル数: ${loadedSkills.length}`);
        setSkills(loadedSkills);
        setCategories(extractCategories(loadedSkills));
        setFilteredSkills(loadedSkills); // 初期状態では全スキルを設定

        // 保存された進捗の確認
        const hasSaved = await ProgressManager.hasSavedProgress();
        setHasSavedProgress(hasSaved);

        // 評価履歴の読み込み
        const history = await AssessmentHistoryManager.getAll();
        setAssessmentHistory(history);

        setIsLoading(false);
      } catch (err) {
        setError("データの読み込み中にエラーが発生しました");
        setIsLoading(false);
        console.error(err);
      }
    };

    initializeApp();
  }, []);

  // 自動保存は無効化し、手動保存のみとする
  // useEffect(() => {
  //   if (userAnswers.length > 0 && skills.length > 0) {
  //     const saveTimer = setTimeout(() => {
  //       saveProgress();
  //     }, 2000);
  //     return () => clearTimeout(saveTimer);
  //   }
  // }, [userAnswers, currentSkillIndex]);

  // スキルに回答する
  const answerSkill = (skillId: number, hasSkill: boolean) => {
    // 既存の回答を更新または新しい回答を追加
    const existingAnswerIndex = userAnswers.findIndex(
      (answer) => answer.skillId === skillId
    );

    if (existingAnswerIndex !== -1) {
      const updatedAnswers = [...userAnswers];
      updatedAnswers[existingAnswerIndex] = { skillId, hasSkill };
      setUserAnswers(updatedAnswers);
    } else {
      setUserAnswers([...userAnswers, { skillId, hasSkill }]);
    }
  };

  // 次のスキルに進む
  const nextSkill = () => {
    const currentSkills = isPartialAssessment ? filteredSkills : skills;
    console.log(`現在のスキルインデックス: ${currentSkillIndex}, スキル総数: ${currentSkills.length}`);

    if (currentSkillIndex < currentSkills.length - 1) {
      const nextIndex = currentSkillIndex + 1;
      console.log(`次のスキルインデックス: ${nextIndex}`);

      // 次のスキルの情報をログに出力
      if (currentSkills[nextIndex]) {
        console.log(`次のスキル: ${currentSkills[nextIndex].スキル}, ID: ${currentSkills[nextIndex].id}`);
      }

      setCurrentSkillIndex(nextIndex);
      // 進捗状況を更新（次のスキルに進んだ後に計算）
      const newProgress = Math.round(((nextIndex + 1) / currentSkills.length) * 100);
      console.log(`新しい進捗率: ${newProgress}%`);
      setProgress(newProgress);
    } else if (currentSkillIndex === currentSkills.length - 1) {
      // 最後のスキルの場合は100%にする
      console.log("最後のスキルに到達しました");
      setProgress(100);
      setCurrentSkillIndex(currentSkillIndex + 1);
    }
  };

  // 前のスキルに戻る
  const prevSkill = () => {
    if (currentSkillIndex > 0) {
      setCurrentSkillIndex(currentSkillIndex - 1);
    }
  };

  // 評価をリセットする
  const resetAssessment = async () => {
    setUserAnswers([]);
    setCurrentSkillIndex(0);
    setProgress(0);
    setSummaries([]);
    setIsPartialAssessment(false);
    setSelectedDomain(null);
    setFilteredSkills(skills);

    // 保存された進捗もクリア
    await clearSavedProgress();
  };

  // 結果を集計する（同期版）- 結果を直接返す
  const calculateSummariesSync = (): SkillSummary[] => {
    const currentSkills = isPartialAssessment ? filteredSkills : skills;
    const grouped = groupSkillsByCategoryAndItem(currentSkills);
    const results: SkillSummary[] = [];

    // 各カテゴリーと項目ごとに集計
    grouped.forEach((itemMap, category) => {
      itemMap.forEach((skillsInItem, item) => {
        // 初級、中級、上級ごとにスキル数と回答数を集計
        const beginnerSkills = skillsInItem.filter((s) => s.レベル === "初級");
        const intermediateSkills = skillsInItem.filter((s) => s.レベル === "中級");
        const advancedSkills = skillsInItem.filter((s) => s.レベル === "上級");

        const beginnerCount = beginnerSkills.filter((s) =>
          userAnswers.some((a) => a.skillId === s.id && a.hasSkill)
        ).length;

        const intermediateCount = intermediateSkills.filter((s) =>
          userAnswers.some((a) => a.skillId === s.id && a.hasSkill)
        ).length;

        const advancedCount = advancedSkills.filter((s) =>
          userAnswers.some((a) => a.skillId === s.id && a.hasSkill)
        ).length;

        results.push({
          category,
          item,
          beginnerCount,
          beginnerTotal: beginnerSkills.length,
          intermediateCount,
          intermediateTotal: intermediateSkills.length,
          advancedCount,
          advancedTotal: advancedSkills.length,
        });
      });
    });

    return results;
  };

  // 結果を集計する（非同期版）- 状態を更新
  const calculateSummaries = () => {
    const results = calculateSummariesSync();
    setSummaries(results);
    setHasUnsavedResult(true); // 結果が生成されたら未保存状態にする
  };

  // 途中保存機能の実装
  const saveProgress = async () => {
    try {
      const savedProgress: SavedProgress = {
        currentSkillIndex,
        userAnswers,
        progress,
        lastSavedDate: new Date()
      };

      await ProgressManager.save(savedProgress);
      setHasSavedProgress(true);
      console.log('進捗が保存されました');
    } catch (error) {
      console.error('進捗保存に失敗しました:', error);
    }
  };

  const loadSavedProgress = async (): Promise<boolean> => {
    try {
      const savedProgress = await ProgressManager.load();
      if (savedProgress) {
        setCurrentSkillIndex(savedProgress.currentSkillIndex);
        setUserAnswers(savedProgress.userAnswers);
        setProgress(savedProgress.progress);
        setHasSavedProgress(true);
        console.log('進捗が復元されました');
        return true;
      }
      return false;
    } catch (error) {
      console.error('進捗読み込みに失敗しました:', error);
      return false;
    }
  };

  const clearSavedProgress = async () => {
    try {
      await ProgressManager.clear();
      setHasSavedProgress(false);
      console.log('保存された進捗が削除されました');
    } catch (error) {
      console.error('進捗削除に失敗しました:', error);
    }
  };

  // 評価結果の履歴保存機能（重複保存防止）
  const saveAssessmentResult = async () => {
    // 部分評価の場合は履歴に保存しない
    if (isPartialAssessment) {
      console.log('部分評価のため履歴に保存しません');
      setHasUnsavedResult(false);
      return;
    }

    // 既に保存処理中の場合は何もしない
    if (isSavingResult) {
      console.log('保存処理が既に実行中のため、スキップします');
      return;
    }

    // 保存するデータがない場合もスキップ
    if (!hasUnsavedResult) {
      console.log('保存する新しい結果がないため、スキップします');
      return;
    }

    try {
      setIsSavingResult(true); // 保存開始

      // 結果を確実に取得（同期版を使用）
      const currentSummaries = summaries.length === 0 ? calculateSummariesSync() : summaries;

      // スキル数の集計
      const totalSkills = skills.length;
      const beginnerAcquired = userAnswers.filter(a =>
        a.hasSkill && skills.find(s => s.id === a.skillId)?.レベル === '初級'
      ).length;
      const intermediateAcquired = userAnswers.filter(a =>
        a.hasSkill && skills.find(s => s.id === a.skillId)?.レベル === '中級'
      ).length;
      const advancedAcquired = userAnswers.filter(a =>
        a.hasSkill && skills.find(s => s.id === a.skillId)?.レベル === '上級'
      ).length;

      const beginnerTotal = skills.filter(s => s.レベル === '初級').length;
      const intermediateTotal = skills.filter(s => s.レベル === '中級').length;
      const advancedTotal = skills.filter(s => s.レベル === '上級').length;

      const assessmentResult: AssessmentHistory = {
        id: `assessment_${Date.now()}`,
        date: new Date(),
        results: currentSummaries,
        userAnswers: [...userAnswers],
        totalSkills,
        completionRate: (userAnswers.length / totalSkills) * 100,
        skillCounts: {
          beginnerTotal,
          intermediateTotal,
          advancedTotal,
          beginnerAcquired,
          intermediateAcquired,
          advancedAcquired
        }
      };

      await AssessmentHistoryManager.save(assessmentResult);

      // summariesが空だった場合は状態も更新
      if (summaries.length === 0) {
        setSummaries(currentSummaries);
      }

      // 評価履歴を更新
      const updatedHistory = await AssessmentHistoryManager.getAll();
      setAssessmentHistory(updatedHistory);

      // 保存された進捗をクリア（評価完了のため）
      await clearSavedProgress();

      // 保存完了フラグを更新
      setHasUnsavedResult(false);

      console.log('評価結果が保存されました');
    } catch (error) {
      console.error('評価結果保存に失敗しました:', error);
    } finally {
      setIsSavingResult(false); // 保存完了
    }
  };

  const loadAssessmentHistory = async () => {
    try {
      const history = await AssessmentHistoryManager.getAll();
      setAssessmentHistory(history);

      // 前回との比較データも更新
      const comparisons = compareWithPreviousAssessment();
      setProgressComparisons(comparisons);

      console.log(`評価履歴${history.length}件を読み込みました`);
    } catch (error) {
      console.error('評価履歴読み込みに失敗しました:', error);
    }
  };

  const compareWithPreviousAssessment = (): ProgressComparison[] => {
    if (assessmentHistory.length < 2) return [];

    const latest = assessmentHistory[assessmentHistory.length - 1];
    const previous = assessmentHistory[assessmentHistory.length - 2];

    const comparisons: ProgressComparison[] = [];

    latest.results.forEach(latestResult => {
      const previousResult = previous.results.find(
        p => p.category === latestResult.category && p.item === latestResult.item
      );

      if (previousResult) {
        const latestTotal = latestResult.beginnerCount + latestResult.intermediateCount + latestResult.advancedCount;
        const previousTotal = previousResult.beginnerCount + previousResult.intermediateCount + previousResult.advancedCount;
        const improvement = latestTotal - previousTotal;

        comparisons.push({
          category: latestResult.category,
          item: latestResult.item,
          previousTotal,
          currentTotal: latestTotal,
          improvement,
          isImproved: improvement > 0
        });
      }
    });

    return comparisons;
  };

  // 特定の履歴を削除
  const deleteAssessmentHistory = async (historyId: string) => {
    try {
      await AssessmentHistoryManager.delete(historyId);
      const updatedHistory = await AssessmentHistoryManager.getAll();
      setAssessmentHistory(updatedHistory);
      console.log(`履歴${historyId}が削除されました`);
    } catch (error) {
      console.error('履歴削除に失敗しました:', error);
      throw error;
    }
  };

  // 全履歴を削除
  const clearAllHistory = async () => {
    try {
      await AssessmentHistoryManager.clearAll();
      setAssessmentHistory([]);
      setProgressComparisons([]);
      console.log('全履歴が削除されました');
    } catch (error) {
      console.error('全履歴削除に失敗しました:', error);
      throw error;
    }
  };

  // 部分評価を開始する
  const startPartialAssessment = (domain: string) => {
    const domainSkills = skills.filter(skill => skill.分野 === domain);
    setFilteredSkills(domainSkills);
    setIsPartialAssessment(true);
    setSelectedDomain(domain);
    setCurrentSkillIndex(0);
    setProgress(0);
    setUserAnswers([]);
    setSummaries([]);
    setHasUnsavedResult(false);
    console.log(`部分評価開始: ${domain}, スキル数: ${domainSkills.length}`);
  };

  // 全評価を開始する
  const startFullAssessment = () => {
    setFilteredSkills(skills);
    setIsPartialAssessment(false);
    setSelectedDomain(null);
    setCurrentSkillIndex(0);
    setProgress(0);
    setUserAnswers([]);
    setSummaries([]);
    setHasUnsavedResult(false);
    console.log(`全評価開始: スキル数: ${skills.length}`);
  };

  const value = {
    skills,
    categories,
    currentSkillIndex,
    userAnswers,
    isLoading,
    error,
    summaries,
    progress,
    assessmentHistory,
    hasSavedProgress,
    progressComparisons,
    hasUnsavedResult,
    isSavingResult,
    isPartialAssessment,
    selectedDomain,
    filteredSkills,
    answerSkill,
    nextSkill,
    prevSkill,
    resetAssessment,
    calculateSummaries,
    saveProgress,
    loadSavedProgress,
    clearSavedProgress,
    saveAssessmentResult,
    loadAssessmentHistory,
    compareWithPreviousAssessment,
    deleteAssessmentHistory,
    clearAllHistory,
    startPartialAssessment,
    startFullAssessment,
  };

  return <SkillContext.Provider value={value}>{children}</SkillContext.Provider>;
};
