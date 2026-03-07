"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, User, Building2, ArrowRight, Phone, Baby, Globe, MapPin, Users } from "lucide-react";
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
    contact: "",
    // Additional Onboarding Fields
    instType: "어린이집",
    studentCount: "1-50명",
    address: "",
    childClass: "",
    childGrade: "E1",
    relationship: "부 (아버지)",
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

    const checkRedirect = async () => {
      if (!auth || !db) return;
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          const savedType = localStorage.getItem("kg_signup_type") as "parent" | "institution";
          if (savedType) {
            setUserType(savedType);
            handleUserPostSignup(result.user, savedType);
          } else {
            handleUserPostSignup(result.user, userType);
          }
        }
      } catch (err: any) {
        console.error("Signup redirect result error:", err);
        setError(err.message);
      }
    };
    checkRedirect();
  }, [searchParams]);

  const handleUserPostSignup = async (user: any, preferredType?: "parent" | "institution") => {
    try {
      if (!db) return;
      const currentType = preferredType || userType;
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
         const userData = userDocSnap.data();
         if (userData.role === "admin" || userData.role === "staff") {
           router.push("/dashboard/admin");
         } else {
           router.push(`/p-portal?id=${userData.institutionId}`);
         }
         return;
      }

      if (currentType === "institution") {
        const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
        const institutionId = `KG-${randomStr}`;
        
        await setDoc(doc(db, "institutions", institutionId), {
          name: formData.institutionName || "New Institution (Google)",
          type: formData.instType,
          studentCount: formData.studentCount,
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
          institutionId: formData.instCode,
          phone: formData.contact || "",
          relationship: formData.relationship,
          createdAt: new Date(),
        });
        router.push(`/p-portal?id=${formData.instCode}`);
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };



  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const getKoreanErrorMessage = (code: string): string => {
    const errorMap: Record<string, string> = {
      "auth/email-already-in-use": "이미 사용 중인 이메일입니다. 로그인을 시도해 주세요.",
      "auth/invalid-email": "유효하지 않은 이메일 형식입니다.",
      "auth/weak-password": "비밀번호는 6자리 이상이어야 합니다.",
      "auth/network-request-failed": "네트워크 오류가 발생했습니다. 인터넷 연결을 확인해 주세요.",
      "auth/invalid-api-key": "Firebase 설정 오류입니다. 관리자에게 문의하세요.",
      "auth/too-many-requests": "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.",
      "auth/operation-not-allowed": "이메일/비밀번호 가입이 비활성화되어 있습니다. 관리자에게 문의하세요.",
      "permission-denied": "데이터 저장 권한이 없습니다. 관리자에게 문의하세요.",
    };
    return errorMap[code] || `오류가 발생했습니다: ${code}`;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Client-side validation
    if (!formData.name.trim()) { setError("이름을 입력해 주세요."); setLoading(false); return; }
    if (!formData.email.trim()) { setError("이메일을 입력해 주세요."); setLoading(false); return; }
    if (formData.password.length < 6) { setError("비밀번호는 6자리 이상이어야 합니다."); setLoading(false); return; }
    if (userType === "institution" && !formData.institutionName.trim()) { setError("기관 이름을 입력해 주세요."); setLoading(false); return; }
    if (userType === "parent" && !formData.instCode.trim()) { setError("기관 코드를 입력해 주세요. (원에서 받은 KG-XXXXXX 코드)"); setLoading(false); return; }

    try {
      if (!auth || !db) {
        throw new Error("Firebase가 초기화되지 않았습니다. 페이지를 새로고침 해주세요.");
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
        // More robust Institution ID generation (e.g., KG-A1B2C3)
        const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
        const institutionId = `KG-${randomStr}`;

        await setDoc(doc(db, "institutions", institutionId), {
          name: formData.institutionName,
          type: formData.instType,
          studentCount: formData.studentCount,
          address: formData.address,
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
          institutionId: formData.instCode.trim(),
          phone: formData.contact,
          childGrade: formData.childGrade,
          childClass: formData.childClass,
          relationship: formData.relationship,
          createdAt: new Date(),
        });

        router.push(`/p-portal?id=${formData.instCode.trim()}`);
      }
    } catch (err: unknown) {
      console.error("Signup error:", err);
      if (err && typeof err === "object" && "code" in err) {
        setError(getKoreanErrorMessage((err as { code: string }).code));
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("알 수 없는 오류가 발생했습니다. 다시 시도해 주세요.");
      }
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
      
      // Save userType to survive potential redirections (though we use popup now)
      localStorage.setItem("kg_signup_type", userType);
      
      try {
        const result = await signInWithPopup(auth, provider);
        handleUserPostSignup(result.user, userType);
      } catch (popupErr: any) {
        console.warn("Popup blocked or failed, trying redirect fallback...", popupErr);
        // Only fallback to redirect if popup is explicitly blocked or if we want to provide a fallback
        // However, redirect is what's failing for this user. 
        // Let's provide a clearer error if it fails instead of potentially broken redirect.
        if (popupErr.code === 'auth/popup-blocked') {
          setError("팝업이 차단되었습니다. 브라우저 설정에서 팝업을 허용해 주세요.");
          setLoading(false);
        } else {
          // If popup fails for other reasons, we CAN try redirect, but let's be cautious
          await signInWithRedirect(auth, provider);
        }
      }
    } catch (err: unknown) {
      console.error("Google Signup error:", err);
      const errorMessage = err instanceof Error ? err.message : (t.auth as any).errorSignup;
      setError(errorMessage);
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative">
      <div className="absolute top-6 right-6 z-10">
        <button 
          onClick={() => setLanguage(language === "ko" ? "en" : "ko")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border bg-white border-black/10 text-xs font-black hover:bg-black/5 transition-all text-black shadow-sm"
        >
          <Globe size={14} className="text-primary" />
          {language === "ko" ? "EN" : "KO"}
        </button>
      </div>
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl shadow-black/5 border border-black/5"
        >
          <div className="text-center mb-10">
            <div className="w-24 h-24 bg-white overflow-hidden rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-black/10 border border-black/5">
              <img src="/children_gate_logo.png" alt="Children Gate Logo" className="w-full h-full object-contain p-0.5" />
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

            <div className="space-y-6">
              {/* Common Fields */}
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
              </div>

              {/* Conditional Fields: Institution */}
              {userType === "institution" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-black ml-1 flex items-center gap-2">
                        <ArrowRight size={14} className="text-primary" /> {(t.auth as any).instType}
                      </label>
                      <select 
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none ring-2 ring-black/5 focus:ring-2 focus:ring-primary outline-none transition-all text-black font-medium appearance-none"
                        value={formData.instType}
                        onChange={(e) => setFormData({...formData, instType: e.target.value})}
                      >
                         <option>어린이집</option>
                         <option>유치원</option>
                         <option>초등학교</option>
                         <option>학원/대학교</option>
                         <option>교회/종교시설</option>
                         <option>기타 시설</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-black ml-1 flex items-center gap-2">
                        <Users size={14} className="text-primary" /> {(t.auth as any).studentCount}
                      </label>
                      <select 
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none ring-2 ring-black/5 focus:ring-2 focus:ring-primary outline-none transition-all text-black font-medium appearance-none"
                        value={formData.studentCount}
                        onChange={(e) => setFormData({...formData, studentCount: e.target.value})}
                      >
                         <option>1-50명</option>
                         <option>51-100명</option>
                         <option>101-500명</option>
                         <option>500명 이상</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-black ml-1 flex items-center gap-2">
                        <MapPin size={14} className="text-primary" /> {(t.auth as any).address}
                      </label>
                      <input
                        type="text"
                        placeholder="기관 소재지 (도시/동)"
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none ring-2 ring-black/5 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-black/20 text-black font-medium"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Conditional Fields: Parent */}
              {userType === "parent" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Column 1: Institution Code */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-black ml-1 flex items-center gap-2">
                        <Building2 size={14} className="text-primary" /> {t.auth.instCode}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="예: KG-A1B2C3"
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none ring-2 ring-black/5 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-black/20 text-black font-medium"
                        value={formData.instCode}
                        onChange={(e) => setFormData({ ...formData, instCode: e.target.value })}
                      />
                    </div>

                    {/* Column 2: Grade Selection */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-black ml-1 flex items-center gap-2">
                        <ArrowRight size={14} className="text-primary" /> 학년 선택
                      </label>
                      <select 
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none ring-2 ring-black/5 focus:ring-2 focus:ring-primary outline-none transition-all text-black font-medium appearance-none"
                        value={formData.childGrade}
                        onChange={(e) => setFormData({...formData, childGrade: e.target.value})}
                      >
                          <optgroup label="미취학/유치원 (Preschool/K)">
                             <option value="PK">미취학 (PK)</option>
                             <option value="K">유치원 (Kindergarten)</option>
                          </optgroup>
                          <optgroup label="초등학교 (Elementary)">
                             <option value="E1">초등 1학년 (E1)</option>
                             <option value="E2">초등 2학년 (E2)</option>
                             <option value="E3">초등 3학년 (E3)</option>
                             <option value="E4">초등 4학년 (E4)</option>
                             <option value="E5">초등 5학년 (E5)</option>
                          </optgroup>
                          <optgroup label="중학교 (Middle)">
                             <option value="M6">중등 1학년 (M6)</option>
                             <option value="M7">중등 2학년 (M7)</option>
                             <option value="M8">중등 3학년 (M8)</option>
                          </optgroup>
                          <optgroup label="고등학교 (High)">
                             <option value="H9">고등 1학년 (H9)</option>
                             <option value="H10">고등 2학년 (H10)</option>
                             <option value="H11">고등 3학년 (H11)</option>
                             <option value="H12">고등 4학년 (H12)</option>
                          </optgroup>
                          <optgroup label="기타">
                             <option value="ETC">기타</option>
                          </optgroup>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Row 2 Col 1: Class Name */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-black ml-1 flex items-center gap-2">
                        <Baby size={14} className="text-primary" /> 반 이름 (선택)
                      </label>
                      <input
                        type="text"
                        placeholder="예: 햇살반, 1반"
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none ring-2 ring-black/5 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-black/20 text-black font-medium"
                        value={formData.childClass}
                        onChange={(e) => setFormData({ ...formData, childClass: e.target.value })}
                      />
                    </div>

                    {/* Row 2 Col 2: Relationship */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-black ml-1 flex items-center gap-2">
                        <User size={14} className="text-primary" /> {t.auth.relationship}
                      </label>
                      <select 
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none ring-2 ring-black/5 focus:ring-2 focus:ring-primary outline-none transition-all text-black font-medium appearance-none"
                        value={formData.relationship}
                        onChange={(e) => setFormData({...formData, relationship: e.target.value})}
                      >
                         <option>부 (아버지)</option>
                         <option>모 (어머니)</option>
                         <option>조부모</option>
                         <option>고모/이모/삼촌</option>
                         <option>기타 보호자</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Login Credentials */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-black ml-1 flex items-center gap-2">
                    <Mail size={14} className="text-primary" /> {t.auth.email}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="example@email.com"
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
              className="w-full bg-black text-white py-5 rounded-3xl text-lg font-bold hover:bg-black/90 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2 mt-8"
            >
              {loading ? t.auth.creating : (
                <>
                  {t.auth.createAccount} <ArrowRight size={20} />
                </>
              )}
            </button>

            <div className="relative flex items-center py-4">
              <div className="grow border-t border-black/10"></div>
              <span className="shrink-0 px-4 text-black/30 text-xs font-bold uppercase tracking-widest">OR</span>
              <div className="grow border-t border-black/10"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={loading}
              className="w-full bg-white border border-black/10 text-black py-4 rounded-3xl text-base font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-3 shadow-sm"
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
