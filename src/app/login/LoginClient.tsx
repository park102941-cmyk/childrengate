"use client";

import { useState, useEffect, useRef } from "react";
import { 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  setPersistence, 
  browserLocalPersistence, 
  browserSessionPersistence, 
  GoogleAuthProvider, 
  signInWithRedirect, 
  getRedirectResult, 
  sendPasswordResetEmail,
  User,
  signInWithPopup
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowRight, Globe, X, CheckCircle2, UserCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { t, language, setLanguage } = useLanguage();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [userType, setUserType] = useState<"parent" | "institution">("parent");

  // Sync tab with URL parameter on mount
  useEffect(() => {
    const typeParam = searchParams?.get("type");
    if (typeParam === "institution") setUserType("institution");
    else if (typeParam === "parent") setUserType("parent");
  }, [searchParams]);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const redirectStarted = useRef(false);

  // Cross-role routing logic
  const handleUserPostLogin = async (firebaseUser: User, preferredType?: "parent" | "institution") => {
    if (!firebaseUser || !db || redirectStarted.current) return;

    try {
      setLoading(true);
      redirectStarted.current = true;
      setError("");
      
      const userDocRef = doc(db, "users", firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
         const userData = userDoc.data();
         // Prioritize actual role
         if (userData.role === "admin" || userData.role === "staff" || userData.role === "teacher") {
             console.log("Redirecting to Admin Dashboard");
             window.location.href = "/dashboard/admin";
         } else {
             console.log("Redirecting to Parent Portal");
             // 1. Check URL for instId or id first (from QR code or manual link)
             const urlInstId = searchParams?.get("instId") || searchParams?.get("id");
             
             // 3. Smart Search: If no URL ID, check if user has students in ANY institution
             let finalInstId = urlInstId || userData.institutionId;
             
             if (!urlInstId && firebaseUser.email) {
                try {
                  const studentQ = query(collection(db, "students"), where("parentEmail", "==", firebaseUser.email));
                  const studentSnap = await getDocs(studentQ);
                  if (!studentSnap.empty) {
                    // Prioritize the institution where students are actually found
                    finalInstId = studentSnap.docs[0].data().institutionId;
                  }
                } catch (e) {
                  console.error("Error finding student records during login:", e);
                }
             }

             // 2. Fallback to userData.institutionId if none in URL
             const targetPortal = finalInstId 
                ? `/p-portal?id=${finalInstId}` 
                : "/p-portal";
                
             window.location.href = targetPortal;
         }
      } else {
          // New user (Google/New Email)
          const currentType = preferredType || userType;
          const roleToAssign = currentType === "institution" ? "admin" : "parent";
          await setDoc(userDocRef, { 
            name: firebaseUser.displayName || "User", 
            email: firebaseUser.email, 
            role: roleToAssign, 
            createdAt: serverTimestamp() 
          });
          
          const urlInstId = searchParams?.get("instId") || searchParams?.get("id");
          const target = roleToAssign === "admin" 
            ? "/dashboard/admin" 
            : (urlInstId ? `/p-portal?id=${urlInstId}` : "/p-portal");
            
          window.location.href = target;
      }
    } catch (err: any) {
      console.error("Redirection Failed:", err);
      setError(`로그인 처리 중 오류 발생: ${err.message}`);
      setLoading(false);
      redirectStarted.current = false;
    }
  };

  useEffect(() => {
    if (!auth) return;

    // 1. Handle Google Redirect Result
    const checkRedirect = async () => {
      if (!auth || redirectStarted.current) return;
      try {
        const result = await getRedirectResult(auth!);
        if (result?.user && !redirectStarted.current) {
          console.log("Google Redirect Result Success");
          const savedType = localStorage.getItem("kg_login_type") as "parent" | "institution" | null;
          await handleUserPostLogin(result.user, savedType || undefined).catch(e => {
            console.error("Post-login redirect failed:", e);
          });
        }
      } catch (err: any) {
        console.error("Redirect Result error details:", err);
        // Ignore "missing initial state" if we didn't just come from a redirect
        if (err.code === 'auth/missing-initial-state' || err.code === 'auth/internal-error') {
           console.log("Transient or state error ignored during mount check");
           return;
        }
        setError("로그인 결과 처리 중 오류가 발생했습니다. 다시 시도해 주세요.");
      }
    };
    
    // 2. Auth State Change (Auto-login)
    const unsubscribe = onAuthStateChanged(auth!, (firebaseUser) => {
      if (searchParams?.get("logout") === "true") return;

      if (firebaseUser && !loading && !redirectStarted.current) {
        const isAutoLoginEnabled = localStorage.getItem("kg_auto_login") === "true";
        if (isAutoLoginEnabled) {
          handleUserPostLogin(firebaseUser);
        }
      }
    });

    // Slight delay for redirect check
    const t = setTimeout(() => {
        checkRedirect();
    }, 500);

    return () => {
        clearTimeout(t);
        unsubscribe();
    };
  }, [loading, searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!auth) throw new Error("Auth not ready");
      const persistenceType = rememberMe ? browserLocalPersistence : browserSessionPersistence;
      await setPersistence(auth, persistenceType);

      if (rememberMe) localStorage.setItem("kg_auto_login", "true");
      else localStorage.removeItem("kg_auto_login");

      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      handleUserPostLogin(userCredential.user, userType);
    } catch (err: any) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      setLoading(false);
      redirectStarted.current = false;
    }
  };

  const handleGoogleLogin = async () => {
    try {
      if (!auth) return;
      setLoading(true);
      setError("");
      localStorage.setItem("kg_login_type", userType);
      
      const provider = new GoogleAuthProvider();
      // Ensure local persistence for better cross-tab/refresh stability
      if (auth) await setPersistence(auth, browserLocalPersistence);

      try {
        if (!auth) throw new Error("Auth instance is missing");
        const result = await signInWithPopup(auth, provider);
        handleUserPostLogin(result.user, userType);
      } catch (popupErr: any) {
        console.warn("Popup flow failed, trying fallback...", popupErr.code);
        
        if (popupErr.code === 'auth/popup-blocked') {
          setError("팝업이 차단되었습니다. 주소창의 팝업 차단해제 버튼을 누르거나 다시 시도해 주세요.");
          setLoading(false);
        } else if (popupErr.code === 'auth/cancelled-by-user') {
          setLoading(false);
        } else {
          // Fallback to redirect only for specific non-block errors or if needed
          setError("로그인 팝업을 열 수 없습니다. 브라우저 설정을 확인해 주세요.");
          setLoading(false);
          // Only attempt redirect if we really want to force it
          // await signInWithRedirect(auth, provider);
        }
      }
    } catch (err: any) {
      console.error("Google Login Error:", err);
      setError("구글 로그인 중 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!auth) return;
      await sendPasswordResetEmail(auth, resetEmail);
      setResetSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    const instId = searchParams?.get("instId");
    router.push(instId ? `/p-portal?guestId=guest&id=${instId}` : "/p-portal?guestId=guest");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative">
      {(loading || authLoading) && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-white/80 backdrop-blur-md font-black">
          잠시만 기다려 주세요...
        </div>
      )}
      
      <div className="w-full max-w-[480px] bg-white rounded-[48px] p-8 md:p-12 shadow-2xl border border-black/5">
        <div className="mb-10 text-center">
          <Link href="/" className="inline-block w-20 h-20 bg-white rounded-[24px] p-2 border border-black/[0.03] shadow-inner mb-6">
            <img src="/children_gate_logo.png" alt="Logo" className="w-full h-full object-contain" />
          </Link>
          <h1 className="text-3xl font-black text-black mb-2">{t.auth.loginTitle}</h1>
          <p className="text-black/40 font-bold">{t.auth.loginSubtitle}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-500 rounded-2xl flex items-center gap-3 border border-red-100">
            <X size={18} />
            <p className="text-xs font-bold leading-tight">{error}</p>
          </div>
        )}

        <div className="flex bg-slate-100 p-1.5 rounded-[24px] mb-8">
          <button onClick={() => setUserType("parent")} className={`flex-1 py-3.5 rounded-[20px] font-black transition-all ${userType === "parent" ? "bg-white text-black shadow-lg" : "text-black/30 hover:text-black/50"}`}>
            {t.auth.tabParent}
          </button>
          <button onClick={() => setUserType("institution")} className={`flex-1 py-3.5 rounded-[20px] font-black transition-all ${userType === "institution" ? "bg-white text-black shadow-lg" : "text-black/30 hover:text-black/50"}`}>
            {t.auth.tabInstitution}
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-black/20 group-focus-within:text-primary transition-colors" />
            </div>
            <input required type="email" placeholder={t.auth.email} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="block w-full pl-14 pr-5 py-5 bg-slate-50 border-transparent focus:bg-white focus:ring-4 focus:ring-primary/10 rounded-[24px] font-bold text-black border-2 transition-all outline-none" />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-black/20 group-focus-within:text-primary transition-colors" />
            </div>
            <input required type="password" placeholder={t.auth.password} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="block w-full pl-14 pr-5 py-5 bg-slate-50 border-transparent focus:bg-white focus:ring-4 focus:ring-primary/10 rounded-[24px] font-bold text-black border-2 transition-all outline-none" />
          </div>

          <div className="flex items-center justify-between px-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-5 h-5 rounded-lg border-2 border-black/10 text-primary focus:ring-primary" />
              <span className="text-sm font-bold text-black/40">{t.auth.rememberMe}</span>
            </label>
            <button type="button" onClick={() => setShowReset(true)} className="text-sm font-bold text-primary hover:underline">{t.auth.forgotPassword}</button>
          </div>

          <button type="submit" disabled={loading} className="w-full py-5 bg-black text-white font-black rounded-[24px] shadow-2xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 mt-4">
            {loading ? t.auth.loggingIn : t.common.login}
            <ArrowRight size={20} />
          </button>
        </form>

        <div className="mt-8 space-y-4">
          <button onClick={handleGoogleLogin} className="w-full py-5 bg-white border-2 border-slate-100 text-black font-black rounded-[24px] flex items-center justify-center gap-3 hover:bg-slate-50 transition-all">
            <img src="/google_icon.png" alt="Google" className="w-6 h-6" />
            {t.auth.googleLogin}
          </button>
          
          {userType === "parent" && (
            <button onClick={handleGuestLogin} className="w-full py-4 bg-slate-100 text-black/60 font-black rounded-[24px] flex items-center justify-center gap-3 hover:bg-slate-200 transition-all border-none">
              <UserCircle2 size={20} />
              {t.auth.guestContinue}
            </button>
          )}

          <p className="text-center text-black/30 font-bold mt-6">
            {t.auth.noAccount} <Link href="/signup" className="text-primary hover:underline">{t.auth.signupTitle}</Link>
          </p>
        </div>
      </div>

      <div className="fixed top-8 right-8 flex gap-2">
        <button onClick={() => setLanguage("ko")} className={`w-10 h-10 rounded-full flex items-center justify-center font-black transition-all ${language === "ko" ? "bg-black text-white shadow-xl" : "bg-white text-black/20 hover:text-black"}`}>KO</button>
        <button onClick={() => setLanguage("en")} className={`w-10 h-10 rounded-full flex items-center justify-center font-black transition-all ${language === "en" ? "bg-black text-white shadow-xl" : "bg-white text-black/20 hover:text-black"}`}>EN</button>
      </div>

      <AnimatePresence>
        {showReset && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-md rounded-[48px] p-10 relative shadow-2xl">
              <button onClick={() => { setShowReset(false); setResetSent(false); }} className="absolute top-8 right-8 text-black/20 hover:text-black"><X size={24} /></button>
              {resetSent ? (
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-[24px] flex items-center justify-center mx-auto"><CheckCircle2 size={40} /></div>
                  <h2 className="text-2xl font-black">이메일을 확인하세요</h2>
                  <p className="text-black/40 font-bold">비밀번호 재설정 링크가 전송되었습니다.</p>
                  <button onClick={() => setShowReset(false)} className="w-full py-5 bg-black text-white font-black rounded-[24px]">확인</button>
                </div>
              ) : (
                <div className="space-y-6">
                  <h2 className="text-2xl font-black">{t.auth.resetPasswordTitle}</h2>
                  <p className="text-black/40 font-bold">{t.auth.resetPasswordSubtitle}</p>
                  <input type="email" placeholder="email@example.com" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} className="w-full px-6 py-5 bg-slate-50 rounded-[24px] outline-none font-bold focus:bg-white border-2 border-transparent focus:border-black/5" />
                  <button onClick={handleResetPassword} className="w-full py-5 bg-primary text-white font-black rounded-[24px] shadow-xl">{t.auth.sendResetLink}</button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
