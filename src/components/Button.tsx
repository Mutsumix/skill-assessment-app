import React from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from "react-native";
import theme from "../styles/theme";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "text";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  icon,
  iconPosition = "left",
}) => {
  // ボタンのスタイルを決定
  const getButtonStyle = () => {
    const baseStyle: ViewStyle = {
      ...styles.button,
      ...styles[size],
      ...(fullWidth && styles.fullWidth),
    };

    if (disabled) {
      return {
        ...baseStyle,
        ...styles[`${variant}Disabled`],
      };
    }

    // textバリアントの場合はtextVariantを使用
    if (variant === "text") {
      return {
        ...baseStyle,
        ...styles.textVariant,
      };
    }

    return {
      ...baseStyle,
      ...styles[variant],
    };
  };

  // テキストのスタイルを決定
  const getTextStyle = () => {
    const baseStyle: TextStyle = {
      ...styles.text,
      ...styles[`${size}Text`],
    };

    if (disabled) {
      return {
        ...baseStyle,
        ...styles[`${variant}DisabledText`],
      };
    }

    return {
      ...baseStyle,
      ...styles[`${variant}Text`],
    };
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "outline" || variant === "text" ? theme.colors.primary.main : theme.colors.primary.contrast}
        />
      ) : (
        <>
          {icon && iconPosition === "left" && icon}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
          {icon && iconPosition === "right" && icon}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius.md,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: theme.typography.fontFamily.base,
    fontWeight: "500" as const,
  },
  // サイズバリエーション
  small: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    minHeight: 32,
  },
  medium: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    minHeight: 40,
  },
  large: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    minHeight: 48,
  },
  // テキストサイズ
  smallText: {
    fontSize: theme.typography.fontSize.xs,
  },
  mediumText: {
    fontSize: theme.typography.fontSize.sm,
  },
  largeText: {
    fontSize: theme.typography.fontSize.md,
  },
  // バリアントスタイル
  primary: {
    backgroundColor: theme.colors.primary.main,
  },
  primaryText: {
    color: theme.colors.primary.contrast,
  },
  secondary: {
    backgroundColor: theme.colors.secondary.main,
  },
  secondaryText: {
    color: theme.colors.secondary.contrast,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: theme.colors.primary.main,
  },
  outlineText: {
    color: theme.colors.primary.main,
  },
  textVariant: {
    backgroundColor: "transparent",
    paddingHorizontal: 0,
    paddingVertical: 0,
    minHeight: 0,
  },
  textText: {
    color: theme.colors.primary.main,
  },
  // 無効化状態
  primaryDisabled: {
    backgroundColor: theme.colors.gray[300],
  },
  primaryDisabledText: {
    color: theme.colors.gray[500],
  },
  secondaryDisabled: {
    backgroundColor: theme.colors.gray[300],
  },
  secondaryDisabledText: {
    color: theme.colors.gray[500],
  },
  outlineDisabled: {
    borderColor: theme.colors.gray[300],
    backgroundColor: "transparent",
  },
  outlineDisabledText: {
    color: theme.colors.gray[400],
  },
  textDisabled: {
    backgroundColor: "transparent",
  },
  textDisabledText: {
    color: theme.colors.gray[400],
  },
  // 幅いっぱい
  fullWidth: {
    width: "100%",
  },
});

export default Button;
