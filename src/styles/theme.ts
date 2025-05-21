// デジタル庁デザインシステムに基づいたテーマ設定
// 参考: https://www.digital.go.jp/policies/servicedesign/designsystem

export const colors = {
  // プライマリカラー
  primary: {
    main: "#00ADB5", // デジタル庁のメインカラー（青緑）
    light: "#4DDFE5",
    dark: "#007D87",
    contrast: "#FFFFFF",
  },
  // セカンダリカラー
  secondary: {
    main: "#2D3047", // 濃紺
    light: "#575A6E",
    dark: "#1A1C2A",
    contrast: "#FFFFFF",
  },
  // アクセントカラー
  accent: {
    success: "#28A745", // 成功
    warning: "#FFC107", // 警告
    error: "#DC3545", // エラー
    info: "#17A2B8", // 情報
  },
  // グレースケール
  gray: {
    50: "#F8F9FA",
    100: "#E9ECEF",
    200: "#DEE2E6",
    300: "#CED4DA",
    400: "#ADB5BD",
    500: "#6C757D",
    600: "#495057",
    700: "#343A40",
    800: "#212529",
    900: "#121416",
  },
  // 基本色
  common: {
    white: "#FFFFFF",
    black: "#000000",
    background: "#F8F9FA",
    surface: "#FFFFFF",
    divider: "#DEE2E6",
  },
  // スワイプアクション用の色
  swipe: {
    yes: "#28A745", // 右スワイプ（スキルあり）
    no: "#DC3545", // 左スワイプ（スキルなし）
  },
};

export const typography = {
  fontFamily: {
    base: "'Noto Sans JP', sans-serif",
    heading: "'Noto Sans JP', sans-serif",
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
  },
  fontWeight: {
    regular: "400",
    medium: "500",
    bold: "700",
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    loose: 1.8,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const borderRadius = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  round: 9999,
};

export const shadows = {
  none: "none",
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
};

export const zIndex = {
  modal: 1000,
  overlay: 900,
  drawer: 800,
  header: 700,
  footer: 600,
  tooltip: 500,
  default: 1,
  below: -1,
};

// レスポンシブブレークポイント
export const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
};

// アニメーション
export const animation = {
  duration: {
    shortest: 150,
    shorter: 200,
    short: 250,
    standard: 300,
    complex: 375,
    enteringScreen: 225,
    leavingScreen: 195,
  },
  easing: {
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    sharp: "cubic-bezier(0.4, 0, 0.6, 1)",
  },
};

// テーマをまとめたオブジェクト
const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  zIndex,
  breakpoints,
  animation,
};

export default theme;
