import React, { useEffect } from "react";
import { View, StyleSheet, Image, ActivityIndicator } from "react-native";
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

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* ロゴ画像（実際の画像がない場合はプレースホルダー） */}
        <View style={styles.logoPlaceholder}>
          <Typography variant="h2" color={theme.colors.common.white}>
            SA
          </Typography>
        </View>

        <Typography variant="h3" style={styles.title}>
          スキル習得状況可視化アプリ
        </Typography>

        <Typography variant="body1" style={styles.subtitle}>
          あなたのスキルを評価して、成長を可視化しましょう
        </Typography>

        <ActivityIndicator
          size="large"
          color={theme.colors.primary.main}
          style={styles.loader}
        />
      </View>

      <Typography variant="caption" style={styles.version}>
        Version 1.0.0
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
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.primary.main,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.xl,
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
