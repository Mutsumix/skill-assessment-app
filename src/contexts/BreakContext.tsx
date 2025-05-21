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
  // 休憩カードのデータ
  const breakCards: BreakCard[] = [
    {
      id: "break1",
      title: "お疲れ様です！",
      message: "インフラエンジニアの分野が終了しました。少し休憩しましょう。",
    },
    {
      id: "break2",
      title: "良い調子です！",
      message: "開発エンジニア（プログラマー）の分野が終了しました。一息つきましょう。",
    },
    {
      id: "break3",
      title: "もう少しです！",
      message: "開発エンジニア（SE）の分野が終了しました。あと少しだけ頑張りましょう。",
    },
    {
      id: "break4",
      title: "完了しました！",
      message: "全ての回答が完了しました。結果を確認しましょう。",
    },
  ];

  const [currentBreakIndex, setCurrentBreakIndex] = useState(0);
  const [showBreak, setShowBreak] = useState(false);

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
