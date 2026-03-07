"use client";

import { useState, useEffect, useRef } from "react";
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
  Edit2,
  Share2,
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
  const redirectRef = useRef(false);

  useEffect(() => {
    if (authLoading || redirectRef.current) return;
    
    let timer: NodeJS.Timeout;

    if (!user) {
      timer = setTimeout(() => {
         if (!user && !authLoading && !redirectRef.current) {
            console.log("Admin Guard: No user found after 10s delay. Redirecting.");
            redirectRef.current = true;
            router.push("/login?type=institution");
         }
      }, 10000); // 10s safety delay for stability
    } else if (role && role !== 'admin' && role !== 'staff' && role !== 'teacher') {
       // Role exists but is wrong
       console.log("Admin Guard: Account is not an admin. Role:", role);
       redirectRef.current = true;
       router.push("/login?type=parent");
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [user, authLoading, role, router]);

  const [instName, setInstName] = useState("");
  const [instPhoto, setInstPhoto] = useState("/children_gate_logo.png");
  const [activities, setActivities] = useState<any[]>([]);
  const [totalStudents, setTotalStudents] = useState("0");
  const [pendingPickups, setPendingPickups] = useState("0");
  const [todayEvents, setTodayEvents] = useState<any[]>([]);
  const [todayCheckins, setTodayCheckins] = useState("0");
  const [todayLateCount, setTodayLateCount] = useState(0);
  const [todayPresentCount, setTodayPresentCount] = useState(0);
  const [currentlyPresentCount, setCurrentlyPresentCount] = useState(0);
  const [arrivalTime, setArrivalTime] = useState("09:00");
  const [departureTime, setDepartureTime] = useState("18:00");
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
          if (data.arrivalTime) setArrivalTime(data.arrivalTime);
          if (data.departureTime) setDepartureTime(data.departureTime);
        }
      };
      fetchInst();

      const unsubscribeStudents = onSnapshot(
        query(collection(db!, "students"), where("institutionId", "==", institutionId)),
        (snap) => {
          setTotalStudents(snap.size.toString());
          const present = snap.docs.filter(d => d.data().status === 'present').length;
          setCurrentlyPresentCount(present);
        }
      );
      return () => unsubscribeStudents();
    }
  }, [institutionId, db]);

  useEffect(() => {
    if (!db || !institutionId) return;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const qLogs = query(
      collection(db, "checkin_logs"), 
      where("institutionId", "==", institutionId),
      where("timestamp", ">=", startOfToday)
    );
    
    const unsubscribeLogs = onSnapshot(qLogs, (snapshot) => {
      let lateCnt = 0;
      let presentCnt = 0;

      // Sort logs by timestamp desc manually to avoid index requirement
      const sortedDocs = [...snapshot.docs].sort((a, b) => {
        const tA = (a.data().timestamp?.toDate?.() || 0).valueOf();
        const tB = (b.data().timestamp?.toDate?.() || 0).valueOf();
        return tB - tA;
      });

      const logs = sortedDocs.map(doc => {
        const d = doc.data();
        let formattedTime = "방금 전";
        let isLate = false;

        try {
          if (d.timestamp?.toDate) {
            const date = d.timestamp.toDate();
            formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
            
            if (d.status === 'in') {
                if (formattedTime > arrivalTime) {
                    isLate = true;
                    lateCnt++;
                } else {
                    presentCnt++;
                }
            } else if (d.status === 'out') {
                // We could track early leavers here if needed
            }
          }
        } catch (e) {}

        return {
          id: doc.id,
          user: d.studentName as string,
          action: d.status === 'out' ? "하교 완료" : (isLate ? "지각 등교" : "정상 등교"),
          timestamp: d.timestamp,
          time: formattedTime,
          icon: d.status === 'out' ? Car : UserCheck,
          color: d.status === 'out' ? "text-amber-500" : (isLate ? "text-rose-500" : "text-emerald-500")
        };
      });
      setActivities(logs.slice(0, 5));
      setTodayCheckins(snapshot.docs.length.toString());
      setTodayLateCount(lateCnt);
      setTodayPresentCount(presentCnt);
    }, (err) => {
      console.error("Logs listener error:", err);
    });

    const qPickups = query(
        collection(db, "pickup_requests"), 
        where("institutionId", "==", institutionId),
        where("status", "==", "pending")
    );
    const unsubscribePickups = onSnapshot(qPickups, (snapshot) => {
        setPendingPickups(snapshot.docs.length.toString());
    }, (err) => {
        console.error("Pickups listener error:", err);
    });

    const todayStr = new Date().toISOString().split('T')[0];
    const qEvents = query(
        collection(db, "events"),
        where("institutionId", "==", institutionId),
        where("date", "==", todayStr)
    );
    const unsubscribeEvents = onSnapshot(qEvents, (snapshot) => {
        setTodayEvents(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => {
        console.error("Events listener error:", err);
    });

    return () => {
        unsubscribeLogs();
        unsubscribePickups();
        unsubscribeEvents();
    };
  }, [institutionId]);

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState("");

  const handleNameUpdate = async () => {
    if (!tempName.trim() || !db || !institutionId) {
      setIsEditingName(false);
      return;
    }
    try {
      const q = query(collection(db, "institutions"), where("institutionId", "==", institutionId));
      const snap = await getDocs(q);
      if (!snap.empty) {
        await updateDoc(doc(db, "institutions", snap.docs[0].id), { name: tempName.trim() });
        setInstName(tempName.trim());
        setIsEditingName(false);
      }
    } catch (err) {
      console.error("Name update error:", err);
      setIsEditingName(false);
    }
  };

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
    <main className="p-4 md:p-6 lg:p-8 bg-gray-50/30 min-h-screen">
      <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col md:flex-row md:items-center gap-4"
        >
          <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-2xl border border-black/5 shadow-sm w-fit">
             <label className="relative cursor-pointer group">
               <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center overflow-hidden border border-black/5 shadow-inner">
                  <img src={instPhoto} alt="Inst Logo" className="w-full h-full object-contain p-0.5" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                    <Camera size={14} className="text-white" />
                  </div>
               </div>
               <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpdate} />
             </label>
             <div>
                <div className="flex items-center gap-2 mb-0.5">
                  {isEditingName ? (
                    <div className="flex items-center gap-2">
                      <input 
                        autoFocus
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        onBlur={handleNameUpdate}
                        onKeyDown={(e) => e.key === 'Enter' && handleNameUpdate()}
                        className="bg-gray-50 border-none ring-1 ring-black/10 rounded px-2 py-0.5 font-black text-black text-lg outline-none focus:ring-primary w-40"
                      />
                    </div>
                  ) : (
                    <h2 
                      onClick={() => { setTempName(instName); setIsEditingName(true); }}
                      className="font-black text-black text-lg leading-tight tracking-tight cursor-pointer hover:text-primary transition-colors flex items-center gap-2"
                    >
                      {instName || "Children Gate"}
                      <Edit2 size={12} className="opacity-0 group-hover:opacity-100" />
                    </h2>
                  )}
                  <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${plan === 'premium' ? 'bg-amber-100 text-amber-600' : plan === 'enterprise' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-400'}`}>
                    {plan}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-[9px] text-black/30 font-black uppercase tracking-widest leading-none border-r border-black/10 pr-2">기관 관리자</span>
                   <span className="text-primary text-[9px] font-black uppercase tracking-widest">{institutionId}</span>
                </div>
             </div>
          </div>
          
          <div className="w-px h-10 bg-black/5 hidden md:block"></div>
          
          <div>
            <h1 className="text-2xl font-black tracking-tight text-black flex items-center gap-2">
               <LayoutDashboard className="text-primary" size={24} />
               {instName || "Children Gate"}
            </h1>
            <p className="text-black/40 font-bold text-[10px] tracking-tight">통합 운영 현황 및 상시 모니터링 보드입니다.</p>
          </div>
        </motion.div>
        
        <div className="flex items-center gap-3">
            <button 
              onClick={() => router.push('/dashboard/admin/students')}
              className="apple-button-primary bg-black hover:bg-black/90 text-white flex items-center gap-2 shadow-xl shadow-black/10 border-none px-5 py-3 text-xs font-black"
            >
              <Users size={14} />
              학생 명단 관리
            </button>
            <button 
              onClick={async () => {
                if (window.confirm("로그아웃 하시겠습니까?")) {
                  try {
                    localStorage.removeItem("kg_auto_login");
                    if (auth) await auth.signOut();
                    window.location.href = "/login?type=institution&logout=true";
                  } catch (err) {
                    window.location.href = "/login?logout=true";
                  }
                }
              }}
              className="w-10 h-10 bg-white rounded-xl border border-black/5 flex items-center justify-center text-red-400 hover:text-red-600 hover:shadow-lg transition-all"
              title="Logout"
            >
                <LogOut size={16} />
            </button>
        </div>
      </header>

      {/* Grid Layout - Improved responsiveness for iPad */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-6">
        
        {/* Left Section (8 cols on XL, Full or half on MD) */}
        <div className="md:col-span-2 xl:col-span-8 space-y-6">
           
           {/* Summary Cards - Reduced Padding */}
           <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SummaryCard 
                label="전체 학생 규모" 
                value={totalStudents} 
                subtext="기관 등록 인원"
                icon={Users}
                color="primary"
                delay={0.05}
              />
               <SummaryCard 
                label="오늘 등교 확인" 
                value={`${currentlyPresentCount}명`}
                subtext={`정상 ${todayPresentCount} · 지각 ${todayLateCount}`}
                icon={CheckCircle2}
                color="emerald"
                delay={0.10}
              />
              <SummaryCard 
                label="하교 대기 요청" 
                value={pendingPickups} 
                subtext="실시간 요청 중"
                icon={Car}
                color="amber"
                alert={parseInt(pendingPickups) > 0}
                delay={0.15}
              />
           </section>

           {/* Quick Action Matrix - More compact */}
           <section className="bg-white rounded-[32px] border border-black/5 shadow-sm p-6">
              <h3 className="font-black text-lg flex items-center gap-2 mb-6">
                <TrendingUp className="text-primary" size={20} />
                시스템 빠른 실행
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <QuickAction 
                    icon={Plus} label="학생 등록" color="bg-blue-50 text-blue-600"
                    onClick={() => router.push('/dashboard/admin/students?add=true')} 
                  />
                  <QuickAction 
                    icon={MessageSquare} label="소식지 발송" color="bg-purple-50 text-purple-600"
                    onClick={() => router.push('/dashboard/admin/messages')}
                  />
                  <QuickAction 
                    icon={QrCode} label="기관 QR" color="bg-emerald-50 text-emerald-600"
                    onClick={() => router.push('/dashboard/admin/qr')}
                  />
                  <QuickAction 
                    icon={Calendar} label="일정 관리" color="bg-amber-50 text-amber-600"
                    onClick={() => router.push('/dashboard/admin/events')}
                  />
              </div>
           </section>

           {/* Schedule Board - List style to save space */}
           <section className="bg-white rounded-[32px] border border-black/5 p-6 shadow-sm">
               <div className="flex items-center justify-between mb-6">
                  <h3 className="font-black text-lg flex items-center gap-2">
                     <Calendar className="text-primary" size={20} />
                     오늘의 일정
                  </h3>
                  <button onClick={() => router.push('/dashboard/admin/events')} className="text-[10px] font-black text-primary bg-primary/5 px-3 py-1.5 rounded-full hover:bg-primary/10 transition-all uppercase tracking-widest">Manage</button>
               </div>
               
               <div className="grid gap-3">
                  {todayEvents.length > 0 ? todayEvents.map(event => (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={event.id} 
                        className="px-5 py-4 bg-gray-50/50 rounded-xl border border-black/5 flex items-center justify-between group hover:bg-white hover:shadow-lg hover:shadow-black/5 transition-all"
                    >
                       <div className="flex items-center gap-4">
                          <div className={`w-1 h-8 rounded-full ${event.color || 'bg-primary'}`}></div>
                          <div>
                             <p className="font-black text-black text-sm mb-1">{event.title}</p>
                             <div className="flex items-center gap-2">
                                <span className="text-[9px] font-black uppercase text-black/30 tracking-widest bg-white border border-black/5 px-2 py-0.5 rounded">{event.startTime} - {event.endTime}</span>
                             </div>
                          </div>
                       </div>
                       <ChevronRight size={16} className="text-black/10 group-hover:text-primary transition-all" />
                    </motion.div>
                  )) : (
                    <div className="py-8 text-center border-2 border-dashed border-black/5 rounded-2xl bg-gray-50/50">
                        <p className="text-black/30 text-xs font-black italic">오늘 등록된 공식 일정이 없습니다.</p>
                    </div>
                  )}
               </div>
           </section>
        </div>

        {/* Right Section (4 cols on XL, Full or half on MD) */}
        <div className="md:col-span-2 xl:col-span-4 space-y-6">
           
           {/* Activity Feed */}
           <section className="bg-white rounded-[32px] border border-black/5 p-6 shadow-sm h-fit">
              <h3 className="font-black text-lg mb-6 flex items-center gap-2">
                <Activity className="text-primary" size={20} />
                최신 활동
              </h3>
              <div className="space-y-5 relative">
                 <div className="absolute left-[17px] top-2 bottom-6 w-px bg-black/5"></div>
                 <AnimatePresence mode="popLayout">
                    {activities.length > 0 ? activities.map((act, idx) => (
                        <motion.div 
                           key={act.id} 
                           initial={{ opacity: 0, y: 5 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, scale: 0.95 }}
                           transition={{ delay: idx * 0.03 }}
                           className="flex items-center gap-3 group"
                        >
                           <div className="w-8 h-8 rounded-full bg-white border border-black/5 shadow-sm flex items-center justify-center relative z-10 group-hover:border-primary transition-colors">
                              <act.icon size={12} className={act.color || "text-primary"} />
                           </div>
                           <div className="flex-1 min-w-0">
                              <p className="text-xs font-black text-black truncate leading-tight mb-0.5">{act.user}</p>
                              <p className="text-[8px] text-black/40 font-black uppercase tracking-widest">{act.action}</p>
                           </div>
                           <span className="text-[8px] font-black text-black/20 font-mono italic">{act.time}</span>
                        </motion.div>
                    )) : <p className="text-center text-black/20 text-[10px] font-black py-10 italic">No Activity</p>}
                 </AnimatePresence>
              </div>
           </section>

           {/* Guides & Sharing Support */}
           <section className="bg-white rounded-[32px] border border-black/5 p-6 shadow-sm overflow-hidden">
              <h3 className="font-black text-lg mb-6 flex items-center gap-2">
                <Share2 className="text-primary" size={20} />
                가이드 및 공유
              </h3>
              
              <div className="space-y-4">
                 <div className="p-4 bg-gray-50 rounded-2xl border border-black/5 group hover:border-primary transition-all cursor-pointer" onClick={() => {
                    const guideText = `[공지] 우리 아이 안전 등하교 시스템 'Children Gate' 도입 안내\n\n안녕하세요, 우리 기관에서는 더욱 안전하고 신속한 등하교 관리를 위해 Children Gate 시스템을 도입하였습니다.\n\n✅ 등록 방법\n1. QR 코드를 스캔하거나 앱에 접속하세요.\n2. 우리 기관 코드 [ ${institutionId} ] 를 입력하세요.\n3. 자녀 정보를 입력하면 즉시 등록됩니다.`;
                    navigator.clipboard.writeText(guideText);
                    alert("학부모 안내용 가이드가 복사되었습니다!");
                 }}>
                    <h4 className="text-xs font-black mb-1 flex items-center justify-between">
                       학부모 안내 가이드
                       <span className="text-[10px] text-primary">Copy</span>
                    </h4>
                    <p className="text-[10px] text-black/40 font-bold leading-relaxed">가정통신문이나 알림톡에 바로 붙여넣으세요.</p>
                 </div>

                 <div className="p-4 bg-slate-900 rounded-2xl border border-white/10 group hover:border-primary transition-all cursor-pointer" onClick={() => {
                    const manualText = `⚠️ Children Gate 관리자 주의사항\n\n* 학생 추가: 학부모가 직접 등록하면 자동 추가됩니다.\n* 학생 삭제: 시트에서 해당 행을 삭제하거나 상태를 [퇴소]로 변경하세요.\n* 데이터 보호: 본 시트에는 아이들의 소중한 개인정보가 담겨 있습니다.\n* 장비 체크: 라벨 프린터 전원을 매일 아침 확인해 주세요.`;
                    navigator.clipboard.writeText(manualText);
                    alert("관리자 매뉴얼이 복사되었습니다!");
                 }}>
                    <h4 className="text-xs font-black mb-1 text-white flex items-center justify-between">
                       관리자 운영 매뉴얼
                       <span className="text-[10px] text-primary">Manual</span>
                    </h4>
                    <p className="text-[10px] text-white/30 font-bold leading-relaxed">운영 시 주의사항 및 관리 팁입니다.</p>
                 </div>
              </div>
           </section>

           <section className="bg-gradient-to-br from-slate-900 to-black rounded-[32px] p-6 text-white shadow-xl relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                 <div className="flex items-center gap-2 mb-6">
                    <TrendingUp size={16} className="text-primary" />
                    <span className="font-black text-[9px] uppercase tracking-widest text-primary">Intelligence</span>
                 </div>
                 <h4 className="text-lg font-black mb-2 leading-tight tracking-tight">똑똑한 출결 관리</h4>
                 <p className="text-white/40 text-[9px] font-bold leading-relaxed mb-6">
                    Children Gate만의 매칭 알고리즘으로 하교 시간을 혁신적으로 단축합니다.
                 </p>
                 <button className="w-full py-3.5 bg-white text-black rounded-xl font-black text-[10px] hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-lg">
                    제안하기 <ChevronRight size={14} />
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
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className={`p-5 bg-white rounded-[32px] border ${alert ? 'border-amber-400 ring-4 ring-amber-400/5' : 'border-black/5'} shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-black/5 transition-all duration-300`}
      >
         <div className="flex items-center justify-between mb-5">
            <div className={`w-10 h-10 rounded-xl ${colorMap[color] || colorMap.primary} flex items-center justify-center border transition-transform group-hover:-rotate-12 duration-500`}>
               <Icon size={20} />
            </div>
         </div>
         <div className="space-y-1">
            <h4 className="text-3xl font-black tracking-tighter text-black">{value}</h4>
            <p className="text-[9px] font-black text-black/30 uppercase tracking-[0.15em]">{label}</p>
         </div>
         <div className="mt-4 pt-4 border-t border-black/5 flex items-center justify-between">
            <span className="text-[9px] font-black text-black/40 italic">{subtext}</span>
            <ChevronRight size={12} className="text-black/10" />
         </div>
      </motion.div>
   );
}

function QuickAction({ icon: Icon, label, onClick, color }: any) {
    return (
       <motion.button 
         whileHover={{ y: -3 }}
         whileTap={{ scale: 0.98 }}
         onClick={onClick}
         className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-black/5 shadow-sm hover:border-primary/20 hover:shadow-lg transition-all group"
       >
          <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-500 shadow-sm border border-black/5`}>
             <Icon size={18} />
          </div>
          <span className="text-[9px] font-black text-black/40 group-hover:text-black transition-colors uppercase tracking-widest">{label}</span>
       </motion.button>
    );
 }
