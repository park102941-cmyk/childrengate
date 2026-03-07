"use client";

import { use, useState, useEffect } from "react";
import { motion } from "framer-motion";

export const runtime = "edge";
import { 
  Users, 
  UserPlus, 
  Car, 
  MessageSquare, 
  ChevronRight, 
  ShieldCheck,
  QrCode,
  Globe
} from "lucide-react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

export default function SmartGatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: instId } = use(params);
  const { user, role, loading: authLoading } = useAuth();
  const router = useRouter();
  const [instName, setInstName] = useState("");
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };
    fetchInst();
  }, [instId]);

  // Auto-redirect if already logged in
  useEffect(() => {
    if (!authLoading && user && instId) {
      if (role === 'admin' || role === 'staff') {
        router.push('/dashboard/admin');
      } else {
        router.push(`/p-portal?id=${instId}`);
      }
    }
  }, [user, role, authLoading, instId]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-primary/20 rounded-3xl"></div>
          <div className="h-4 w-32 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-primary/10">
      {/* Background patterns */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_2px_2px,rgba(0,0,0,1)_1px,transparent_0)] bg-[size:40px_40px]"></div>
      </div>

      <main className="relative max-w-md mx-auto min-h-screen flex flex-col p-8 pb-12">
        {/* Header */}
        <header className="pt-16 pb-12 text-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 bg-slate-50 rounded-[32px] shadow-2xl shadow-primary/5 flex items-center justify-center mx-auto mb-8 border border-black/[0.03]"
          >
            <img src="/children_gate_logo.png" alt="Logo" className="w-14 h-14 object-contain" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-black text-black tracking-tight mb-2"
          >
            {instName || "칠드런 게이트"}
          </motion.h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest bg-slate-100 rounded-full py-1.5 px-6 inline-block">Smart Entrance</p>
        </header>

        {/* Main Action Selection - Simplified to 2 Big Buttons */}
        <div className="flex-1 flex flex-col justify-center gap-6">
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (user) {
                router.push(`/p-portal?id=${instId}`);
              } else {
                router.push(`/login?type=parent&instId=${instId}`);
              }
            }}
            className="w-full bg-primary p-10 rounded-[40px] shadow-2xl shadow-primary/30 flex flex-col items-center gap-4 text-center ring-4 ring-primary/5"
          >
            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center text-white">
              <Users size={48} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white mb-1">학부모 입장</h2>
              <p className="text-xs font-bold text-white/70 uppercase tracking-widest">Parent Portal</p>
            </div>
          </motion.button>
          
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push(`/gate/${instId}/guest-reg`)}
            className="w-full bg-slate-900 p-10 rounded-[40px] shadow-2xl shadow-black/20 flex flex-col items-center gap-4 text-center ring-4 ring-black/5"
          >
            <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center text-white">
              <Car size={48} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white mb-1">게스트 입장</h2>
              <p className="text-xs font-bold text-white/50 uppercase tracking-widest">Guest Access</p>
            </div>
          </motion.button>
        </div>

        {/* Footer info and Smaller Signup Link */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <button 
            onClick={() => router.push(`/signup?code=${instId}`)}
            className="mb-10 text-slate-400 font-bold text-sm bg-slate-50 hover:bg-slate-100 hover:text-primary transition-all rounded-2xl py-4 px-8 border border-black/[0.03] group"
          >
            아직 회원이 아니신가요? <span className="text-primary font-black ml-1 group-hover:underline">가입하며 시작하기</span>
          </button>

          <div className="flex items-center justify-center gap-2 text-slate-200 font-bold text-[10px] uppercase tracking-widest mb-2">
            <ShieldCheck size={14} />
            Secure smart portal by Kids Gate
          </div>
          <p className="text-slate-300 text-[10px] font-bold uppercase tracking-tighter">{instId}</p>
        </motion.footer>
      </main>
    </div>
  );
}

function GateAction({ icon: Icon, title, description, onClick, color, delay }: { 
  icon: any, 
  title: string, 
  description: string, 
  onClick: () => void, 
  color: 'primary' | 'emerald' | 'amber',
  delay: number 
}) {
  const colorStyles = {
    primary: "bg-primary text-white shadow-primary/20",
    emerald: "bg-emerald-600 text-white shadow-emerald-600/20",
    amber: "bg-amber-500 text-white shadow-amber-500/20",
  };

  const iconStyles = {
    primary: "bg-white/20 text-white",
    emerald: "bg-white/20 text-white",
    amber: "bg-white/20 text-white",
  };

  return (
    <motion.button
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full p-6 rounded-[32px] flex items-center text-left gap-5 shadow-2xl transition-all ${colorStyles[color]}`}
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${iconStyles[color]}`}>
        <Icon size={28} />
      </div>
      <div className="flex-1">
        <h3 className="font-black text-lg leading-tight mb-1">{title}</h3>
        <p className="text-[11px] font-bold opacity-70 uppercase tracking-wide">{description}</p>
      </div>
      <ChevronRight size={20} className="opacity-40" />
    </motion.button>
  );
}
