"use client";









import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, Mail, Lock, User, Building2, ArrowRight, Phone, Baby, Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SignupContent />
    </Suspense>
  );
}

function SignupContent() {
  const { t, language, setLanguage } = useLanguage();
  const searchParams = useSearchParams();
  const [userType, setUserType] = useState<"parent" | "institution">("parent");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    institutionName: "",
    instCode: "",
    contact: ""
  });

  useEffect(() => {
    const code = searchParams.get("code");
    const type = searchParams.get("type");
    if (code) {
      setFormData(prev => ({ ...prev, instCode: code }));
    }
    if (type === "institution") {
      setUserType("institution");
    }
  }, [searchParams]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!auth || !db) {
        throw new Error("Firebase is not initialized");
      }

      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // 2. Update profile with name
      await updateProfile(user, {
        displayName: formData.name,
      });

      // 3. Create role-specific doc in Firestore
      if (userType === "institution") {
        const institutionId = Math.random().toString(36).substring(2, 7).toUpperCase();
        await setDoc(doc(db, "institutions", institutionId), {
          name: formData.institutionName,
          adminId: user.uid,
          createdAt: new Date(),
        });

        await setDoc(doc(db, "users", user.uid), {
          name: formData.name,
          email: formData.email,
          role: "admin",
          institutionId: institutionId,
          createdAt: new Date(),
        });

        router.push("/dashboard/admin");
      } else {
        await setDoc(doc(db, "users", user.uid), {
          name: formData.name,
          email: formData.email,
          role: "parent",
          institutionId: formData.instCode || "children-gate-church-01",
          phone: formData.contact,
          createdAt: new Date(),
        });

        router.push(`/p/${formData.instCode || "children-gate-church-01"}`);
      }
    } catch (err: unknown) {
      console.error("Signup error:", err);
      const errorMessage = err instanceof Error ? err.message : t.auth.errorSignup;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError("");
    try {
      if (!auth || !db) throw new Error("Firebase is not initialized");

      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
         const userData = userDocSnap.data();
         if (userData.role === "admin") {
           router.push("/dashboard/admin");
         } else {
           router.push(`/p/${userData.institutionId || "children-gate-church-01"}`);
         }
         return;
      }

      if (userType === "institution") {
        const institutionId = Math.random().toString(36).substring(2, 7).toUpperCase();
        await setDoc(doc(db, "institutions", institutionId), {
          name: formData.institutionName || "New Institution (Google)",
          adminId: user.uid,
          createdAt: new Date(),
        });

        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName || "Google Admin",
          email: user.email,
          role: "admin",
          institutionId: institutionId,
          createdAt: new Date(),
        });
        router.push("/dashboard/admin");
      } else {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName || "Google Parent",
          email: user.email,
          role: "parent",
          institutionId: formData.instCode || "children-gate-church-01",
          phone: formData.contact || "",
          createdAt: new Date(),
        });
        router.push(`/p/${formData.instCode || "children-gate-church-01"}`);
      }
    } catch (err: unknown) {
      console.error("Google Signup error:", err);
      const errorMessage = err instanceof Error ? err.message : t.auth.errorSignup;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative">
      <div className="absolute top-6 right-6 z-10">
        <button 
          onClick={() => setLanguage(language === "ko" ? "en" : "ko")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border bg-white border-black/10 text-xs font-bold hover:bg-black/5 transition-all text-black shadow-sm"
        >
          <Globe size={14} className="text-primary" />
          {language === "ko" ? "EN" : "KO"}
        </button>
      </div>
      <div className="w-full max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] p-10 md:p-16 shadow-2xl shadow-black/5 border border-black/5"
        >
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-white overflow-hidden rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-black/5 border border-black/5">
              <img src="/children_gate_logo.png" alt="Children Gate Logo" className="w-full h-full object-contain p-2" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-black mb-3">{t.auth.signupTitle}</h1>
            <p className="text-black/60 font-medium">{t.auth.signupSubtitle}</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-black ml-1 flex items-center gap-2">
                  <User size={14} className="text-primary" /> {userType === "parent" ? t.auth.parentName : t.auth.name}
                </label>
                <input
                  type="text"
                  required
                  placeholder="예: 홍길동"
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none ring-2 ring-black/5 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-black/20 text-black font-medium"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              {userType === "institution" ? (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-black ml-1 flex items-center gap-2">
                    <Building2 size={14} className="text-primary" /> {t.auth.institution}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="예: 햇살 어린이집"
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none ring-2 ring-black/5 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-black/20 text-black font-medium"
                    value={formData.institutionName}
                    onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-black ml-1 flex items-center gap-2">
                    <Phone size={14} className="text-primary" /> {t.auth.contact}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="010-0000-0000"
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none ring-2 ring-black/5 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-black/20 text-black font-medium"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  />
                </div>
              )}
            </div>

            {userType === "parent" && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-black ml-1 flex items-center gap-2">
                  <Building2 size={14} className="text-primary" /> {t.auth.instCode}
                </label>
                <input
                  type="text"
                  required
                  placeholder="예: kids-gate-01"
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none ring-2 ring-black/5 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-black/20 text-black font-medium"
                  value={formData.instCode}
                  onChange={(e) => setFormData({ ...formData, instCode: e.target.value })}
                />
              </div>
            )}

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

            {error && (
              <p className="text-error text-sm font-bold text-center bg-error/10 py-3 rounded-xl">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-5 rounded-2xl text-lg font-bold hover:bg-black/90 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2 mt-8"
            >
              {loading ? t.auth.creating : (
                <>
                  {t.auth.createAccount} <ArrowRight size={20} />
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
              onClick={handleGoogleSignup}
              disabled={loading}
              className="w-full bg-white border border-black/10 text-black py-4 rounded-2xl text-base font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-3 shadow-sm"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              {t.auth.googleLogin || "Google 계정으로 계속하기"}
            </button>

            <p className="text-center text-black/50 text-sm font-medium mt-8">
              {t.auth.hasAccount}{" "}
              <Link href="/login" className="text-primary font-bold hover:underline underline-offset-4">
                {t.common.login}
              </Link>
            </p>

            <div className="mt-8 pt-8 border-t border-black/5 text-center">
              <p className="text-[10px] text-black/30 font-bold leading-relaxed">
                가입 시 Children Gate의 <Link href="/terms" className="underline hover:text-primary">{t.common.terms}</Link> 및 <Link href="/privacy" className="underline hover:text-primary">{t.common.privacy}</Link>에 동의하게 됩니다.
              </p>
            </div>
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
    </div>
  );
}
