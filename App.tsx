import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { SkillProvider, useSkillContext } from "./src/contexts/SkillContext";
import { BreakProvider } from "./src/contexts/BreakContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SplashScreen from "./src/screens/SplashScreen";
import HomeScreen from "./src/screens/HomeScreen";
import InstructionScreen from "./src/screens/InstructionScreen";
import AssessmentScreen from "./src/screens/AssessmentScreen";
import ResultScreen from "./src/screens/ResultScreen";
import HistoryScreen from "./src/screens/HistoryScreen";
import AssessmentModeSelectionScreen from "./src/screens/AssessmentModeSelectionScreen";
import DomainSelectionScreen from "./src/screens/DomainSelectionScreen";
import theme from "./src/styles/theme";
import { AssessmentHistory } from "./src/types";
import { FirstLaunchManager } from "./src/utils/storageManager";

// アプリの画面
enum AppScreen {
  SPLASH,
  HOME,
  MODE_SELECTION,
  DOMAIN_SELECTION,
  INSTRUCTION,
  ASSESSMENT,
  RESULT,
  HISTORY,
  HISTORY_DETAIL,
}

// 内部コンポーネントを分離してSkillContextを使用可能にする
function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.SPLASH);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedHistory, setSelectedHistory] = useState<AssessmentHistory | null>(null);
  const { resetAssessment, startFullAssessment, startPartialAssessment } = useSkillContext();

  // アプリの初期化
  useEffect(() => {
    // 実際のアプリでは、ここでデータの読み込みなどの初期化処理を行う
    const initializeApp = async () => {
      try {
        // 初期化処理（例：データの読み込み）
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsLoading(false);
      } catch (error) {
        console.error("初期化エラー:", error);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // スプラッシュ画面の完了時
  const handleSplashComplete = async () => {
    // 初回起動かどうかをチェック
    const isFirstLaunch = await FirstLaunchManager.isFirstLaunch();

    if (isFirstLaunch) {
      setCurrentScreen(AppScreen.INSTRUCTION);
    } else {
      setCurrentScreen(AppScreen.HOME);
    }
  };

  // ホーム画面から新規評価開始
  const handleStartNew = async () => {
    await resetAssessment(); // 既存のデータをクリア
    setCurrentScreen(AppScreen.MODE_SELECTION);
  };

  // ホーム画面から進捗再開
  const handleResumeProgress = () => {
    setCurrentScreen(AppScreen.ASSESSMENT);
  };

  // ホーム画面から履歴表示
  const handleViewHistory = () => {
    setCurrentScreen(AppScreen.HISTORY);
  };

  // モード選択画面のハンドラー
  const handleSelectFullAssessment = () => {
    startFullAssessment();
    setCurrentScreen(AppScreen.INSTRUCTION);
  };

  const handleSelectDomainAssessment = () => {
    setCurrentScreen(AppScreen.DOMAIN_SELECTION);
  };

  const handleModeSelectionBack = () => {
    setCurrentScreen(AppScreen.HOME);
  };

  // 分野選択画面のハンドラー
  const handleSelectDomain = (domain: string) => {
    startPartialAssessment(domain);
    // 分野別チェック時はインストラクション画面をスキップ
    setCurrentScreen(AppScreen.ASSESSMENT);
  };

  const handleDomainSelectionBack = () => {
    setCurrentScreen(AppScreen.MODE_SELECTION);
  };

  // 説明画面の完了時
  const handleInstructionComplete = async () => {
    // 初回起動完了をマーク
    await FirstLaunchManager.markLaunchComplete();
    setCurrentScreen(AppScreen.ASSESSMENT);
  };

  // 評価画面の完了時
  const handleAssessmentComplete = () => {
    setCurrentScreen(AppScreen.RESULT);
  };

  // 評価画面からホームに戻る
  const handleBackToHome = () => {
    setCurrentScreen(AppScreen.HOME);
  };

  // 結果画面からホームに戻る
  const handleResultToHome = () => {
    setCurrentScreen(AppScreen.HOME);
  };

  // 履歴画面から戻る
  const handleHistoryBack = () => {
    setCurrentScreen(AppScreen.HOME);
  };

  // 履歴詳細表示
  const handleViewHistoryDetail = (history: AssessmentHistory) => {
    setSelectedHistory(history);
    setCurrentScreen(AppScreen.HISTORY_DETAIL);
  };

  // 履歴詳細から戻る
  const handleHistoryDetailBack = () => {
    setSelectedHistory(null);
    setCurrentScreen(AppScreen.HISTORY);
  };

  // 読み込み中の表示
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
      </View>
    );
  }

  // 現在の画面を表示
  const renderScreen = () => {
    switch (currentScreen) {
      case AppScreen.SPLASH:
        return <SplashScreen onComplete={handleSplashComplete} />;
      case AppScreen.HOME:
        return (
          <HomeScreen
            onStartNew={handleStartNew}
            onResumeProgress={handleResumeProgress}
            onViewHistory={handleViewHistory}
          />
        );
      case AppScreen.MODE_SELECTION:
        return (
          <AssessmentModeSelectionScreen
            onSelectFullAssessment={handleSelectFullAssessment}
            onSelectDomainAssessment={handleSelectDomainAssessment}
            onBack={handleModeSelectionBack}
          />
        );
      case AppScreen.DOMAIN_SELECTION:
        return (
          <DomainSelectionScreen
            onSelectDomain={handleSelectDomain}
            onBack={handleDomainSelectionBack}
          />
        );
      case AppScreen.INSTRUCTION:
        return <InstructionScreen onStart={handleInstructionComplete} />;
      case AppScreen.ASSESSMENT:
        return (
          <AssessmentScreen
            onComplete={handleAssessmentComplete}
            onBackToHome={handleBackToHome}
          />
        );
      case AppScreen.RESULT:
        return <ResultScreen onRestart={handleResultToHome} />;
      case AppScreen.HISTORY:
        return (
          <HistoryScreen
            onBack={handleHistoryBack}
            onViewResult={handleViewHistoryDetail}
          />
        );
      case AppScreen.HISTORY_DETAIL:
        return (
          <ResultScreen
            onRestart={handleHistoryDetailBack}
            historyData={selectedHistory}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {renderScreen()}
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SkillProvider>
        <BreakProvider>
          <AppContent />
        </BreakProvider>
      </SkillProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.common.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.common.background,
  },
});
