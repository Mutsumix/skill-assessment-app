import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
// @ts-ignore - React Native 用の永続化。Firebase v11 では型定義が直接公開されていない
import { getReactNativePersistence } from "@firebase/auth/dist/rn/index.js";
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
