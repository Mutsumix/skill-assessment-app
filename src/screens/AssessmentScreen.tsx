import React, { useEffect, useState } from "react";
import { View, StyleSheet, SafeAreaView, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Typography from "../components/Typography";
import Button from "../components/Button";
import Card from "../components/Card";
import BreakCard from "../components/BreakCard";
import theme from "../styles/theme";
import { useSkillContext } from "../contexts/SkillContext";
import { useBreakContext } from "../contexts/BreakContext";

interface AssessmentScreenProps {
  onComplete: () => void;
  onBackToHome: () => void;
}

const AssessmentScreen: React.FC<AssessmentScreenProps> = ({ onComplete, onBackToHome }) => {
  const {
    skills,
    currentSkillIndex,
    progress,
    answerSkill,
    nextSkill,
    prevSkill,
    calculateSummaries,
    saveProgress,
    hasSavedProgress,
    userAnswers,
    hasUnsavedResult,
    saveAssessmentResult,
  } = useSkillContext();

  // SafeAreaのinsets取得
  const insets = useSafeAreaInsets();

  const {
    breakCards,
    currentBreakIndex,
    showBreak,
    setShowBreak,
    nextBreak,
    showBreakForField,
  } = useBreakContext();

  // 保存関連の状態管理
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // 現在のスキル
  const currentSkill = skills[currentSkillIndex];

  // スキルデータをログに出力
  useEffect(() => {
    console.log(`AssessmentScreen - 現在のスキルインデックス: ${currentSkillIndex}`);
    if (currentSkill) {
      console.log(`AssessmentScreen - 現在のスキル: ${currentSkill.スキル}, ID: ${currentSkill.id}`);
    } else {
      console.log("AssessmentScreen - 現在のスキルがnullです");
    }
  }, [currentSkillIndex, currentSkill]);

  // 分野の変更を検出して休憩カードを表示
  useEffect(() => {
    if (currentSkillIndex > 0 && currentSkillIndex < skills.length && !showBreak) {
      const prevSkill = skills[currentSkillIndex - 1];
      const currentSkill = skills[currentSkillIndex];

      // 分野が変わったら休憩カードを表示（終了した分野の休憩カードを表示）
      if (prevSkill.分野 !== currentSkill.分野) {
        console.log(`分野が変わりました: ${prevSkill.分野} -> ${currentSkill.分野}`);
        showBreakForField(prevSkill.分野); // 終了した分野の休憩カードを表示
      }
    }
  }, [currentSkillIndex, skills]);

  // 全てのスキルが評価されたら完了
  useEffect(() => {
    if (currentSkillIndex >= skills.length) {
      calculateSummaries();
      onComplete();
    }
  }, [currentSkillIndex, skills.length, calculateSummaries, onComplete]);

  // スキルありの回答
  const handleYes = () => {
    if (currentSkill) {
      console.log(`回答: スキルあり, ID: ${currentSkill.id}, スキル名: ${currentSkill.スキル}`);
      answerSkill(currentSkill.id, true);
      nextSkill();
    }
  };

  // スキルなしの回答
  const handleNo = () => {
    if (currentSkill) {
      console.log(`回答: スキルなし, ID: ${currentSkill.id}, スキル名: ${currentSkill.スキル}`);
      answerSkill(currentSkill.id, false);
      nextSkill();
    }
  };

  // 休憩から続ける
  const handleContinue = () => {
    setShowBreak(false);
  };

  // 手動保存のハンドラー
  const handleSaveProgress = async () => {
    if (userAnswers.length === 0) {
      Alert.alert("保存データなし", "まだ回答がありません。");
      return;
    }

    setIsSaving(true);
    try {
      await saveProgress();
      setSaveMessage("保存完了!");
      setTimeout(() => setSaveMessage(''), 2000); // 2秒後にメッセージを消す
    } catch (error) {
      Alert.alert("エラー", "保存に失敗しました。");
    } finally {
      setIsSaving(false);
    }
  };

  // トップに戻る
  const handleBackToHome = () => {
    // 評価完了後の結果画面から戻る場合は、結果を自動保存してからトップに戻る
    if (currentSkillIndex >= skills.length && hasUnsavedResult) {
      Alert.alert(
        "結果を保存しますか？",
        "評価が完了しました。結果を履歴に保存してトップに戻りますか？",
        [
          {
            text: "保存せずに戻る",
            style: "destructive",
            onPress: onBackToHome
          },
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
    }
    // 評価途中で進捗がある場合の確認
    else if (userAnswers.length > 0 && currentSkillIndex < skills.length) {
      Alert.alert(
        "途中の記録を保存しますか？",
        "評価の途中です。進捗を保存してトップに戻りますか？",
        [
          {
            text: "保存せずに戻る",
            style: "destructive",
            onPress: onBackToHome
          },
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
      // その他の場合（評価開始前、または既に保存済み）はそのまま戻る
      onBackToHome();
    }
  };

  // 読み込み中または全てのスキルが評価された場合は何も表示しない
  if (!currentSkill) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerRow}>
          <Typography variant="h5" style={styles.title}>
            スキル評価
          </Typography>
          <View style={styles.headerButtons}>
            <Button
              title={isSaving ? "保存中..." : "保存"}
              onPress={handleSaveProgress}
              variant="secondary"
              style={styles.saveButton}
              size="small"
              disabled={isSaving || userAnswers.length === 0}
            />
            <Button
              title="トップ"
              onPress={handleBackToHome}
              variant="outline"
              style={styles.homeButton}
              size="small"
            />
          </View>
        </View>
        {/* 保存メッセージ */}
        {saveMessage && (
          <View style={styles.saveMessageContainer}>
            <Typography variant="caption" style={styles.saveMessage}>
              {saveMessage}
            </Typography>
          </View>
        )}

        {/* 進捗パーセンテージ表示 */}
        <View style={styles.progressInfo}>
          <Typography variant="h6" style={styles.progressText}>
            {Math.round(progress)}%
          </Typography>
          <Typography variant="caption" style={styles.progressSubtext}>
            進捗
          </Typography>
        </View>

        {/* 分野ごとの設問バランス可視化 */}
        <View style={styles.categoryBarContainer}>
          {(() => {
            // 分野ごとの設問数を集計
            const fieldCounts: { [field: string]: number } = {};
            skills.forEach((s) => {
              fieldCounts[s.分野] = (fieldCounts[s.分野] || 0) + 1;
            });
            const total = skills.length;
            const fieldOrder = [
              "インフラエンジニア",
              "開発エンジニア（プログラマー）",
              "開発エンジニア（SE）",
              "マネジメント",
            ];
            // 現在の進捗位置を計算
            let cumulativeCount = 0;
            const fieldProgress = fieldOrder.map((field) => {
              const count = fieldCounts[field] || 0;
              const start = cumulativeCount;
              const end = cumulativeCount + count;
              cumulativeCount += count;
              return { field, count, start, end };
            });

            return (
              <View style={{ flexDirection: "row", alignItems: "center", width: "100%", marginTop: 8 }}>
                {fieldProgress.map(({ field, count, start, end }, idx) => {
                  // 現在の位置がこの分野内にあるかチェック
                  const isCurrentField = currentSkillIndex >= start && currentSkillIndex < end;
                  const fieldProgressRatio = isCurrentField
                    ? (currentSkillIndex - start) / count
                    : currentSkillIndex >= end ? 1 : 0;

                  return (
                    <View key={field} style={{ flex: count, alignItems: "center" }}>
                      <View
                        style={{
                          height: 8,
                          width: "100%",
                          backgroundColor: theme.colors.gray[300],
                          borderRadius: 4,
                          marginHorizontal: 2,
                          overflow: "hidden",
                        }}
                      >
                        <View
                          style={{
                            height: "100%",
                            width: `${fieldProgressRatio * 100}%`,
                            backgroundColor: theme.colors.primary.main,
                            borderRadius: 4,
                          }}
                        />
                      </View>
                      <Typography
                        variant="caption"
                        style={{
                          fontSize: 11,
                          color: isCurrentField ? theme.colors.primary.main : theme.colors.gray[600],
                          marginTop: 2,
                          textAlign: "center",
                          fontWeight: isCurrentField ? "600" : "normal",
                        }}
                        numberOfLines={1}
                      >
                        {field === "マネジメント"
                          ? "MGR"
                          : field === "開発エンジニア（SE）"
                          ? "システムエンジニア"
                          : field.replace("開発エンジニア（", "").replace("）", "")}
                      </Typography>
                    </View>
                  );
                })}
              </View>
            );
          })()}
        </View>
      </View>

      <View style={styles.content}>
        {showBreak ? (
          <BreakCard
            breakCard={breakCards[currentBreakIndex]}
            onContinue={handleContinue}
          />
        ) : (
          <Card variant="elevated" style={styles.card}>

            <Typography variant="body2" color={theme.colors.gray[600]} style={styles.skillSubtitle}>
              {`${currentSkill.分野 || "不明"} > ${currentSkill.項目 || "不明"} > ${currentSkill.レベル || "不明"}`}
            </Typography>

            <Typography variant="h4" style={styles.skillTitle}>
              {currentSkill.スキル || "スキル名が取得できません"}
            </Typography>

            <View style={styles.divider} />

            {currentSkill.解説 ? (
              <Typography variant="body2" style={styles.description}>
                {currentSkill.解説}
              </Typography>
            ) : (
              <Typography variant="body2" style={styles.description}>
                {`${currentSkill.スキル}のスキルを持っているかどうかを評価します。`}
              </Typography>
            )}

            <Typography variant="body1" style={styles.question}>
              このスキルを持っていますか？
            </Typography>

            {/* カード左上に戻るテキスト */}
            {currentSkillIndex > 0 && (
              <View style={styles.backTextContainer}>
                <Typography
                  variant="caption"
                  style={styles.backText}
                  onPress={prevSkill}
                >
                  戻る
                </Typography>
              </View>
            )}
            <View style={styles.buttonContainer}>
              <Button
                title="はい"
                onPress={handleYes}
                variant="primary"
                style={styles.button}
              />
              <Button
                title="いいえ"
                onPress={handleNo}
                variant="outline"
                style={styles.button}
              />
            </View>
          </Card>
        )}
      </View>

      <View style={styles.footer}>
        <Typography variant="caption" color={theme.colors.gray[500]}>
          {`${currentSkillIndex + 1} / ${skills.length}`}
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
    marginBottom: theme.spacing.lg,
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
  progressSubtext: {
    color: theme.colors.gray[500],
    marginTop: theme.spacing.xs,
  },
  title: {
    marginBottom: 0,
    flex: 1,
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
  skillTitle: {
    marginBottom: theme.spacing.xs,
  },
  skillSubtitle: {
    marginBottom: theme.spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.gray[200],
    marginVertical: theme.spacing.md,
  },
  question: {
    marginBottom: theme.spacing.lg,
    textAlign: "center",
  },
  backTextContainer: {
    position: "absolute",
    top: 8,
    right: 12,
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing.md,
  },
  button: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  description: {
    marginBottom: theme.spacing.md,
  },
  categoryBarContainer: {
    marginTop: 4,
    marginBottom: 2,
    width: "100%",
  },
  footer: {
    marginTop: theme.spacing.lg,
    alignItems: "center",
  },
});

export default AssessmentScreen;
