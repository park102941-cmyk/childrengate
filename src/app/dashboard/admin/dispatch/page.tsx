"use client";






import { useState, useMemo, useEffect } from "react";
import { Search, Car, UserCheck, Clock, CheckCircle2, ChevronRight, X, AlertCircle, Phone, MessageSquare, MoreVertical, LogIn, LogOut, RefreshCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, updateDoc, doc, Timestamp, orderBy, getDocs, limit, addDoc, serverTimestamp, arrayUnion } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

interface DispatchStudent {
  id: string; // Document ID (Request ID or Student ID)
  studentId: string;
  name: string;
  grade: string;
  class: string;
  parentName: string;
  parentPhone?: string;
  status: "absent" | "present" | "pickup_requested" | "released";
  requestTime?: string;
  photo?: string;
  hasPendingRequest?: boolean; // New flag for the approval flow
  isApproved?: boolean;
  activeRequestId?: string; // Explicitly track the request ID
}

export default function DispatchDashboard() {
  const [students, setStudents] = useState<DispatchStudent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "pickup_requested" | "present" | "released" | "absent">("all");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const { institutionId } = useAuth();

  const [pickupRequests, setPickupRequests] = useState<any[]>([]);
  const [allStudentsData, setAllStudentsData] = useState<any[]>([]);

  useEffect(() => {
    if (!db || !institutionId) return;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // 1. Listen to real-time pickup requests (TODAY ONLY for better sync)
    const qRequests = query(
      collection(db, "pickup_requests"),
      where("institutionId", "==", institutionId),
      where("requestTime", ">=", Timestamp.fromDate(startOfToday)),
      orderBy("requestTime", "desc")
    );

    const unsubscribeRequests = onSnapshot(qRequests, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPickupRequests(data);
    }, (err) => {
      console.error("Pickup sync error:", err);
    });

    // 2. Listen to ALL students
    const qStudents = query(
      collection(db, "students"),
      where("institutionId", "==", institutionId)
    );

    const unsubscribeStudents = onSnapshot(qStudents, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAllStudentsData(data);
    });

    return () => {
      unsubscribeRequests();
      unsubscribeStudents();
    };
  }, [institutionId]);

  // Combine both sources and unify state
  useEffect(() => {
    const combined = allStudentsData.map(student => {
      const activeRequest = pickupRequests.find(r => r.studentId === student.id && (r.status === "pending" || r.status === "approved"));
      
      let status: DispatchStudent["status"] = student.status || "absent";
      let requestTime = "";
      let id = student.id; 
      let hasPendingRequest = false;
      let isApproved = false;

      if (activeRequest) {
        id = activeRequest.id;
        
        if (activeRequest.status === "pending") {
          // If pending, keep as 'present' so they don't disappear from the in-house list yet
          status = "present";
          hasPendingRequest = true;
        } else if (activeRequest.status === "approved") {
          // If approved, move to 'pickup_requested' status so they leave the in-house list
          status = "pickup_requested";
          isApproved = true;
        }
        
        if (activeRequest.requestTime?.toDate) {
          requestTime = activeRequest.requestTime.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
      } else {
        const completedRequest = pickupRequests.find(r => r.studentId === student.id && r.status === "completed");
        if (completedRequest) {
          status = "released";
          if (completedRequest.requestTime?.toDate) {
            requestTime = completedRequest.requestTime.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }
        }
      }

      return {
        id: id,
        studentId: student.id,
        name: student.name || "알 수 없음",
        class: student.class || "기본반",
        grade: student.grade || "미지정",
        parentName: student.parent || student.parentName || (student.parentEmail ? student.parentEmail.split('@')[0] : "보호자"),
        parentPhone: student.contact || student.phone || student.parentPhone,
        status: status,
        requestTime: requestTime,
        photo: student.photo,
        hasPendingRequest,
        isApproved,
        activeRequestId: activeRequest ? activeRequest.id : undefined
      } as DispatchStudent;
    });

    setStudents(combined);
  }, [pickupRequests, allStudentsData]);

  // Actions
  const handleApprove = async (student: DispatchStudent) => {
    setLoadingId(student.id);
    // Optimistic Update
    setStudents(prev => prev.map(s => s.id === student.id ? { ...s, status: 'pickup_requested', isApproved: true, hasPendingRequest: false } : s));

    try {
      if (!db || !student.activeRequestId) {
        console.error("Missing DB or Active Request ID");
        setLoadingId(null);
        return;
      }
      
      await updateDoc(doc(db, "pickup_requests", student.activeRequestId), {
        status: "approved",
        approvedAt: serverTimestamp()
      });

      await updateDoc(doc(db, "students", student.studentId), { 
        status: "pickup_requested",
        attendanceHistory: arrayUnion({
          timestamp: new Date(),
          type: "PICKUP_APPROVED",
          message: "하교 승인됨",
          status: "waiting"
        })
      });
    } catch (e) {
      console.error("Error approving request:", e);
      alert("승인 처리 중 오류 발생");
    } finally {
      setLoadingId(null);
    }
  };

  // Actions
  const handleCheckIn = async (student: DispatchStudent) => {
     try {
        if (!db || !institutionId) return;
        await updateDoc(doc(db, "students", student.studentId), { 
          status: "present",
          attendanceHistory: arrayUnion({
            timestamp: new Date(),
            type: "CHECK_IN",
            message: "정상 등교 (관리자 확인)",
            status: "present"
          })
        });
        await addDoc(collection(db, "checkin_logs"), {
           studentId: student.studentId,
           studentName: student.name,
           className: student.class,
           grade: student.grade,
           parentName: "Admin", // Assuming admin is performing check-in
           institutionId,
           timestamp: serverTimestamp(),
           status: "in"
        });
        alert(`${student.name} 등교 확인되었습니다.`);
     } catch (e) {
        console.error("Error checking in student:", e);
        alert("등교 처리 중 오류 발생");
     }
  };

  const handleResetStatus = async (student: DispatchStudent) => {
    if (!confirm(`${student.name}의 출결 상태를 초기화(미등교)하시겠습니까?`)) return;
    try {
       if (!db || !institutionId) return;
       await updateDoc(doc(db, "students", student.studentId), { status: "absent" });
       // Also cancel any pending requests
       const q = query(collection(db, "pickup_requests"), where("studentId", "==", student.studentId), where("status", "==", "pending"));
       const snap = await getDocs(q);
       for (const d of snap.docs) {
          await updateDoc(doc(db, "pickup_requests", d.id), { status: "cancelled" });
       }
       alert(`${student.name}의 상태가 초기화되었습니다.`);
    } catch (e) {
       console.error("Error resetting student status:", e);
       alert("상태 초기화 중 오류 발생");
    }
  };

  const handleAppMessage = async (student: DispatchStudent) => {
    const msg = prompt(`${student.name} 보호자에게 보낼 알림장 내용을 입력하세요:`);
    if (!msg) return;
    try {
       if (!db || !institutionId) return;
       await addDoc(collection(db, "messages"), {
          studentId: student.studentId,
          institutionId,
          sender: "admin",
          content: msg,
          timestamp: serverTimestamp(),
          type: "notice"
       });
       alert("학부모 포털로 알림이 전송되었습니다.");
    } catch (e) {
       console.error("Error sending app message:", e);
       alert("알림 전송 중 오류 발생");
    }
  };

  const handleCall = (student: DispatchStudent) => {
    if (student.parentPhone) {
      window.open(`tel:${student.parentPhone}`);
    } else {
      alert("등록된 보호자 연락처가 없습니다.");
    }
  };

  const handleSms = (student: DispatchStudent) => {
    if (student.parentPhone) {
      window.open(`sms:${student.parentPhone}`);
    } else {
      alert("등록된 보호자 연락처가 없습니다.");
    }
  };

  const handleRelease = async (student: DispatchStudent) => {
    setLoadingId(student.id);
    // Optimistic Update
    setStudents(prev => prev.map(s => s.id === student.id ? { ...s, status: 'released' } : s));

    try {
      if (!db) return;
      
      const requestId = student.activeRequestId;
      if (!requestId) {
        // Fallback: try to find an approved request if not in state
        const q = query(
          collection(db, "pickup_requests"), 
          where("studentId", "==", student.studentId),
          where("status", "==", "approved"),
          limit(1)
        );
        const snap = await getDocs(q);
        if (snap.empty) {
          throw new Error("진행 중인 하교 승인 내역을 찾을 수 없습니다.");
        }
        await updateDoc(doc(db, "pickup_requests", snap.docs[0].id), {
          status: "completed",
          releasedAt: Timestamp.now()
        });
      } else {
        await updateDoc(doc(db, "pickup_requests", requestId), {
          status: "completed",
          releasedAt: Timestamp.now()
        });
      }
      
      await updateDoc(doc(db, "students", student.studentId), { 
        status: "absent",
        lastReleaseTime: Timestamp.now(),
        attendanceHistory: arrayUnion({
          timestamp: new Date(),
          type: "PICKUP_RELEASED",
          message: "하교 인계 완료",
          status: "absent"
        })
      });

      // Removed blocking alert for smoother experience
      
      fetch("/api/sync-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "PICKUP_RELEASED",
          studentId: student.studentId,
          timestamp: new Date().toISOString()
        })
      }).catch(e => console.error("Report sync failed", e));

    } catch (e) {
      console.error("Error releasing student:", e);
      alert(e instanceof Error ? e.message : "하교 완료 처리 중 오류 발생");
    } finally {
      setLoadingId(null);
    }
  };

  const handleCancelRelease = async (student: DispatchStudent) => {
    try {
      if (!db || !student.activeRequestId) return;

      await updateDoc(doc(db, "pickup_requests", student.activeRequestId), {
        status: "pending",
        releasedAt: null
      });

      await updateDoc(doc(db, "students", student.studentId), { status: "present" });
    } catch (e) {
      console.error("Error canceling release:", e);
      alert("인계 취소 중 오류 발생");
    }
  };

  const filteredStudents = useMemo(() => {
    let result = students;
    if (filter === "present") {
      result = result.filter(s => s.status === "present" || s.status === "pickup_requested");
    } else if (filter !== "all") {
      result = result.filter(s => s.status === filter);
    }
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(lower) || 
        s.class.toLowerCase().includes(lower) ||
        s.parentName.toLowerCase().includes(lower)
      );
    }
    return result;
  }, [students, searchTerm, filter]);

  const groupedStudents = useMemo(() => {
    const groups: Record<string, DispatchStudent[]> = {};
    filteredStudents.forEach(student => {
      const key = `${student.grade} - ${student.class}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(student);
    });
    return groups;
  }, [filteredStudents]);

  return (
    <main className="p-6 md:p-10 lg:p-14 bg-gray-50 min-h-screen">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-black mb-1 flex items-center gap-3">
             등하교 관리
             <span className="px-3 py-1 bg-red-500/10 text-red-600 text-sm rounded-full tracking-widest uppercase flex items-center gap-1.5 font-bold">
               <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
               Live
             </span>
          </h1>
          <p className="text-black/50 font-semibold mt-2">학부모의 하교 요청을 실시간으로 확인하고 학생을 인계합니다.</p>
        </div>
      </header>

      {/* Stats/Filters Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-black/5 self-stretch md:self-auto overflow-x-auto">
          <FilterButton active={filter === "all"} onClick={() => setFilter("all")} label="전체" icon={UserCheck} count={students.length} />
          <FilterButton active={filter === "present"} onClick={() => setFilter("present")} label="원내 보육" icon={UserCheck} count={students.filter(s => s.status === 'present' || s.status === 'pickup_requested').length} />
          <FilterButton active={filter === "pickup_requested"} onClick={() => setFilter("pickup_requested")} label="하교 중" icon={Clock} count={students.filter(s => s.status === 'pickup_requested').length} alert />
          <FilterButton active={filter === "released"} onClick={() => setFilter("released")} label="하교 완료" icon={CheckCircle2} count={students.filter(s => s.status === 'released').length} />
          <FilterButton active={filter === "absent"} onClick={() => setFilter("absent")} label="미등교" icon={AlertCircle} count={students.filter(s => s.status === 'absent').length} />
        </div>

        <div className="relative w-full md:w-auto min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" size={18} />
          <input 
            type="text" 
            placeholder="이름, 반, 부모님 검색..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-black/5 rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold text-black transition-all shadow-sm"
          />
        </div>
      </div>

      {Object.keys(groupedStudents).length === 0 ? (
        <div className="bg-white rounded-[40px] border border-black/5 p-20 flex flex-col items-center justify-center text-center">
           <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Car className="text-black/20" size={40} />
           </div>
           <h3 className="text-xl font-black text-black mb-2">학생이 없습니다.</h3>
           <p className="text-black/40 font-bold">조건에 맞는 학생 데이터가 존재하지 않습니다.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(groupedStudents).map(([groupName, groupStudents]) => (
            <section key={groupName} className="bg-white rounded-[32px] border border-black/5 shadow-sm overflow-hidden">
               <div className="bg-gradient-to-r from-gray-50 to-white px-8 py-5 border-b border-black/5 flex items-center justify-between">
                 <h2 className="text-lg font-black text-black flex items-center gap-3">
                    <span className="w-2 h-6 bg-primary rounded-full"></span>
                    {groupName}
                 </h2>
                 <span className="bg-white px-3 py-1 rounded-xl text-xs font-black border border-black/5 shadow-sm">
                    {groupStudents.length}명
                 </span>
               </div>
               
               <div className="divide-y divide-black/5">
                 <AnimatePresence>
                   {groupStudents.map(student => (
                     <motion.div 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        key={student.id} 
                        className={`p-6 flex flex-col xl:flex-row items-center justify-between gap-6 transition-colors ${student.status === 'pickup_requested' ? 'bg-orange-50/30' : 'hover:bg-gray-50'}`}
                     >
                        <div className="flex items-center gap-5 w-full xl:w-auto">
                           <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-xl border-2 shadow-sm ${
                              student.status === 'pickup_requested' ? 'bg-orange-100 text-orange-600 border-orange-200' : 
                              student.status === 'released' ? 'bg-emerald-100 text-emerald-600 border-emerald-200' : 
                              student.status === 'present' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                              'bg-gray-100 text-gray-500 border-white opacity-50'
                           }`}>
                              {student.photo ? <img src={student.photo} alt={student.name} className="w-full h-full object-cover rounded-full" /> : student.name.charAt(0)}
                           </div>
                           
                           <div>
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className={`text-xl font-black ${student.status === 'absent' ? 'text-black/30' : 'text-black'}`}>{student.name}</h3>
                                {student.hasPendingRequest && (
                                   <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-[10px] font-black rounded-lg uppercase flex items-center gap-1 border border-amber-200 shadow-sm animate-pulse w-fit">
                                      <Car size={10} /> 하교 요청됨
                                   </span>
                                )}
                                {student.status === 'pickup_requested' && (
                                   <span className="px-2.5 py-1 bg-orange-100 text-orange-700 text-[10px] font-black rounded-lg uppercase flex items-center gap-1 border border-orange-200 shadow-sm w-fit">
                                      <UserCheck size={10} /> 하교 승인됨
                                   </span>
                                )}
                                {student.status === 'released' && (
                                   <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-lg uppercase flex items-center gap-1 border border-emerald-200 w-fit">
                                      <CheckCircle2 size={10} /> 하교 완료
                                   </span>
                                )}
                                {student.status === 'absent' && !student.hasPendingRequest && (
                                   <span className="px-2.5 py-1 bg-gray-100 text-gray-400 text-[10px] font-black rounded-lg uppercase flex items-center gap-1 border border-gray-200 w-fit">
                                      <AlertCircle size={10} /> 미등교
                                   </span>
                                )}
                              </div>
                              <p className="text-sm font-bold text-black/50 flex items-center gap-2">
                                보호자: <span className={student.status === 'absent' ? 'text-black/30' : 'text-black'}>{student.parentName}</span>
                                {student.requestTime && (student.hasPendingRequest || student.status === 'pickup_requested' || student.status === 'released') && (
                                   <>
                                     <span className="w-1 h-1 bg-black/20 rounded-full"></span>
                                     <span className={`${student.status === 'released' ? 'text-black/30' : 'text-orange-600'} flex items-center gap-1`}>
                                       <Clock size={12}/> {student.requestTime} {student.status === 'released' ? '하교' : '요청'}
                                     </span>
                                   </>
                                )}
                              </p>
                           </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
                           {/* Quick Actions Support */}
                           <div className="flex items-center gap-1 pr-4 border-r border-black/5">
                              <button onClick={() => handleCall(student)} className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all active:scale-95" title="전화">
                                <Phone size={18} />
                              </button>
                              <button onClick={() => handleSms(student)} className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all active:scale-95" title="문자">
                                <MessageSquare size={18} />
                              </button>
                              <button onClick={() => handleAppMessage(student)} className="p-2.5 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100 transition-all active:scale-95" title="앱 알림">
                                <RefreshCcw size={18} />
                              </button>
                           </div>

                           {student.status === 'absent' && (
                              <button 
                                onClick={() => handleCheckIn(student)}
                                className="flex-1 sm:flex-none px-6 py-3 bg-emerald-500 text-white rounded-2xl font-black shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 active:scale-95 transition-all flex items-center justify-center gap-2"
                              >
                                수동 등교 처리 <LogIn size={18} />
                              </button>
                           )}

                           {student.hasPendingRequest && (
                              <button 
                                onClick={() => handleApprove(student)}
                                disabled={loadingId === student.id}
                                className="flex-1 sm:flex-none px-6 py-3 bg-amber-500 text-white rounded-2xl font-black shadow-xl shadow-amber-500/20 hover:bg-amber-600 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {loadingId === student.id ? (
                                  <RefreshCcw size={18} className="animate-spin" />
                                ) : (
                                  <>하교 승인하기 <CheckCircle2 size={18} /></>
                                )}
                              </button>
                           )}

                           {student.status === 'present' && !student.hasPendingRequest && (
                              <button 
                                onClick={() => handleResetStatus(student)}
                                className="flex-1 sm:flex-none px-4 py-3 bg-white border border-black/10 text-black/50 rounded-2xl font-bold hover:bg-red-50 hover:text-red-500 active:scale-95 transition-all flex items-center justify-center gap-2"
                              >
                                <RefreshCcw size={16} /> 등교 취소
                              </button>
                           )}

                           {student.status === 'pickup_requested' && (
                              <button 
                                onClick={() => handleRelease(student)}
                                disabled={loadingId === student.id}
                                className="flex-1 sm:flex-none px-6 py-3 bg-black text-white rounded-2xl font-black shadow-xl shadow-black/20 hover:bg-gray-800 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {loadingId === student.id ? (
                                  <RefreshCcw size={18} className="animate-spin" />
                                ) : (
                                  <>하교 완료 처리 <CheckCircle2 size={18} /></>
                                )}
                              </button>
                           )}
                           {student.status === 'released' && (
                              <button 
                                onClick={() => handleCancelRelease(student)}
                                className="flex-1 sm:flex-none px-4 py-3 bg-white border border-black/10 text-black/50 rounded-2xl font-bold hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center gap-2"
                              >
                                <X size={16} /> 인계 취소
                              </button>
                           )}
                        </div>
                     </motion.div>
                   ))}
                 </AnimatePresence>
               </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}

function FilterButton({ active, onClick, label, icon: Icon, count, alert }: any) {
  return (
    <button 
      onClick={onClick}
      className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all text-sm ${
        active ? "bg-black text-white shadow-md shadow-black/20" : "text-black/50 hover:bg-black/5 hover:text-black"
      }`}
    >
      <Icon size={16} className={alert && !active ? "text-orange-500" : ""} />
      {label}
      <span className={`px-2 py-0.5 rounded-lg text-xs ml-1 ${active ? "bg-white/20" : "bg-black/5"}`}>
        {count}
      </span>
      {alert && count > 0 && (
         <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orange-500 border-2 border-white"></span>
      )}
    </button>
  );
}
