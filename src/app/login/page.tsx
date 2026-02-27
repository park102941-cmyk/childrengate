"use client";

export const runtime = 'edge';










import { useState } from "react";
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, Mail, Lock, ArrowRight, Globe, X, CheckCircle2 } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

export default function LoginPage() {
  const { t, language, setLanguage } = useLanguage();
  const [userType, setUserType] = useState<"parent" | "institution">("parent");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!auth || !db) {
        throw new Error("Firebase auth is not initialized");
      }

      const persistenceType = rememberMe ? browserLocalPersistence : browserSessionPersistence;
      await setPersistence(auth, persistenceType);

      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const expectedRole = userType === "institution" ? "admin" : "parent";
        
        if (userData.role !== expectedRole) {
           if (userType === "institution" && userData.role === "staff") {
               // Allow staff to login via institution tab
           } else {
               await auth.signOut();
               throw new Error("선택하신 로그인 유형(학부모/기관)과 계정 권한이 일치하지 않습니다.");
           }
        }
        
        if (userData.role === "admin" || userData.role === "staff") {
          router.push("/dashboard/admin");
        } else {
          router.push(`/p/${userData.institutionId || "children-gate-church-01"}`);
        }
      } else {
         await auth.signOut();
         throw new Error("사용자 정보를 찾을 수 없습니다.");
      }
    } catch (err: unknown) {
      console.error("Login error:", err);
      const errorMessage = err instanceof Error ? err.message : t.auth.errorLogin;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (!auth) throw new Error("Firebase auth not ready");
      await sendPasswordResetEmail(auth, resetEmail);
      setResetSent(true);
    } catch (err: unknown) {
      console.error("Reset password error:", err);
      setError(t.auth.errorReset);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      if (!auth || !db) throw new Error("Firebase auth not ready");
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      const userDocRef = doc(db, "users", userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);
      
      const expectedRole = userType === "institution" ? "admin" : "parent";

      if (userDoc.exists()) {
         const userData = userDoc.data();
         if (userData.role !== expectedRole) {
            if (userType === "institution" && userData.role === "staff") {
               // Allow
            } else {
               await auth.signOut();
               throw new Error("선택하신 로그인 유형(학부모/기관)과 계정 권한이 일치하지 않습니다.");
            }
         }
         if (userData.role === "admin" || userData.role === "staff") {
           router.push("/dashboard/admin");
         } else {
           router.push(`/p/${userData.institutionId || "children-gate-church-01"}`);
         }
      } else {
         // Auto-create user doc via Google Login
         await setDoc(userDocRef, {
           name: userCredential.user.displayName || "Google User",
           email: userCredential.user.email,
           role: expectedRole,
           institutionId: "children-gate-church-01",
           createdAt: new Date(),
         });
         
         if (expectedRole === "admin") {
           // Create institution doc if they chose institution
           await setDoc(doc(db, "institutions", userCredential.user.uid), {
             name: "New Institution (Google)",
             adminId: userCredential.user.uid,
             createdAt: new Date(),
           });
           router.push("/dashboard/admin");
         } else {
           router.push("/p/children-gate-church-01");
         }
      }
    } catch (err: unknown) {
      console.error("Google Login error:", err);
      const errorMessage = err instanceof Error ? err.message : t.auth.errorLogin;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative">
      <div className="absolute top-6 right-6">
        <button 
          onClick={() => setLanguage(language === "ko" ? "en" : "ko")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border bg-white border-black/10 text-xs font-bold hover:bg-black/5 transition-all text-black shadow-sm"
        >
          <Globe size={14} className="text-primary" />
          {language === "ko" ? "EN" : "KO"}
        </button>
      </div>
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] p-10 md:p-12 shadow-2xl shadow-black/5 border border-black/5"
        >
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-white overflow-hidden rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-black/5 border border-black/5">
              <img src="/children_gate_logo.png" alt="Children Gate Logo" className="w-full h-full object-contain p-2" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-black mb-3">{t.auth.loginTitle}</h1>
            <p className="text-black/60 font-medium">{t.auth.loginSubtitle}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="flex p-1 bg-gray-100 rounded-2xl mb-8">
              <button
                type="button"
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${userType === "parent" ? "bg-white text-primary shadow-sm" : "text-black/50 hover:text-black"}`}
                onClick={() => setUserType("parent")}
              >
                {t.auth.tabParent}
              </button>
              <button
                type="button"
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${userType === "institution" ? "bg-white text-primary shadow-sm" : "text-black/50 hover:text-black"}`}
                onClick={() => setUserType("institution")}
              >
                {t.auth.tabInstitution}
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-black ml-1 flex items-center gap-2">
                <Mail size={14} className="text-primary" /> {t.auth.email}
              </label>
              <input
                type="email"
                required
                placeholder="admin@institution.com"
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none ring-2 ring-black/5 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-black/20 text-black font-medium"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-black ml-1 flex items-center gap-2">
                  <Lock size={14} className="text-primary" /> {t.auth.password}
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none ring-2 ring-black/5 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-black/20 text-black font-medium"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-primary bg-slate-50 border-black/10 rounded focus:ring-primary focus:ring-2 accent-primary cursor-pointer"
                  />
                  <label htmlFor="rememberMe" className="text-sm font-bold text-black/60 cursor-pointer select-none">
                    {t.auth.rememberMe || "자동 로그인 (스마트폰 기억하기)"}
                  </label>
                </div>
                <button 
                  type="button"
                  onClick={() => {
                    setShowReset(true);
                    setResetEmail(formData.email);
                    setError("");
                  }}
                  className="text-sm font-bold text-primary hover:underline underline-offset-4"
                >
                  {t.auth.forgotPassword}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-error text-sm font-bold text-center bg-error/10 py-3 rounded-xl">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-5 rounded-2xl text-lg font-bold hover:bg-black/90 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2 mt-4"
            >
              {loading ? t.auth.loggingIn : (
                <>
                  {t.common.login} <ArrowRight size={20} />
                </>
              )}
            </button>

            <div className="relative flex items-center py-2">
              <div className="grow border-t border-black/10"></div>
              <span className="shrink-0 px-4 text-black/30 text-xs font-bold uppercase tracking-widest">OR</span>
              <div className="grow border-t border-black/10"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-white border border-black/10 text-black py-4 rounded-2xl text-base font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-3 shadow-sm"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              {t.auth.googleLogin || "Google 계정으로 계속하기"}
            </button>

            <p className="text-center text-black/50 text-sm font-medium mt-8">
              {t.auth.noAccount}{" "}
              <Link href="/signup" className="text-primary font-bold hover:underline underline-offset-4">
                {t.common.signup}
              </Link>
            </p>
          </form>
        </motion.div>

        <div className="mt-12 flex flex-col items-center gap-4">
          <div className="flex items-center gap-6 text-[10px] font-black text-black/60 uppercase tracking-widest">
            <Link href="/privacy" className="hover:text-primary transition-colors">{t.common.privacy}</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">{t.common.terms}</Link>
            <a href="mailto:onchurchtx@gmail.com" className="hover:text-primary transition-colors">{t.common.contact}</a>
          </div>
          <p className="text-center text-black/40 text-[10px] font-bold tracking-tight">
            &copy; 2026 Children Gate. All Rights Reserved.
          </p>
        </div>
      </div>

      {/* Password Reset Modal */}
      {showReset && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-sm rounded-[44px] p-8 md:p-10 shadow-2xl relative border border-black/5"
          >
            <button 
              onClick={() => {
                setShowReset(false);
                setResetSent(false);
                setError("");
              }}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-black/40 hover:bg-gray-100 transition-all"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Lock size={32} />
              </div>
              <h2 className="text-2xl font-black text-black mb-2">{t.auth.resetPasswordTitle}</h2>
              <p className="text-sm font-bold text-black/50 leading-relaxed">
                {resetSent ? t.auth.resetLinkSent : t.auth.resetPasswordSubtitle}
              </p>
            </div>

            {!resetSent ? (
               <form onSubmit={handleResetPassword} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-black ml-1 flex items-center gap-2">
                      <Mail size={14} className="text-primary" /> {t.auth.email}
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="admin@institution.com"
                      className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none ring-2 ring-black/5 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-black/20 text-black font-bold"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                    />
                  </div>
                  
                  {error && (
                    <p className="text-error text-xs font-bold text-center bg-error/5 py-3 rounded-xl">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-5 rounded-2xl text-base font-black hover:bg-black/90 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2"
                  >
                    {loading ? t.auth.creating : t.auth.sendResetLink}
                  </button>
               </form>
            ) : (
              <div className="space-y-6 text-center">
                <div className="flex justify-center">
                   <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center">
                      <CheckCircle2 size={32} />
                   </div>
                </div>
                <button
                  onClick={() => setShowReset(false)}
                  className="w-full bg-black text-white py-5 rounded-2xl text-base font-black hover:bg-black/90 transition-all shadow-xl shadow-black/10"
                >
                  {t.auth.backToLogin}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
