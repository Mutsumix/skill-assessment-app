import React, { useEffect } from "react";
import { View, StyleSheet, Alert, TouchableOpacity, Linking } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Typography from "../components/Typography";
import Button from "../components/Button";
import Card from "../components/Card";
import theme from "../styles/theme";
import { useSkillContext } from "../contexts/SkillContext";
import { FEEDBACK_CONFIG } from "../config/feedback";

interface HomeScreenProps {
  onStartNew: () => void;
  onResumeProgress: () => void;
  onViewHistory: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartNew,
  onResumeProgress,
  onViewHistory
}) => {
  const {
    hasSavedProgress,
    assessmentHistory,
    loadSavedProgress,
    loadAssessmentHistory
  } = useSkillContext();

  const insets = useSafeAreaInsets();

  // 画面初期化時にデータを読み込み
  useEffect(() => {
    loadAssessmentHistory();
  }, []);

  // 新しい評価を開始
  const handleStartNew = () => {
    if (hasSavedProgress) {
      Alert.alert(
        "保存されたデータについて",
        "既に途中まで進めた評価があります。新しく開始すると、保存されたデータは削除されます。よろしいですか？",
        [
          { text: "キャンセル", style: "cancel" },
          {
            text: "新しく開始",
            style: "destructive",
            onPress: onStartNew
          }
        ]
      );
    } else {
      onStartNew();
    }
  };

  // 保存された進捗から再開
  const handleResumeProgress = async () => {
    const loaded = await loadSavedProgress();
    if (loaded) {
      onResumeProgress();
    } else {
      Alert.alert("エラー", "保存された進捗の読み込みに失敗しました。");
    }
  };

  // 履歴表示
  const handleViewHistory = () => {
    if (assessmentHistory.length === 0) {
      Alert.alert("履歴なし", "まだ評価履歴がありません。\n最初の評価を完了してください。");
    } else {
      onViewHistory();
    }
  };

  // フィードバック機能
  const handleFeedback = () => {
    Alert.alert(
      FEEDBACK_CONFIG.DIALOG_CONFIG.title,
      FEEDBACK_CONFIG.DIALOG_CONFIG.message,
      [
        {
          text: FEEDBACK_CONFIG.DIALOG_CONFIG.cancelText,
          style: "cancel"
        },
        {
          text: FEEDBACK_CONFIG.DIALOG_CONFIG.confirmText,
          onPress: async () => {
            try {
              const canOpen = await Linking.canOpenURL(FEEDBACK_CONFIG.FEEDBACK_FORM_URL);
              if (canOpen) {
                await Linking.openURL(FEEDBACK_CONFIG.FEEDBACK_FORM_URL);
              } else {
                Alert.alert("エラー", "フィードバックフォームを開けませんでした。");
              }
            } catch (error) {
              Alert.alert("エラー", "フィードバックフォームを開けませんでした。");
            }
          }
        }
      ]
    );
  };



  return (
    <SafeAreaView style={styles.container}>
      {/* フィードバックボタン - 画面の一番右上 */}
      <TouchableOpacity 
        style={[styles.feedbackButton, { top: insets.top + theme.spacing.sm }]}
        onPress={handleFeedback}
        activeOpacity={0.7}
      >
        <Typography style={styles.feedbackIcon}>
          {FEEDBACK_CONFIG.BUTTON_CONFIG.icon}
        </Typography>
      </TouchableOpacity>

      <View style={[styles.content, { paddingTop: insets.top + theme.spacing.md }]}>
        {/* ヘッダー */}
        <View style={styles.header}>
          <Typography variant="h2" align="center" style={styles.title}>
            スキル評価
          </Typography>
          <Typography variant="body1" align="center" style={styles.subtitle}>
            あなたの技術スキルを評価して、成長を記録しましょう
          </Typography>
        </View>

        {/* メインコンテンツ - グリッド表示 */}
        <View style={styles.gridContainer}>
          {/* 上段 - 新規評価 */}
          <Card variant="elevated" style={styles.mainCard}>
            <Typography variant="h5" style={styles.cardTitle}>
              🚀 新しい評価を開始
            </Typography>
            <Typography variant="body2" style={styles.cardDescription}>
                                128項目のスキル評価（約15-20分）
            </Typography>
            <Button
              title="評価を開始"
              onPress={handleStartNew}
              variant="primary"
              style={styles.cardButton}
            />
          </Card>

          {/* 中段 - 2x1グリッド */}
          <View style={styles.middleRow}>
            {/* 途中から再開 */}
            {hasSavedProgress && (
              <Card variant="elevated" style={styles.halfCard}>
                <Typography variant="h6" style={styles.halfCardTitle}>
                  ⏸️ 続きから
                </Typography>
                <Typography variant="caption" style={styles.halfCardDescription}>
                  前回の続きから
                </Typography>
                <Button
                  title="再開"
                  onPress={handleResumeProgress}
                  variant="secondary"
                  style={styles.halfCardButton}
                  size="small"
                />
              </Card>
            )}

            {/* 履歴表示 */}
            <Card variant="elevated" style={styles.halfCard}>
              <Typography variant="h6" style={styles.halfCardTitle}>
                📊 履歴
              </Typography>
              <Typography variant="caption" style={styles.halfCardDescription}>
                {assessmentHistory.length > 0 ? `${assessmentHistory.length}件` : "履歴なし"}
              </Typography>
              <Button
                title="見る"
                onPress={handleViewHistory}
                variant="outline"
                style={styles.halfCardButton}
                size="small"
                disabled={assessmentHistory.length === 0}
              />
            </Card>
          </View>

          {/* 下段 - 統計情報 & 削除ボタン */}
          {assessmentHistory.length > 0 && (
            <View style={styles.bottomRow}>
              <Card variant="outlined" style={styles.statsCard}>
                <Typography variant="h6" style={styles.statsTitle}>
                  📈 あなたの統計
                </Typography>
                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <Typography variant="h5" style={styles.statNumber}>
                      {assessmentHistory.length}
                    </Typography>
                    <Typography variant="caption" style={styles.statLabel}>
                      評価回数
                    </Typography>
                  </View>
                  <View style={styles.statItem}>
                    <Typography variant="caption" style={styles.statNumber}>
                      {assessmentHistory[assessmentHistory.length - 1]?.date.toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" style={styles.statLabel}>
                      最新評価日
                    </Typography>
                  </View>
                </View>
              </Card>
            </View>
          )}
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
    marginBottom: theme.spacing.lg,
    alignItems: "center",
  },
  feedbackButton: {
    position: "absolute",
    right: theme.spacing.md,
    width: FEEDBACK_CONFIG.BUTTON_CONFIG.size,
    height: FEEDBACK_CONFIG.BUTTON_CONFIG.size,
    borderRadius: FEEDBACK_CONFIG.BUTTON_CONFIG.borderRadius,
    backgroundColor: theme.colors.gray[100],
    justifyContent: "center",
    alignItems: "center",
    shadowColor: theme.colors.common.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 1000,
  },
  feedbackIcon: {
    fontSize: 20,
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
  gridContainer: {
    flex: 1,
    gap: theme.spacing.md,
  },
  mainCard: {
    padding: theme.spacing.lg,
    alignItems: "center",
  },
  cardTitle: {
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },
  cardDescription: {
    marginBottom: theme.spacing.md,
    color: theme.colors.gray[700],
    textAlign: "center",
  },
  cardButton: {
    minWidth: 120,
  },
  middleRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  halfCard: {
    flex: 1,
    padding: theme.spacing.md,
    alignItems: "center",
  },
  halfCardTitle: {
    marginBottom: theme.spacing.xs,
    textAlign: "center",
  },
  halfCardDescription: {
    marginBottom: theme.spacing.sm,
    color: theme.colors.gray[600],
    textAlign: "center",
  },
  halfCardButton: {
    minWidth: 80,
  },
  bottomRow: {
    marginTop: "auto",
  },
  statsCard: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.gray[50],
  },
  statsTitle: {
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    color: theme.colors.primary.main,
    fontWeight: "bold",
  },
  statLabel: {
    color: theme.colors.gray[600],
    marginTop: theme.spacing.xs,
    textAlign: "center",
  },
});

export default HomeScreen;
