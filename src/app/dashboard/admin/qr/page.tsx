"use client";


export const runtime = "edge";


import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { Download, Copy, Settings, Users, Printer } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

export default function QRManagementPage() {
  const { t } = useLanguage();
  const [instId] = useState("kids-gate-church-01");
  const [qrValue, setQrValue] = useState(`https://kids-gate.io/p/${instId}`);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setQrValue(`${window.location.origin}/p/${instId}`);
    }
  }, [instId]);

  
  // Mock subset of students for student QR feature
  const students = [
    { id: 1, name: "김지우", class: "민들레반" },
    { id: 2, name: "이준서", class: "해바라기반" },
    { id: 3, name: "박서현", class: "장미반" }
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
      ctx?.drawImage(img, 0, 0, 1000, 1000);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = fileName;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <main className="flex-1 lg:ml-64 p-6 md:p-10 lg:p-14">
      <header className="mb-10">
        <h1 className="text-4xl font-black tracking-tight text-black mb-1">{t.dashboard.qr.title}</h1>
        <p className="text-black/50 font-semibold">{t.dashboard.qr.subtitle}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         {/* Institution Master QR */}
        <section className="bg-white rounded-[40px] border border-black/5 shadow-2xl shadow-black/5 p-10 flex flex-col items-center justify-center text-center">
            
            <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="bg-gray-50 p-12 rounded-[40px] inline-block mb-10 relative group border border-black/5 cursor-pointer"
               onClick={() => window.open(`/p/${instId}`, '_blank')}
               title="클릭하여 학부모 페이지로 이동"
            >
              <QRCodeSVG 
                id="main-qr-code"
                value={qrValue} 
                size={256} 
                level="H"
                includeMargin={true}
                imageSettings={{
                    src: "/logo-icon.png", 
                    x: undefined,
                    y: undefined,
                    height: 48,
                    width: 48,
                    excavate: true,
                }}
              />
              <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity rounded-[40px] flex items-center justify-center">
                 <button onClick={() => downloadQR("main-qr-code", `KidsGate_QR_${instId}.png`)} className="bg-white text-primary p-4 rounded-full shadow-2xl hover:scale-110 transition-transform">
                    <Download size={28} />
                 </button>
              </div>
            </motion.div>

            <div className="grid grid-cols-3 gap-3 w-full max-w-sm mb-10">
               <button 
                 onClick={() => downloadQR("main-qr-code", `KidsGate_QR_${instId}.png`)}
                 className="apple-button-primary flex items-center justify-center gap-2 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-xs px-2"
                 title="QR 이미지 다운로드"
               >
                  <Download size={16} />
                  다운로드
               </button>
               <button 
                 className="apple-button-secondary flex items-center justify-center gap-2 text-xs px-2"
                 onClick={() => {
                    navigator.clipboard.writeText(qrValue);
                    alert(t.dashboard.qr.copied || "복사되었습니다.");
                 }}
                 title="QR 링크 복사"
               >
                  <Copy size={16} />
                  링크 복사
               </button>
               <button 
                 className="apple-button-secondary bg-gray-900 border-none text-white hover:bg-black hover:text-white flex items-center justify-center gap-2 text-xs px-2"
                 onClick={() => {
                    const printWindow = window.open('', '_blank');
                    if (printWindow) {
                      printWindow.document.write(`
                        <html>
                          <head>
                            <title>Children Gate - 학부모 QR 포털</title>
                            <style>
                              body { font-family: 'Helvetica Neue', sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #fff; text-align: center; }
                              .card { border: 2px solid #000; border-radius: 40px; padding: 60px; }
                              h1 { font-size: 32px; font-weight: 900; margin-bottom: 30px; }
                              p { font-size: 18px; font-weight: bold; color: #666; margin-top: 30px; }
                              .inst-code { margin-top: 10px; font-size: 24px; font-weight: 900; background: #f3f4f6; padding: 10px 20px; border-radius: 10px; display: inline-block; }
                            </style>
                          </head>
                          <body>
                            <div class="card">
                              <h1>키즈게이트 학부모 QR</h1>
                              <div id="qr-container"></div>
                              <p>스마트폰 카메라로 위 QR코드를 스캔하여<br/>자녀를 연결하고 실시간으로 소통하세요.</p>
                              <div class="inst-code">${instId}</div>
                            </div>
                          </body>
                        </html>
                      `);
                      const svg = document.getElementById('main-qr-code');
                      if (svg) printWindow.document.getElementById('qr-container')?.appendChild(svg.cloneNode(true));
                      printWindow.document.close();
                      setTimeout(() => { printWindow.print(); printWindow.close(); }, 300);
                    }
                 }}
                 title="QR 기기/인쇄 출력"
               >
                  <Printer size={16} />
                  QR 출력
               </button>
            </div>

            <div className="w-full pt-8 border-t border-black/5 flex items-center justify-between text-left">
               <div>
                  <p className="text-sm font-bold text-black/50 uppercase tracking-widest">{t.dashboard.qr.instId}</p>
                  <code className="text-black font-black text-xl">{instId}</code>
               </div>
               <button className="p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                  <Settings className="text-black/50" />
               </button>
            </div>
        </section>

         {/* Individual Student QR Manager */}
        <section className="bg-slate-900 rounded-[40px] shadow-2xl shadow-primary/10 p-10 flex flex-col text-white">
            <h2 className="text-2xl font-black mb-2 flex items-center gap-3">
               <Users className="text-primary" />
               {t.dashboard.qr.studentQrTitle || "학생 개인 QR 발급"}
            </h2>
            <p className="text-white/50 font-bold mb-8">
               {t.dashboard.qr.studentQrSubtitle || "학생증이나 가방에 부착할 수 있는 개인 고유 QR 코드입니다."}
            </p>

            <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
               {students.map((student) => {
                  const sQrValue = `https://kids-gate.io/scan/${instId}/${student.id}`;
                  return (
                     <div key={student.id} className="bg-white/10 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-6 group hover:bg-white/20 transition-all">
                        <div className="bg-white p-2 rounded-2xl shrink-0">
                           <QRCodeSVG 
                              id={`student-qr-${student.id}`}
                              value={sQrValue} 
                              size={80} 
                              level="Q"
                           />
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                           <h3 className="font-black text-xl">{student.name}</h3>
                           <p className="text-white/50 text-sm font-bold">{student.class}</p>
                        </div>
                        <button 
                           onClick={() => downloadQR(`student-qr-${student.id}`, `QR_${student.name}.png`)}
                           className="p-4 bg-primary rounded-full text-white shadow-lg hover:scale-110 transition-transform sm:opacity-0 group-hover:opacity-100 shrink-0"
                        >
                           <Download size={20} />
                        </button>
                     </div>
                  );
               })}
            </div>

            <div className="mt-8 pt-8 border-t border-white/10">
               <button className="w-full apple-button-primary bg-primary border-none shadow-lg shadow-primary/30 flex items-center justify-center gap-2">
                  <Printer size={18} />
                  {t.dashboard.qr.printAll || "전체 학생 QR 일괄 출력"}
               </button>
            </div>
        </section>
      </div>
    </main>
  );
}
