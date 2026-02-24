"use client";


export const runtime = "edge";


import { useState } from "react";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import { Send, CheckCircle2, QrCode, ShieldCheck } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

export default function ParentRequestPage() {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    studentName: "",
    className: "",
    parentName: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!db) {
        throw new Error("Firebase database is not initialized");
      }
      await addDoc(collection(db, "pickup_requests"), {
        ...formData,
        requestTime: Timestamp.now(),
        status: "pending",
        type: "qr",
        institutionId: "default_inst"
      });

      // Sync to Google Sheets (Reporting Store)
      fetch("/api/sync-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "REQUEST_CREATED",
          studentName: formData.studentName,
          className: formData.className,
          parentName: formData.parentName,
          timestamp: new Date().toISOString(),
          status: "PENDING"
        })
      }).catch(err => console.error("Reporting sync failed:", err));

      setStep(2);

    } catch (error) {
      console.error("Error submitting request:", error);
      alert("요청 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20">
            <QrCode className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-extra-bold tracking-tight text-black">{t.dashboard.parent.title}</h1>
          <p className="text-black/60 font-semibold mt-2">{t.dashboard.parent.subtitle}</p>
        </div>

        {step === 1 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-50 rounded-[40px] p-8 border border-black/5 shadow-sm"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-extra-bold mb-2 ml-1 text-black">{t.dashboard.parent.studentName}</label>
                <input 
                  type="text"
                  required
                  placeholder="예: 홍길동"
                  className="w-full px-5 py-4 rounded-2xl border-none ring-2 ring-black/5 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-black/30 bg-white"
                  value={formData.studentName}
                  onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-extra-bold mb-2 ml-1 text-black">{t.dashboard.parent.className}</label>
                <input 
                  type="text"
                  required
                  placeholder="예: 기쁨반"
                  className="w-full px-5 py-4 rounded-2xl border-none ring-2 ring-black/5 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-black/30 bg-white"
                  value={formData.className}
                  onChange={(e) => setFormData({...formData, className: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-extra-bold mb-2 ml-1 text-black">{t.dashboard.parent.parentName}</label>
                <input 
                  type="text"
                  required
                  placeholder="보호자 성함"
                  className="w-full px-5 py-4 rounded-2xl border-none ring-2 ring-black/5 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-black/30 bg-white"
                  value={formData.parentName}
                  onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full apple-button-primary flex items-center justify-center gap-2 py-5 text-lg font-bold shadow-xl shadow-primary/30"
              >
                {loading ? t.dashboard.parent.requesting : (
                  <>
                    <Send size={20} />
                    {t.dashboard.parent.requestButton}
                  </>
                )}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-12 bg-green-50 rounded-[40px] border border-green-100"
          >
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-2xl font-bold text-green-900 mb-2">{t.dashboard.parent.completeTitle}</h2>
            <p className="text-green-800/70 mb-8">
              {t.dashboard.parent.completeSubtitle}
            </p>
            <div className="bg-white/50 p-4 rounded-2xl flex items-center gap-3 justify-center text-sm font-medium text-green-900">
               <ShieldCheck size={18} />
               {t.dashboard.parent.safetyShield}
            </div>
          </motion.div>
        )}

        <div className="mt-12 text-center text-xs text-secondary/60">
           &copy; 2026 Children Gate. Smart and Safe Mobility for Children.
        </div>
      </div>
    </div>
  );
}
