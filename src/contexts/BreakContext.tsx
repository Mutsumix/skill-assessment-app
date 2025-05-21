import React, { createContext, useContext, useState, ReactNode } from "react";
import { BreakCard } from "../types";

interface BreakContextType {
  breakCards: BreakCard[];
  currentBreakIndex: number;
  showBreak: boolean;
  // メソッド
  setShowBreak: (show: boolean) => void;
  nextBreak: () => void;
  resetBreaks: () => void;
}

const BreakContext = createContext<BreakContextType | undefined>(undefined);

export const useBreakContext = () => {
  const context = useContext(BreakContext);
  if (context === undefined) {
    throw new Error("useBreakContext must be used within a BreakProvider");
  }
  return context;
};

interface BreakProviderProps {
  children: ReactNode;
}

export const BreakProvider: React.FC<BreakProviderProps> = ({ children }) => {
  // 分野ごとに休憩カードを動的生成
  const fieldBreaks: { [key: string]: { title: string; message: string; emoji: string } } = {
    "インフラエンジニア": {
      title: "お疲れ様です！",
      message: "インフラエンジニア分野が終了しました。少し休憩しましょう。",
      emoji: "🖥️🔌",
    },
    "開発エンジニア（プログラマー）": {
      title: "良い調子です！",
      message: "開発エンジニア（プログラマー）分野が終了しました。一息つきましょう。",
      emoji: "💻👨‍💻",
    },
    "開発エンジニア（SE）": {
      title: "もう少しです！",
      message: "開発エンジニア（SE）分野が終了しました。あと少しだけ頑張りましょう。",
      emoji: "📐📝",
    },
    "マネジメント": {
      title: "完了しました！",
      message: "全ての分野の回答が完了しました。結果を確認しましょう。",
      emoji: "🏆👑",
    },
  };

  // 現在の分野名を取得
  const [currentBreakIndex, setCurrentBreakIndex] = useState(0);
  const [showBreak, setShowBreak] = useState(false);
  const [breakCards, setBreakCards] = useState<BreakCard[]>([]);

  // 分野リストを初期化（SkillContextのskillsから分野を抽出するのが理想だが、ここでは固定順）
  const fieldOrder = [
    "インフラエンジニア",
    "開発エンジニア（プログラマー）",
    "開発エンジニア（SE）",
    "マネジメント",
  ];

  // 初回のみbreakCardsを生成
  React.useEffect(() => {
    const cards: BreakCard[] = fieldOrder.map((field, idx) => ({
      id: `break${idx + 1}`,
      title: fieldBreaks[field]?.title || "休憩",
      message: fieldBreaks[field]?.message || `${field}分野が終了しました。休憩しましょう。`,
      emoji: fieldBreaks[field]?.emoji || "☕️",
    }));
    setBreakCards(cards);
  }, []);

  // 次の休憩カードに進む
  const nextBreak = () => {
    if (currentBreakIndex < breakCards.length - 1) {
      setCurrentBreakIndex(currentBreakIndex + 1);
    }
  };

  // 休憩カードをリセットする
  const resetBreaks = () => {
    setCurrentBreakIndex(0);
    setShowBreak(false);
  };

  const value = {
    breakCards,
    currentBreakIndex,
    showBreak,
    setShowBreak,
    nextBreak,
    resetBreaks,
  };

  return <BreakContext.Provider value={value}>{children}</BreakContext.Provider>;
};
