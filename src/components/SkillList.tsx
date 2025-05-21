import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { SkillSummary } from "../types";
import Card from "./Card";
import Typography from "./Typography";
import theme from "../styles/theme";

interface SkillListProps {
  data: SkillSummary[];
}

const SkillList: React.FC<SkillListProps> = ({ data }) => {
  // データが空の場合は何も表示しない
  if (!data || data.length === 0) {
    return null;
  }

  // カテゴリーごとにデータをグループ化
  const groupedData: { [key: string]: SkillSummary[] } = {};
  data.forEach((item) => {
    if (!groupedData[item.category]) {
      groupedData[item.category] = [];
    }
    groupedData[item.category].push(item);
  });

  return (
    <Card variant="elevated" style={styles.container}>
      <Typography variant="h4" align="center" style={styles.title}>
        スキル習得状況一覧
      </Typography>

      <ScrollView
        style={styles.scrollView}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={true}
      >
        {Object.entries(groupedData).map(([category, items]) => (
          <View key={category} style={styles.categorySection}>
            <Typography variant="h5" style={styles.categoryTitle}>
              {category}
            </Typography>

            {items.map((item, index) => (
              <View key={`${item.category}-${item.item}-${index}`} style={styles.itemContainer}>
                <Typography variant="h6" style={styles.itemTitle}>
                  {item.item}
                </Typography>

                <View style={styles.levelContainer}>
                  {/* 初級レベル */}
                  <View style={styles.levelSection}>
                    <Typography variant="caption" style={styles.levelTitle}>
                      初級
                    </Typography>
                    <View style={styles.progressContainer}>
                      <View
                        style={[
                          styles.progressBar,
                          {
                            width: `${(item.beginnerCount / item.beginnerTotal) * 100}%`,
                            backgroundColor: theme.colors.primary.light,
                          },
                        ]}
                      />
                      <Typography variant="caption" style={styles.progressText}>
                        {item.beginnerCount}/{item.beginnerTotal}
                      </Typography>
                    </View>
                  </View>

                  {/* 中級レベル */}
                  <View style={styles.levelSection}>
                    <Typography variant="caption" style={styles.levelTitle}>
                      中級
                    </Typography>
                    <View style={styles.progressContainer}>
                      <View
                        style={[
                          styles.progressBar,
                          {
                            width: `${(item.intermediateCount / item.intermediateTotal) * 100}%`,
                            backgroundColor: theme.colors.primary.main,
                          },
                        ]}
                      />
                      <Typography variant="caption" style={styles.progressText}>
                        {item.intermediateCount}/{item.intermediateTotal}
                      </Typography>
                    </View>
                  </View>

                  {/* 上級レベル */}
                  <View style={styles.levelSection}>
                    <Typography variant="caption" style={styles.levelTitle}>
                      上級
                    </Typography>
                    <View style={styles.progressContainer}>
                      <View
                        style={[
                          styles.progressBar,
                          {
                            width: `${(item.advancedCount / item.advancedTotal) * 100}%`,
                            backgroundColor: theme.colors.primary.dark,
                          },
                        ]}
                      />
                      <Typography variant="caption" style={styles.progressText}>
                        {item.advancedCount}/{item.advancedTotal}
                      </Typography>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
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
  scrollView: {
    maxHeight: 500, // 高さを増やす
    flexGrow: 1,
  },
  categorySection: {
    marginBottom: theme.spacing.lg,
  },
  categoryTitle: {
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.gray[100],
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  itemContainer: {
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  itemTitle: {
    marginBottom: theme.spacing.xs,
  },
  levelContainer: {
    marginLeft: theme.spacing.md,
  },
  levelSection: {
    marginBottom: theme.spacing.xs,
  },
  levelTitle: {
    marginBottom: 2,
  },
  progressContainer: {
    height: 16,
    backgroundColor: theme.colors.gray[200],
    borderRadius: theme.borderRadius.sm,
    overflow: "hidden",
    position: "relative",
  },
  progressBar: {
    height: "100%",
    position: "absolute",
    left: 0,
    top: 0,
  },
  progressText: {
    position: "absolute",
    right: theme.spacing.xs,
    top: 0,
    height: "100%",
    textAlignVertical: "center",
    fontSize: 10,
  },
});

export default SkillList;
