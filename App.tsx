import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { SkillProvider, useSkillContext } from "./src/contexts/SkillContext";
import { AuthProvider } from "./src/contexts/AuthContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SplashScreen from "./src/screens/SplashScreen";
import HomeScreen from "./src/screens/HomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RoleSelectionScreen from "./src/screens/RoleSelectionScreen";
import PreCheckScreen from "./src/screens/PreCheckScreen";
import AssessmentScreen from "./src/screens/AssessmentScreen";
import ResultScreen from "./src/screens/ResultScreen";
import HistoryScreen from "./src/screens/HistoryScreen";
import theme from "./src/styles/theme";
import { AssessmentHistory } from "./src/types";
import { FirstLaunchManager } from "./src/utils/storageManager";

enum AppScreen {
  SPLASH,
  HOME,
  LOGIN,
  ROLE_SELECTION,
  PRE_CHECK,
  ASSESSMENT,
  RESULT,
  RESULT_DETAIL,
  HISTORY,
  HISTORY_DETAIL,
}

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.SPLASH);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedHistory, setSelectedHistory] = useState<AssessmentHistory | null>(null);
  const { resetAssessment, startRoleAssessment, selectedRole, roleSkills, userAnswers } = useSkillContext();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsLoading(false);
      } catch (error) {
        console.error("初期化エラー:", error);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // スプラッシュ完了
  const handleSplashComplete = async () => {
    const isFirstLaunch = await FirstLaunchManager.isFirstLaunch();
    if (isFirstLaunch) {
      await FirstLaunchManager.markLaunchComplete();
    }
    setCurrentScreen(AppScreen.HOME);
  };

  // ホーム → ログイン
  const handleLogin = () => {
    setCurrentScreen(AppScreen.LOGIN);
  };

  // ログイン成功 or 戻る → ホーム
  const handleLoginBack = () => {
    setCurrentScreen(AppScreen.HOME);
  };

  // ホーム → ロール選択
  const handleStartNew = async () => {
    await resetAssessment();
    setCurrentScreen(AppScreen.ROLE_SELECTION);
  };

  // ホーム → 進捗再開
  const handleResumeProgress = () => {
    setCurrentScreen(AppScreen.ASSESSMENT);
  };

  // ホーム → 履歴
  const handleViewHistory = () => {
    setCurrentScreen(AppScreen.HISTORY);
  };

  // ロール選択 → PreCheck
  const handleSelectRole = (role: string) => {
    startRoleAssessment(role);
    setCurrentScreen(AppScreen.PRE_CHECK);
  };

  // ロール選択 → ホーム
  const handleRoleSelectionBack = () => {
    setCurrentScreen(AppScreen.HOME);
  };

  // PreCheck → 評価開始
  const handlePreCheckStart = () => {
    setCurrentScreen(AppScreen.ASSESSMENT);
  };

  // PreCheck → ロール選択に戻る
  const handlePreCheckBack = () => {
    setCurrentScreen(AppScreen.ROLE_SELECTION);
  };

  // 評価完了 → 結果
  const handleAssessmentComplete = () => {
    setCurrentScreen(AppScreen.RESULT);
  };

  // → ホーム
  const handleBackToHome = () => {
    setCurrentScreen(AppScreen.HOME);
  };

  // 結果 → ロール選択
  const handleGoToRoleSelection = async () => {
    await resetAssessment();
    setCurrentScreen(AppScreen.ROLE_SELECTION);
  };

  // 結果 → 項目詳細（閲覧モード）
  const handleViewDetail = () => {
    setCurrentScreen(AppScreen.RESULT_DETAIL);
  };

  // 閲覧モード → 結果に戻る
  const handleResultDetailBack = () => {
    setCurrentScreen(AppScreen.RESULT);
  };

  // 履歴 → ホーム
  const handleHistoryBack = () => {
    setCurrentScreen(AppScreen.HOME);
  };

  // 履歴詳細表示
  const handleViewHistoryDetail = (history: AssessmentHistory) => {
    setSelectedHistory(history);
    // 履歴の結果表示用にロールのスキルを設定
    startRoleAssessment(history.role);
    setCurrentScreen(AppScreen.HISTORY_DETAIL);
  };

  // 履歴詳細 → 項目詳細（閲覧モード）
  const handleHistoryViewDetail = () => {
    setCurrentScreen(AppScreen.RESULT_DETAIL);
  };

  // 履歴詳細の「他のロールをチェックする」
  const handleHistoryGoToRoleSelection = async () => {
    setSelectedHistory(null);
    await resetAssessment();
    setCurrentScreen(AppScreen.ROLE_SELECTION);
  };

  // 履歴詳細から戻る
  const handleHistoryDetailBack = () => {
    setSelectedHistory(null);
    setCurrentScreen(AppScreen.HISTORY);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
      </View>
    );
  }

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
            onLogin={handleLogin}
          />
        );
      case AppScreen.LOGIN:
        return (
          <LoginScreen
            onBack={handleLoginBack}
            onLoginSuccess={handleLoginBack}
          />
        );
      case AppScreen.ROLE_SELECTION:
        return (
          <RoleSelectionScreen
            onSelectRole={handleSelectRole}
            onBack={handleRoleSelectionBack}
          />
        );
      case AppScreen.PRE_CHECK:
        return (
          <PreCheckScreen
            role={selectedRole || ""}
            onStart={handlePreCheckStart}
            onBack={handlePreCheckBack}
          />
        );
      case AppScreen.ASSESSMENT:
        return (
          <AssessmentScreen
            onComplete={handleAssessmentComplete}
            onBackToHome={handleBackToHome}
          />
        );
      case AppScreen.RESULT:
        return (
          <ResultScreen
            onGoToRoleSelection={handleGoToRoleSelection}
            onBackToHome={handleBackToHome}
            onViewDetail={handleViewDetail}
          />
        );
      case AppScreen.RESULT_DETAIL:
        return (
          <AssessmentScreen
            onComplete={() => {}}
            onBackToHome={selectedHistory ? handleHistoryDetailBack : handleResultDetailBack}
            isViewMode={true}
            viewModeAnswers={selectedHistory ? selectedHistory.userAnswers : userAnswers}
          />
        );
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
            onGoToRoleSelection={handleHistoryGoToRoleSelection}
            onBackToHome={handleHistoryDetailBack}
            onViewDetail={handleHistoryViewDetail}
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
      <AuthProvider>
        <SkillProvider>
          <AppContent />
        </SkillProvider>
      </AuthProvider>
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
