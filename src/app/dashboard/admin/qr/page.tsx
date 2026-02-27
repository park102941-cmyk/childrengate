"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { Download, Copy, Settings, Users, Printer, ExternalLink } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

export default function QRManagementPage() {
  const { t } = useLanguage();
  const { institutionId } = useAuth();
  const [instId, setInstId] = useState("gate-XXXX");
  const [qrValue, setQrValue] = useState("");

  useEffect(() => {
    if (institutionId) {
      setInstId(institutionId);
    }
  }, [institutionId]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      setQrValue(`${origin}/p/${instId}`);
    }
  }, [instId]);

  // Mock subset of students for student QR feature
  const students = [
    { id: "S001", name: "김지우", class: "민들레반" },
    { id: "S002", name: "이준서", class: "해바라기반" },
    { id: "S003", name: "박서현", class: "장미반" }
  ];

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

  return (
    <main className="flex-1 lg:ml-64 p-6 md:p-10 lg:p-14 bg-slate-50 min-h-screen">
      <header className="mb-10">
        <h1 className="text-4xl font-black tracking-tight text-black mb-1">{t.dashboard.qr.title}</h1>
        <p className="text-black/50 font-semibold">{t.dashboard.qr.subtitle}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Institution Master QR */}
        <section className="bg-white rounded-[40px] border border-black/5 shadow-2xl shadow-black/5 p-10 flex flex-col items-center justify-center text-center">
            <h2 className="text-xl font-bold mb-6 text-black flex items-center gap-2">
               기관 입구용 마스터 QR
            </h2>
            
            <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="bg-white p-10 rounded-[40px] inline-block mb-10 relative group border-4 border-primary/10 cursor-pointer shadow-inner"
               onClick={() => window.open(`/p/${instId}`, '_blank')}
            >
              <QRCodeSVG 
                id="main-qr-code"
                value={qrValue || `https://childrengate.com/p/${instId}`} 
                size={280} 
                level="H"
                includeMargin={true}
                imageSettings={{
                    src: "/children_gate_logo.png", 
                    x: undefined,
                    y: undefined,
                    height: 52,
                    width: 52,
                    excavate: true,
                }}
              />
              <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-[36px] flex flex-col items-center justify-center text-white gap-3 p-4">
                 <ExternalLink size={32} />
                 <span className="font-bold">학부모 페이지 미리보기</span>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-sm mb-10">
               <button 
                 onClick={() => downloadQR("main-qr-code", `KidsGate_QR_${instId}.png`)}
                 className="bg-primary text-white py-4 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
               >
                  <Download size={18} />
                  저장
               </button>
               <button 
                 className="bg-slate-100 text-slate-700 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold hover:bg-slate-200 transition-all"
                 onClick={() => {
                    navigator.clipboard.writeText(qrValue);
                    alert(t.dashboard.qr.copied || "복사되었습니다.");
                 }}
               >
                  <Copy size={18} />
                  복사
               </button>
               <button 
                 className="bg-slate-900 text-white py-4 rounded-2xl flex items-center justify-center gap-2 font-bold hover:bg-black transition-all"
                 onClick={() => window.print()}
               >
                  <Printer size={18} />
                  인쇄
               </button>
            </div>

            <div className="w-full pt-8 border-t border-black/5 flex items-center justify-between text-left">
               <div>
                  <p className="text-xs font-bold text-black/40 uppercase tracking-widest mb-1">{t.dashboard.qr.instId}</p>
                  <code className="text-primary font-black text-2xl tracking-tight">{instId}</code>
               </div>
               <div className="flex gap-2">
                 <button className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors border border-black/5">
                    <Settings className="text-black/40" size={20} />
                 </button>
               </div>
            </div>
        </section>

        {/* Individual Student QR Manager */}
        <section className="bg-slate-900 rounded-[40px] shadow-2xl shadow-primary/10 p-10 flex flex-col text-white">
            <h2 className="text-2xl font-black mb-2 flex items-center gap-3">
               <Users className="text-primary" />
               {t.dashboard.qr.studentQrTitle || "학생 개인 QR 발급"}
            </h2>
            <p className="text-white/40 font-bold mb-8 text-sm">
               {t.dashboard.qr.studentQrSubtitle || "학생증이나 가방에 부착할 수 있는 개인 고유 QR 코드입니다."}
            </p>

            <div className="flex-1 space-y-4 overflow-y-auto pr-2 max-h-[500px] custom-scrollbar">
               {students.map((student) => {
                  const sQrValue = `${typeof window !== 'undefined' ? window.location.origin : 'https://childrengate.com'}/scan/${instId}/${student.id}`;
                  return (
                     <div key={student.id} className="bg-white/5 rounded-3xl p-5 flex items-center gap-6 group hover:bg-white/10 transition-all border border-white/5">
                        <div className="bg-white p-2 rounded-2xl shrink-0">
                           <QRCodeSVG 
                              id={`student-qr-${student.id}`}
                              value={sQrValue} 
                              size={70} 
                              level="Q"
                           />
                        </div>
                        <div className="flex-1">
                           <h3 className="font-bold text-lg text-white/90">{student.name}</h3>
                           <p className="text-white/40 text-xs font-bold uppercase tracking-wider">{student.class}</p>
                        </div>
                        <button 
                           onClick={() => downloadQR(`student-qr-${student.id}`, `QR_${student.name}.png`)}
                           className="p-4 bg-primary/20 text-primary rounded-2xl hover:bg-primary hover:text-white transition-all shadow-inner"
                        >
                           <Download size={18} />
                        </button>
                     </div>
                  );
               })}
            </div>

            <div className="mt-8 pt-8 border-t border-white/10">
               <button className="w-full bg-primary py-5 rounded-3xl text-white font-black shadow-xl shadow-primary/20 flex items-center justify-center gap-2 hover:translate-y-[-2px] transition-transform">
                  <Printer size={20} />
                  전체 학생용 QR 일괄 인쇄 (PDF)
               </button>
            </div>
        </section>
      </div>
    </main>
  );
}
