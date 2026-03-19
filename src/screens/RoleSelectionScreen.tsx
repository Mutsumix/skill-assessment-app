import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Typography from "../components/Typography";
import Button from "../components/Button";
import Card from "../components/Card";
import theme from "../styles/theme";
import { useSkillContext } from "../contexts/SkillContext";
import { ROLES, ROLE_DESCRIPTIONS } from "../types";
import { getSkillCountByRole } from "../utils/csvParser";

interface RoleSelectionScreenProps {
  onSelectRole: (role: string) => void;
  onBack: () => void;
}

const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({ onSelectRole, onBack }) => {
  const { skills } = useSkillContext();
  const insets = useSafeAreaInsets();
  const skillCounts = getSkillCountByRole(skills);

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top + theme.spacing.sm }]}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Typography variant="h4" style={styles.title}>
              ロールを選択してチェックを開始
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
          {ROLES.map((role) => {
            const description = ROLE_DESCRIPTIONS[role];
            const count = skillCounts[role] || 0;

            return (
              <Card key={role} variant="elevated" style={styles.roleCard}>
                <Typography variant="h5" style={styles.roleName}>
                  {role}
                </Typography>
                <Typography variant="caption" style={styles.skillCount}>
                  全{count}項目
                </Typography>
                <Typography variant="body2" style={styles.roleDescription}>
                  {description?.short || ""}
                </Typography>
                <Button
                  title="チェック開始"
                  onPress={() => onSelectRole(role)}
                  variant="primary"
                  size="small"
                  style={styles.startButton}
                />
              </Card>
            );
          })}
        </ScrollView>
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
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  roleCard: {
    padding: theme.spacing.lg,
  },
  roleName: {
    marginBottom: theme.spacing.xs,
  },
  skillCount: {
    color: theme.colors.gray[500],
    marginBottom: theme.spacing.sm,
  },
  roleDescription: {
    color: theme.colors.gray[700],
    marginBottom: theme.spacing.md,
    lineHeight: 22,
  },
  startButton: {
    alignSelf: "flex-end",
  },
});

export default RoleSelectionScreen;
