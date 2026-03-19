import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  Skill,
  UserAnswer,
  SkillResult,
  AssessmentHistory,
  SavedProgress,
} from "../types";
import { loadSkillsFromCSV, getSkillsByRole } from "../utils/csvParser";
import { AssessmentHistoryManager, ProgressManager } from "../utils/storageManager";
import { FirestoreAssessmentManager } from "../utils/firestoreManager";
import { useAuth } from "./AuthContext";
import { useFirestoreSync } from "../hooks/useFirestoreSync";

interface SkillContextType {
  skills: Skill[];
  currentSkillIndex: number;
  userAnswers: UserAnswer[];
  isLoading: boolean;
  error: string | null;
  progress: number;
  assessmentHistory: AssessmentHistory[];
  hasSavedProgress: boolean;
  hasUnsavedResult: boolean;
  isSavingResult: boolean;
  // ロール評価関連
  selectedRole: string | null;
  roleSkills: Skill[];
  initialLevel: number | null;
  // メソッド
  answerSkill: (skillId: number, level: number) => void;
  nextSkill: () => void;
  prevSkill: () => void;
  resetAssessment: () => Promise<void>;
  getPreviousAnswer: (skillId: number) => number | undefined;
  // 保存・履歴
  saveProgress: () => Promise<void>;
  loadSavedProgress: () => Promise<boolean>;
  clearSavedProgress: () => Promise<void>;
  saveAssessmentResult: () => Promise<void>;
  loadAssessmentHistory: () => Promise<void>;
  deleteAssessmentHistory: (historyId: string) => Promise<void>;
  clearAllHistory: () => Promise<void>;
  // ロール評価
  startRoleAssessment: (role: string) => void;
  setInitialLevel: (level: number) => void;
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
  const { user } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentHistory[]>([]);
  const [hasSavedProgress, setHasSavedProgress] = useState(false);
  const [hasUnsavedResult, setHasUnsavedResult] = useState(false);
  const [isSavingResult, setIsSavingResult] = useState(false);
  // ロール評価関連
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [roleSkills, setRoleSkills] = useState<Skill[]>([]);
  const [initialLevel, setInitialLevelState] = useState<number | null>(null);

