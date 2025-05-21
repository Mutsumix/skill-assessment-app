import React from "react";
import { Text, StyleSheet, TextStyle, TextProps } from "react-native";
import theme from "../styles/theme";

interface TypographyProps extends TextProps {
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "body1" | "body2" | "caption" | "button";
  color?: string;
  align?: "auto" | "left" | "right" | "center" | "justify";
  style?: TextStyle;
  children: React.ReactNode;
}

const Typography: React.FC<TypographyProps> = ({
  variant = "body1",
  color,
  align = "left",
  style,
  children,
  ...props
}) => {
  return (
    <Text
      style={[
        styles.base,
        styles[variant],
        { textAlign: align },
        color ? { color } : {},
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    fontFamily: theme.typography.fontFamily.base,
    color: theme.colors.gray[800],
  },
  h1: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: "700",
    lineHeight: theme.typography.lineHeight.tight * theme.typography.fontSize.xxxl,
    marginBottom: theme.spacing.md,
  },
  h2: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: "700",
    lineHeight: theme.typography.lineHeight.tight * theme.typography.fontSize.xxl,
    marginBottom: theme.spacing.sm,
  },
  h3: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: "600",
    lineHeight: theme.typography.lineHeight.tight * theme.typography.fontSize.xl,
    marginBottom: theme.spacing.sm,
  },
  h4: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: "600",
    lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.lg,
    marginBottom: theme.spacing.xs,
  },
  h5: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: "600",
    lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.md,
    marginBottom: theme.spacing.xs,
  },
  h6: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: "600",
    lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.sm,
    marginBottom: theme.spacing.xs,
  },
  body1: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: "400",
    lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.md,
  },
  body2: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: "400",
    lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.sm,
  },
  caption: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: "400",
    lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.xs,
    color: theme.colors.gray[600],
  },
  button: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: "500",
    lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.sm,
    textTransform: "uppercase" as const,
  },
});

export default Typography;
