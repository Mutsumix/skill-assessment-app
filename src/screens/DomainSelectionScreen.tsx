import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Typography from "../components/Typography";
import Button from "../components/Button";
import Card from "../components/Card";
import theme from "../styles/theme";
import { useSkillContext } from "../contexts/SkillContext";

interface DomainSelectionScreenProps {
  onSelectDomain: (domain: string) => void;
  onBack: () => void;
}

const DomainSelectionScreen: React.FC<DomainSelectionScreenProps> = ({
  onSelectDomain,
  onBack
}) => {
  const { skills } = useSkillContext();
  const insets = useSafeAreaInsets();

  // 分野ごとのスキル数を計算
  const domainStats = React.useMemo(() => {
    const stats: { [domain: string]: { total: number; beginner: number; intermediate: number; advanced: number } } = {};
    
    skills.forEach(skill => {
      if (!stats[skill.分野]) {
        stats[skill.分野] = { total: 0, beginner: 0, intermediate: 0, advanced: 0 };
      }
      stats[skill.分野].total++;
      
      switch (skill.レベル) {
        case "初級":
          stats[skill.分野].beginner++;
          break;
        case "中級":
          stats[skill.分野].intermediate++;
          break;
        case "上級":
          stats[skill.分野].advanced++;
          break;
      }
    });
    
    return stats;
  }, [skills]);

  const domains = Object.keys(domainStats);

  const getDomainIcon = (domain: string) => {
    switch (domain) {
      case "インフラエンジニア":
        return "🖥️";
      case "プログラマー":
        return "💻";
      case "システムエンジニア":
        return "⚙️";
      case "マネジメント":
        return "👥";
      default:
        return "📋";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top + theme.spacing.md }]}>
        {/* ヘッダー */}
        <View style={styles.header}>
          <Typography variant="h3" align="center" style={styles.title}>
            評価する分野を選択
          </Typography>
          <Typography variant="body1" align="center" style={styles.subtitle}>
            評価したい分野を1つ選んでください
          </Typography>
          <View style={styles.warningContainer}>
            <Typography variant="caption" style={styles.warningText}>
              ⚠️ 分野別評価の結果は履歴に保存されません
            </Typography>
          </View>
        </View>

        {/* 分野選択リスト */}
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.domainList}>
            {domains.map((domain) => {
              const stats = domainStats[domain];
              return (
                <Card key={domain} variant="elevated" style={styles.domainCard}>
                  <View style={styles.domainHeader}>
                    <Typography variant="h5" style={styles.domainTitle}>
                      {getDomainIcon(domain)} {domain}
                    </Typography>
                    <Typography variant="caption" style={styles.domainTotal}>
                      全{stats.total}項目
                    </Typography>
                  </View>
                  
                  <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                      <Typography variant="caption" style={styles.statLabel}>
                        初級
                      </Typography>
                      <Typography variant="body2" style={styles.statValue}>
                        {stats.beginner}
                      </Typography>
                    </View>
                    <View style={styles.statItem}>
                      <Typography variant="caption" style={styles.statLabel}>
                        中級
                      </Typography>
                      <Typography variant="body2" style={styles.statValue}>
                        {stats.intermediate}
                      </Typography>
                    </View>
                    <View style={styles.statItem}>
                      <Typography variant="caption" style={styles.statLabel}>
                        上級
                      </Typography>
                      <Typography variant="body2" style={styles.statValue}>
                        {stats.advanced}
                      </Typography>
                    </View>
                  </View>

                  <Button
                    title={`${domain}を評価`}
                    onPress={() => onSelectDomain(domain)}
                    variant="primary"
                    style={styles.selectButton}
                  />
                </Card>
              );
            })}
          </View>
        </ScrollView>

        {/* 戻るボタン */}
        <View style={styles.backButtonContainer}>
          <Button
            title="戻る"
            onPress={onBack}
            variant="outline"
            style={styles.backButton}
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
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.lg,
    alignItems: "center",
  },
  title: {
    marginBottom: theme.spacing.sm,
    color: theme.colors.primary.main,
  },
  subtitle: {
    color: theme.colors.gray[600],
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  warningContainer: {
    backgroundColor: theme.colors.warning.light,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.sm,
  },
  warningText: {
    color: theme.colors.warning.dark,
    textAlign: "center",
    fontWeight: "500",
  },
  scrollContainer: {
    flex: 1,
  },
  domainList: {
    gap: theme.spacing.md,
  },
  domainCard: {
    padding: theme.spacing.lg,
  },
  domainHeader: {
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  domainTitle: {
    marginBottom: theme.spacing.xs,
    textAlign: "center",
  },
  domainTotal: {
    color: theme.colors.gray[600],
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.gray[50],
    borderRadius: theme.borderRadius.md,
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    color: theme.colors.gray[600],
    marginBottom: theme.spacing.xs,
  },
  statValue: {
    fontWeight: "600",
    color: theme.colors.primary.main,
  },
  selectButton: {
    alignSelf: "center",
    minWidth: 140,
  },
  backButtonContainer: {
    marginTop: theme.spacing.lg,
    alignItems: "center",
  },
  backButton: {
    minWidth: 100,
  },
});

export default DomainSelectionScreen;