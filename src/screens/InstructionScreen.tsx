import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Image, Text } from "react-native";
import Typography from "../components/Typography";
import Button from "../components/Button";
import Card from "../components/Card";
import theme from "../styles/theme";

interface InstructionScreenProps {
  onStart: () => void;
}

const InstructionScreen: React.FC<InstructionScreenProps> = ({ onStart }) => {
  const [currentPage, setCurrentPage] = useState(0);

  // 説明ページのコンテンツ
  const pages = [
    {
      title: "スキル評価の方法",
      content:
        "このアプリでは、あなたのスキルレベルを評価します。表示されるスキル項目に対して、スワイプ操作で回答してください。",
      image: null,
    },
    {
      title: "スワイプ操作",
      content:
        "右にスワイプ：スキルあり\n左にスワイプ：スキルなし\n\n画面に表示されるカードを指でスワイプして回答します。",
      image: null,
    },
    {
      title: "休憩タイム",
      content:
        "分野ごとに休憩カードが表示されます。一息ついてから次の分野に進みましょう。",
      image: null,
    },
    {
      title: "結果の確認",
      content:
        "全ての回答が完了すると、あなたのスキルレベルがレーダーチャートと一覧で表示されます。これにより、あなたの強みと弱みを視覚的に確認できます。",
      image: null,
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

  return (
    <View style={styles.container}>
      <Card variant="elevated" style={styles.card}>
        <Typography variant="h3" align="center" style={styles.title}>
          {currentPageData.title}
        </Typography>

        <ScrollView style={styles.contentContainer}>
          {currentPageData.image && (
            <Image
              source={currentPageData.image}
              style={styles.image}
              resizeMode="contain"
            />
          )}

          {!currentPageData.image && (
            <View style={styles.imagePlaceholder}>
              <Typography variant="h4" color={theme.colors.gray[400]}>
                {currentPage + 1}
              </Typography>
            </View>
          )}

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
});

export default InstructionScreen;
