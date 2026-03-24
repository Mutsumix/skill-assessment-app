import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Typography from "../components/Typography";
import Button from "../components/Button";
import Card from "../components/Card";
import theme from "../styles/theme";
import { ROLE_DESCRIPTIONS, LEVEL_DEFINITIONS } from "../types";

interface PreCheckScreenProps {
  role: string;
  onStart: () => void;
  onBack: () => void;
}

const PreCheckScreen: React.FC<PreCheckScreenProps> = ({ role, onStart, onBack }) => {
  const insets = useSafeAreaInsets();
  const description = ROLE_DESCRIPTIONS[role];

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top + theme.spacing.sm }]}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Typography variant="h4" style={styles.title}>
              {role}
            </Typography>
            <Button
              title="戻る"
              onPress={onBack}
              variant="outline"
              size="small"
              style={styles.backButton}
            />
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={true}
        >
          <Card variant="elevated" style={styles.descriptionCard}>
            <Typography variant="body1" style={styles.detailText}>
              {description?.detail || ""}
            </Typography>
          </Card>

          <View style={styles.levelSection}>
            <Typography variant="h6" style={styles.levelLabel}>
              レベルの目安
            </Typography>

            {LEVEL_DEFINITIONS.map((def) => (
              <View key={def.level} style={styles.levelRow}>
                <View style={styles.levelBadge}>
                  <Typography variant="body2" style={styles.levelBadgeText}>
                    {def.level}
                  </Typography>
                </View>
                <Typography variant="body2" style={styles.levelDescription}>
                  {def.description}
                </Typography>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="チェックを開始"
            onPress={onStart}
            variant="primary"
            style={styles.startButton}
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
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    flex: 1,
  },
  backButton: {
    paddingHorizontal: theme.spacing.md,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: theme.spacing.xs,
    paddingBottom: theme.spacing.md,
  },
  descriptionCard: {
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  detailText: {
    color: theme.colors.gray[700],
    lineHeight: 24,
  },
  levelSection: {
    marginBottom: theme.spacing.md,
  },
  levelLabel: {
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.xs,
  },
  levelRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
  },
  levelBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.gray[200],
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  levelBadgeText: {
    fontWeight: "bold",
    color: theme.colors.gray[600],
    fontSize: 13,
  },
  levelDescription: {
    flex: 1,
    color: theme.colors.gray[700],
  },
  footer: {
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray[200],
  },
  startButton: {
    marginHorizontal: theme.spacing.md,
  },
});

export default PreCheckScreen;
