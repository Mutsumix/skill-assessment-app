import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Typography from "../components/Typography";
import Button from "../components/Button";
import Card from "../components/Card";
import theme from "../styles/theme";
import { ROLE_DESCRIPTIONS, LEVEL_DEFINITIONS } from "../types";
import { useSkillContext } from "../contexts/SkillContext";

interface PreCheckScreenProps {
  role: string;
  onStart: () => void;
  onBack: () => void;
}

const PreCheckScreen: React.FC<PreCheckScreenProps> = ({ role, onStart, onBack }) => {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const { setInitialLevel } = useSkillContext();
  const insets = useSafeAreaInsets();
  const description = ROLE_DESCRIPTIONS[role];

  const handleStart = () => {
    if (selectedLevel !== null) {
      setInitialLevel(selectedLevel);
      onStart();
    }
  };

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
              最も近い習熟度を選択してください
            </Typography>

            {LEVEL_DEFINITIONS.map((def) => {
              const isSelected = selectedLevel === def.level;
              return (
                <TouchableOpacity
                  key={def.level}
                  style={[
                    styles.levelOption,
                    isSelected && styles.levelOptionSelected,
                  ]}
                  onPress={() => setSelectedLevel(def.level)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.radio, isSelected && styles.radioSelected]}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                  <View style={styles.levelTextContainer}>
                    <Typography
                      variant="body1"
                      style={isSelected ? {...styles.levelTitle, ...styles.levelTitleSelected} : styles.levelTitle}
                    >
                      {def.label}
                    </Typography>
                    <Typography variant="body2" style={styles.levelDescription}>
                      {def.description}
                    </Typography>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="チェックを開始"
            onPress={handleStart}
            variant="primary"
            disabled={selectedLevel === null}
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
  levelOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
    backgroundColor: theme.colors.common.surface,
  },
  levelOptionSelected: {
    borderColor: theme.colors.primary.main,
    backgroundColor: `${theme.colors.primary.main}08`,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: theme.colors.gray[400],
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  radioSelected: {
    borderColor: theme.colors.primary.main,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary.main,
  },
  levelTextContainer: {
    flex: 1,
  },
  levelTitle: {
    fontWeight: "600",
    marginBottom: 2,
  },
  levelTitleSelected: {
    color: theme.colors.primary.main,
  },
  levelDescription: {
    color: theme.colors.gray[600],
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
