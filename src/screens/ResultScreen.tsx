import React, { useEffect } from "react";
import { View, StyleSheet, ScrollView, SafeAreaView, Share, Linking, Alert, Image, Clipboard } from "react-native";
// import Clipboard from "expo-clipboard";
import { captureRef } from "react-native-view-shot";
import { Platform } from "react-native";
import Typography from "../components/Typography";
import Button from "../components/Button";
import RadarChart from "../components/RadarChart";
import SkillList from "../components/SkillList";
import theme from "../styles/theme";
import { useSkillContext } from "../contexts/SkillContext";
import { AssessmentHistory } from "../types";

interface ResultScreenProps {
  onRestart: () => void;
  historyData?: AssessmentHistory | null;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ onRestart, historyData }) => {
  const {
    summaries,
    resetAssessment,
    skills,
    userAnswers,
    saveAssessmentResult,
    hasUnsavedResult,
    isSavingResult
  } = useSkillContext();

  // 表示するデータを決定（履歴データがある場合はそちらを使用）
  const displayData = historyData ? historyData.results : summaries;
  const displayUserAnswers = historyData ? historyData.userAnswers : userAnswers;

  // 評価完了時の自動保存（重複保存防止強化）
  useEffect(() => {
    // 履歴表示モードでない場合のみ、新しい評価結果を自動保存
    if (!historyData && hasUnsavedResult && !isSavingResult && summaries.length > 0) {
      const autoSave = async () => {
        try {
          await saveAssessmentResult();
          console.log('評価結果が自動保存されました');
        } catch (error) {
          console.error('自動保存に失敗しました:', error);
        }
      };
      autoSave();
    }
  }, [historyData, hasUnsavedResult, isSavingResult, summaries.length, saveAssessmentResult]);

  // レーダーチャート画像付きでX共有
  const radarRef = React.useRef<View>(null);

  // imgurアップロード関数
  const uploadToImgur = async (base64: string): Promise<string | null> => {
    try {
      const response = await fetch("https://api.imgur.com/3/image", {
        method: "POST",
        headers: {
          Authorization: "Client-ID 77b8e7e9bcc0a96",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: base64,
          type: "base64",
        }),
      });
      const json = await response.json();
      if (json.success && json.data && json.data.link) {
        return json.data.link;
      }
      return null;
    } catch (e) {
      console.error("imgur upload error", e);
      return null;
    }
  };

  // Xで共有（intent/post URL遷移＋imgur画像URL）
  const handleShare = async () => {
    try {
      // レーダーチャート部分を画像としてキャプチャ（base64）
      const base64 = await captureRef(radarRef, {
        format: "png",
        quality: 1,
        result: "base64",
      });

      // imgurにアップロード
      const imgurUrl = await uploadToImgur(base64);

      // 投稿文
      const tweetText = encodeURIComponent("技術マップでスキルチェックしたよ！");
      // 画像URLを投稿に含める
      const url = imgurUrl
        ? `https://x.com/intent/post?text=${tweetText}&url=${encodeURIComponent(imgurUrl)}`
        : `https://x.com/intent/post?text=${tweetText}`;

      // Xアプリまたはブラウザで開く
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert("エラー", "Xの投稿画面を開けませんでした。");
      }
    } catch (e) {
      Alert.alert("エラー", "画像のアップロードまたは共有に失敗しました。");
    }
  };

  // スプレッドシート用コピー
  const handleCopySpreadsheet = async () => {
    try {
      // skillsの順番でTRUE/FALSEを出力
      const answerMap: { [skillId: number]: boolean } = {};
      displayUserAnswers.forEach((a) => {
        answerMap[a.skillId] = a.hasSkill;
      });

      // スプレッドシートの形式に合わせる（D列にスキル名、E列に習得状況）
      const lines = skills.map(
        (s) => `${s.スキル}\t${answerMap[s.id] !== undefined ? (answerMap[s.id] ? "TRUE" : "FALSE") : "FALSE"}`
      );

      const text = lines.join("\n");
      console.log("コピーするテキスト:", text); // デバッグ用

      // クリップボードにコピー
      Clipboard.setString(text);
      Alert.alert("コピー完了", "スプレッドシート用データをクリップボードにコピーしました。");
    } catch (e) {
      console.error("クリップボードコピーエラー:", e);
      Alert.alert("エラー", "データのコピーに失敗しました。");
    }
  };



  // トップに戻る
  const handleBackToHome = () => {
    onRestart();
  };

  // 再評価
  const handleRestart = async () => {
    await resetAssessment();
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
        {displayData && displayData.length > 0 ? (
          <>
            {/* レーダーチャート */}
            <View ref={radarRef} collapsable={false}>
              <RadarChart data={displayData} />
            </View>

            {/* スキル一覧 */}
            <SkillList data={displayData} />
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Typography variant="h6" align="center" style={styles.emptyText}>
              表示するデータがありません
            </Typography>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.buttonRow}>
          <Button
            title="結果をコピー"
            onPress={handleCopySpreadsheet}
            variant="outline"
            style={styles.button}
          />
          <Button
            title={historyData ? "戻る" : "再評価する"}
            onPress={handleRestart}
            variant="secondary"
            style={styles.button}
          />
        </View>

        {/* トップに戻るボタンを画面下部に配置 */}
        <View style={styles.homeButtonContainer}>
          <Button
            title="トップに戻る"
            onPress={handleBackToHome}
            variant="primary"
            style={styles.homeButton}
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
    marginTop: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray[200],
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.sm,
  },
  button: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  emptyText: {
    color: theme.colors.gray[600],
  },
  homeButtonContainer: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray[200],
  },
  homeButton: {
    marginHorizontal: theme.spacing.lg,
  },
});

export default ResultScreen;
