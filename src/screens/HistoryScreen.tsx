import React from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Typography from "../components/Typography";
import Button from "../components/Button";
import Card from "../components/Card";
import theme from "../styles/theme";
import { useSkillContext } from "../contexts/SkillContext";
import { AssessmentHistory } from "../types";

interface HistoryScreenProps {
  onBack: () => void;
  onViewResult: (history: AssessmentHistory) => void;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ onBack, onViewResult }) => {
  const { assessmentHistory, deleteAssessmentHistory } = useSkillContext();
  const insets = useSafeAreaInsets();

  // 履歴を日付順でソート（新しい順）
  const sortedHistory = [...assessmentHistory].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  // 詳細表示
  const handleViewDetail = (history: AssessmentHistory) => {
    onViewResult(history);
  };

  // 個別の履歴削除
  const handleDeleteHistory = (history: AssessmentHistory) => {
    Alert.alert(
      "履歴の削除",
      `${history.date.toLocaleDateString()}の評価履歴を削除しますか？この操作は取り消せません。`,
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "削除",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAssessmentHistory(history.id);
              Alert.alert("削除完了", "履歴を削除しました。");
            } catch (error) {
              Alert.alert("エラー", "履歴の削除に失敗しました。");
            }
          }
        }
      ]
    );
  };

  // 成長率を計算
  const calculateGrowthRate = (current: AssessmentHistory, previous?: AssessmentHistory) => {
    if (!previous) return null;

    const currentTotal = current.skillCounts.beginnerAcquired +
                        current.skillCounts.intermediateAcquired +
                        current.skillCounts.advancedAcquired;
    const previousTotal = previous.skillCounts.beginnerAcquired +
                         previous.skillCounts.intermediateAcquired +
                         previous.skillCounts.advancedAcquired;

    const growth = currentTotal - previousTotal;
    return growth;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top + theme.spacing.sm }]}>
        <View style={styles.header}>
        <View style={styles.headerRow}>
          <Typography variant="h4" style={styles.title}>
            評価履歴
          </Typography>
          <Button
            title="戻る"
            onPress={onBack}
            variant="outline"
            style={styles.backButton}
            size="small"
          />
        </View>
        <Typography variant="body1" style={styles.subtitle}>
          過去の評価結果を確認できます
        </Typography>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={true}
      >
        {sortedHistory.length === 0 ? (
          <Card variant="outlined" style={styles.emptyCard}>
            <Typography variant="h6" align="center" style={styles.emptyTitle}>
              📋 履歴がありません
            </Typography>
            <Typography variant="body2" align="center" style={styles.emptyText}>
              まだ評価を完了していません。
              最初の評価を完了すると、ここに履歴が表示されます。
            </Typography>
          </Card>
        ) : (
          <View style={styles.historyList}>
            {sortedHistory.map((history, index) => {
              const previousHistory = index < sortedHistory.length - 1 ? sortedHistory[index + 1] : undefined;
              const growth = calculateGrowthRate(history, previousHistory);

              const totalAcquired = history.skillCounts.beginnerAcquired +
                                   history.skillCounts.intermediateAcquired +
                                   history.skillCounts.advancedAcquired;
              const totalSkills = history.skillCounts.beginnerTotal +
                                 history.skillCounts.intermediateTotal +
                                 history.skillCounts.advancedTotal;

              return (
                <Card key={history.id} variant="elevated" style={styles.historyCard}>
                  <View style={styles.cardHeader}>
                    <View style={styles.cardHeaderLeft}>
                      <Typography variant="h6" style={styles.historyDate}>
                        {history.date.toLocaleDateString('ja-JP', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Typography>
                      <Typography variant="caption" style={styles.historyTime}>
                        {history.date.toLocaleTimeString('ja-JP', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Typography>
                    </View>
                    {index === 0 && (
                      <View style={styles.latestBadge}>
                        <Typography variant="caption" style={styles.latestText}>
                          最新
                        </Typography>
                      </View>
                    )}
                  </View>

                  <View style={styles.statsContainer}>
                    <View style={styles.statRow}>
                      <Typography variant="body2" style={styles.statLabel}>
                        総合スキル取得率:
                      </Typography>
                      <Typography variant="h6" style={styles.statValue}>
                        {Math.round((totalAcquired / totalSkills) * 100)}%
                      </Typography>
                    </View>

                    <View style={styles.skillBreakdown}>
                      <View style={styles.skillLevel}>
                        <Typography variant="caption" style={styles.skillLevelLabel}>
                          初級
                        </Typography>
                        <Typography variant="body2" style={styles.skillLevelValue}>
                          {history.skillCounts.beginnerAcquired}/{history.skillCounts.beginnerTotal}
                        </Typography>
                      </View>
                      <View style={styles.skillLevel}>
                        <Typography variant="caption" style={styles.skillLevelLabel}>
                          中級
                        </Typography>
                        <Typography variant="body2" style={styles.skillLevelValue}>
                          {history.skillCounts.intermediateAcquired}/{history.skillCounts.intermediateTotal}
                        </Typography>
                      </View>
                      <View style={styles.skillLevel}>
                        <Typography variant="caption" style={styles.skillLevelLabel}>
                          上級
                        </Typography>
                        <Typography variant="body2" style={styles.skillLevelValue}>
                          {history.skillCounts.advancedAcquired}/{history.skillCounts.advancedTotal}
                        </Typography>
                      </View>
                    </View>

                    {growth !== null && (
                      <View style={styles.growthContainer}>
                        <Typography variant="caption" style={styles.growthLabel}>
                          前回からの成長:
                        </Typography>
                                                                        <Typography
                          variant="body2"
                          style={{
                            ...styles.growthValue,
                            color: growth > 0 ? theme.colors.accent.success :
                                   growth < 0 ? theme.colors.accent.error :
                                   theme.colors.gray[600]
                          }}
                        >
                          {growth > 0 ? '+' : ''}{growth}スキル
                        </Typography>
                      </View>
                    )}
                  </View>

                  <View style={styles.buttonRow}>
                    <Button
                      title="詳細を見る"
                      onPress={() => handleViewDetail(history)}
                      variant="outline"
                      style={styles.detailButton}
                      size="small"
                    />
                    <Button
                      title="削除"
                      onPress={() => handleDeleteHistory(history)}
                      variant="outline"
                      style={styles.deleteButton}
                      size="small"
                    />
                  </View>
                </Card>
              );
            })}
          </View>
        )}
      </ScrollView>
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
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.sm,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  title: {
    flex: 1,
  },
  backButton: {
    paddingHorizontal: theme.spacing.md,
  },
  subtitle: {
    color: theme.colors.gray[600],
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  emptyCard: {
    padding: theme.spacing.xl,
    alignItems: "center",
  },
  emptyTitle: {
    marginBottom: theme.spacing.sm,
    color: theme.colors.gray[600],
  },
  emptyText: {
    color: theme.colors.gray[500],
    lineHeight: 20,
  },
  historyList: {
    gap: theme.spacing.md,
  },
  historyCard: {
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.xs,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing.md,
  },
  cardHeaderLeft: {
    flex: 1,
  },
  historyDate: {
    marginBottom: theme.spacing.xs,
  },
  historyTime: {
    color: theme.colors.gray[500],
  },
  latestBadge: {
    backgroundColor: theme.colors.primary.main,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  latestText: {
    color: theme.colors.common.white,
    fontWeight: "bold",
  },
  statsContainer: {
    marginBottom: theme.spacing.md,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  statLabel: {
    color: theme.colors.gray[600],
  },
  statValue: {
    color: theme.colors.primary.main,
    fontWeight: "bold",
  },
  skillBreakdown: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.gray[50],
    borderRadius: theme.borderRadius.sm,
  },
  skillLevel: {
    alignItems: "center",
  },
  skillLevelLabel: {
    color: theme.colors.gray[500],
    marginBottom: theme.spacing.xs,
  },
  skillLevelValue: {
    fontWeight: "bold",
  },
  growthContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  growthLabel: {
    color: theme.colors.gray[600],
  },
  growthValue: {
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  detailButton: {
    flex: 1,
  },
  deleteButton: {
    flex: 1,
    borderColor: theme.colors.accent.error,
  },
});

export default HistoryScreen;
