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

// Global singletons for Firebase services
let app: FirebaseApp | undefined;
let auth: Auth | null = null;
let db: Firestore | null = null;

// Initialize Firebase only in the browser to ensure compatibility with Edge Runtime
if (typeof window !== "undefined") {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
}

export { app, auth, db };
