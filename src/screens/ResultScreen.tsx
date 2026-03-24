import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import Typography from "../components/Typography";
import Button from "../components/Button";
import Card from "../components/Card";
import theme from "../styles/theme";
import { useSkillContext } from "../contexts/SkillContext";
import { AssessmentHistory, SkillResult } from "../types";

interface ResultScreenProps {
  onGoToRoleSelection: () => void;
  onBackToHome: () => void;
  onViewDetail: () => void;
  historyData?: AssessmentHistory | null;
}

const ResultScreen: React.FC<ResultScreenProps> = ({
  onGoToRoleSelection,
  onBackToHome,
  onViewDetail,
  historyData,
}) => {
  const {
    roleSkills,
    userAnswers,
    saveAssessmentResult,
    hasUnsavedResult,
    isSavingResult,
    selectedRole,
    assessmentHistory,
  } = useSkillContext();

  // 表示するデータを決定
  const displayRole = historyData ? historyData.role : selectedRole;
  const displayResults: SkillResult[] = historyData
    ? historyData.results
    : roleSkills.map(skill => ({
        skillId: skill.id,
        スキル名: skill.スキル名,
        担当工程: skill.担当工程,
        level: userAnswers.find(a => a.skillId === skill.id)?.level ?? -1,
      }));

  // 前回データをマウント時に一度だけ計算（自動保存後の自己参照を防止）
  const [previousResults] = useState<SkillResult[] | null>(() => {
    if (!displayRole) return null;

    const roleHistories = assessmentHistory
      .filter(h => h.role === displayRole)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (historyData) {
      // 履歴表示時：表示中の履歴より前の履歴
      const currentIndex = roleHistories.findIndex(h => h.id === historyData.id);
      if (currentIndex >= 0 && currentIndex < roleHistories.length - 1) {
        return roleHistories[currentIndex + 1].results;
      }
      return null;
    } else {
      // 通常結果表示時：保存前の最新履歴
      if (roleHistories.length > 0) {
        return roleHistories[0].results;
      }
      return null;
    }
  });

  // 評価完了時の自動保存
  useEffect(() => {
    if (!historyData && hasUnsavedResult && !isSavingResult) {
      const autoSave = async () => {
        try {
          await saveAssessmentResult();
        } catch (error) {
          console.error('自動保存に失敗しました:', error);
        }
      };
      autoSave();
    }
  }, [historyData, hasUnsavedResult, isSavingResult, saveAssessmentResult]);

  // 担当工程でグループ化
  const groupedResults: Record<string, SkillResult[]> = {};
  displayResults.forEach(result => {
    if (!groupedResults[result.担当工程]) {
      groupedResults[result.担当工程] = [];
    }
    groupedResults[result.担当工程].push(result);
  });

  // 前回データのマップ
  const previousMap: Record<number, number> = {};
  if (previousResults) {
    previousResults.forEach(r => {
      previousMap[r.skillId] = r.level;
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h4" align="center" style={styles.title}>
          {displayRole} チェック結果
        </Typography>
        {historyData && (
          <Typography variant="body2" align="center" style={styles.dateText}>
            {historyData.date.toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Typography>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={true}
      >
        {Object.entries(groupedResults).map(([process, results]) => (
          <Card key={process} variant="elevated" style={styles.processCard}>
            <Typography variant="h6" style={styles.processTitle}>
              {process}
            </Typography>

            {/* テーブルヘッダー */}
            <View style={styles.tableHeader}>
              <Typography variant="caption" style={styles.skillNameHeader}>
                スキル名
              </Typography>
              <Typography variant="caption" style={styles.levelHeader}>
                前回
              </Typography>
              <Typography variant="caption" style={styles.levelHeader}>
                今回
              </Typography>
            </View>

            {/* テーブル行 */}
            {results.map((result) => {
              const prevLevel = previousMap[result.skillId];
              const hasImproved = prevLevel !== undefined && prevLevel >= 0 && result.level > prevLevel;

              return (
                <View key={result.skillId} style={styles.tableRow}>
                  <Typography variant="body2" style={styles.skillNameCell} numberOfLines={2}>
                    {result.スキル名}
                  </Typography>
                  <Typography variant="body2" style={styles.levelCell}>
                    {prevLevel !== undefined && prevLevel >= 0 ? prevLevel : "-"}
                  </Typography>
                  <View style={styles.currentLevelCell}>
                    <Typography
                      variant="body2"
                      style={hasImproved ? {...styles.levelCellText, ...styles.improvedText} : styles.levelCellText}
                    >
                      {result.level >= 0 ? result.level : "-"}
                    </Typography>
                    {hasImproved && (
                      <Typography variant="caption" style={styles.upArrow}>
                        ↑
                      </Typography>
                    )}
                  </View>
                </View>
              );
            })}
          </Card>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.buttonRow}>
          <Button
            title="他のロールをチェックする"
            onPress={onGoToRoleSelection}
            variant="outline"
            style={styles.button}
          />
        </View>
        <View style={styles.buttonRow}>
          <Button
            title="項目詳細を確認"
            onPress={onViewDetail}
            variant="secondary"
            style={styles.button}
          />
        </View>
        <View style={styles.homeButtonContainer}>
          <Button
            title="トップに戻る"
            onPress={onBackToHome}
            variant="primary"
            style={styles.homeButton}
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
    padding: theme.spacing.md,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    marginBottom: theme.spacing.xs,
  },
  dateText: {
    color: theme.colors.gray[500],
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  processCard: {
    padding: theme.spacing.md,
  },
  processTitle: {
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.gray[100],
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[300],
    marginBottom: theme.spacing.xs,
  },
  skillNameHeader: {
    flex: 1,
    fontWeight: "bold",
    color: theme.colors.gray[600],
  },
  levelHeader: {
    width: 44,
    textAlign: "center",
    fontWeight: "bold",
    color: theme.colors.gray[600],
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[100],
  },
  skillNameCell: {
    flex: 1,
    paddingRight: theme.spacing.xs,
  },
  levelCell: {
    width: 44,
    textAlign: "center",
    color: theme.colors.gray[500],
  },
  currentLevelCell: {
    width: 44,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  levelCellText: {
    textAlign: "center",
  },
  improvedText: {
    color: theme.colors.accent.success,
    fontWeight: "bold",
  },
  upArrow: {
    color: theme.colors.accent.success,
    fontWeight: "bold",
    marginLeft: 2,
    fontSize: 11,
  },
  footer: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray[200],
  },
  buttonRow: {
    marginBottom: theme.spacing.sm,
  },
  button: {
    marginHorizontal: theme.spacing.xs,
  },
  homeButtonContainer: {
    marginTop: theme.spacing.xs,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray[200],
  },
  homeButton: {
    marginHorizontal: theme.spacing.lg,
  },
});

export default ResultScreen;
