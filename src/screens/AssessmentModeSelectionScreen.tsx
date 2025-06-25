import React from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Typography from "../components/Typography";
import Button from "../components/Button";
import Card from "../components/Card";
import theme from "../styles/theme";

interface AssessmentModeSelectionScreenProps {
  onSelectFullAssessment: () => void;
  onSelectDomainAssessment: () => void;
  onBack: () => void;
}

const AssessmentModeSelectionScreen: React.FC<AssessmentModeSelectionScreenProps> = ({
  onSelectFullAssessment,
  onSelectDomainAssessment,
  onBack
}) => {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top + theme.spacing.md }]}>
        {/* ヘッダー */}
        <View style={styles.header}>
          <Typography variant="h3" align="center" style={styles.title}>
            評価モードを選択
          </Typography>
          <Typography variant="body1" align="center" style={styles.subtitle}>
            評価方法を選んでください
          </Typography>
        </View>

        {/* メインコンテンツ */}
        <View style={styles.optionsContainer}>
          {/* 全スキルチェック */}
          <Card variant="elevated" style={styles.optionCard}>
            <Typography variant="h5" style={styles.optionTitle}>
              🎯 全スキルチェック
            </Typography>
            <Typography variant="body2" style={styles.optionDescription}>
              全128項目のスキル評価を行います
            </Typography>
            <Typography variant="caption" style={styles.optionTime}>
              所要時間: 約15-20分
            </Typography>
            <Typography variant="caption" style={styles.historyNote}>
              ✅ 結果は履歴に保存されます
            </Typography>
            <Button
              title="全スキルで開始"
              onPress={onSelectFullAssessment}
              variant="primary"
              style={styles.optionButton}
            />
          </Card>

          {/* 分野ごとのチェック */}
          <Card variant="elevated" style={styles.optionCard}>
            <Typography variant="h5" style={styles.optionTitle}>
              📋 分野ごとのチェック
            </Typography>
            <Typography variant="body2" style={styles.optionDescription}>
              特定の分野のみを評価します
            </Typography>
            <View style={styles.domainList}>
              <Typography variant="caption" style={styles.domainItem}>
                • インフラエンジニア
              </Typography>
              <Typography variant="caption" style={styles.domainItem}>
                • プログラマー
              </Typography>
              <Typography variant="caption" style={styles.domainItem}>
                • システムエンジニア
              </Typography>
              <Typography variant="caption" style={styles.domainItem}>
                • マネジメント
              </Typography>
            </View>
            <Typography variant="caption" style={styles.historyWarning}>
              ⚠️ 結果は履歴に保存されません
            </Typography>
            <Button
              title="分野を選択"
              onPress={onSelectDomainAssessment}
              variant="secondary"
              style={styles.optionButton}
            />
          </Card>
        </View>

        {/* 戻るボタン */}
        <View style={styles.backButtonContainer}>
          <Button
            title="戻る"
            onPress={onBack}
            variant="outline"
            style={styles.backButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.common.background,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.xl,
    alignItems: "center",
  },
  title: {
    marginBottom: theme.spacing.sm,
    color: theme.colors.primary.main,
  },
  subtitle: {
    color: theme.colors.gray[600],
    textAlign: "center",
  },
  optionsContainer: {
    flex: 1,
    gap: theme.spacing.lg,
  },
  optionCard: {
    padding: theme.spacing.lg,
    alignItems: "center",
  },
  optionTitle: {
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },
  optionDescription: {
    marginBottom: theme.spacing.sm,
    color: theme.colors.gray[700],
    textAlign: "center",
  },
  optionTime: {
    marginBottom: theme.spacing.xs,
    color: theme.colors.gray[600],
    textAlign: "center",
  },
  historyNote: {
    marginBottom: theme.spacing.md,
    color: theme.colors.success.main,
    textAlign: "center",
    fontWeight: "500",
  },
  historyWarning: {
    marginBottom: theme.spacing.md,
    color: theme.colors.warning.main,
    textAlign: "center",
    fontWeight: "500",
  },
  domainList: {
    marginBottom: theme.spacing.sm,
    alignItems: "flex-start",
  },
  domainItem: {
    color: theme.colors.gray[600],
    marginBottom: theme.spacing.xs,
  },
  optionButton: {
    minWidth: 140,
  },
  backButtonContainer: {
    marginTop: theme.spacing.lg,
    alignItems: "center",
  },
  backButton: {
    minWidth: 100,
  },
});

export default AssessmentModeSelectionScreen;