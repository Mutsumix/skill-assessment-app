import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Skill, UserAnswer, SkillSummary, SkillCategory } from "../types";
import { loadSkillsFromCSV, extractCategories, groupSkillsByCategoryAndItem } from "../utils/csvParser";

interface SkillContextType {
  skills: Skill[];
  categories: SkillCategory[];
  currentSkillIndex: number;
  userAnswers: UserAnswer[];
  isLoading: boolean;
  error: string | null;
  summaries: SkillSummary[];
  progress: number;
  // メソッド
  answerSkill: (skillId: number, hasSkill: boolean) => void;
  nextSkill: () => void;
  prevSkill: () => void;
  resetAssessment: () => void;
  calculateSummaries: () => void;
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

  // CSVからスキルデータを読み込む
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setIsLoading(true);
        const loadedSkills = await loadSkillsFromCSV();

        if (loadedSkills.length === 0) {
          setError("スキルデータが読み込めませんでした");
          return;
        }

        console.log(`読み込まれたスキル数: ${loadedSkills.length}`);
        setSkills(loadedSkills);
        setCategories(extractCategories(loadedSkills));
        setIsLoading(false);
      } catch (err) {
        setError("データの読み込み中にエラーが発生しました");
        setIsLoading(false);
        console.error(err);
      }
    };

    fetchSkills();
  }, []);

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
    console.log(`現在のスキルインデックス: ${currentSkillIndex}, スキル総数: ${skills.length}`);

    if (currentSkillIndex < skills.length - 1) {
      const nextIndex = currentSkillIndex + 1;
      console.log(`次のスキルインデックス: ${nextIndex}`);

      // 次のスキルの情報をログに出力
      if (skills[nextIndex]) {
        console.log(`次のスキル: ${skills[nextIndex].スキル}, ID: ${skills[nextIndex].id}`);
      }

      setCurrentSkillIndex(nextIndex);
      // 進捗状況を更新（次のスキルに進んだ後に計算）
      const newProgress = Math.round(((nextIndex + 1) / skills.length) * 100);
      console.log(`新しい進捗率: ${newProgress}%`);
      setProgress(newProgress);
    } else if (currentSkillIndex === skills.length - 1) {
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
  const resetAssessment = () => {
    setUserAnswers([]);
    setCurrentSkillIndex(0);
    setProgress(0);
    setSummaries([]);
  };

  // 結果を集計する
  const calculateSummaries = () => {
    const grouped = groupSkillsByCategoryAndItem(skills);
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

    setSummaries(results);
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
    answerSkill,
    nextSkill,
    prevSkill,
    resetAssessment,
    calculateSummaries,
  };

  return <SkillContext.Provider value={value}>{children}</SkillContext.Provider>;
};
