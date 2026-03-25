import { initializeApp, FirebaseApp } from "firebase/app";
// @ts-ignore - TypeScript の型定義には含まれないが、RN バンドルには存在する
import { initializeAuth, getReactNativePersistence, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const extra = Constants.expoConfig?.extra || {};

const firebaseConfig = {
  apiKey: extra.firebaseApiKey || "",
  authDomain: extra.firebaseAuthDomain || "",
  projectId: extra.firebaseProjectId || "",
  storageBucket: extra.firebaseStorageBucket || "",
  messagingSenderId: extra.firebaseMessagingSenderId || "",
  appId: extra.firebaseAppId || "",
};

const isConfigured = !!firebaseConfig.apiKey && !!firebaseConfig.projectId;

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isConfigured) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
  db = getFirestore(app);
} else {
  console.warn("Firebase設定が見つかりません。Firebase機能は無効です。");
}

export { app, auth, db, isConfigured };
