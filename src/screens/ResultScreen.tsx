import React from "react";
import { View, StyleSheet, ScrollView, SafeAreaView, Share } from "react-native";
import Typography from "../components/Typography";
import Button from "../components/Button";
import RadarChart from "../components/RadarChart";
import SkillList from "../components/SkillList";
import theme from "../styles/theme";
import { useSkillContext } from "../contexts/SkillContext";

interface ResultScreenProps {
  onRestart: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ onRestart }) => {
  const { summaries, resetAssessment } = useSkillContext();

  // 結果を共有
  const handleShare = async () => {
    try {
      // カテゴリーごとの結果を集計
      const resultText = summaries
        .map(
          (item) =>
            `${item.category} > ${item.item}:\n` +
            `初級: ${item.beginnerCount}/${item.beginnerTotal}\n` +
            `中級: ${item.intermediateCount}/${item.intermediateTotal}\n` +
            `上級: ${item.advancedCount}/${item.advancedTotal}\n`
        )
        .join("\n");

      await Share.share({
        title: "スキル評価結果",
        message: `スキル習得状況評価結果\n\n${resultText}`,
      });
    } catch (error) {
      console.error("共有エラー:", error);
    }
  };

  // 再評価
  const handleRestart = () => {
    resetAssessment();
    onRestart();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h4" align="center" style={styles.title}>
          評価結果
        </Typography>
        <Typography variant="body1" align="center" style={styles.subtitle}>
          あなたのスキル習得状況の評価結果です
        </Typography>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* レーダーチャート */}
        <RadarChart data={summaries} />

        {/* スキル一覧 */}
        <SkillList data={summaries} />
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="結果を共有"
          onPress={handleShare}
          variant="outline"
          style={styles.button}
        />
        <Button
          title="再評価する"
          onPress={handleRestart}
          variant="primary"
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.common.background,
    padding: theme.spacing.md,
    paddingTop: theme.spacing.xl, // OSのナビゲーションバーとかぶらないように上部のパディングを増やす
    paddingBottom: theme.spacing.xl, // 下部のパディングも増やす
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    color: theme.colors.gray[600],
  },
  scrollView: {
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray[200],
  },
  button: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
});

export default ResultScreen;
