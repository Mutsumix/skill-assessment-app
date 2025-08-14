import React, { useEffect } from "react";
import { View, StyleSheet, Image, ActivityIndicator } from "react-native";
import Constants from "expo-constants";
import Typography from "../components/Typography";
import theme from "../styles/theme";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    // 3秒後に完了コールバックを呼び出す
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  // app.jsonからバージョン情報を取得
  const appVersion = Constants.expoConfig?.version || "1.0.0";

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* アプリアイコン */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/icon.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Typography variant="h3" style={styles.title}>
          技術マップ
        </Typography>

        <Typography variant="body1" style={styles.subtitle}>
          あなたのスキルを評価・可視化
        </Typography>

        <ActivityIndicator
          size="large"
          color={theme.colors.primary.main}
          style={styles.loader}
        />
      </View>

      <Typography variant="caption" style={styles.version}>
        Version {appVersion}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.common.background,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  content: {
    alignItems: "center",
  },
  logoContainer: {
    width: 120,
    height: 120,
    marginBottom: theme.spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8, // Android用
  },
  title: {
    marginBottom: theme.spacing.md,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    color: theme.colors.gray[600],
    marginBottom: theme.spacing.xl,
  },
  loader: {
    marginTop: theme.spacing.lg,
  },
  version: {
    position: "absolute",
    bottom: theme.spacing.lg,
    color: theme.colors.gray[500],
  },
});

export default SplashScreen;
