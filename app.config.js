import "dotenv/config";

export default {
  expo: {
    name: "技術マップ",
    slug: "skill-assessment",
    version: "4.0.1",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.mutsumix.skillassessment",
      buildNumber: "9",
      newArchEnabled: false,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      package: "com.mutsumix.skillassessment",
      versionCode: 9,
      newArchEnabled: false,
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      eas: {
        projectId: "9940adcc-c976-4528-a7fc-cc7a82248096",
      },
      firebaseApiKey: process.env.FIREBASE_API_KEY || "AIzaSyA46RhaAi6PkSrBpYBPlNKcd2Nmm3fkvv0",
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN || "skill-map-8446f.firebaseapp.com",
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID || "skill-map-8446f",
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET || "skill-map-8446f.firebasestorage.app",
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "19563136471",
      firebaseAppId: process.env.FIREBASE_APP_ID || "1:19563136471:web:608b4078cdbcbd076a7792",
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    updates: {
      url: "https://u.expo.dev/9940adcc-c976-4528-a7fc-cc7a82248096",
    },
  },
};
