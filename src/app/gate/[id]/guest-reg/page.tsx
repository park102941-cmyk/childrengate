"use client";

import { use, useState, useEffect } from "react";
export const runtime = "edge";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Phone, 
  Baby, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  Send,
  Calendar,
  Layers,
  Sparkles
} from "lucide-react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs, limit } from "firebase/firestore";

export default function GuestRegistrationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: instId } = use(params);
  const router = useRouter();
  const [instName, setInstName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    parentName: "",
    parentPhone: "",
    childName: "",
    childGrade: "K",
    childClass: "",
  });

  useEffect(() => {
    const fetchInst = async () => {
      if (!db || !instId) return;
      try {
        const q = query(collection(db, "institutions"), where("institutionId", "==", instId), limit(1));
        const snap = await getDocs(q);
        if (!snap.empty) {
          setInstName(snap.docs[0].data().name);
        }
      } catch (err) {
        console.error("Error fetching institution:", err);
      }
    };
    fetchInst();
  }, [instId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.parentName || !formData.parentPhone || !formData.childName || !db) {
      alert("모든 필수 정보를 입력해 주세요.");
      return;
    }

    setLoading(true);
    try {
      // 1. Create student record as guest
      const studentRef = await addDoc(collection(db, "students"), {
        name: formData.childName,
        grade: formData.childGrade,
        class: formData.childClass || "게스트",
        parent: formData.parentName,
        contact: formData.parentPhone,
        institutionId: instId,
        isGuest: true,
        status: "absent",
        createdAt: serverTimestamp(),
      });

      // 2. We'll show success screen. 
      // User requested "send link via message". 
      // We'll simulate this by providing a shareable link that the gate manager could also use.
      setSuccess(true);
    } catch (err) {
      console.error("Guest registration error:", err);
      alert("등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const shareLink = typeof window !== 'undefined' ? `${window.location.origin}/p-portal?guestId=${formData.parentPhone}&id=${instId}` : '';

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Kids Gate 게스트 포털',
          text: `${formData.parentName}님, 아이의 등하교를 관리할 수 있는 링크입니다.`,
          url: shareLink,
        });
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
      navigator.clipboard.writeText(shareLink);
      alert("링크가 클립보드에 복사되었습니다. 메시지로 전달해 주세요!");
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-primary/10">
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center"
          >
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6"></div>
            <h3 className="text-xl font-black text-black">정보 전송 중...</h3>
            <p className="text-black/40 font-bold mt-2">잠시만 기다려 주세요.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-md mx-auto min-h-screen flex flex-col p-8 pb-12">
        <header className="pt-12 pb-10 flex items-center justify-between">
          <button onClick={() => router.back()} className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-black/20 hover:text-black transition-all border border-black/[0.03]">
            <ArrowLeft size={20} />
          </button>
          <div className="text-right">
             <h4 className="text-[10px] font-black text-black/30 uppercase tracking-[0.2em] mb-1">Guest Arrival</h4>
             <p className="text-xs font-black text-primary">{instName || "칠드런 게이트"}</p>
          </div>
        </header>

        {success ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center space-y-8"
          >
            <div className="w-24 h-24 bg-emerald-50 rounded-[32px] flex items-center justify-center text-emerald-500 shadow-2xl shadow-emerald-500/10 mb-4">
              <CheckCircle2 size={48} strokeWidth={2.5} />
            </div>
            
            <div>
              <h2 className="text-3xl font-black text-black mb-3">등록 완료!</h2>
              <p className="text-black/40 font-bold px-6">
                아이의 정보가 등록되었습니다.<br/>
                아래 버튼을 눌러 부모님께 관리 링크를 보내주세요.
              </p>
            </div>

            <div className="w-full space-y-3 pt-8">
              <button 
                onClick={handleShare}
                className="w-full py-5 bg-black text-white font-black rounded-3xl shadow-2xl shadow-black/20 flex items-center justify-center gap-3 active:scale-95 transition-all text-lg"
              >
                <Send size={20} />
                링크 메시지로 전송하기
              </button>
              <button 
                onClick={() => router.push(`/gate/${instId}`)}
                className="w-full py-5 bg-slate-50 text-black/30 font-black rounded-3xl hover:bg-slate-100 transition-all"
              >
                홈으로 돌아가기
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="mb-12">
               <h1 className="text-4xl font-black text-black tracking-tight mb-3">게스트 방문 등록</h1>
               <p className="text-black/40 font-bold leading-relaxed">
                 아이와 보호자 정보를 입력해 주시면<br/>
                 실시간 등하교 알림 링크를 보내드립니다.
               </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <section className="space-y-6">
                <div className="relative">
                  <label className="text-[10px] font-black text-black/30 ml-4 uppercase tracking-[0.2em] mb-2 block">보호자 정보</label>
                  <div className="space-y-3">
                    <div className="relative">
                      <User className="absolute left-6 top-1/2 -translate-y-1/2 text-black/20" size={20} />
                      <input 
                        required
                        type="text"
                        placeholder="보호자 성함"
                        value={formData.parentName}
                        onChange={e => setFormData({...formData, parentName: e.target.value})}
                        className="w-full pl-16 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-3xl outline-none font-black text-black focus:bg-white focus:border-primary transition-all shadow-inner"
                      />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-black/20" size={20} />
                      <input 
                        required
                        type="tel"
                        placeholder="보호자 연락처 (예: 01012345678)"
                        value={formData.parentPhone}
                        onChange={e => setFormData({...formData, parentPhone: e.target.value})}
                        className="w-full pl-16 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-3xl outline-none font-black text-black focus:bg-white focus:border-primary transition-all shadow-inner"
                      />
                    </div>
                  </div>
                </div>

                <div className="relative pt-4">
                  <label className="text-[10px] font-black text-black/30 ml-4 uppercase tracking-[0.2em] mb-2 block">자녀 정보</label>
                  <div className="space-y-3">
                    <div className="relative">
                      <Baby className="absolute left-6 top-1/2 -translate-y-1/2 text-black/20" size={20} />
                      <input 
                        required
                        type="text"
                        placeholder="자녀 이름"
                        value={formData.childName}
                        onChange={e => setFormData({...formData, childName: e.target.value})}
                        className="w-full pl-16 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-3xl outline-none font-black text-black focus:bg-white focus:border-primary transition-all shadow-inner"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-black/20" size={18} />
                        <input 
                          type="text"
                          placeholder="학년"
                          value={formData.childGrade}
                          onChange={e => setFormData({...formData, childGrade: e.target.value})}
                          className="w-full pl-16 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-3xl outline-none font-black text-black focus:bg-white focus:border-primary transition-all shadow-inner"
                        />
                      </div>
                      <div className="relative">
                        <Layers className="absolute left-6 top-1/2 -translate-y-1/2 text-black/20" size={18} />
                        <input 
                          type="text"
                          placeholder="반"
                          value={formData.childClass}
                          onChange={e => setFormData({...formData, childClass: e.target.value})}
                          className="w-full pl-16 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-3xl outline-none font-black text-black focus:bg-white focus:border-primary transition-all shadow-inner"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <div className="pt-6">
                 <button 
                  type="submit"
                  className="w-full py-6 bg-primary text-white font-black rounded-[32px] shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 active:scale-95 transition-all text-xl"
                 >
                   <Sparkles size={24} />
                   방문 등록 완료
                 </button>
                 <p className="text-[10px] font-bold text-center text-black/20 mt-6 uppercase tracking-widest flex items-center justify-center gap-2">
                    <ShieldCheck size={12} /> Privacy protected by Kids Gate
                 </p>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
