import React, { useEffect, useState } from "react";
import { View, StyleSheet, SafeAreaView, Alert, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Typography from "../components/Typography";
import Button from "../components/Button";
import Card from "../components/Card";
import ProgressBar from "../components/ProgressBar";
import theme from "../styles/theme";
import { useSkillContext } from "../contexts/SkillContext";
import { LEVEL_DEFINITIONS, UserAnswer } from "../types";

interface AssessmentScreenProps {
  onComplete: () => void;
  onBackToHome: () => void;
  isViewMode?: boolean;
  viewModeAnswers?: UserAnswer[];
}

const AssessmentScreen: React.FC<AssessmentScreenProps> = ({
  onComplete,
  onBackToHome,
  isViewMode = false,
  viewModeAnswers,
}) => {
  const {
    roleSkills,
    currentSkillIndex,
    progress,
    answerSkill,
    nextSkill,
    prevSkill,
    saveProgress,
    userAnswers,
    hasUnsavedResult,
    saveAssessmentResult,
    selectedRole,
    getPreviousAnswer,
    setInitialLevel: _setInitialLevel,
  } = useSkillContext();

  const insets = useSafeAreaInsets();
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // 閲覧モード用のインデックス管理
  const [viewIndex, setViewIndex] = useState(0);

  const effectiveIndex = isViewMode ? viewIndex : currentSkillIndex;
  const currentSkill = roleSkills[effectiveIndex];

  // 現在のスキルの回答を取得
  const currentAnswer = (() => {
    if (isViewMode && viewModeAnswers) {
      return viewModeAnswers.find(a => a.skillId === currentSkill?.id)?.level;
    }
    return currentSkill ? userAnswers.find(a => a.skillId === currentSkill.id)?.level : undefined;
  })();

  // 前回の回答を取得
  const previousAnswer = currentSkill ? getPreviousAnswer(currentSkill.id) : undefined;

  // 全てのスキルが評価されたら完了
  useEffect(() => {
    if (!isViewMode && currentSkillIndex >= roleSkills.length && roleSkills.length > 0) {
      onComplete();
    }
  }, [currentSkillIndex, roleSkills.length, isViewMode, onComplete]);

  // レベル選択ハンドラー
  const handleLevelSelect = (level: number) => {
    if (isViewMode || !currentSkill) return;
    answerSkill(currentSkill.id, level);
    nextSkill();
  };

  // 手動保存
  const handleSaveProgress = async () => {
    if (userAnswers.length === 0) {
      Alert.alert("保存データなし", "まだ回答がありません。");
      return;
    }

    setIsSaving(true);
    try {
      await saveProgress();
      setSaveMessage("保存完了!");
      setTimeout(() => setSaveMessage(''), 2000);
    } catch (error) {
      Alert.alert("エラー", "保存に失敗しました。");
    } finally {
      setIsSaving(false);
    }
  };

  // トップに戻る
  const handleBackToHome = () => {
    if (isViewMode) {
      onBackToHome();
      return;
    }

    if (currentSkillIndex >= roleSkills.length && hasUnsavedResult) {
      Alert.alert(
        "結果を保存しますか？",
        "評価が完了しました。結果を履歴に保存してトップに戻りますか？",
        [
          { text: "保存せずに戻る", style: "destructive", onPress: onBackToHome },
          { text: "キャンセル", style: "cancel" },
          {
            text: "保存して戻る",
            onPress: async () => {
              await saveAssessmentResult();
              onBackToHome();
            }
          }
        ]
      );
    } else if (userAnswers.length > 0 && currentSkillIndex < roleSkills.length) {
      Alert.alert(
        "途中の記録を保存しますか？",
        "評価の途中です。進捗を保存してトップに戻りますか？",
        [
          { text: "保存せずに戻る", style: "destructive", onPress: onBackToHome },
          { text: "キャンセル", style: "cancel" },
          {
            text: "保存して戻る",
            onPress: async () => {
              await saveProgress();
              onBackToHome();
            }
          }
        ]
      );
    } else {
      onBackToHome();
    }
  };

  // 閲覧モードの前後移動
  const handleViewPrev = () => {
    if (viewIndex > 0) setViewIndex(viewIndex - 1);
  };
  const handleViewNext = () => {
    if (viewIndex < roleSkills.length - 1) setViewIndex(viewIndex + 1);
  };

  if (!currentSkill) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerRow}>
          <View style={styles.titleContainer}>
            <Typography variant="h5" style={styles.title}>
              {selectedRole || "スキル評価"}
            </Typography>
            {isViewMode && (
              <Typography variant="caption" style={styles.viewModeNote}>
                閲覧モード
              </Typography>
            )}
          </View>
          <View style={styles.headerButtons}>
            {isViewMode ? (
              <Button
                title="戻る"
                onPress={onBackToHome}
                variant="outline"
                size="small"
                style={styles.homeButton}
              />
            ) : (
              <>
                <Button
                  title={isSaving ? "保存中..." : "保存"}
                  onPress={handleSaveProgress}
                  variant="secondary"
                  size="small"
                  style={styles.saveButton}
                  disabled={isSaving || userAnswers.length === 0}
                />
                <Button
                  title="トップ"
                  onPress={handleBackToHome}
                  variant="outline"
                  size="small"
                  style={styles.homeButton}
                />
              </>
            )}
          </View>
        </View>
        {saveMessage && (
          <View style={styles.saveMessageContainer}>
            <Typography variant="caption" style={styles.saveMessage}>
              {saveMessage}
            </Typography>
          </View>
        )}

        {/* 進捗表示 */}
        <View style={styles.progressInfo}>
          <Typography variant="body2" style={styles.progressText}>
            {effectiveIndex + 1}問目 / {roleSkills.length}問中
          </Typography>
        </View>
        <ProgressBar
          progress={isViewMode
            ? ((viewIndex + 1) / roleSkills.length) * 100
            : progress
          }
          height={6}
        />
      </View>

      <View style={styles.content}>
        <Card variant="elevated" style={styles.card}>
          {/* 戻るテキスト */}
          {effectiveIndex > 0 && (
            <View style={styles.backTextContainer}>
              <Typography
                variant="caption"
                style={styles.backText}
                onPress={isViewMode ? handleViewPrev : prevSkill}
              >
                戻る
              </Typography>
            </View>
          )}

          {/* 前回の回答表示（閲覧モードでは非表示） */}
          {!isViewMode && previousAnswer !== undefined && previousAnswer >= 0 && (
            <View style={styles.previousAnswerContainer}>
              <Typography variant="caption" style={styles.previousAnswerText}>
                前回：レベル{previousAnswer}
              </Typography>
            </View>
          )}

          <Typography variant="body2" color={theme.colors.gray[600]} style={styles.skillSubtitle}>
            {currentSkill.担当工程} &gt; {currentSkill.スキル名}
          </Typography>

          <Typography variant="body1" style={styles.description}>
            {currentSkill.説明}
          </Typography>

          <View style={styles.divider} />

          {/* レベル選択ボタン */}
          <View style={styles.levelContainer}>
            {LEVEL_DEFINITIONS.map((def) => {
              const isCurrentAnswer = currentAnswer === def.level;
              return (
                <TouchableOpacity
                  key={def.level}
                  style={[
                    styles.levelOption,
                    isCurrentAnswer && styles.levelOptionSelected,
                    isViewMode && styles.levelOptionDisabled,
                  ]}
                  onPress={() => handleLevelSelect(def.level)}
                  disabled={isViewMode}
                  activeOpacity={isViewMode ? 1 : 0.7}
                >
                  <View style={[styles.levelBadge, isCurrentAnswer ? styles.levelBadgeSelected : undefined]}>
                    <Typography
                      variant="caption"
                      style={isCurrentAnswer ? {...styles.levelBadgeText, ...styles.levelBadgeTextSelected} : styles.levelBadgeText}
                    >
                      {def.level}
                    </Typography>
                  </View>
                  <Typography
                    variant="body2"
                    style={isCurrentAnswer ? {...styles.levelText, ...styles.levelTextSelected} : styles.levelText}
                  >
                    {def.description}
                  </Typography>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* 閲覧モードの次へボタン */}
          {isViewMode && viewIndex < roleSkills.length - 1 && (
            <View style={styles.viewNextContainer}>
              <Typography
                variant="caption"
                style={styles.viewNextText}
                onPress={handleViewNext}
              >
                次へ
              </Typography>
            </View>
          )}
        </Card>
      </View>

      <View style={styles.footer}>
        <Typography variant="caption" color={theme.colors.gray[500]}>
          {effectiveIndex + 1} / {roleSkills.length}
        </Typography>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.common.background,
    padding: theme.spacing.md,
  },
  header: {
    marginBottom: theme.spacing.md,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  headerButtons: {
    flexDirection: "row",
    gap: theme.spacing.xs,
  },
  saveButton: {
    paddingHorizontal: theme.spacing.sm,
  },
  homeButton: {
    paddingHorizontal: theme.spacing.sm,
  },
  saveMessageContainer: {
    alignItems: "center",
    marginTop: theme.spacing.xs,
  },
  saveMessage: {
    color: theme.colors.accent.success,
    fontWeight: "600",
  },
  progressInfo: {
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  progressText: {
    color: theme.colors.primary.main,
    fontWeight: "600",
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    marginBottom: 0,
  },
  viewModeNote: {
    color: theme.colors.accent.info,
    marginTop: theme.spacing.xs,
    fontWeight: "500",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  card: {
    width: "100%",
    padding: theme.spacing.lg,
    maxWidth: 500,
  },
  skillSubtitle: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.gray[200],
    marginVertical: theme.spacing.md,
  },
  description: {
    marginBottom: theme.spacing.sm,
    lineHeight: 24,
  },
  backTextContainer: {
    position: "absolute",
    top: 8,
    left: 12,
    zIndex: 10,
  },
  backText: {
    color: theme.colors.gray[500],
    fontSize: 13,
    textDecorationLine: "underline",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 8,
    overflow: "hidden",
  },
  previousAnswerContainer: {
    position: "absolute",
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: theme.colors.gray[100],
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
    zIndex: 5,
  },
  previousAnswerText: {
    color: theme.colors.gray[600],
    fontSize: 11,
  },
  levelContainer: {
    gap: theme.spacing.sm,
  },
  levelOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
    backgroundColor: theme.colors.common.surface,
  },
  levelOptionSelected: {
    borderColor: theme.colors.primary.main,
    backgroundColor: `${theme.colors.primary.main}10`,
  },
  levelOptionDisabled: {
    opacity: 0.7,
  },
  levelBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.gray[200],
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.sm,
  },
  levelBadgeSelected: {
    backgroundColor: theme.colors.primary.main,
  },
  levelBadgeText: {
    fontWeight: "bold",
    color: theme.colors.gray[600],
    fontSize: 13,
  },
  levelBadgeTextSelected: {
    color: theme.colors.common.white,
  },
  levelText: {
    flex: 1,
    color: theme.colors.gray[700],
  },
  levelTextSelected: {
    color: theme.colors.primary.main,
    fontWeight: "600",
  },
  viewNextContainer: {
    alignItems: "flex-end",
    marginTop: theme.spacing.md,
  },
  viewNextText: {
    color: theme.colors.primary.main,
    fontSize: 13,
    textDecorationLine: "underline",
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  footer: {
    marginTop: theme.spacing.md,
    alignItems: "center",
  },
});

export default AssessmentScreen;
