import React, { useRef } from "react";
import { View, StyleSheet, Animated, PanResponder, Dimensions } from "react-native";
import Card from "./Card";
import Typography from "./Typography";
import theme from "../styles/theme";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25; // 画面幅の25%
const SWIPE_OUT_DURATION = 250; // スワイプアニメーションの時間（ミリ秒）

interface SwipeCardProps {
  title: string;
  subtitle?: string;
  content: string;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

const SwipeCard: React.FC<SwipeCardProps> = ({
  title,
  subtitle,
  content,
  onSwipeLeft,
  onSwipeRight,
}) => {
  const position = useRef(new Animated.ValueXY()).current;
  const rotation = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ["-10deg", "0deg", "10deg"],
    extrapolate: "clamp",
  });

  // スワイプ中の背景色の変化
  const leftSwipeOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 4, 0],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const rightSwipeOpacity = position.x.interpolate({
    inputRange: [0, SCREEN_WIDTH / 4],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const cardStyle = {
    transform: [
      { translateX: position.x },
      { rotate: rotation },
    ],
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: 0 });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          forceSwipe("right");
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          forceSwipe("left");
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  const forceSwipe = (direction: "left" | "right") => {
    const x = direction === "right" ? SCREEN_WIDTH : -SCREEN_WIDTH;
    console.log(`スワイプ方向: ${direction}`);

    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: true,
    }).start(() => {
      console.log(`スワイプアニメーション完了: ${direction}`);

      if (direction === "right") {
        console.log("右スワイプのコールバックを呼び出し");
        onSwipeRight();
      } else {
        console.log("左スワイプのコールバックを呼び出し");
        onSwipeLeft();
      }

      position.setValue({ x: 0, y: 0 });
    });
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      {/* スワイプ方向のインジケーター */}
      <View style={styles.indicatorContainer}>
        <Animated.View
          style={[
            styles.indicator,
            styles.leftIndicator,
            { opacity: leftSwipeOpacity },
          ]}
        >
          <Typography color={theme.colors.common.white} align="center">
            スキルなし
          </Typography>
        </Animated.View>
        <Animated.View
          style={[
            styles.indicator,
            styles.rightIndicator,
            { opacity: rightSwipeOpacity },
          ]}
        >
          <Typography color={theme.colors.common.white} align="center">
            スキルあり
          </Typography>
        </Animated.View>
      </View>

      {/* スワイプ可能なカード */}
      <Animated.View
        style={[styles.cardContainer, cardStyle]}
        {...panResponder.panHandlers}
      >
        <Card variant="elevated" style={styles.card}>
          <Typography variant="h4" style={styles.title}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color={theme.colors.gray[600]} style={styles.subtitle}>
              {subtitle}
            </Typography>
          )}
          <View style={styles.divider} />
          <Typography variant="body1" style={styles.content}>
            {content}
          </Typography>
        </Card>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
    height: 300,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 1,
  },
  card: {
    height: "100%",
    justifyContent: "space-between",
  },
  title: {
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    marginBottom: theme.spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.gray[200],
    marginVertical: theme.spacing.md,
  },
  content: {
    flex: 1,
  },
  indicatorContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  indicator: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.borderRadius.md,
  },
  leftIndicator: {
    backgroundColor: theme.colors.swipe.no,
  },
  rightIndicator: {
    backgroundColor: theme.colors.swipe.yes,
  },
});

export default SwipeCard;
