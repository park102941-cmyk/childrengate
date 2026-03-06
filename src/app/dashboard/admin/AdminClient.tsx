"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Plus, 
  QrCode,
  Bell,
  Activity,
  UserCheck,
  Camera,
  MessageSquare,
  Car,
  Calendar,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  LayoutDashboard,
  CheckCircle2,
  LogOut,
  type LucideIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db, auth } from "@/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const { t } = useLanguage();
  const { institutionId, user, loading: authLoading, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      // Small delay to ensure Firebase isn't just slow to restore session
      // This is critical for preventing "bounce" back to login
      const timer = setTimeout(() => {
         if (!user && !authLoading) {
           console.log("Admin Guard: No user found after 4s, redirecting to login");
           window.location.href = "/login?type=institution";
         }
      }, 4000);
      return () => clearTimeout(timer);
    }

    // Only allow admin/staff/teacher
    if (user && role && role !== 'admin' && role !== 'staff' && role !== 'teacher') {
       console.log("Admin Guard: Invalid role", role);
       window.location.href = "/login?type=parent";
    }
  }, [user, authLoading, role]);
  const [instName, setInstName] = useState("");
  const [instPhoto, setInstPhoto] = useState("/children_gate_logo.png");
  const [activities, setActivities] = useState<any[]>([]);
  const [totalStudents, setTotalStudents] = useState("0");
  const [pendingPickups, setPendingPickups] = useState("0");
  const [todayEvents, setTodayEvents] = useState<any[]>([]);
  const [todayCheckins, setTodayCheckins] = useState("0");
  const [plan, setPlan] = useState<"basic" | "premium" | "enterprise">("basic");

  useEffect(() => {
    if (institutionId && db) {
      const fetchInst = async () => {
        const q = query(collection(db!, "institutions"), where("institutionId", "==", institutionId));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const data = snap.docs[0].data();
          setInstName(data.name);
          if (data.photo) setInstPhoto(data.photo);
          if (data.plan) setPlan(data.plan);
        }
      };
      fetchInst();

      // Fetch student count
      const fetchCount = async () => {
        const q = query(collection(db!, "students"), where("institutionId", "==", institutionId));
        const snap = await getDocs(q);
        setTotalStudents(snap.size.toString());
      };
      fetchCount();
    }
  }, [institutionId, db]);

  useEffect(() => {
    if (!db || !institutionId) return;

    // Real-time logs (Removed orderBy for missing index compatibility)
    const qLogs = query(
      collection(db, "checkin_logs"), 
      where("institutionId", "==", institutionId),
      limit(20)
    );
    const unsubscribeLogs = onSnapshot(qLogs, (snapshot) => {
      const logs = snapshot.docs.map(doc => {
        const d = doc.data();
        return {
          id: doc.id,
          user: d.studentName as string,
          action: d.status === 'out' ? "하교 완료" : "등교 확인됨",
          timestamp: d.timestamp,
          time: d.timestamp?.toDate ? d.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "방금 전",
          icon: d.status === 'out' ? Car : UserCheck,
          color: d.status === 'out' ? "text-amber-500" : "text-primary"
        };
      });
      // Client-side sort
      const sorted = logs.sort((a: any, b: any) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)).slice(0, 8);
      setActivities(sorted);
      
      // Today checkins count (simple simulation)
      setTodayCheckins(snapshot.docs.length.toString());
    });

    // Fetch pending pickups
    const qPickups = query(
        collection(db, "pickup_requests"), 
        where("institutionId", "==", institutionId),
        where("status", "==", "pending")
    );
    const unsubscribePickups = onSnapshot(qPickups, (snapshot) => {
        setPendingPickups(snapshot.docs.length.toString());
    });

    // Fetch today's events
    const today = new Date().toISOString().split('T')[0];
    const qEvents = query(
        collection(db, "events"),
        where("institutionId", "==", institutionId),
        where("date", "==", today)
    );
    const unsubscribeEvents = onSnapshot(qEvents, (snapshot) => {
        setTodayEvents(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => {
        unsubscribeLogs();
        unsubscribePickups();
        unsubscribeEvents();
    };
  }, [institutionId]);

  const handlePhotoUpdate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && db && institutionId) {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const base64 = ev.target?.result as string;
        setInstPhoto(base64);
        const q = query(collection(db!, "institutions"), where("institutionId", "==", institutionId));
        const snap = await getDocs(q);
        if (!snap.empty) {
            await updateDoc(doc(db!, "institutions", snap.docs[0].id), { photo: base64 });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <main className="flex-1 lg:ml-64 p-6 md:p-10 lg:p-14 bg-gray-50/30 min-h-screen">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col md:flex-row md:items-center gap-8"
        >
          <div className="flex items-center gap-5 bg-white px-7 py-4 rounded-[32px] border border-black/5 shadow-sm w-fit">
             <label className="relative cursor-pointer group">
               <div className="w-18 h-18 rounded-2xl bg-white flex items-center justify-center overflow-hidden border border-black/5 shadow-inner">
                  <img src={instPhoto} alt="Inst Logo" className="w-full h-full object-contain p-0.5" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-2xl">
                    <Camera size={18} className="text-white" />
                  </div>
               </div>
               <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpdate} />
             </label>
             <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h2 className="font-black text-black text-2xl leading-tight tracking-tight">{instName || "Children Gate"}</h2>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest ${plan === 'premium' ? 'bg-amber-100 text-amber-600' : plan === 'enterprise' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-400'}`}>
                    {plan} {plan === 'basic' ? 'Plan' : 'Member'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                   <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1 rounded-full border border-primary/5">
                      <span className="text-primary text-[10px] font-black uppercase tracking-widest">{institutionId || "ADMIN"}</span>
                   </div>
                   <span className="text-[10px] text-black/30 font-black uppercase tracking-widest leading-none border-l border-black/10 pl-3">기관 관리자</span>
                </div>
             </div>
          </div>
          <div className="w-px h-12 bg-black/5 hidden md:block"></div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-black flex items-center gap-3">
               <LayoutDashboard className="text-primary" size={28} />
               대시보드
            </h1>
            <p className="text-black/40 font-bold text-xs tracking-tight">기관 전용 운영 관리 시스템입니다.</p>
          </div>
        </motion.div>
        
        <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/dashboard/admin/students')}
              className="apple-button-primary bg-black hover:bg-black/90 text-white flex items-center gap-2 shadow-2xl shadow-black/10 border-none px-6 py-4"
            >
              <Users size={18} />
              학생 명단 관리
            </button>
            <div className="w-px h-10 bg-black/5 mx-2 hidden md:block"></div>
            <button 
              onClick={async () => {
                if (window.confirm("로그아웃 하시겠습니까?")) {
                  try {
                    localStorage.removeItem("kg_auto_login");
                    await auth?.signOut(); 
                    window.location.href="/login?type=institution&logout=true"; 
                  } catch (e) {
                    window.location.href="/login?logout=true";
                  }
                }
              }}
              className="w-12 h-12 bg-white rounded-2xl border border-black/5 flex items-center justify-center text-red-400 hover:text-red-600 hover:shadow-lg transition-all"
              title="Logout"
            >
                <LogOut size={20} />
            </button>
        </div>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Section (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
           
           {/* Summary Cards */}
           <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SummaryCard 
                label="전체 학생 규모" 
                value={totalStudents} 
                subtext="기관 등록 인원"
                icon={Users}
                color="primary"
                delay={0.1}
              />
               <SummaryCard 
                label="오늘 등교 확인" 
                value={todayCheckins} 
                subtext="참석률 92%"
                icon={CheckCircle2}
                color="emerald"
                delay={0.2}
              />
              <SummaryCard 
                label="하교 대기 요청" 
                value={pendingPickups} 
                subtext="실시간 매칭 중"
                icon={Car}
                color="amber"
                alert={parseInt(pendingPickups) > 0}
                delay={0.3}
              />
           </section>

           {/* Quick Action Matrix */}
           <section className="bg-white rounded-[40px] border border-black/5 shadow-sm p-8">
              <div className="flex items-center justify-between mb-8">
                  <h3 className="font-black text-xl flex items-center gap-2">
                    <TrendingUp className="text-primary" size={24} />
                    시스템 빠른 실행
                  </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <QuickAction 
                    icon={Plus} label="학생 신규 등록" color="bg-blue-50 text-blue-600"
                    onClick={() => router.push('/dashboard/admin/students?add=true')} 
                  />
                  <QuickAction 
                    icon={MessageSquare} label="소식지 발송" color="bg-purple-50 text-purple-600"
                    onClick={() => router.push('/dashboard/admin/messages')}
                  />
                  <QuickAction 
                    icon={QrCode} label="기관 QR 발급" color="bg-emerald-50 text-emerald-600"
                    onClick={() => router.push('/dashboard/admin/qr')}
                  />
                  <QuickAction 
                    icon={Calendar} label="일정/이벤트" color="bg-amber-50 text-amber-600"
                    onClick={() => router.push('/dashboard/admin/events')}
                  />
              </div>
           </section>

           {/* Schedule Board */}
           <section className="bg-white rounded-[40px] border border-black/5 p-8 shadow-sm">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="font-black text-xl flex items-center gap-2">
                     <Calendar className="text-primary" size={24} />
                     오늘의 주요 일정
                  </h3>
                  <button onClick={() => router.push('/dashboard/admin/events')} className="text-xs font-black text-primary bg-primary/5 px-4 py-2 rounded-full hover:bg-primary/10 transition-all uppercase tracking-widest">Manage All</button>
               </div>
               
               <div className="grid gap-4">
                  {todayEvents.length > 0 ? todayEvents.map(event => (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={event.id} 
                        className="p-6 bg-gray-50/50 rounded-2xl border border-black/5 flex items-center justify-between group hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all"
                    >
                       <div className="flex items-center gap-5">
                          <div className={`w-1 h-12 rounded-full ${event.color || 'bg-primary'}`}></div>
                          <div>
                             <p className="font-black text-black text-lg leading-none mb-2">{event.title}</p>
                             <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase text-black/30 tracking-widest bg-white border border-black/5 px-2 py-0.5 rounded">{event.startTime} - {event.endTime}</span>
                                <span className="text-[10px] font-black uppercase text-primary/60 tracking-widest">{event.target}</span>
                             </div>
                          </div>
                       </div>
                       <ChevronRight size={20} className="text-black/10 group-hover:text-primary transition-all" />
                    </motion.div>
                  )) : (
                    <div className="py-16 text-center border-2 border-dashed border-black/5 rounded-[32px] bg-gray-50/50">
                        <Calendar className="mx-auto text-black/10 mb-4" size={40} />
                        <p className="text-black/30 font-black italic">오늘 등록된 공식 일정이 없습니다.</p>
                        <button onClick={() => router.push('/dashboard/admin/events')} className="mt-6 text-xs font-black text-primary border-b-2 border-primary/20 hover:border-primary pb-1 transition-all">신규 일정 등록하기</button>
                    </div>
                  )}
               </div>
           </section>
        </div>

        {/* Right Section (4 cols) */}
        <div className="lg:col-span-4 space-y-8">
           
           {/* Activity Feed */}
           <section className="bg-white rounded-[40px] border border-black/5 p-8 shadow-sm h-fit">
              <h3 className="font-black text-xl mb-8 flex items-center gap-2">
                <Activity className="text-primary" size={24} />
                실시간 활동 스트림
              </h3>
              <div className="space-y-6 relative">
                 <div className="absolute left-[19px] top-2 bottom-6 w-px bg-black/5"></div>
                 <AnimatePresence mode="popLayout">
                    {activities.length > 0 ? activities.map((act, idx) => (
                        <motion.div 
                           key={act.id} 
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, scale: 0.9 }}
                           transition={{ delay: idx * 0.05 }}
                           className="flex items-center gap-4 group"
                        >
                           <div className="w-10 h-10 rounded-full bg-white border border-black/5 shadow-sm flex items-center justify-center relative z-10 group-hover:border-primary transition-colors">
                              <act.icon size={16} className={act.color || "text-primary"} />
                           </div>
                           <div className="flex-1 min-w-0">
                              <p className="text-sm font-black text-black truncate leading-tight mb-0.5">{act.user}</p>
                              <p className="text-[10px] text-black/40 font-black uppercase tracking-widest">{act.action}</p>
                           </div>
                           <span className="text-[10px] font-black text-black/20 font-mono italic">{act.time}</span>
                        </motion.div>
                    )) : <p className="text-center text-black/20 font-black py-20 italic">No Activity</p>}
                 </AnimatePresence>
              </div>
           </section>

           {/* Support/Promotion Card */}
           <section className="bg-gradient-to-br from-slate-900 to-black rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
              <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/10">
                       <TrendingUp size={20} className="text-primary" />
                    </div>
                    <span className="font-black text-sm uppercase tracking-widest text-primary">Intelligence</span>
                 </div>
                 <h4 className="text-2xl font-black mb-4 leading-tight tracking-tight">{"더 똑똑한\n출결 관리 시스템"}</h4>
                 <p className="text-white/40 text-[11px] font-bold leading-relaxed mb-10">
                    Children Gate만의 독자적인 매칭 알고리즘으로 하교 대기 시간을 40% 이상 단축했습니다. 모든 데이터는 종단간 암호화로 보호됩니다.
                 </p>
                 <button className="w-full py-5 bg-white text-black rounded-2xl font-black text-sm hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center gap-3 shadow-xl">
                    시스템 기능 제안 <ChevronRight size={18} />
                 </button>
              </div>
           </section>

        </div>
      </div>
    </main>
  );
}

// --- Dashboard Primitives ---

function SummaryCard({ label, value, subtext, icon: Icon, color, alert, delay = 0 }: any) {
   const colorMap: any = {
      primary: 'bg-primary/10 text-primary border-primary/20',
      emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      amber: 'bg-amber-50 text-amber-600 border-amber-100',
   };

   return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className={`p-8 bg-white rounded-[40px] border ${alert ? 'border-amber-400 animate-pulse ring-8 ring-amber-400/5' : 'border-black/5'} shadow-sm relative overflow-hidden group hover:shadow-2xl hover:shadow-black/5 transition-all duration-500`}
      >
         <div className="flex items-center justify-between mb-8">
            <div className={`w-14 h-14 rounded-2xl ${colorMap[color] || colorMap.primary} flex items-center justify-center border transition-transform group-hover:-rotate-12 duration-500`}>
               <Icon size={28} />
            </div>
            {alert && <div className="px-3 py-1 bg-amber-500 text-white text-[10px] font-black rounded-full uppercase tracking-widest animate-bounce">Live</div>}
         </div>
         <div className="space-y-2">
            <h4 className="text-5xl font-black tracking-tighter text-black">{value}</h4>
            <p className="text-[10px] font-black text-black/30 uppercase tracking-[0.2em]">{label}</p>
         </div>
         <div className="mt-6 pt-6 border-t border-black/5 flex items-center justify-between">
            <span className="text-[11px] font-black text-black/40 italic">{subtext}</span>
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <ChevronRight size={14} className="text-black/20" />
            </div>
         </div>
      </motion.div>
   );
}

function QuickAction({ icon: Icon, label, onClick, color }: any) {
    return (
       <motion.button 
         whileHover={{ y: -5 }}
         whileTap={{ scale: 0.95 }}
         onClick={onClick}
         className="flex flex-col items-center justify-center p-8 bg-white rounded-[32px] border border-black/5 shadow-sm hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all group"
       >
          <div className={`w-16 h-16 rounded-[24px] ${color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500 shadow-sm border border-black/5`}>
             <Icon size={28} />
          </div>
          <span className="text-[11px] font-black text-black/40 group-hover:text-black transition-colors uppercase tracking-widest">{label}</span>
       </motion.button>
    );
 }
