import { FirebaseApp, initializeApp, getApps, getApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDJm5vG3oeZUUMlVZXJqxkxo_dWE9SgPCc",
  authDomain: "schedulo-b0491.firebaseapp.com",
  projectId: "schedulo-b0491",
  storageBucket: "schedulo-b0491.firebasestorage.app",
  messagingSenderId: "1067549095640",
  appId: "1:1067549095640:web:822a85c7d3b16ead2cc9ad",
};

// Internal cache
let cachedApp: FirebaseApp | null = null;
let cachedAuth: Auth | null = null;
let cachedDb: Firestore | null = null;

function getSafeApp() {
    if (typeof window === "undefined") return null;
    if (!cachedApp) {
        cachedApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    }
    return cachedApp;
}

export const getAuthInstance = () => {
    if (typeof window === "undefined") return null;
    const app = getSafeApp();
    if (!app) return null;
    if (!cachedAuth) cachedAuth = getAuth(app);
    return cachedAuth;
};

export const getDbInstance = () => {
    if (typeof window === "undefined") return null;
    const app = getSafeApp();
    if (!app) return null;
    if (!cachedDb) cachedDb = getFirestore(app);
    return cachedDb;
};

// Providing dummy objects for the server to prevent "undefined" errors during SSR initialization
// but these will never be used for real calls.
export const auth = typeof window !== "undefined" ? getAuth(getSafeApp()!) : null;
export const db = typeof window !== "undefined" ? getFirestore(getSafeApp()!) : null;
export const app = typeof window !== "undefined" ? getSafeApp() : null;
