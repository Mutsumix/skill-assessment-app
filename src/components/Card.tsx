import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import theme from "../styles/theme";

interface CardProps {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "outlined";
  style?: ViewStyle;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = "default",
  style,
}) => {
  return (
    <View style={[styles.card, styles[variant], style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.common.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    width: "100%",
  },
  default: {
    shadowColor: theme.colors.common.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  elevated: {
    shadowColor: theme.colors.common.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  outlined: {
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
});

export default Card;
