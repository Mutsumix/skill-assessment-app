import React, { useState } from "react";
import { View, StyleSheet, TextInput, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Typography from "../components/Typography";
import Button from "../components/Button";
import Card from "../components/Card";
import theme from "../styles/theme";
import { useAuth } from "../contexts/AuthContext";

interface LoginScreenProps {
  onBack: () => void;
  onLoginSuccess: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onBack, onLoginSuccess }) => {
  const { login, signup, authError, clearAuthError } = useAuth();
  const insets = useSafeAreaInsets();

  const [isSignup, setIsSignup] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setLocalError(null);

    if (isSignup && !displayName.trim()) {
      setLocalError("名前を入力してください");
      return;
    }
    if (!email.trim() || !password.trim()) {
      setLocalError("メールアドレスとパスワードを入力してください");
      return;
    }
    if (isSignup && password !== passwordConfirm) {
      setLocalError("パスワードが一致しません");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isSignup) {
        await signup(email.trim(), password, displayName.trim());
      } else {
        await login(email.trim(), password);
      }
      onLoginSuccess();
    } catch (error) {
      // authError は AuthContext 内で設定済み
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setLocalError(null);
    clearAuthError();
  };

  const displayError = localError || authError;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + theme.spacing.md }]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Typography variant="h3" align="center" style={styles.title}>
              {isSignup ? "アカウント作成" : "ログイン"}
            </Typography>
            <Typography variant="body2" align="center" style={styles.subtitle}>
              {isSignup
                ? "名前・メールアドレス・パスワードで登録"
                : "ログインすると評価結果がクラウドに保存されます"
              }
            </Typography>
          </View>

          <Card variant="elevated" style={styles.formCard}>
            {isSignup && (
              <>
                <Typography variant="body2" style={styles.inputLabel}>
                  名前
                </Typography>
                <TextInput
                  style={styles.input}
                  placeholder="山田 太郎"
                  placeholderTextColor={theme.colors.gray[400]}
                  value={displayName}
                  onChangeText={(text) => { setDisplayName(text); setLocalError(null); }}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </>
            )}

            <Typography variant="body2" style={styles.inputLabel}>
              メールアドレス
            </Typography>
            <TextInput
              style={styles.input}
              placeholder="example@company.co.jp"
              placeholderTextColor={theme.colors.gray[400]}
              value={email}
              onChangeText={(text) => { setEmail(text); setLocalError(null); clearAuthError(); }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Typography variant="body2" style={styles.inputLabel}>
              パスワード
            </Typography>
            <TextInput
              style={styles.input}
              placeholder="6文字以上"
              placeholderTextColor={theme.colors.gray[400]}
              value={password}
              onChangeText={(text) => { setPassword(text); setLocalError(null); clearAuthError(); }}
              secureTextEntry
            />

            {isSignup && (
              <>
                <Typography variant="body2" style={styles.inputLabel}>
                  パスワード（確認）
                </Typography>
                <TextInput
                  style={styles.input}
                  placeholder="もう一度入力"
                  placeholderTextColor={theme.colors.gray[400]}
                  value={passwordConfirm}
                  onChangeText={(text) => { setPasswordConfirm(text); setLocalError(null); }}
                  secureTextEntry
                />
              </>
            )}

            {displayError && (
              <Typography variant="body2" style={styles.errorText}>
                {displayError}
              </Typography>
            )}

            <Button
              title={isSubmitting ? "処理中..." : (isSignup ? "登録" : "ログイン")}
              onPress={handleSubmit}
              variant="primary"
              disabled={isSubmitting}
              style={styles.submitButton}
            />

            <Button
              title={isSignup ? "既にアカウントをお持ちの方" : "新規登録はこちら"}
              onPress={toggleMode}
              variant="text"
              style={styles.toggleButton}
            />
          </Card>

          <Button
            title="ログインせずに使う"
            onPress={onBack}
            variant="outline"
            style={styles.backButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.common.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.xl,
    alignItems: "center",
  },
  title: {
    marginBottom: theme.spacing.sm,
    color: theme.colors.primary.main,
  },
  subtitle: {
    color: theme.colors.gray[600],
    lineHeight: 22,
  },
  formCard: {
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  inputLabel: {
    marginBottom: theme.spacing.xs,
    fontWeight: "600",
    color: theme.colors.gray[700],
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.gray[300],
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    fontSize: 16,
    backgroundColor: theme.colors.common.surface,
    color: theme.colors.gray[800],
  },
  errorText: {
    color: theme.colors.accent.error,
    marginBottom: theme.spacing.md,
    textAlign: "center",
  },
  submitButton: {
    marginTop: theme.spacing.sm,
  },
  toggleButton: {
    marginTop: theme.spacing.sm,
  },
  backButton: {
    marginTop: theme.spacing.md,
  },
});

export default LoginScreen;
