import { FirebaseApp, initializeApp, getApps, getApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDJm5vG3oeZUUMlVZXJqxkxo_dWE9SgPCc",
  // authDomain must be the custom domain (childrengate.com) for Google OAuth to work
  // when running on that domain. Falls back to firebaseapp.com for localhost dev.
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "schedulo-b0491.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "schedulo-b0491",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "schedulo-b0491.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1067549095640",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1067549095640:web:822a85c7d3b16ead2cc9ad",
};

// Initialize Firebase (works in both browser and server contexts)
let app: FirebaseApp | undefined;
let auth: Auth | null = null;
let db: Firestore | null = null;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.error("Firebase initialization error:", error);
}

// Messaging (Push Notifications)
const messaging = async () => {
    if (!app) return null;
    const supported = await isSupported();
    return supported ? getMessaging(app) : null;
};

export { app, auth, db, messaging };
