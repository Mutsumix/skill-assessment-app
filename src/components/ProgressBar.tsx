import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import Typography from "./Typography";
import theme from "../styles/theme";

interface ProgressBarProps {
  progress: number; // 0から100までの値
  showLabel?: boolean;
  height?: number;
  backgroundColor?: string;
  progressColor?: string;
  style?: ViewStyle;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  showLabel = false,
  height = 8,
  backgroundColor = theme.colors.gray[200],
  progressColor = theme.colors.primary.main,
  style,
}) => {
  // 進捗値を0〜100の範囲に制限
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.progressContainer,
          { height, backgroundColor },
        ]}
      >
        <View
          style={[
            styles.progressBar,
            {
              width: `${clampedProgress}%`,
              height,
              backgroundColor: progressColor,
            },
          ]}
        />
      </View>
      {showLabel && (
        <Typography
          variant="caption"
          style={styles.label}
        >
          {`${Math.round(clampedProgress)}%`}
        </Typography>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  progressContainer: {
    width: "100%",
    borderRadius: theme.borderRadius.round,
    overflow: "hidden",
  },
  progressBar: {
    borderRadius: theme.borderRadius.round,
  },
  label: {
    marginTop: theme.spacing.xs,
    textAlign: "right",
  },
});

export default ProgressBar;
