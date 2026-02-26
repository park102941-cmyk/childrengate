import { FirebaseApp, initializeApp, getApps, getApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDJm5vG3oeZUUMlVZXJqxkxo_dWE9SgPCc",
  authDomain: "schedulo-b0491.firebaseapp.com",
  projectId: "schedulo-b0491",
  storageBucket: "schedulo-b0491.firebasestorage.app",
  messagingSenderId: "1067549095640",
  appId: "1:1067549095640:web:822a85c7d3b16ead2cc9ad",
};

const isFirebaseConfigured = true;


// Initialize Firebase only if config is valid
let app: FirebaseApp | undefined;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (typeof window !== 'undefined' && isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
} else {
  if (typeof window !== 'undefined') {
    console.warn("Firebase is not configured. Please add valid keys to .env.local to enable real-time features.");
  }
}

// Messaging (Push Notifications)
const messaging = async () => {
    if (!isFirebaseConfigured || !app) return null;
    const supported = await isSupported();
    return supported ? getMessaging(app) : null;
};

export { app, auth, db, messaging };

