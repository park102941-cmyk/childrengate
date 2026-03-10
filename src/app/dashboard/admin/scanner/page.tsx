"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Barcode as BarcodeIcon, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User, 
  ArrowLeft,
  Volume2,
  VolumeX,
  History,
  Car
} from "lucide-react";
import { db } from "@/lib/firebase";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  doc, 
  serverTimestamp, 
  addDoc,
  limit,
  orderBy,
  Timestamp
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Barcode from "react-barcode";

interface ScanResult {
  success: boolean;
  message: string;
  studentName?: string;
  studentId?: string;
  type?: 'drop-off' | 'pickup' | 'release';
  timestamp: Date;
}

export default function BarcodeScannerPage() {
  const { institutionId } = useAuth();
  const router = useRouter();
  const [scanInput, setScanInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<ScanResult | null>(null);
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input for hardware scanner
  useEffect(() => {
    const focusTimer = setInterval(() => {
      if (document.activeElement?.tagName !== 'INPUT') {
        inputRef.current?.focus();
      }
    }, 1000);
    return () => clearInterval(focusTimer);
  }, []);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanInput.trim() || isProcessing || !institutionId) return;

    const barcode = scanInput.trim();
    setScanInput("");
    setIsProcessing(true);

    try {
      let studentDoc;
      let isDynamic = false;

      // 1. Resolve Student (Dynamic QR or Static Barcode)
      if (barcode.startsWith("kgp:")) {
        const parts = barcode.split(":");
        if (parts.length !== 3) {
          provideFeedback(false, "잘못된 형식의 QR 코드입니다.");
          setIsProcessing(false);
          return;
        }

        const [_, studentId, qrSeed] = parts;
        const todaySeed = new Date().toISOString().split('T')[0].replace(/-/g, '');

        // Daily Security: QR must match today's date
        if (qrSeed !== todaySeed) {
          provideFeedback(false, "만료된 QR 코드입니다 (오늘 생성된 코드가 아님).");
          setIsProcessing(false);
          return;
        }

        const { getDoc } = await import("firebase/firestore");
        const sSnap = await getDoc(doc(db!, "students", studentId));
        
        if (!sSnap.exists() || sSnap.data().institutionId !== institutionId) {
          provideFeedback(false, "유효하지 않은 학생 정보입니다.");
          setIsProcessing(false);
          return;
        }
        studentDoc = sSnap;
        isDynamic = true;
      } else {
        // Legacy Barcode Lookup
        const studentQ = query(
          collection(db!, "students"),
          where("institutionId", "==", institutionId),
          where("barcodeId", "==", barcode),
          limit(1)
        );
        const snap = await getDocs(studentQ);
        if (snap.empty) {
          provideFeedback(false, "등록되지 않은 바코드입니다.");
          setIsProcessing(false);
          return;
        }
        studentDoc = snap.docs[0];
      }

      const student = studentDoc.data();
      const currentStatus = student.status || "absent";
      let nextStatus = currentStatus;
      let type: 'drop-off' | 'pickup' | 'release' = 'drop-off';
      let msg = "";
      const scanType = isDynamic ? "dynamic_qr" : "barcode_scan";

      // 2. Determine Action based on status
      if (currentStatus === "absent" || currentStatus === "released") {
          // Absent (or already released - re-entry) -> Present (Drop-off)
          nextStatus = "present";
          type = "drop-off";
          msg = "등교 확인 완료";
          
          await addDoc(collection(db!, "checkin_logs"), {
            studentId: studentDoc.id,
            studentName: student.name,
            institutionId,
            status: "in",
            type: scanType,
            timestamp: serverTimestamp()
          });
      } else if (currentStatus === "present" || currentStatus === "pickup_requested") {
          // Present or Pickup Requested -> Release (Handoff)
          nextStatus = "released";
          type = "release";
          msg = "하교 처리 완료 (인계)";

          await addDoc(collection(db!, "checkin_logs"), {
            studentId: studentDoc.id,
            studentName: student.name,
            institutionId,
            status: "out",
            type: scanType,
            timestamp: serverTimestamp()
          });
          
          // Close all pending pickup requests for this student
          const pickupQ = query(
            collection(db!, "pickup_requests"),
            where("studentId", "==", studentDoc.id),
            where("status", "==", "pending")
          );
          const pSnap = await getDocs(pickupQ);
          for (const d of pSnap.docs) {
            await updateDoc(doc(db!, "pickup_requests", d.id), { status: "completed", completedAt: serverTimestamp() });
          }
      }

      // 3. Update Student Status
      await updateDoc(doc(db!, "students", studentDoc.id), { status: nextStatus });
      provideFeedback(true, msg, student.name, studentDoc.id, type);

    } catch (err) {
      console.error("Scan error:", err);
      provideFeedback(false, "연결 오류가 발생했습니다.");
    } finally {
      setIsProcessing(false);
      inputRef.current?.focus();
    }
  };

  const provideFeedback = (success: boolean, message: string, name?: string, id?: string, type?: any) => {
    const result: ScanResult = { success, message, studentName: name, studentId: id, type, timestamp: new Date() };
    setLastResult(result);
    setHistory(prev => [result, ...prev].slice(0, 10));
    
    // Play sound
    if (!isMuted) {
      const audio = new Audio(success ? "/sounds/success.mp3" : "/sounds/error.mp3");
      audio.play().catch(() => {}); // Browser might block
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-6 md:p-12 relative overflow-hidden">
      {/* Abstract Background Blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10"></div>
      
      <header className="w-full max-w-4xl flex items-center justify-between mb-12">
        <button 
          onClick={() => router.push('/dashboard/admin')}
          className="flex items-center gap-2 text-white/40 hover:text-white font-bold transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Dashboard
        </button>
        <h1 className="text-2xl font-black tracking-tight flex items-center gap-3">
          <BarcodeIcon className="text-primary" />
          Gateway Scanner Mode
        </h1>
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all"
        >
          {isMuted ? <VolumeX size={18} className="text-red-400" /> : <Volume2 size={18} className="text-emerald-400" />}
        </button>
      </header>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Input & Last Result */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          
          <div className="bg-white/5 backdrop-blur-xl rounded-[40px] border border-white/10 p-10 text-center relative overflow-hidden">
            <h2 className="text-xl font-black mb-1">바코드를 스캔하세요</h2>
            <p className="text-white/30 font-bold text-sm mb-8">연결된 스캐너로 학생/학부모의 바코드를 읽어주세요.</p>
            
            <form onSubmit={handleScan} className="relative">
              <input 
                ref={inputRef}
                type="text"
                autoFocus
                value={scanInput}
                onChange={e => setScanInput(e.target.value)}
                placeholder="Waiting for scan..."
                className="w-full bg-white/10 border-2 border-white/5 rounded-3xl py-6 px-10 text-center text-3xl font-black tracking-widest outline-none focus:border-primary/50 focus:bg-white/15 transition-all text-white placeholder:text-white/10"
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20">
                {isProcessing ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div> : <Search size={24} />}
              </div>
            </form>

            <div className="mt-8 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Connected
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div> Auto-Focus Active
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {lastResult && (
              <motion.div 
                key={lastResult.timestamp.getTime()}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className={`rounded-[40px] p-10 border-2 flex items-center gap-8 ${lastResult.success ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}
              >
                <div className={`w-24 h-24 rounded-[32px] flex items-center justify-center shrink-0 ${lastResult.success ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' : 'bg-red-500 text-white'}`}>
                  {lastResult.success ? <CheckCircle2 size={48} /> : <XCircle size={48} />}
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-1">{lastResult.message}</h3>
                  {lastResult.studentName && (
                    <div className="flex items-center gap-3">
                      <p className="text-xl font-bold text-white/80">{lastResult.studentName}</p>
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                        lastResult.type === 'drop-off' ? 'bg-blue-500/20 text-blue-400' : 
                        lastResult.type === 'pickup' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {lastResult.type}
                      </span>
                    </div>
                  )}
                  <p className="text-xs font-bold opacity-30 mt-2 uppercase tracking-tight">Time: {lastResult.timestamp.toLocaleTimeString()}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Right: History */}
        <div className="lg:col-span-5">
           <div className="bg-white/5 backdrop-blur-sm rounded-[40px] border border-white/5 p-8 flex flex-col h-full">
              <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                 <History size={18} className="text-white/40" />
                 최근 스캔 기록
              </h3>
              
              <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {history.map((item, idx) => (
                  <div key={idx} className="bg-white/[0.03] p-5 rounded-2xl flex items-center justify-between border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.success ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {item.type === 'drop-off' ? <LogIn size={18} /> : item.type === 'pickup' ? <Car size={18} /> : <User size={18} />}
                      </div>
                      <div>
                        <p className="font-black text-sm">{item.studentName || "알 수 없음"}</p>
                        <p className="text-[10px] font-bold opacity-40 uppercase">{item.message}</p>
                      </div>
                    </div>
                    <p className="text-[10px] font-mono opacity-20">{item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                ))}
                {history.length === 0 && (
                  <div className="py-20 text-center opacity-10">
                    <BarcodeIcon size={48} className="mx-auto mb-4" />
                    <p className="font-black italic">No scans yet</p>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-8 border-t border-white/5">
                 <div className="flex items-center justify-between px-2">
                    <div className="text-center">
                       <p className="text-[10px] font-black uppercase text-white/20 mb-1">Today Scans</p>
                       <p className="text-2xl font-black">{history.filter(h => h.success).length}</p>
                    </div>
                    <div className="text-center">
                       <p className="text-[10px] font-black uppercase text-white/20 mb-1">Errors</p>
                       <p className="text-2xl font-black text-red-400">{history.filter(h => !h.success).length}</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>

      </div>

      <footer className="mt-12 text-white/10 font-bold text-[10px] uppercase tracking-[0.4em]">
         Kids Gate Barcode Security Protocol v1.0
      </footer>
    </main>
  );
}

function LogIn({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" y1="12" x2="3" y2="12" />
    </svg>
  );
}
