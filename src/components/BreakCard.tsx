import React from "react";
import { View, StyleSheet, Image, ImageSourcePropType } from "react-native";
import Card from "./Card";
import Typography from "./Typography";
import Button from "./Button";
import theme from "../styles/theme";
import { BreakCard as BreakCardType } from "../types";

// 休憩イメージのプレースホルダー
// 注意: 実際の画像ファイルがない場合はエラーになるため、コメントアウトしています
// const breakImages: { [key: string]: ImageSourcePropType } = {
//   break1: require("../../assets/break1.png"),
//   break2: require("../../assets/break2.png"),
//   break3: require("../../assets/break3.png"),
//   break4: require("../../assets/break4.png"),
// };

interface BreakCardProps {
  breakCard: BreakCardType;
  onContinue: () => void;
}

const BreakCard: React.FC<BreakCardProps> = ({ breakCard, onContinue }) => {
  // 注意: 実際の画像がない場合はエラーになるため、コメントアウトしています
  // const image = breakImages[breakCard.id];

  return (
    <Card variant="elevated" style={styles.card}>
      <View style={styles.content}>
        <Typography variant="h3" align="center" style={styles.title}>
          {breakCard.title}
        </Typography>

        {/* 画像がある場合は表示 */}
        {/* {image && (
          <Image source={image} style={styles.image} resizeMode="contain" />
        )} */}

        {/* 代替として色付きのビュー */}
        <View style={styles.imagePlaceholder} />

        <Typography variant="body1" align="center" style={styles.message}>
          {breakCard.message}
        </Typography>

        <Button
          title="続ける"
          onPress={onContinue}
          variant="primary"
          size="large"
          style={styles.button}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: theme.spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 400,
  },
  content: {
    width: "100%",
    alignItems: "center",
  },
  title: {
    marginBottom: theme.spacing.lg,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: theme.spacing.lg,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: theme.colors.primary.light,
    borderRadius: theme.borderRadius.md,
    marginVertical: theme.spacing.lg,
  },
  message: {
    marginBottom: theme.spacing.xl,
  },
  button: {
    minWidth: 200,
  },
});

export default BreakCard;
