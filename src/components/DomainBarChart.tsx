import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { G, Rect, Text } from "react-native-svg";
import Typography from "./Typography";
import theme from "../styles/theme";
import { SkillSummary } from "../types";

interface DomainBarChartProps {
  summaries: SkillSummary[];
  selectedDomain: string;
}

const DomainBarChart: React.FC<DomainBarChartProps> = ({ summaries, selectedDomain }) => {
  // 選択された分野のデータのみをフィルタリング
  const domainSummaries = summaries.filter(summary => summary.category === selectedDomain);

  if (domainSummaries.length === 0) {
    return (
      <View style={styles.container}>
        <Typography variant="body1" style={styles.noDataText}>
          データがありません
        </Typography>
      </View>
    );
  }

  const chartWidth = 350;
  const chartHeight = domainSummaries.length * 50 + 40; // 各バー50px + マージン
  const barHeight = 30;
  const maxBarWidth = 220;

  // 最大スキル数を計算
  const maxSkills = Math.max(...domainSummaries.map(summary => 
    summary.beginnerTotal + summary.intermediateTotal + summary.advancedTotal
  ));

  return (
    <View style={styles.container}>
      <Typography variant="h6" style={styles.title}>
        {selectedDomain} スキル習得状況
      </Typography>
      
      <View style={styles.chartContainer}>
        <Svg width={chartWidth} height={chartHeight}>
          {domainSummaries.map((summary, index) => {
            const totalSkills = summary.beginnerTotal + summary.intermediateTotal + summary.advancedTotal;
            const acquiredSkills = summary.beginnerCount + summary.intermediateCount + summary.advancedCount;
            
            const yPos = index * 50 + 20;
            const barWidth = (totalSkills / maxSkills) * maxBarWidth;
            const acquiredWidth = (acquiredSkills / totalSkills) * barWidth;
            
            return (
              <G key={summary.item}>
                {/* バー背景 */}
                <Rect
                  x={80}
                  y={yPos}
                  width={barWidth}
                  height={barHeight}
                  fill={theme.colors.gray[200]}
                  rx={4}
                />
                {/* 習得済みバー */}
                <Rect
                  x={80}
                  y={yPos}
                  width={acquiredWidth}
                  height={barHeight}
                  fill={theme.colors.primary.main}
                  rx={4}
                />
                {/* ラベル */}
                <Text
                  x={75}
                  y={yPos + barHeight / 2 + 4}
                  fontSize="12"
                  textAnchor="end"
                  fill={theme.colors.gray[700]}
                >
                  {summary.item}
                </Text>
                {/* 数値表示 */}
                <Text
                  x={90 + barWidth}
                  y={yPos + barHeight / 2 + 4}
                  fontSize="12"
                  textAnchor="start"
                  fill={theme.colors.gray[700]}
                  fontWeight="600"
                >
                  {acquiredSkills}/{totalSkills}
                </Text>
              </G>
            );
          })}
        </Svg>
      </View>


      {/* 凡例 */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: theme.colors.primary.main }]} />
          <Typography variant="caption">習得済み</Typography>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: theme.colors.gray[200] }]} />
          <Typography variant="caption">未習得</Typography>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.common.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    margin: theme.spacing.md,
  },
  title: {
    textAlign: "center",
    marginBottom: theme.spacing.lg,
    color: theme.colors.primary.main,
  },
  chartContainer: {
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  noDataText: {
    textAlign: "center",
    color: theme.colors.gray[600],
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});

export default DomainBarChart;