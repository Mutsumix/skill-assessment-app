import { initializeApp } from "firebase/app";
// React Native 環境では firebase/auth が自動的に RN 用バンドルを使用し
// getReactNativePersistence がエクスポートされる
// @ts-ignore - TypeScript の型定義には含まれないが、RN バンドルには存在する
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
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

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { app, auth, db };