  // CSVからスキルデータを読み込み
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);

        const loadedSkills = await loadSkillsFromCSV();
        if (loadedSkills.length === 0) {
          setError("スキルデータが読み込めませんでした");
          return;
        }

        setSkills(loadedSkills);

        // 保存された進捗の確認
        const hasSaved = await ProgressManager.hasSavedProgress();
        setHasSavedProgress(hasSaved);

        // 評価履歴の読み込み（旧フォーマットを除外、日付でソート）
        const history = await AssessmentHistoryManager.getAll();
        const sortedHistory = history
          .filter(h => !!h.role)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setAssessmentHistory(sortedHistory);

        setIsLoading(false);
      } catch (err) {
        setError("データの読み込み中にエラーが発生しました");
        setIsLoading(false);
        console.error(err);
      }
    };

    initializeApp();
  }, []);

  // 前回の回答を取得する（同じロールの最新履歴から）
  const getPreviousAnswer = (skillId: number): number | undefined => {
    if (assessmentHistory.length === 0 || !selectedRole) {
      return undefined;
    }

    // 同じロールの最新履歴を取得
    const roleHistory = assessmentHistory
      .filter(h => h.role === selectedRole)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (roleHistory.length === 0) return undefined;

    const latestHistory = roleHistory[0];
    const previousAnswer = latestHistory.userAnswers.find(
      (answer) => answer.skillId === skillId
    );

    return previousAnswer?.level;
  };

  // スキルに回答する
  const answerSkill = (skillId: number, level: number) => {
    const existingAnswerIndex = userAnswers.findIndex(
      (answer) => answer.skillId === skillId
    );

    if (existingAnswerIndex !== -1) {
      const updatedAnswers = [...userAnswers];
      updatedAnswers[existingAnswerIndex] = { skillId, level };
      setUserAnswers(updatedAnswers);
    } else {
      setUserAnswers([...userAnswers, { skillId, level }]);
    }
  };

  // 次のスキルに進む
  const nextSkill = () => {
    if (currentSkillIndex < roleSkills.length - 1) {
      const nextIndex = currentSkillIndex + 1;
      setCurrentSkillIndex(nextIndex);
      setProgress(Math.round(((nextIndex + 1) / roleSkills.length) * 100));
    } else if (currentSkillIndex === roleSkills.length - 1) {
      setProgress(100);
      setCurrentSkillIndex(currentSkillIndex + 1);
      setHasUnsavedResult(true);
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
    setSelectedRole(null);
    setRoleSkills([]);
    setInitialLevelState(null);
    setHasUnsavedResult(false);
    await clearSavedProgress();
  };

  // ロール評価を開始する
  const startRoleAssessment = (role: string) => {
    const filteredSkills = getSkillsByRole(skills, role);
    setSelectedRole(role);
    setRoleSkills(filteredSkills);
    setCurrentSkillIndex(0);
    setProgress(0);
    setUserAnswers([]);
    setHasUnsavedResult(false);
  };

  // initialLevelを設定する
  const setInitialLevel = (level: number) => {
    setInitialLevelState(level);
  };

  // 途中保存
  const saveProgress = async () => {
    try {
      const savedProgress: SavedProgress = {
        currentSkillIndex,
        userAnswers,
        progress,
        lastSavedDate: new Date(),
        selectedRole,
      };

      await ProgressManager.save(savedProgress);
      setHasSavedProgress(true);
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

        // ロール情報を復元
        if (savedProgress.selectedRole) {
          const filteredSkills = getSkillsByRole(skills, savedProgress.selectedRole);
          setSelectedRole(savedProgress.selectedRole);
          setRoleSkills(filteredSkills);
        }

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
    } catch (error) {
      console.error('進捗削除に失敗しました:', error);
    }
  };

  // 評価結果の保存
  const saveAssessmentResult = async () => {
    if (isSavingResult) return;
    if (!hasUnsavedResult) return;
    if (!selectedRole) return;

    try {
      setIsSavingResult(true);

      const assessmentResult: AssessmentHistory = {
        id: `assessment_${Date.now()}`,
        date: new Date(),
        role: selectedRole,
        results: roleSkills.map(skill => ({
          skillId: skill.id,
          スキル名: skill.スキル名,
          担当工程: skill.担当工程,
          level: userAnswers.find(a => a.skillId === skill.id)?.level ?? -1,
        })),
        userAnswers: [...userAnswers],
        totalSkills: roleSkills.length,
        completionRate: (userAnswers.filter(a => a.level >= 0).length / roleSkills.length) * 100,
      };

      await AssessmentHistoryManager.save(assessmentResult);

      // Firebase 保存（認証済みの場合のみ）
      if (user) {
        try {
          await FirestoreAssessmentManager.save(user.uid, assessmentResult);
        } catch (firebaseError) {
          console.warn('Firestore保存に失敗（ローカルには保存済み）:', firebaseError);
        }
      }

      // 履歴を更新（旧フォーマット除外）
      const updatedHistory = await AssessmentHistoryManager.getAll();
      const sortedHistory = updatedHistory
        .filter(h => !!h.role)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setAssessmentHistory(sortedHistory);

      await clearSavedProgress();
      setHasUnsavedResult(false);
    } catch (error) {
      console.error('評価結果保存に失敗しました:', error);
    } finally {
      setIsSavingResult(false);
    }
  };

  const loadAssessmentHistory = async () => {
    try {
      const history = await AssessmentHistoryManager.getAll();
      const sortedHistory = history
        .filter(h => !!h.role)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setAssessmentHistory(sortedHistory);
    } catch (error) {
      console.error('評価履歴読み込みに失敗しました:', error);
    }
  };

  const deleteAssessmentHistory = async (historyId: string) => {
    try {
      await AssessmentHistoryManager.delete(historyId);
      if (user) {
        try {
          await FirestoreAssessmentManager.delete(user.uid, historyId);
        } catch (e) {
          console.warn('Firestore削除に失敗:', e);
        }
      }
      const updatedHistory = await AssessmentHistoryManager.getAll();
      const sortedHistory = updatedHistory
        .filter(h => !!h.role)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setAssessmentHistory(sortedHistory);
    } catch (error) {
      console.error('履歴削除に失敗しました:', error);
      throw error;
    }
  };

  const clearAllHistory = async () => {
    try {
      await AssessmentHistoryManager.clearAll();
      if (user) {
        try {
          await FirestoreAssessmentManager.clearAll(user.uid);
        } catch (e) {
          console.warn('Firestore全削除に失敗:', e);
        }
      }
      setAssessmentHistory([]);
    } catch (error) {
      console.error('全履歴削除に失敗しました:', error);
      throw error;
    }
  };

  // ログイン時にローカル↔Firestoreを同期
  useFirestoreSync(user, loadAssessmentHistory);

  const value = {
    skills,
    currentSkillIndex,
    userAnswers,
    isLoading,
    error,
    progress,
    assessmentHistory,
    hasSavedProgress,
    hasUnsavedResult,
    isSavingResult,
    selectedRole,
    roleSkills,
    initialLevel,
    answerSkill,
    nextSkill,
    prevSkill,
    resetAssessment,
    getPreviousAnswer,
    saveProgress,
    loadSavedProgress,
    clearSavedProgress,
    saveAssessmentResult,
    loadAssessmentHistory,
    deleteAssessmentHistory,
    clearAllHistory,
    startRoleAssessment,
    setInitialLevel,
  };

  return <SkillContext.Provider value={value}>{children}</SkillContext.Provider>;
};
