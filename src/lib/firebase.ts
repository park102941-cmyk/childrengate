import { FirebaseApp, getApps, getApp } from "firebase/app";
import { Auth } from "firebase/auth";
import { Firestore } from "firebase/firestore";

// IMPORTANT: No top-level firebase initialization to prevent Edge runtime crashes.
const firebaseConfig = {
  apiKey: "AIzaSyDJm5vG3oeZUUMlVZXJqxkxo_dWE9SgPCc",
  authDomain: "schedulo-b0491.firebaseapp.com",
  projectId: "schedulo-b0491",
  storageBucket: "schedulo-b0491.firebasestorage.app",
  messagingSenderId: "1067549095640",
  appId: "1:1067549095640:web:822a85c7d3b16ead2cc9ad",
};

let app: FirebaseApp | undefined;
let auth: Auth | null = null;
let db: Firestore | null = null;

// Lazy initialize Firebase only in the browser.
if (typeof window !== "undefined") {
  const { initializeApp } = require("firebase/app");
  const { getAuth } = require("firebase/auth");
  const { getFirestore } = require("firebase/firestore");

  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
}

export { app, auth, db };
