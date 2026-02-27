import { FirebaseApp, initializeApp, getApps, getApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { getMessaging, isSupported } from "firebase/messaging";

// IMPORTANT: authDomain must ALWAYS be the firebaseapp.com domain.
// Do NOT set this to childrengate.com — Cloudflare Pages does not serve
// the /__/auth/ routes that Firebase requires for OAuth popup/redirect.
// childrengate.com only needs to be in the Firebase "Authorized domains" list,
// which it already is. That's a separate setting from authDomain.
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

if (typeof window !== "undefined") {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
}


const messaging = async () => {
  if (!app) return null;
  const supported = await isSupported();
  return supported ? getMessaging(app) : null;
};

export { app, auth, db, messaging };
