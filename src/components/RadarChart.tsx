import React from "react";
import { View, StyleSheet, Dimensions, Text, ScrollView } from "react-native";
import Svg, { Polygon, Line, Circle, Text as SvgText } from "react-native-svg";
import { SkillSummary } from "../types";
import theme from "../styles/theme";
import Card from "./Card";
import Typography from "./Typography";

interface RadarChartProps {
  data: SkillSummary[];
}

const RadarChart: React.FC<RadarChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return null;
  }

  const screenWidth = Dimensions.get("window").width;
  const chartSize = Math.min(screenWidth - 40, 340);
  const radius = chartSize / 2 - 40;
  const center = chartSize / 2;

  const uniqueItems = Array.from(new Set(data.map(item => item.item)));
  const categoryCount = uniqueItems.length;
  const angleStep = (Math.PI * 2) / categoryCount;
  const maxValue = 3;

  const getCoordinates = (angle: number, value: number) => {
    const adjustedValue = (value / maxValue) * radius;
    return {
      x: center + adjustedValue * Math.cos(angle - Math.PI / 2),
      y: center + adjustedValue * Math.sin(angle - Math.PI / 2),
    };
  };

  const itemData = uniqueItems.map(item => {
    const itemSummaries = data.filter(summary => summary.item === item);
    const beginnerTotal = itemSummaries.reduce((sum, summary) => sum + summary.beginnerTotal, 0);
    const beginnerCount = itemSummaries.reduce((sum, summary) => sum + summary.beginnerCount, 0);
    const intermediateTotal = itemSummaries.reduce((sum, summary) => sum + summary.intermediateTotal, 0);
    const intermediateCount = itemSummaries.reduce((sum, summary) => sum + summary.intermediateCount, 0);
    const advancedTotal = itemSummaries.reduce((sum, summary) => sum + summary.advancedTotal, 0);
    const advancedCount = itemSummaries.reduce((sum, summary) => sum + summary.advancedCount, 0);

    return {
      item,
      beginnerRatio: beginnerTotal > 0 ? beginnerCount / beginnerTotal : 0,
      intermediateRatio: intermediateTotal > 0 ? intermediateCount / intermediateTotal : 0,
      advancedRatio: advancedTotal > 0 ? advancedCount / advancedTotal : 0,
    };
  });

  const beginnerData = itemData.map(item => item.beginnerRatio);
  const intermediateData = itemData.map(item => item.beginnerRatio + item.intermediateRatio);
  const advancedData = itemData.map(item => item.beginnerRatio + item.intermediateRatio + item.advancedRatio);

  const generatePolygonPoints = (values: number[]) => {
    return values
      .map((value, i) => {
        const angle = i * angleStep;
        const { x, y } = getCoordinates(angle, value);
        return `${x},${y}`;
      })
      .join(" ");
  };

  const axisLines = Array.from({ length: categoryCount }).map((_, i) => {
    const angle = i * angleStep;
    const { x, y } = getCoordinates(angle, maxValue);
    return { x1: center, y1: center, x2: x, y2: y };
  });

  const circles = [1, 2, 3].map((level) => {
    const radius = (level / maxValue) * (chartSize / 2 - 40);
    return { cx: center, cy: center, r: radius };
  });

  return (
    <Card variant="elevated" style={styles.container}>
      <Typography variant="h4" align="center" style={styles.title}>
        スキル習得状況
      </Typography>
      <View style={styles.chartContainer}>
        <Svg width={chartSize} height={chartSize} viewBox={`0 0 ${chartSize} ${chartSize}`}>
          {/* 同心円 */}
          {circles.map((circle, i) => (
            <Circle
              key={`circle-${i}`}
              cx={circle.cx}
              cy={circle.cy}
              r={circle.r}
              stroke={theme.colors.gray[300]}
              strokeWidth={1}
              fill="none"
            />
          ))}

          {/* 軸の線 */}
          {axisLines.map((line, i) => (
            <Line
              key={`axis-${i}`}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke={theme.colors.gray[300]}
              strokeWidth={1}
            />
          ))}

          {/* 上級レベルのポリゴン */}
          <Polygon
            points={generatePolygonPoints(advancedData)}
            fill={theme.colors.primary.dark}
            fillOpacity={0.3}
            stroke={theme.colors.primary.dark}
            strokeWidth={1}
          />

          {/* 中級レベルのポリゴン */}
          <Polygon
            points={generatePolygonPoints(intermediateData)}
            fill={theme.colors.primary.main}
            fillOpacity={0.3}
            stroke={theme.colors.primary.main}
            strokeWidth={1}
          />

          {/* 初級レベルのポリゴン */}
          <Polygon
            points={generatePolygonPoints(beginnerData)}
            fill={theme.colors.primary.light}
            fillOpacity={0.3}
            stroke={theme.colors.primary.light}
            strokeWidth={1}
          />

          {/* 各頂点にラベルを追加 */}
          {uniqueItems.map((item, i) => {
            const angle = i * angleStep;
            // ラベルの位置を調整（チャートに近づける）
            const labelRadius = radius + 10;
            const x = center + labelRadius * Math.cos(angle - Math.PI / 2);
            const y = center + labelRadius * Math.sin(angle - Math.PI / 2);

            // テキストの配置を調整
            let textAnchor: "start" | "middle" | "end" = "middle";
            let dy = "0.35em"; // デフォルトの垂直位置調整

            // 角度に応じてテキストの配置を調整
            if (angle < 0.25 * Math.PI || angle > 1.75 * Math.PI) {
              textAnchor = "middle"; // 上部
              dy = "-0.5em";
            } else if (angle >= 0.25 * Math.PI && angle < 0.75 * Math.PI) {
              textAnchor = "start"; // 右側
              dy = "0.35em";
            } else if (angle >= 0.75 * Math.PI && angle < 1.25 * Math.PI) {
              textAnchor = "middle"; // 下部
              dy = "1em";
            } else {
              textAnchor = "end"; // 左側
              dy = "0.35em";
            }

            // 項目名を表示するための処理
            let displayText = item;

            // 特定の項目名に対する特別な処理
            if (item === "開発プロセス") {
              displayText = "開発\nプロセス";
            } else if (item === "プログラミング") {
              displayText = "PG";
            } else if (item.length > 8) {
              // 長い項目名は短く表示
              displayText = item.substring(0, 7) + "..";
            }

            return (
              <SvgText
                key={`label-${i}`}
                x={x}
                y={y}
                textAnchor={textAnchor}
                dy={dy}
                fontSize="8"
                fontWeight="bold"
                fill={theme.colors.gray[700]}
              >
                {displayText}
              </SvgText>
            );
          })}
        </Svg>
      </View>

      {/* 凡例 */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: theme.colors.primary.light }]} />
          <Typography variant="caption">初級</Typography>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: theme.colors.primary.main }]} />
          <Typography variant="caption">中級</Typography>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: theme.colors.primary.dark }]} />
          <Typography variant="caption">上級</Typography>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
    marginVertical: theme.spacing.lg,
  },
  title: {
    marginBottom: theme.spacing.md,
  },
  scrollViewContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: theme.spacing.md,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: theme.spacing.md,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: theme.spacing.sm,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: theme.spacing.xs,
  },
});

export default RadarChart;
