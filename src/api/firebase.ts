import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const config = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyB--zj4-NYawddsNzuMvdK0EoaxwoFcbDg",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    "e-pharmacy-89a3e.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "e-pharmacy-89a3e",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "e-pharmacy-89a3e.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "915141607010",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:915141607010:web:8a309e986d0e32e5315b3b",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-YQCME05T56",
};

export const firebaseReady = Boolean(
  config.apiKey && config.authDomain && config.projectId && config.appId,
);
export const firebaseApp = firebaseReady
  ? getApps().length > 0
    ? getApp()
    : initializeApp(config)
  : null;
export const firebaseAuth = firebaseApp ? getAuth(firebaseApp) : null;
export const firestore = firebaseApp ? getFirestore(firebaseApp) : null;
export const analytics =
  firebaseApp && import.meta.env.PROD
    ? isSupported()
        .then((supported) => (supported ? getAnalytics(firebaseApp) : null))
        .catch(() => null)
    : Promise.resolve(null);
