import React from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import Svg, { Polygon, Line, Circle, Text as SvgText } from "react-native-svg";
import { SkillSummary } from "../types";
import theme from "../styles/theme";
import Card from "./Card";
import Typography from "./Typography";

interface RadarChartProps {
  data: SkillSummary[];
}

const RadarChart: React.FC<RadarChartProps> = ({ data }) => {
  // データが空の場合は何も表示しない
  if (!data || data.length === 0) {
    return null;
  }

  // 画面の幅に基づいてチャートのサイズを決定
  const screenWidth = Dimensions.get("window").width;
  const size = Math.min(screenWidth - 40, 500);
  const radius = size / 2 - 40;
  const center = size / 2;

  // 項目数（11角形）
  // 項目の一覧を抽出
  const uniqueItems = Array.from(new Set(data.map(item => item.item)));
  const categoryCount = uniqueItems.length;

  console.log(`レーダーチャート - 項目数: ${categoryCount}`);
  console.log(`レーダーチャート - 項目一覧: ${uniqueItems.join(', ')}`);
  const angleStep = (Math.PI * 2) / categoryCount;

  // 各レベルの最大値
  const maxValue = 3; // 初級・中級・上級の3レベル

  // 座標を計算する関数
  const getCoordinates = (angle: number, value: number) => {
    const adjustedValue = (value / maxValue) * radius;
    return {
      x: center + adjustedValue * Math.cos(angle - Math.PI / 2),
      y: center + adjustedValue * Math.sin(angle - Math.PI / 2),
    };
  };

  // 項目ごとにデータを集計
  const itemData = uniqueItems.map(item => {
    const itemSummaries = data.filter(summary => summary.item === item);

    // 初級、中級、上級のデータを集計
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

  console.log("レーダーチャート - 項目データ:", itemData);

  // 初級、中級、上級のデータを正規化
  const beginnerData = itemData.map(item => item.beginnerRatio);
  const intermediateData = itemData.map(item => item.beginnerRatio + item.intermediateRatio);
  const advancedData = itemData.map(item => item.beginnerRatio + item.intermediateRatio + item.advancedRatio);

  // ポリゴンの頂点を生成
  const generatePolygonPoints = (values: number[]) => {
    return values
      .map((value, i) => {
        const angle = i * angleStep;
        const { x, y } = getCoordinates(angle, value);
        return `${x},${y}`;
      })
      .join(" ");
  };

  // 軸の線を生成
  const axisLines = Array.from({ length: categoryCount }).map((_, i) => {
    const angle = i * angleStep;
    const { x, y } = getCoordinates(angle, maxValue);
    return { x1: center, y1: center, x2: x, y2: y };
  });

  // 同心円を生成
  const circles = [1, 2, 3].map((level) => {
    const radius = (level / maxValue) * (size / 2 - 40);
    return { cx: center, cy: center, r: radius };
  });

  // カテゴリーラベルを生成
  const categoryLabels = uniqueItems.map((item, i) => {
    const angle = i * angleStep;
    const { x, y } = getCoordinates(angle, maxValue * 1.1);

    // 項目に対応する分野を取得（最初に見つかったものを使用）
    const category = data.find(summary => summary.item === item)?.category || "";

    return {
      x,
      y,
      text: `${category}\n${item}`,
      anchor:
        angle === 0 ? "middle" :
        angle < Math.PI ? "start" :
        angle === Math.PI ? "middle" : "end",
      dy: angle === Math.PI / 2 ? "1em" : angle === 3 * Math.PI / 2 ? "-1em" : 0,
    };
  });

  return (
    <Card variant="elevated" style={styles.container}>
      <Typography variant="h4" align="center" style={styles.title}>
        スキル習得状況
      </Typography>

      <View style={styles.chartContainer}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
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

          {/* カテゴリーラベル */}
          {categoryLabels.map((label, i) => (
            <SvgText
              key={`label-${i}`}
              x={label.x}
              y={label.y}
              fontSize={8}
              fill={theme.colors.gray[700]}
              textAnchor={label.anchor as any}
              dy={label.dy}
            >
              {label.text}
            </SvgText>
          ))}
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
