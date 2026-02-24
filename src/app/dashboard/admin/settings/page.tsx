"use client";
export const runtime = "edge";






import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Building2, Mail, Phone, BellRing, MessageSquare, ShieldCheck, Check, Printer, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const { t } = useLanguage();
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Mock settings state
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

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
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
