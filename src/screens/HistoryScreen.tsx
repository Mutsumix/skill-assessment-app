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

  // 平均レベルを計算
  const calculateAverageLevel = (history: AssessmentHistory): string => {
    const answeredResults = history.results.filter(r => r.level >= 0);
    if (answeredResults.length === 0) return "-";
    const avg = answeredResults.reduce((sum, r) => sum + r.level, 0) / answeredResults.length;
    return avg.toFixed(1);
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
                履歴がありません
              </Typography>
              <Typography variant="body2" align="center" style={styles.emptyText}>
                まだ評価を完了していません。
                最初の評価を完了すると、ここに履歴が表示されます。
              </Typography>
            </Card>
          ) : (
            <View style={styles.historyList}>
              {sortedHistory.map((history, index) => (
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
                    <Typography variant="body1" style={styles.roleName}>
                      {history.role}（{history.totalSkills}項目）
                    </Typography>
                    <View style={styles.averageContainer}>
                      <Typography variant="body2" style={styles.statLabel}>
                        平均レベル：
                      </Typography>
                      <Typography variant="h6" style={styles.statValue}>
                        {calculateAverageLevel(history)}
                      </Typography>
                    </View>
                  </View>

                  <View style={styles.buttonRow}>
                    <Button
                      title="詳細を見る"
                      onPress={() => onViewResult(history)}
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
              ))}
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
  roleName: {
    fontWeight: "600",
    marginBottom: theme.spacing.sm,
  },
  averageContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statLabel: {
    color: theme.colors.gray[600],
  },
  statValue: {
    color: theme.colors.primary.main,
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
