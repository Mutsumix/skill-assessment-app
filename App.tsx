import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { SkillProvider } from "./src/contexts/SkillContext";
import { BreakProvider } from "./src/contexts/BreakContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SplashScreen from "./src/screens/SplashScreen";
import InstructionScreen from "./src/screens/InstructionScreen";
import AssessmentScreen from "./src/screens/AssessmentScreen";
import ResultScreen from "./src/screens/ResultScreen";
import theme from "./src/styles/theme";

// アプリの画面
enum AppScreen {
  SPLASH,
  INSTRUCTION,
  ASSESSMENT,
  RESULT,
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.SPLASH);
  const [isLoading, setIsLoading] = useState(true);

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
  const handleSplashComplete = () => {
    setCurrentScreen(AppScreen.INSTRUCTION);
  };

  // 説明画面の完了時
  const handleInstructionComplete = () => {
    setCurrentScreen(AppScreen.ASSESSMENT);
  };

  // 評価画面の完了時
  const handleAssessmentComplete = () => {
    setCurrentScreen(AppScreen.RESULT);
  };

  // 結果画面からの再開始
  const handleRestart = () => {
    // 評価をリセットして評価画面に戻る
    setCurrentScreen(AppScreen.ASSESSMENT);
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
      case AppScreen.INSTRUCTION:
        return <InstructionScreen onStart={handleInstructionComplete} />;
      case AppScreen.ASSESSMENT:
        return <AssessmentScreen onComplete={handleAssessmentComplete} />;
      case AppScreen.RESULT:
        return <ResultScreen onRestart={handleRestart} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaProvider>
      <SkillProvider>
        <BreakProvider>
          <View style={styles.container}>
            <StatusBar style="auto" />
            {renderScreen()}
          </View>
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
