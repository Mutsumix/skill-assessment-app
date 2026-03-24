import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../config/firebase";
import { FirestoreUserManager } from "../utils/firestoreManager";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setAuthError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      const message = getErrorMessage(error.code);
      setAuthError(message);
      throw error;
    }
  };

  const signup = async (email: string, password: string, displayName: string) => {
    try {
      setAuthError(null);
      const credential = await createUserWithEmailAndPassword(auth, email, password);

      // Firebase Auth のプロフィールに名前を設定
      await updateProfile(credential.user, { displayName });

      // Firestore にユーザー情報を保存
      await FirestoreUserManager.createOrUpdate(credential.user.uid, {
        email,
        displayName,
      });
    } catch (error: any) {
      const message = getErrorMessage(error.code);
      setAuthError(message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setAuthError(null);
      await signOut(auth);
    } catch (error: any) {
      setAuthError("ログアウトに失敗しました");
      throw error;
    }
  };

  const clearAuthError = () => setAuthError(null);

  const value = {
    user,
    isAuthenticated: user !== null,
    isAuthLoading,
    authError,
    login,
    signup,
    logout,
    clearAuthError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

function getErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case "auth/invalid-email":
      return "メールアドレスの形式が正しくありません";
    case "auth/user-disabled":
      return "このアカウントは無効化されています";
    case "auth/user-not-found":
      return "アカウントが見つかりません";
    case "auth/wrong-password":
      return "パスワードが正しくありません";
    case "auth/invalid-credential":
      return "メールアドレスまたはパスワードが正しくありません";
    case "auth/email-already-in-use":
      return "このメールアドレスは既に使用されています";
    case "auth/weak-password":
      return "パスワードは6文字以上で設定してください";
    case "auth/too-many-requests":
      return "ログイン試行回数が多すぎます。しばらく待ってから再試行してください";
    default:
      return "認証エラーが発生しました";
  }
}
