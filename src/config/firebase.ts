import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
// @ts-ignore - React Native 用の永続化。Firebase v11 では型定義が直接公開されていない
import { getReactNativePersistence } from "@firebase/auth/dist/rn/index.js";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "REDACTED",
  authDomain: "skill-map-8446f.firebaseapp.com",
  projectId: "skill-map-8446f",
  storageBucket: "skill-map-8446f.firebasestorage.app",
  messagingSenderId: "19563136471",
  appId: "1:19563136471:web:608b4078cdbcbd076a7792",
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { app, auth, db };
