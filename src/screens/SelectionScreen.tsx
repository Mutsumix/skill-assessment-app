import React from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Typography from "../components/Typography";
import Button from "../components/Button";
import Card from "../components/Card";
import theme from "../styles/theme";

interface SelectionScreenProps {
  onSelectFullAssessment: () => void;
  onSelectFieldSpecific: () => void;
  onBack: () => void;
}

const SelectionScreen: React.FC<SelectionScreenProps> = ({
  onSelectFullAssessment,
  onSelectFieldSpecific,
  onBack
}) => {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top + theme.spacing.md }]}>
        {/* ヘッダー */}
        <View style={styles.header}>
          <Typography variant="h3" align="center" style={styles.title}>
            評価タイプの選択
          </Typography>
          <Typography variant="body1" align="center" style={styles.subtitle}>
            全体評価または分野別評価を選択してください
          </Typography>
        </View>

        {/* 選択肢 */}
        <View style={styles.optionsContainer}>
          {/* 全スキルチェック */}
          <Card variant="elevated" style={styles.optionCard}>
            <Typography variant="h5" style={styles.optionTitle}>
              🚀 全スキルチェック
            </Typography>
            <Typography variant="body2" style={styles.optionDescription}>
              128項目のすべてのスキルを評価します（約15-20分）
            </Typography>
            <Typography variant="caption" style={styles.optionNote}>
              • 結果は履歴に保存されます
              • 総合的なスキル分析が可能
              • レーダーチャートで表示
            </Typography>
            <Button
              title="全スキルチェック"
              onPress={onSelectFullAssessment}
              variant="primary"
              style={styles.optionButton}
            />
          </Card>

          {/* 分野ごとのチェック */}
          <Card variant="elevated" style={styles.optionCard}>
            <Typography variant="h5" style={styles.optionTitle}>
              📊 分野ごとのチェック
            </Typography>
            <Typography variant="body2" style={styles.optionDescription}>
              特定の分野のみを選択して評価します（約5-10分）
            </Typography>
            <Typography variant="caption" style={styles.optionNote}>
              • インフラエンジニア
              • プログラマー  
              • システムエンジニア
              • マネジメント
            </Typography>
            <Typography variant="caption" style={[styles.optionNote, styles.warningNote]}>
              ⚠️ 分野別評価の結果は履歴に保存されません
            </Typography>
            <Button
              title="分野を選択"
              onPress={onSelectFieldSpecific}
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
    lineHeight: 24,
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
    marginBottom: theme.spacing.md,
    color: theme.colors.gray[700],
    textAlign: "center",
    lineHeight: 20,
  },
  optionNote: {
    color: theme.colors.gray[600],
    textAlign: "center",
    lineHeight: 18,
    marginBottom: theme.spacing.sm,
  },
  warningNote: {
    color: theme.colors.accent.warning,
    fontWeight: "600",
  },
  optionButton: {
    minWidth: 150,
    marginTop: theme.spacing.sm,
  },
  backButtonContainer: {
    alignItems: "center",
    marginTop: theme.spacing.lg,
  },
  backButton: {
    minWidth: 120,
  },
});

export default SelectionScreen;