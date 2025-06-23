import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Typography from "./Typography";
import theme from "../styles/theme";
import { FieldSummary } from "../types";

interface FieldResultChartProps {
  fieldSummaries: FieldSummary[];
}

const FieldResultChart: React.FC<FieldResultChartProps> = ({ fieldSummaries }) => {
  const getFieldDisplayName = (field: string) => {
    switch (field) {
      case 'インフラエンジニア':
        return 'インフラエンジニア';
      case '開発エンジニア（プログラマー）':
        return 'プログラマー';
      case '開発エンジニア（SE）':
        return 'システムエンジニア';
      case 'マネジメント':
        return 'マネジメント';
      default:
        return field;
    }
  };

  const getFieldEmoji = (field: string) => {
    switch (field) {
      case 'インフラエンジニア':
        return '🔧';
      case '開発エンジニア（プログラマー）':
        return '💻';
      case '開発エンジニア（SE）':
        return '⚙️';
      case 'マネジメント':
        return '👥';
      default:
        return '📊';
    }
  };

  if (fieldSummaries.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Typography variant="body1" style={styles.emptyText}>
          分野別の結果がありません
        </Typography>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {fieldSummaries.map((summary, index) => {
        const totalAcquired = summary.beginnerCount + summary.intermediateCount + summary.advancedCount;
        const totalPossible = summary.beginnerTotal + summary.intermediateTotal + summary.advancedTotal;
        const completionRate = totalPossible > 0 ? (totalAcquired / totalPossible * 100) : 0;

        return (
          <View key={summary.field} style={styles.fieldContainer}>
            {/* フィールドヘッダー */}
            <View style={styles.fieldHeader}>
              <Typography variant="h6" style={styles.fieldTitle}>
                {getFieldEmoji(summary.field)} {getFieldDisplayName(summary.field)}
              </Typography>
              <Typography variant="body2" style={styles.completionRate}>
                {Math.round(completionRate)}% ({totalAcquired}/{totalPossible})
              </Typography>
            </View>

            {/* 積み上げ棒グラフ */}
            <View style={styles.chartContainer}>
              <View style={styles.barContainer}>
                {/* 初級バー */}
                <View style={styles.barSection}>
                  <View style={styles.barBackground}>
                    <View 
                      style={[
                        styles.barFill,
                        styles.beginnerBar,
                        { 
                          width: summary.beginnerTotal > 0 
                            ? `${(summary.beginnerCount / summary.beginnerTotal) * 100}%` 
                            : '0%' 
                        }
                      ]} 
                    />
                  </View>
                  <Typography variant="caption" style={styles.levelLabel}>
                    初級 {summary.beginnerCount}/{summary.beginnerTotal}
                  </Typography>
                </View>

                {/* 中級バー */}
                <View style={styles.barSection}>
                  <View style={styles.barBackground}>
                    <View 
                      style={[
                        styles.barFill,
                        styles.intermediateBar,
                        { 
                          width: summary.intermediateTotal > 0 
                            ? `${(summary.intermediateCount / summary.intermediateTotal) * 100}%` 
                            : '0%' 
                        }
                      ]} 
                    />
                  </View>
                  <Typography variant="caption" style={styles.levelLabel}>
                    中級 {summary.intermediateCount}/{summary.intermediateTotal}
                  </Typography>
                </View>

                {/* 上級バー */}
                <View style={styles.barSection}>
                  <View style={styles.barBackground}>
                    <View 
                      style={[
                        styles.barFill,
                        styles.advancedBar,
                        { 
                          width: summary.advancedTotal > 0 
                            ? `${(summary.advancedCount / summary.advancedTotal) * 100}%` 
                            : '0%' 
                        }
                      ]} 
                    />
                  </View>
                  <Typography variant="caption" style={styles.levelLabel}>
                    上級 {summary.advancedCount}/{summary.advancedTotal}
                  </Typography>
                </View>
              </View>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  emptyText: {
    color: theme.colors.gray[600],
    textAlign: "center",
  },
  fieldContainer: {
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.sm,
  },
  fieldHeader: {
    marginBottom: theme.spacing.md,
    alignItems: "center",
  },
  fieldTitle: {
    marginBottom: theme.spacing.xs,
    textAlign: "center",
  },
  completionRate: {
    color: theme.colors.primary.main,
    fontWeight: "600",
    textAlign: "center",
  },
  chartContainer: {
    paddingHorizontal: theme.spacing.sm,
  },
  barContainer: {
    gap: theme.spacing.sm,
  },
  barSection: {
    marginBottom: theme.spacing.sm,
  },
  barBackground: {
    height: 24,
    backgroundColor: theme.colors.gray[200],
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: theme.spacing.xs,
  },
  barFill: {
    height: "100%",
    borderRadius: 12,
    minWidth: 4,
  },
  beginnerBar: {
    backgroundColor: theme.colors.accent.success,
  },
  intermediateBar: {
    backgroundColor: theme.colors.accent.warning,
  },
  advancedBar: {
    backgroundColor: theme.colors.accent.error,
  },
  levelLabel: {
    color: theme.colors.gray[700],
    fontSize: 12,
    textAlign: "center",
  },
});

export default FieldResultChart;