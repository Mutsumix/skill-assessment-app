import React, { useEffect } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Typography from "../components/Typography";
import ProgressBar from "../components/ProgressBar";
import Button from "../components/Button";
import Card from "../components/Card";
import BreakCard from "../components/BreakCard";
import theme from "../styles/theme";
import { useSkillContext } from "../contexts/SkillContext";
import { useBreakContext } from "../contexts/BreakContext";

interface AssessmentScreenProps {
  onComplete: () => void;
}

const AssessmentScreen: React.FC<AssessmentScreenProps> = ({ onComplete }) => {
  const {
    skills,
    currentSkillIndex,
    progress,
    answerSkill,
    nextSkill,
    prevSkill,
    calculateSummaries,
  } = useSkillContext();

  // SafeAreaのinsets取得
  const insets = useSafeAreaInsets();

  const {
    breakCards,
    currentBreakIndex,
    showBreak,
    setShowBreak,
    nextBreak,
  } = useBreakContext();

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
    if (currentSkillIndex > 0 && currentSkillIndex < skills.length) {
      const prevSkill = skills[currentSkillIndex - 1];
      const currentSkill = skills[currentSkillIndex];

      // 分野が変わったら休憩カードを表示
      if (prevSkill.分野 !== currentSkill.分野) {
        console.log(`分野が変わりました: ${prevSkill.分野} -> ${currentSkill.分野}`);
        setShowBreak(true);
      }
    }
  }, [currentSkillIndex, skills, setShowBreak]);

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
    nextBreak();
  };

  // 読み込み中または全てのスキルが評価された場合は何も表示しない
  if (!currentSkill) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Typography variant="h5" style={styles.title}>
          スキル評価
        </Typography>
        <ProgressBar progress={progress} showLabel />

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
              "開発エンジニア（システムエンジニア）",
              "マネジメント",
            ];
            return (
              <View style={{ flexDirection: "row", alignItems: "center", width: "100%", marginTop: 8 }}>
                {fieldOrder.map((field, idx) => {
                  const count = fieldCounts[field] || 0;
                  const widthPercent = total > 0 ? (count / total) * 100 : 0;
                  return (
                    <View key={field} style={{ flex: count, alignItems: "center" }}>
                      <View
                        style={{
                          height: 8,
                          width: "100%",
                          backgroundColor: theme.colors.primary.light,
                          opacity: 0.5,
                          borderRadius: 4,
                          marginHorizontal: 2,
                        }}
                      />
                      <Typography
                        variant="caption"
                        style={{
                          fontSize: 11,
                          color: theme.colors.gray[600],
                          marginTop: 2,
                          textAlign: "center",
                        }}
                        numberOfLines={1}
                      >
                        {field === "マネジメント"
                          ? "MGR"
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
            <Typography variant="h4" style={styles.skillTitle}>
              {currentSkill.スキル || "スキル名が取得できません"}
            </Typography>

            <Typography variant="body2" color={theme.colors.gray[600]} style={styles.skillSubtitle}>
              {`${currentSkill.分野 || "不明"} > ${currentSkill.項目 || "不明"} > ${currentSkill.レベル || "不明"}`}
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
  title: {
    marginBottom: theme.spacing.sm,
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
