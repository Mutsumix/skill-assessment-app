import React from "react";
import { View, StyleSheet, ScrollView, SafeAreaView, Share, Linking, Alert, Image } from "react-native";
import Clipboard from "expo-clipboard";
import { captureRef } from "react-native-view-shot";
import { Platform } from "react-native";
import Typography from "../components/Typography";
import Button from "../components/Button";
import RadarChart from "../components/RadarChart";
import SkillList from "../components/SkillList";
import theme from "../styles/theme";
import { useSkillContext } from "../contexts/SkillContext";

interface ResultScreenProps {
  onRestart: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ onRestart }) => {
  const { summaries, resetAssessment, skills, userAnswers } = useSkillContext();

  // レーダーチャート画像付きでX共有
  const radarRef = React.useRef<View>(null);

  // Xで共有（intent/post URL遷移）
  const handleShare = async () => {
    // 投稿文を生成
    const resultText = summaries
      .map(
        (item) =>
          `${item.category} > ${item.item}:\n` +
          `初級: ${item.beginnerCount}/${item.beginnerTotal}\n` +
          `中級: ${item.intermediateCount}/${item.intermediateTotal}\n` +
          `上級: ${item.advancedCount}/${item.advancedTotal}\n`
      )
      .join("\n");

    // X intent/post URLを生成
    const tweetText = encodeURIComponent(
      `スキル習得状況評価結果\n\n${resultText}`
    );
    const url = `https://x.com/intent/post?text=${tweetText}`;

    // Xアプリまたはブラウザで開く
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      Linking.openURL(url);
    } else {
      Alert.alert("エラー", "Xの投稿画面を開けませんでした。");
    }
  };

  // スプレッドシート用コピー
  const handleCopySpreadsheet = async () => {
    // skillsの順番でTRUE/FALSEを出力
    const answerMap: { [skillId: number]: boolean } = {};
    userAnswers.forEach((a) => {
      answerMap[a.skillId] = a.hasSkill;
    });
    const lines = skills.map(
      (s) => `${s.スキル}\t${answerMap[s.id] ? "TRUE" : "FALSE"}`
    );
    const text = lines.join("\n");
    await Clipboard.setStringAsync(text);
    Alert.alert("コピー完了", "スプレッドシート用データをクリップボードにコピーしました。");
  };

  // 再評価
  const handleRestart = () => {
    resetAssessment();
    onRestart();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h4" align="center" style={styles.title}>
          評価結果
        </Typography>
        <Typography variant="body1" align="center" style={styles.subtitle}>
          あなたのスキル習得状況の評価結果です
        </Typography>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled={true}
      >
        {/* レーダーチャート */}
        <View ref={radarRef} collapsable={false}>
          <RadarChart data={summaries} />
        </View>

        {/* スキル一覧 */}
        <SkillList data={summaries} />
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Xで共有"
          onPress={handleShare}
          variant="outline"
          style={styles.button}
          icon={
            <Image
              source={{
                uri: "https://abs.twimg.com/favicons/twitter.2.ico",
              }}
              style={{ width: 18, height: 18, marginRight: 6 }}
              resizeMode="contain"
            />
          }
        />
        <Button
          title="スプレッドシート用コピー"
          onPress={handleCopySpreadsheet}
          variant="outline"
          style={styles.button}
        />
        <Button
          title="再評価する"
          onPress={handleRestart}
          variant="primary"
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.common.background,
    padding: theme.spacing.md,
    paddingTop: theme.spacing.xl, // OSのナビゲーションバーとかぶらないように上部のパディングを増やす
    paddingBottom: theme.spacing.xl, // 下部のパディングも増やす
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    color: theme.colors.gray[600],
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: theme.spacing.xl,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray[200],
  },
  button: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
});

export default ResultScreen;
