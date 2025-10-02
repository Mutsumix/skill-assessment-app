import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Image, Text } from "react-native";
import Typography from "../components/Typography";
import Button from "../components/Button";
import Card from "../components/Card";
import theme from "../styles/theme";
import { useSkillContext } from "../contexts/SkillContext";

interface InstructionScreenProps {
  onStart: () => void;
}

const InstructionScreen: React.FC<InstructionScreenProps> = ({ onStart }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const { hasSavedProgress, loadSavedProgress, isPartialAssessment, selectedDomain } = useSkillContext();

  // 説明ページのコンテンツ（部分評価時は一部変更）
  const pages = isPartialAssessment ? [
    {
      title: `${selectedDomain} 評価の方法`,
      content:
        `${selectedDomain}分野のスキルレベルを評価します。表示されるスキル項目に対して、ボタンで回答してください。`,
      image: "📝✨",
    },
    {
      title: "回答方法",
      content:
        "「はい」：スキルあり\n「いいえ」：スキルなし\n\n前回の回答がある場合、緑色のボタンで表示されます。カードの右上に「前回：はい/いいえ」も表示されます。",
      image: "⭕️❌",
    },
    {
      title: "結果の確認",
      content:
        `評価完了後、${selectedDomain}分野のスキル習得状況が棒グラフで表示されます。なお、この結果は履歴に保存されません。`,
      image: "📊🦸‍♂️",
    },
  ] : [
    {
      title: "スキル評価の方法",
      content:
        "このアプリでは、あなたのスキルレベルを評価します。表示されるスキル項目に対して、ボタンで回答してください。",
      image: "📝✨",
    },
    {
      title: "回答方法",
      content:
        "「はい」：スキルあり\n「いいえ」：スキルなし\n\n前回の回答がある場合、緑色のボタンで表示されます。カードの右上に「前回：はい/いいえ」も表示されます。",
      image: "⭕️❌",
    },
    {
      title: "休憩タイム",
      content:
        "分野ごとに休憩カードが表示されます。一息ついてから次の分野に進みましょう。",
      image: "☕️😌",
    },
    {
      title: "結果の確認",
      content:
        "全ての回答が完了すると、あなたのスキルレベルがレーダーチャートと一覧で表示されます。これにより、あなたの強みと弱みを視覚的に確認できます。",
      image: "📊🦸‍♂️",
    },
  ];

  // 現在のページ
  const currentPageData = pages[currentPage];

  // 次のページに進む
  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      onStart();
    }
  };

  // 前のページに戻る
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // 途中から再開
  const handleResume = async () => {
    const loaded = await loadSavedProgress();
    if (loaded) {
      onStart();
    }
  };

  return (
    <View style={styles.container}>
      <Card variant="elevated" style={styles.card}>
        <Typography variant="h3" align="center" style={styles.title}>
          {currentPageData.title}
        </Typography>

        <ScrollView style={styles.contentContainer}>
          <View style={styles.imagePlaceholder}>
            <Text style={styles.emojiImage}>
              {currentPageData.image}
            </Text>
          </View>

          <View style={styles.contentTextContainer}>
            {currentPageData.content.split('\n').map((line, index) => (
              <Text key={index} style={styles.contentText}>
                {line}
              </Text>
            ))}
          </View>
        </ScrollView>

        <View style={styles.pagination}>
          {Array.from({ length: pages.length }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                currentPage === index && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          {currentPage > 0 && (
            <Button
              title="戻る"
              onPress={prevPage}
              variant="outline"
              style={styles.button}
            />
          )}
          <Button
            title={currentPage === pages.length - 1 ? "始める" : "次へ"}
            onPress={nextPage}
            variant="primary"
            style={styles.button}
          />
        </View>

        {/* 保存された進捗がある場合は途中から再開ボタンを表示 */}
        {hasSavedProgress && currentPage === pages.length - 1 && (
          <View style={styles.resumeContainer}>
            <Typography variant="caption" style={styles.resumeText}>
              保存された進捗があります
            </Typography>
            <Button
              title="途中から再開"
              onPress={handleResume}
              variant="secondary"
              style={styles.resumeButton}
            />
          </View>
        )}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.common.background,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  card: {
    width: "100%",
    maxWidth: 500,
    padding: theme.spacing.lg,
  },
  title: {
    marginBottom: theme.spacing.lg,
  },
  contentContainer: {
    maxHeight: 400,
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: theme.spacing.md,
  },
  imagePlaceholder: {
    width: "100%",
    height: 200,
    backgroundColor: theme.colors.gray[200],
    borderRadius: theme.borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  content: {
    marginBottom: theme.spacing.lg,
    lineHeight: theme.typography.lineHeight.loose,
  },
  contentTextContainer: {
    marginBottom: theme.spacing.lg,
  },
  emojiImage: {
    fontSize: 64,
    textAlign: "center",
    marginBottom: theme.spacing.md,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.gray[800],
    marginBottom: 8,
    fontFamily: theme.typography.fontFamily.base,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: theme.spacing.md,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.gray[300],
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: theme.colors.primary.main,
    width: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  resumeContainer: {
    marginTop: theme.spacing.md,
    alignItems: "center",
  },
  resumeText: {
    marginBottom: theme.spacing.xs,
    color: theme.colors.primary.main,
  },
  resumeButton: {
    width: "100%",
  },
});

export default InstructionScreen;
