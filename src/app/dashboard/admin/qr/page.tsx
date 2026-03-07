"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { Download, Copy, Settings, Users, Printer, ExternalLink, UserPlus, Check, Globe, Car, LogOut } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Barcode from "react-barcode";

export default function QRManagementPage() {
  const { t } = useLanguage();
  const { institutionId } = useAuth();
  const router = useRouter();
  const [instId, setInstId] = useState("KG-XXXXXX");
  const [qrValue, setQrValue] = useState("");
  const [signupQrValue, setSignupQrValue] = useState("");
  const [guestQrValue, setGuestQrValue] = useState("");
  const [smartQrValue, setSmartQrValue] = useState("");
  const [copiedType, setCopiedType] = useState<string | null>(null);

  useEffect(() => {
    if (institutionId) {
      setInstId(institutionId);
    }
  }, [institutionId]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      setQrValue(`${origin}/p-portal?id=${instId}`);
      setSignupQrValue(`${origin}/signup?code=${instId}`);
      setGuestQrValue(`${origin}/login?guest=true&instId=${instId}`);
      setSmartQrValue(`${origin}/gate/${instId}`);
    }
  }, [instId]);

  // Mock students
  const students = [
    { id: "S001", name: "김지우", class: "민들레반" },
    { id: "S002", name: "이준서", class: "해바라기반" },
    { id: "S003", name: "박서현", class: "장미반" }
  ];

  const handleCopy = (value: string, type: string) => {
    navigator.clipboard.writeText(value);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const downloadQR = (id: string, fileName: string) => {
    const svg = document.getElementById(id);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = 1000;
      canvas.height = 1000;
      ctx!.fillStyle = "white";
      ctx!.fillRect(0, 0, 1000, 1000);
      ctx?.drawImage(img, 0, 0, 1000, 1000);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = fileName;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handleLogout = async () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      const { auth } = await import("@/lib/firebase");
      await auth?.signOut();
      window.location.href = "/login";
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Student Names & Barcodes</title>
          <style>
            body { font-family: 'Inter', sans-serif; padding: 20px; }
            .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
            .card { border: 1px solid #eee; padding: 15px; border-radius: 10px; text-align: center; }
            .name { font-weight: bold; font-size: 16px; margin-bottom: 5px; }
            .class { font-size: 12px; color: #666; margin-bottom: 10px; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <h1 style="text-align: center;">[${instId}] 학생용 이름표 세트</h1>
          <div class="grid">
            ${students.map(s => `
              <div class="card">
                <div class="name">${s.name}</div>
                <div class="class">${s.class}</div>
                <div id="barcode-${s.id}"></div>
              </div>
            `).join('')}
          </div>
          <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.0/dist/JsBarcode.all.min.js"></script>
          <script>
            ${students.map(s => `JsBarcode("#barcode-${s.id}", "${s.id}", { width: 1.5, height: 40, fontSize: 12 });`).join('')}
            window.onload = () => window.print();
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <main className="p-6 md:p-10 lg:p-14 bg-slate-50 min-h-screen">
      <header className="mb-10 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-black mb-1">{t.dashboard.qr.title}</h1>
          <p className="text-black/50 font-semibold">{t.dashboard.qr.subtitle}</p>
        </div>
        <button 
          onClick={handleLogout}
          className="bg-red-50 text-red-500 px-6 py-2.5 rounded-2xl font-black flex items-center gap-2 hover:bg-red-100 transition-all border border-red-100"
        >
          로그아웃 <LogOut size={18} />
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
        {/* Primary: Unified Smart QR */}
        <section className="lg:col-span-2 bg-gradient-to-br from-indigo-50 to-white rounded-[40px] border border-indigo-100 shadow-2xl shadow-indigo-500/10 p-12 text-center relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
             
             <div className="relative z-10 flex flex-col items-center">
                <div className="flex items-center gap-2 px-4 py-1.5 bg-indigo-100 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                   <Globe size={14} />
                   Our Institution ID: {instId}
                </div>
                
                <h2 className="text-3xl font-black mb-4 text-black">통합 스마트 게이트 QR (강력 추천)</h2>
                <p className="text-slate-500 font-bold max-w-lg mb-10 leading-relaxed text-sm lg:text-base">
                   가입, 로그인, 게스트 입장 등 모든 기능을 하나의 QR로 통합했습니다.<br/>
                   원의 정문에 <span className="text-indigo-600">이 QR 하나만 부착해 두시면 가장 편리하게 운영</span>하실 수 있습니다.
                </p>

                <div className="flex flex-col lg:flex-row items-center gap-12 bg-white/50 p-8 lg:p-12 rounded-[50px] border border-white backdrop-blur-sm shadow-xl shadow-indigo-900/5">
                   {/* QR Code */}
                   <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-white p-12 rounded-[50px] shadow-2xl shadow-indigo-200 border-4 border-indigo-50 cursor-pointer group relative"
                      onClick={() => window.open(smartQrValue, '_blank')}
                   >
                      <QRCodeSVG 
                        id="smart-qr-code"
                        value={smartQrValue} 
                        size={300} 
                        level="H"
                        includeMargin={true}
                        fgColor="#4f46e5"
                        imageSettings={{
                            src: "/children_gate_logo.png", 
                            x: undefined,
                            y: undefined,
                            height: 60,
                            width: 60,
                            excavate: true,
                        }}
                      />
                      <div className="absolute inset-0 bg-indigo-600/90 opacity-0 group-hover:opacity-100 transition-opacity rounded-[46px] flex flex-col items-center justify-center text-white gap-4">
                         <ExternalLink size={40} />
                         <span className="font-black text-lg">스마트 게이트 미리보기</span>
                      </div>
                   </motion.div>

                   {/* Features and Actions */}
                   <div className="flex flex-col gap-6 text-left w-full lg:w-72">
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] px-1">Included Services</p>
                      <div className="space-y-4">
                         <FeatureItem icon={Users} label="기존 학부모 포털 접속" />
                         <FeatureItem icon={UserPlus} label="신규 학부모 가입 자동 연동" />
                         <FeatureItem icon={Car} label="게스트 간편 입장 지원" />
                         <FeatureItem icon={Globe} label="모든 기기/브라우저 최적화" />
                      </div>

                      <div className="pt-6 grid grid-cols-2 gap-3">
                         <button 
                           onClick={() => downloadQR("smart-qr-code", `KidsGate_SmartQR_${instId}.png`)}
                           className="bg-indigo-600 text-white py-4 rounded-2xl flex items-center justify-center gap-2 font-black shadow-xl shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all text-xs"
                         >
                           <Download size={16} /> 저장
                         </button>
                         <button 
                           onClick={() => handleCopy(smartQrValue, "smart")}
                           className="bg-white text-indigo-600 py-4 rounded-2xl flex items-center justify-center gap-2 font-black border border-indigo-100 shadow-sm hover:scale-105 active:scale-95 transition-all text-xs"
                         >
                           {copiedType === "smart" ? <Check size={16} /> : <Copy size={16} />}
                           {copiedType === "smart" ? "완료!" : "링크복사"}
                         </button>
                      </div>
                   </div>
                </div>
             </div>
        </section>

        {/* Specialized QRs: Portal, Signup, Guest */}
        <SpecializedQRCard 
          id="portal-qr-code"
          title="포털 전용 QR"
          description="가입된 학부모님용 즉시 접속"
          value={qrValue}
          onDownload={() => downloadQR("portal-qr-code", `KG_Portal_${instId}.png`)}
          onCopy={() => handleCopy(qrValue, "portal")}
          isCopied={copiedType === "portal"}
          color="bg-slate-50 text-slate-600 border-slate-100"
        />

        <SpecializedQRCard 
          id="signup-qr-code"
          title="가입 전용 QR"
          description="초기 가입 단계로 바로 이동"
          value={signupQrValue}
          onDownload={() => downloadQR("signup-qr-code", `KG_Signup_${instId}.png`)}
          onCopy={() => handleCopy(signupQrValue, "signup")}
          isCopied={copiedType === "signup"}
          color="bg-emerald-50 text-emerald-600 border-emerald-100"
        />

        <SpecializedQRCard 
          id="guest-qr-code"
          title="게스트 전용 QR"
          description="비회원 방문객용 임시 모달"
          value={guestQrValue}
          onDownload={() => downloadQR("guest-qr-code", `KG_Guest_${instId}.png`)}
          onCopy={() => handleCopy(guestQrValue, "guest")}
          isCopied={copiedType === "guest"}
          color="bg-amber-50 text-amber-600 border-amber-100"
        />

        {/* Individual Student Barcode Manager */}
        <section className="bg-slate-900 rounded-[40px] shadow-2xl shadow-primary/10 p-10 flex flex-col text-white lg:col-span-2">
            <h2 className="text-2xl font-black mb-2 flex items-center gap-3">
               <Users className="text-primary" />
               학생 개인 바코드(Barcode) 발급
            </h2>
            <p className="text-white/40 font-bold mb-8 text-sm">
               학생증이나 가방에 부착할 수 있는 전용 바코드입니다. 바코드 리더기로 즉시 인식 가능합니다.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-2 max-h-[500px] custom-scrollbar">
               {students.map((student) => {
                  return (
                     <div key={student.id} className="bg-white rounded-3xl p-5 flex items-center gap-6 group hover:translate-y-[-4px] transition-all border border-black/5 shadow-xl">
                        <div className="bg-white shrink-0">
                           <Barcode 
                             value={student.id} 
                             width={1} 
                             height={40} 
                             fontSize={10} 
                             margin={0}
                           />
                        </div>
                        <div className="flex-1">
                           <h3 className="font-bold text-lg text-black">{student.name}</h3>
                           <p className="text-black/40 text-xs font-black uppercase tracking-wider">{student.class}</p>
                        </div>
                        <button 
                           onClick={() => window.print()}
                           className="p-4 bg-primary/20 text-primary rounded-2xl hover:bg-primary hover:text-white transition-all"
                        >
                           <Printer size={18} />
                        </button>
                     </div>
                  );
               })}
            </div>

            <div className="mt-8 pt-8 border-t border-white/10">
               <button 
                onClick={handlePrint}
                className="w-full bg-primary py-5 rounded-3xl text-white font-black shadow-xl shadow-primary/20 flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-95 transition-all"
               >
                  <Printer size={20} />
                  전체 학생용 이름표(바코드 포함) 인쇄하기
               </button>
            </div>
        </section>
      </div>
    </main>
  );
}

function FeatureItem({ icon: Icon, label }: { icon: any, label: string }) {
   return (
      <div className="flex items-center gap-3">
         <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Icon size={12} />
         </div>
         <span className="text-xs font-bold text-black/60">{label}</span>
      </div>
   );
}

function SpecializedQRCard({ id, title, description, value, onDownload, onCopy, isCopied, color }: { 
  id: string, 
  title: string, 
  description: string, 
  value: string, 
  onDownload: () => void, 
  onCopy: () => void, 
  isCopied: boolean,
  color: string 
}) {
   return (
      <section className={`rounded-[40px] p-8 border ${color} flex flex-col items-center text-center shadow-sm`}>
         <h3 className="font-black text-lg mb-1">{title}</h3>
         <p className="text-[10px] font-bold opacity-60 uppercase mb-8">{description}</p>
         
         <div className="bg-white p-6 rounded-[32px] shadow-inner mb-8 border border-black/5">
            <QRCodeSVG id={id} value={value} size={150} level="M" />
         </div>

         <div className="flex gap-2 w-full mt-auto">
            <button 
              onClick={onDownload}
              className="flex-1 bg-white text-black py-4 rounded-2xl flex items-center justify-center gap-2 font-black border border-black/5 hover:bg-slate-50 transition-all text-xs"
            >
               <Download size={14} /> 
            </button>
            <button 
               onClick={onCopy}
               className="flex-1 bg-black text-white py-4 rounded-2xl flex items-center justify-center gap-2 font-black hover:opacity-80 transition-all text-xs"
            >
               {isCopied ? <Check size={14} /> : <Copy size={14} />}
               {isCopied ? "완료" : "복사"}
            </button>
         </div>
      </section>
   );
}
