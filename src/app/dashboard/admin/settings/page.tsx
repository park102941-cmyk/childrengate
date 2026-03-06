"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { Building2, Mail, Phone, BellRing, MessageSquare, ShieldCheck, Check, Printer, CheckCircle2, Plus, Key, AlertCircle, Copy } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, updateDoc, writeBatch, getDoc, type Firestore } from "firebase/firestore";

export default function SettingsPage() {
  const { t } = useLanguage();
  const { institutionId, user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [newInstCode, setNewInstCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [isChangingCode, setIsChangingCode] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  
  const [settings, setSettings] = useState({
    name: "칠드런 게이트 어린이집",
    email: "admin@kidsgate.io",
    phone: "02-1234-5678",
    pushAlerts: true,
    smsAlerts: false,
    twoFactor: true,
    labelIncludesName: true,
    labelIncludesClass: true,
    labelIncludesPhone: false,
    printerDPI: "203",
    labelSize: "4x6"
  });

  // Fetch institution data
  useEffect(() => {
    if (institutionId && db) {
      const fetchInst = async () => {
        try {
          const firestore = db as Firestore;
          // Try by institutionId field first
          const q = query(collection(firestore, "institutions"), where("institutionId", "==", institutionId));
          let snap = await getDocs(q);
          
          if (snap.empty) {
            // Try by document ID
            const instDoc = await getDoc(doc(firestore, "institutions", institutionId));
            if (instDoc.exists()) {
              const data = instDoc.data();
              setSettings(prev => ({
                ...prev,
                name: data.name || prev.name,
                email: data.email || prev.email,
                phone: data.phone || prev.phone,
              }));
            }
          } else {
            const data = snap.docs[0].data();
            setSettings(prev => ({
              ...prev,
              name: data.name || prev.name,
              email: data.email || prev.email,
              phone: data.phone || prev.phone,
            }));
          }
        } catch (error) {
          console.error("Error fetching institution settings:", error);
        }
      };
      fetchInst();
    }
  }, [institutionId]);

  const handleCopyCode = () => {
    if (institutionId) {
      navigator.clipboard.writeText(institutionId);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  const handleChangeInstitutionCode = async () => {
    if (!newInstCode.trim()) {
      setCodeError("새 기관 코드를 입력해 주세요.");
      return;
    }
    
    if (newInstCode.trim() === institutionId) {
      setCodeError("현재 코드와 동일합니다.");
      return;
    }

    if (!confirm(`기관 코드를 "${newInstCode.trim()}"으로 변경하시겠습니까?\n\n⚠️ 주의: 기존 QR 코드와 초대 링크가 무효화됩니다. 학부모님들에게 새 QR 코드를 다시 안내해야 합니다.`)) {
      return;
    }

    setIsChangingCode(true);
    setCodeError("");
    
    try {
      if (!db || !user) throw new Error("Firebase not initialized");
      const firestore = db as Firestore;

      const newCode = newInstCode.trim().toUpperCase();

      // 1. Check if new code already exists
      const existingQ = query(collection(firestore, "institutions"), where("institutionId", "==", newCode));
      const existingSnap = await getDocs(existingQ);
      
      // Also check document ID
      try {
        const existingDoc = await getDoc(doc(firestore, "institutions", newCode));
        if (existingDoc.exists() || !existingSnap.empty) {
          setCodeError("이미 사용 중인 기관 코드입니다. 다른 코드를 입력해 주세요.");
          setIsChangingCode(false);
          return;
        }
      } catch {}

      // 2. Get current institution doc
      const oldQ = query(collection(firestore, "institutions"), where("institutionId", "==", institutionId));
      let oldSnap = await getDocs(oldQ);
      let oldDocId = "";
      let oldData: any = {};

      if (!oldSnap.empty) {
        oldDocId = oldSnap.docs[0].id;
        oldData = oldSnap.docs[0].data();
      } else {
        // Try document ID approach
        const oldDoc = await getDoc(doc(firestore, "institutions", institutionId!));
        if (oldDoc.exists()) {
          oldDocId = institutionId!;
          oldData = oldDoc.data();
        }
      }

      if (!oldDocId) {
        setCodeError("현재 기관 정보를 찾을 수 없습니다.");
        setIsChangingCode(false);
        return;
      }

      const batch = writeBatch(firestore);

      // 3. Create new institution doc with the new code
      const newInstRef = doc(firestore, "institutions", newCode);
      batch.set(newInstRef, {
        ...oldData,
        institutionId: newCode,
        previousCode: institutionId,
        codeChangedAt: new Date(),
      });

      // 4. Update admin user's institutionId
      const userDocRef = doc(firestore, "users", user.uid);
      batch.update(userDocRef, { institutionId: newCode });

      // 5. Update all parent users with old institutionId
      const parentQ = query(collection(firestore, "users"), where("institutionId", "==", institutionId));
      const parentSnap = await getDocs(parentQ);
      parentSnap.docs.forEach(parentDoc => {
        if (parentDoc.id !== user.uid) {
          batch.update(doc(firestore, "users", parentDoc.id), { institutionId: newCode });
        }
      });

      // 6. Delete old institution doc (optional - could keep as redirect)
      batch.delete(doc(firestore, "institutions", oldDocId));

      await batch.commit();

      alert(`✅ 기관 코드가 "${newCode}"으로 변경되었습니다!\n\n새로운 QR 코드를 생성하여 학부모님들께 안내해 주세요.\n\n페이지를 새로고침합니다.`);
      window.location.reload();
    } catch (error: any) {
      console.error("Error changing institution code:", error);
      setCodeError(`코드 변경 중 오류: ${error.message}`);
    } finally {
      setIsChangingCode(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (db && institutionId) {
        const firestore = db as Firestore;
        // Try to find the institution doc
        const q = query(collection(firestore, "institutions"), where("institutionId", "==", institutionId));
        const snap = await getDocs(q);
        
        if (!snap.empty) {
          await updateDoc(doc(firestore, "institutions", snap.docs[0].id), {
            name: settings.name,
            email: settings.email,
            phone: settings.phone,
          });
        } else {
          // Try document ID
          try {
            await updateDoc(doc(firestore, "institutions", institutionId), {
              name: settings.name,
              email: settings.email,
              phone: settings.phone,
            });
          } catch {}
        }
      }
    } catch (error) {
      console.error("Error saving settings:", error);
    }
    
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 500);
  };

  return (
    <main className="flex-1 lg:ml-64 p-6 md:p-10 lg:p-14">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-black mb-1">
            {t.dashboard.settings?.title || "기관 설정"}
          </h1>
          <p className="text-black/50 font-semibold">
            {t.dashboard.settings?.subtitle || "칠드런 게이트 시스템의 전반적인 환경을 설정합니다."}
          </p>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="apple-button-primary flex items-center gap-2 shadow-xl shadow-primary/30 min-w-[140px] justify-center"
        >
          {isSaving ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          ) : showSuccess ? (
            <><Check size={18} /> {t.dashboard.settings?.saved || "저장되었습니다."}</>
          ) : (
            t.dashboard.settings?.save || "변경사항 저장"
          )}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Left Column */}
        <div className="space-y-10">
          
          {/* Institution Code Management */}
          <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[40px] shadow-2xl shadow-primary/10 p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full"></div>
            <h3 className="font-black text-xl mb-8 flex items-center gap-3 border-b border-white/10 pb-4 relative z-10">
               <Key className="text-primary" />
               기관 코드 관리
            </h3>
            
            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/10">
                <div>
                  <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">현재 기관 코드</p>
                  <code className="text-primary font-black text-3xl tracking-tight">
                    {institutionId || "KG-XXXXXX"}
                  </code>
                </div>
                <button 
                  onClick={handleCopyCode}
                  className={`p-4 rounded-2xl transition-all ${codeCopied ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
                >
                  {codeCopied ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>

              <p className="text-xs font-bold text-white/40 leading-relaxed">
                이 코드는 QR 코드 및 초대 링크에 사용됩니다. 학부모들이 이 코드를 입력하여 기관에 연결합니다.
              </p>

              {!showCodeEditor ? (
                <button
                  onClick={() => { setShowCodeEditor(true); setNewInstCode(""); setCodeError(""); }}
                  className="w-full py-4 border-2 border-dashed border-white/20 rounded-2xl text-white/40 font-black text-sm hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
                >
                  <Key size={16} /> 기관 코드 변경하기
                </button>
              ) : (
                <div className="space-y-4 p-6 bg-white/5 rounded-2xl border border-white/10">
                  <div className="flex items-start gap-2 p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                    <AlertCircle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-xs font-bold text-amber-300/80 leading-relaxed">
                      코드 변경 시 기존 QR 코드와 초대 링크가 무효화됩니다. 신중하게 진행해 주세요.
                    </p>
                  </div>
                  <input
                    type="text"
                    placeholder="새 기관 코드 입력 (예: KG-MYCODE)"
                    value={newInstCode}
                    onChange={(e) => { setNewInstCode(e.target.value.toUpperCase()); setCodeError(""); }}
                    className="w-full px-5 py-4 bg-white/10 border border-white/10 rounded-2xl outline-none font-bold text-white placeholder:text-white/20 focus:border-primary transition-all"
                  />
                  {codeError && (
                    <p className="text-xs font-bold text-red-400 flex items-center gap-1">
                      <AlertCircle size={12} /> {codeError}
                    </p>
                  )}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowCodeEditor(false)}
                      className="flex-1 py-3 bg-white/10 rounded-xl font-bold text-sm text-white/60 hover:bg-white/20 transition-all"
                    >
                      취소
                    </button>
                    <button
                      onClick={handleChangeInstitutionCode}
                      disabled={isChangingCode}
                      className="flex-[2] py-3 bg-primary rounded-xl font-bold text-sm text-white shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                    >
                      {isChangingCode ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      ) : (
                        <>
                          <Check size={16} /> 코드 변경 확인
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* General Information */}
          <section className="bg-white rounded-[40px] border border-black/5 shadow-sm p-10">
            <h3 className="font-black text-xl mb-8 flex items-center gap-3 border-b border-black/5 pb-4">
               <Building2 className="text-primary" />
               {t.dashboard.settings?.general || "기본 정보"}
            </h3>
            
            <div className="space-y-6">
               <div>
                  <label className="block text-sm font-bold text-black/60 mb-2">
                     {t.dashboard.settings?.institutionName || "기관 이름"}
                  </label>
                  <div className="relative">
                     <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" />
                     <input 
                        type="text" 
                        value={settings.name}
                        onChange={e => setSettings({...settings, name: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-black/5 rounded-2xl focus:ring-2 focus:ring-primary outline-none font-bold text-black transition-all"
                     />
                  </div>
               </div>
               
               <div>
                  <label className="block text-sm font-bold text-black/60 mb-2">
                     {t.dashboard.settings?.contactEmail || "대표 이메일"}
                  </label>
                  <div className="relative">
                     <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" />
                     <input 
                        type="email" 
                        value={settings.email}
                        onChange={e => setSettings({...settings, email: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-black/5 rounded-2xl focus:ring-2 focus:ring-primary outline-none font-bold text-black transition-all"
                     />
                  </div>
               </div>

               <div>
                  <label className="block text-sm font-bold text-black/60 mb-2">
                     {t.dashboard.settings?.phone || "연락처"}
                  </label>
                  <div className="relative">
                     <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" />
                     <input 
                        type="tel" 
                        value={settings.phone}
                        onChange={e => setSettings({...settings, phone: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-black/5 rounded-2xl focus:ring-2 focus:ring-primary outline-none font-bold text-black transition-all"
                     />
                  </div>
               </div>
            </div>
          </section>

          {/* Printer & Label Settings */}
          <section className="bg-white rounded-[40px] border border-black/5 shadow-sm p-10">
            <h3 className="font-black text-xl mb-8 flex items-center gap-3 border-b border-black/5 pb-4">
               <Printer className="text-primary" />
               라벨 및 프린터 설정
            </h3>
            
            <div className="space-y-6">
               <div>
                  <label className="block text-sm font-bold text-black/60 mb-4">라벨 포함 항목</label>
                  <div className="grid grid-cols-1 gap-3">
                     <LabelCheckItem 
                       label="아이 이름" 
                       active={settings.labelIncludesName} 
                       onClick={() => setSettings({...settings, labelIncludesName: !settings.labelIncludesName})} 
                     />
                     <LabelCheckItem 
                       label="소속 반 (학년)" 
                       active={settings.labelIncludesClass} 
                       onClick={() => setSettings({...settings, labelIncludesClass: !settings.labelIncludesClass})} 
                     />
                     <LabelCheckItem 
                       label="보호자 연락처" 
                       active={settings.labelIncludesPhone} 
                       onClick={() => setSettings({...settings, labelIncludesPhone: !settings.labelIncludesPhone})} 
                     />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4 pt-4">
                  <div>
                     <label className="block text-sm font-bold text-black/60 mb-2">프린트 해상도</label>
                     <select 
                       value={settings.printerDPI} 
                       onChange={e => setSettings({...settings, printerDPI: e.target.value})}
                       className="w-full px-4 py-3 bg-gray-50 border border-black/5 rounded-2xl outline-none font-bold text-black"
                     >
                        <option value="203">203 DPI</option>
                        <option value="300">300 DPI</option>
                     </select>
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-black/60 mb-2">용지 규격</label>
                     <select 
                       value={settings.labelSize} 
                       onChange={e => setSettings({...settings, labelSize: e.target.value})}
                       className="w-full px-4 py-3 bg-gray-50 border border-black/5 rounded-2xl outline-none font-bold text-black"
                     >
                        <option value="4x6">4 x 6 인치</option>
                        <option value="2x1">2 x 1 인치</option>
                     </select>
                  </div>
               </div>
            </div>
          </section>

        </div>

        {/* Right Column */}
        <div className="space-y-10">
           
           {/* Notifications */}
          <section className="bg-white rounded-[40px] border border-black/5 shadow-sm p-10">
            <h3 className="font-black text-xl mb-8 flex items-center gap-3 border-b border-black/5 pb-4">
               <BellRing className="text-primary" />
               {t.dashboard.settings?.notifications || "알림 설정"}
            </h3>
            
            <div className="space-y-6">
               <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-black/5">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <BellRing size={20} className="text-primary" />
                     </div>
                     <div>
                        <p className="font-bold text-black">{t.dashboard.settings?.pushAlerts || "앱 푸시 알림"}</p>
                        <p className="text-xs text-black/50 font-medium">선생님과 학부모 기기로 즉시 전송</p>
                     </div>
                  </div>
                  <Toggle active={settings.pushAlerts} onClick={() => setSettings({...settings, pushAlerts: !settings.pushAlerts})} />
               </div>

               <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-black/5">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                        <MessageSquare size={20} className="text-blue-500" />
                     </div>
                     <div>
                        <p className="font-bold text-black">{t.dashboard.settings?.smsAlerts || "SMS 알림 (크레딧 필요)"}</p>
                        <p className="text-xs text-black/50 font-medium">앱 미설치 학부모를 위한 임시 문자</p>
                     </div>
                  </div>
                  <Toggle active={settings.smsAlerts} onClick={() => setSettings({...settings, smsAlerts: !settings.smsAlerts})} />
               </div>
            </div>
          </section>

          {/* Security */}
          <section className="bg-slate-900 text-white rounded-[40px] shadow-2xl shadow-primary/10 p-10">
            <h3 className="font-black text-xl mb-8 flex items-center gap-3 border-b border-white/10 pb-4">
               <ShieldCheck className="text-primary" />
               {t.dashboard.settings?.security || "보안"}
            </h3>
            
            <div className="space-y-6">
               <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                        <ShieldCheck size={20} className="text-emerald-400" />
                     </div>
                     <div>
                        <p className="font-bold">{t.dashboard.settings?.twoFactor || "선생님용 2단계 인증"}</p>
                        <p className="text-xs text-white/50 font-medium">새 기기 로그인 시 이메일 코드로 승인</p>
                     </div>
                  </div>
                  <Toggle active={settings.twoFactor} onClick={() => setSettings({...settings, twoFactor: !settings.twoFactor})} />
               </div>
            </div>
          </section>

          {/* Staff Management */}
          <section className="bg-white rounded-[40px] border border-black/5 shadow-sm p-10">
            <h3 className="font-black text-xl mb-8 flex items-center gap-3 border-b border-black/5 pb-4">
               <ShieldCheck className="text-primary" />
               교직원 계정 관리
            </h3>
            
            <p className="text-sm font-bold text-black/40 mb-6">기관 관리자 외에 추가로 로그인할 수 있는 스태프 아이디를 생성합니다.</p>
            
            <div className="space-y-4 mb-8">
               <div className="p-4 bg-gray-50 rounded-2xl border border-black/5 flex items-center justify-between">
                  <div>
                     <p className="font-bold text-black text-sm">staff_joy_01</p>
                     <p className="text-[10px] font-bold text-black/30">기쁨반 선생님 · 마지막 접속: 2시간 전</p>
                  </div>
                  <button className="text-xs font-black text-red-500 hover:underline">삭제</button>
               </div>
               <div className="p-4 bg-gray-50 rounded-2xl border border-black/5 flex items-center justify-between">
                  <div>
                     <p className="font-bold text-black text-sm">admin_sub_kris</p>
                     <p className="text-[10px] font-bold text-black/30">부원장님 · 마지막 접속: 어제</p>
                  </div>
                  <button className="text-xs font-black text-red-500 hover:underline">삭제</button>
               </div>
            </div>

            <button className="w-full py-4 border-2 border-dashed border-black/10 rounded-2xl text-black/40 font-black text-sm hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2">
               <Plus size={18} /> 추가 로그인 아이디 생성
            </button>
          </section>

        </div>

      </div>
    </main>
  );
}
 
function LabelCheckItem({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
   return (
      <button 
         onClick={onClick}
         className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${active ? 'bg-primary/5 border-primary/20 text-primary' : 'bg-gray-50 border-black/5 text-black/40'}`}
      >
         <span className="font-bold">{label}</span>
         {active ? <CheckCircle2 size={18} /> : <div className="w-4.5 h-4.5 rounded-full border-2 border-black/10"></div>}
      </button>
   );
}
 
function Toggle({ active, onClick }: { active: boolean; onClick: () => void }) {
   return (
      <button 
         onClick={onClick}
         className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${active ? 'bg-primary' : 'bg-gray-300'}`}
      >
         <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 shadow-sm ${active ? 'transform translate-x-6' : ''}`}></span>
      </button>
   );
}
