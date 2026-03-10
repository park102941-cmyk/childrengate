"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { 
    doc, 
    getDoc, 
    collection, 
    query, 
    where, 
    orderBy, 
    limit, 
    getDocs,
    updateDoc
} from "firebase/firestore";
import { QRCodeSVG } from "qrcode.react";
import Barcode from "react-barcode";
import { 
    ArrowLeft, 
    Users, 
    Calendar, 
    Clock, 
    Edit3, 
    ShieldAlert, 
    CheckCircle2, 
    User, 
    MessageSquare, 
    Paperclip, 
    Send, 
    FileIcon,
    Camera,
    Heart,
    Home,
    Car,
    QrCode,
    RefreshCcw,
    XCircle,
    ShieldCheck
} from "lucide-react";

interface Activity {
  id: string;
  date: string;
  checkIn: string;
  checkOut: string | null;
  status: "present" | "absent";
  checkedInBy: string;
  checkedOutBy: string | null;
}

export default function StudentDetailClient() {
  const { t } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const { institutionId } = useAuth();
  const id = params?.id as string;

  const [student, setStudent] = useState<any>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("30days");
  const [comment, setComment] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [familyData, setFamilyData] = useState<any>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const dailySeed = new Date().toISOString().split('T')[0].replace(/-/g, '');

  useEffect(() => {
    if (!id || !db || !institutionId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch Student
        const studentRef = doc(db!, "students", id);
        const studentSnap = await getDoc(studentRef);
        
        if (studentSnap.exists()) {
          const data = studentSnap.data();
          // Security check
          if (data.institutionId !== institutionId) {
            alert("권한이 없습니다.");
            router.push("/dashboard/admin/students");
            return;
          }
          setStudent({ id: studentSnap.id, ...data });

          // Fetch Family Info if parentEmail exists
          if (data.parentEmail) {
            try {
              // 1. Check parent_profiles (detailed info)
              const profileSnap = await getDoc(doc(db!, "parent_profiles", data.parentEmail));
              if (profileSnap.exists()) {
                 setFamilyData(profileSnap.data());
              } else {
                 // 2. Fallback to users collection (basic info)
                 const familyQ = query(collection(db!, "users"), where("email", "==", data.parentEmail));
                 const familySnap = await getDocs(familyQ);
                 if (!familySnap.empty) {
                    setFamilyData(familySnap.docs[0].data());
                 }
              }
            } catch (err) {
              console.error("Error fetching family data:", err);
            }
          }

          // Fetch Activities (logs)
          const qLogs = query(
            collection(db!, "checkin_logs"),
            where("studentId", "==", id),
            limit(100)
          );
          const logsSnap = await getDocs(qLogs);
          const logsList = logsSnap.docs.map(doc => {
            const d = doc.data();
            const date = d.timestamp?.toDate ? d.timestamp.toDate() : new Date();
            let checkInBy = d.parentName || "시스템";
            if (d.type === 'manual') checkInBy = "선생님 직접 입력";
            else if (d.type === 'qr') checkInBy = "QR 스캔";

            return {
              id: doc.id,
              date: date.toISOString().split('T')[0],
              checkIn: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
              checkOut: d.checkOutTime ? d.checkOutTime.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : "-",
              status: d.status === 'in' ? "present" : (d.status === 'out' ? "absent" : (d.status || "present")),
              checkedInBy: checkInBy,
              checkedOutBy: d.approvedBy || "-"
            } as Activity;
          });

          // Merge with new attendanceHistory if exists
          const historyData = data.attendanceHistory || [];
          const historyList = historyData.map((h: any, idx: number) => {
            const date = h.timestamp?.toDate ? h.timestamp.toDate() : new Date(h.timestamp);
            return {
              id: `hist-${idx}`,
              date: date.toISOString().split('T')[0],
              checkIn: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              checkOut: "-",
              status: h.status || "present",
              checkedInBy: h.message || h.type,
              checkedOutBy: "-"
            } as Activity;
          });

          const combinedLogs = [...historyList, ...logsList].sort((a, b) => {
             const timeA = new Date(a.date + 'T' + (a.checkIn.includes(':') ? a.checkIn : '00:00')).getTime();
             const timeB = new Date(b.date + 'T' + (b.checkIn.includes(':') ? b.checkIn : '00:00')).getTime();
             return timeB - timeA;
          });
          setActivities(combinedLogs.slice(0, 100));
        } else {
          router.push("/dashboard/admin/students");
          return;
        }

      } catch (err) {
        console.error("Fetch student detail error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, institutionId, db]);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment) return;
    setPosts([{ id: Date.now(), text: comment, date: new Date().toISOString().split('T')[0], file: null }, ...posts]);
    setComment("");
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
       <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="font-bold text-black/40">정보를 불러오는 중...</p>
       </div>
    </div>
  );

  if (!student) return null;

  return (
    <main className="p-6 md:p-10 lg:p-14 bg-gray-50/50 min-h-screen">
      <header className="mb-10">
        <button 
          onClick={() => router.push('/dashboard/admin/students')}
          className="flex items-center gap-2 text-primary font-bold hover:underline mb-6 group transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:-translate-x-1 transition-transform">
            <ArrowLeft size={16} />
          </div>
          {t.dashboard.studentProfile?.backToList || "학생 목록으로 돌아가기"}
        </button>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-[32px] bg-gradient-to-tr from-primary/20 to-primary/5 flex items-center justify-center font-black text-primary text-4xl uppercase shadow-inner border border-white relative overflow-hidden group">
               {student.photo ? (
                 <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
               ) : student.name.charAt(0)}
               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                  <Camera size={20} className="text-white" />
               </div>
               {student.isActive !== false && (
                 <div className="absolute top-2 right-2 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
               )}
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-4xl font-black tracking-tight text-black">{student.name}</h1>
                <div className="flex flex-wrap items-center gap-2">
                   <span className="px-3 py-1 bg-white border border-black/10 rounded-lg text-[10px] font-black shadow-sm uppercase tracking-widest text-black/60">{student.grade}</span>
                   <span className="px-3 py-1 bg-primary text-white rounded-lg text-[10px] font-black shadow-sm uppercase tracking-widest">{student.class}</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-black/60 font-medium mt-3">
                <span className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-black/5 text-sm shadow-sm">
                   <Users size={14} className="text-primary" /> 
                   <span className="text-black font-bold">{student.parent}</span>
                </span>
                <span className="text-black/20">•</span>
                <span className="font-mono text-sm bg-gray-100/50 px-2 py-0.5 rounded italic">{student.contact}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <button 
               onClick={() => setShowQrModal(true)}
               className="apple-button-secondary flex items-center gap-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
             >
               <QrCode size={18} />
               보안 QR 패스 확인
             </button>
             <button className="apple-button-secondary flex items-center gap-2">
               <Edit3 size={18} />
               {t.dashboard.studentProfile?.editProfile || "정보 수정"}
             </button>
             <button className="apple-button-primary bg-black hover:bg-black/90 text-white flex items-center gap-2 shadow-xl shadow-black/10 border-none">
               <Calendar size={18} />
               출석부 수동 입력
             </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-6">
          {student.medical && (
            <div className="bg-red-50 border border-red-100 rounded-[32px] p-8 shadow-sm">
              <h3 className="flex items-center gap-2 text-red-600 font-bold mb-3 uppercase tracking-tighter text-sm">
                <ShieldAlert size={18} />
                Medical & Allergies
              </h3>
              <p className="text-red-900 font-black text-xl leading-snug">{student.medical}</p>
            </div>
          )}

          <div className="bg-white border border-black/5 rounded-[32px] p-8 shadow-sm">
            <h3 className="font-black text-xl mb-6 flex items-center gap-2 text-slate-800">
              <User size={20} className="text-primary" />
              General Profile
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 border-b border-black/5 pb-4 last:border-0 last:pb-0 items-center">
                <span className="text-black/50 font-black tracking-widest uppercase text-[10px]">Unique ID</span>
                <span className="font-mono font-bold text-black bg-gray-100 px-3 py-1 rounded-xl w-fit justify-self-end text-xs shadow-inner uppercase">{student.id.toUpperCase().substring(0,8)}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 border-b border-black/5 pb-4 last:border-0 last:pb-0 items-center">
                <span className="text-black/50 font-black tracking-widest uppercase text-[10px]">Registration</span>
                <span className="font-bold text-black text-right">{student.createdAt?.toDate ? student.createdAt.toDate().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }) : "2026. 01. 10."}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 border-b border-black/5 pb-4 last:border-0 last:pb-0 items-center">
                <span className="text-black/50 font-black tracking-widest uppercase text-[10px]">Institution</span>
                 <span className="font-black text-primary text-right uppercase tracking-tight">{student.institutionId || institutionId || "-"}</span>
              </div>
            </div>
          </div>

          {familyData && (
             <div className="bg-white border border-black/5 rounded-[32px] p-8 shadow-sm space-y-8">
               <h3 className="font-black text-xl flex items-center gap-2 border-b border-black/5 pb-4 text-slate-800">
                 <Heart size={20} className="text-rose-500" />
                 가족 정보 (Family Info)
               </h3>
               
               {/* Father Info */}
               <div className="space-y-4">
                 <div className="flex items-center gap-2">
                   <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                   <h4 className="font-black text-sm text-black/80 uppercase tracking-widest">부 (Father)</h4>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="bg-slate-50 p-4 rounded-2xl border border-black/5">
                     <p className="text-[10px] font-black text-black/50 uppercase mb-1">성명</p>
                     <p className="font-bold text-black">{familyData.fatherName || "-"}</p>
                   </div>
                   <div className="bg-slate-50 p-4 rounded-2xl border border-black/5">
                     <p className="text-[10px] font-black text-black/50 uppercase mb-1">연락처</p>
                     <p className="font-mono text-xs font-bold text-black">{familyData.fatherPhone || "-"}</p>
                   </div>
                 </div>
               </div>

               {/* Mother Info */}
               <div className="space-y-4">
                 <div className="flex items-center gap-2">
                   <div className="w-1.5 h-6 bg-rose-500 rounded-full"></div>
                   <h4 className="font-black text-sm text-black/80 uppercase tracking-widest">모 (Mother)</h4>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="bg-slate-50 p-4 rounded-2xl border border-black/5">
                     <p className="text-[10px] font-black text-black/50 uppercase mb-1">성명</p>
                     <p className="font-bold text-black">{familyData.motherName || "-"}</p>
                   </div>
                   <div className="bg-slate-50 p-4 rounded-2xl border border-black/5">
                     <p className="text-[10px] font-black text-black/50 uppercase mb-1">연락처</p>
                     <p className="font-mono text-xs font-bold text-black">{familyData.motherPhone || "-"}</p>
                   </div>
                 </div>
               </div>

               {/* Address Info */}
               <div className="space-y-4">
                 <div className="flex items-center gap-2">
                    <Home size={18} className="text-emerald-500" />
                    <h4 className="font-black text-sm text-black/80 uppercase tracking-widest">주소 및 기타 정보</h4>
                 </div>
                 <div className="grid gap-4">
                    <div className="bg-slate-50 p-5 rounded-2xl border border-black/5">
                        <p className="text-[10px] font-black text-black/50 uppercase mb-2">Residential Address</p>
                        {familyData.street ? (
                          <p className="font-bold text-black leading-relaxed">
                            {familyData.street}<br/>
                            {familyData.city}, {familyData.state} {familyData.zip}
                          </p>
                        ) : (
                          <p className="font-bold text-black leading-relaxed">{familyData.address || "등록된 주소가 없습니다."}</p>
                        )}
                    </div>
                    
                    {familyData.carNumber && (
                      <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <Car size={20} className="text-blue-500" />
                            <div>
                               <p className="text-[10px] font-black text-blue-400 uppercase">Registered Car</p>
                               <p className="text-lg font-black text-blue-900 tracking-widest">{familyData.carNumber}</p>
                            </div>
                         </div>
                         <span className="text-[9px] font-black text-blue-300 uppercase border border-blue-200 px-2 py-1 rounded-md tracking-tighter">Verified</span>
                      </div>
                    )}
                 </div>
               </div>
             </div>
           )}

          <div className="bg-white border border-black/5 rounded-[32px] p-8 shadow-sm">
            <h3 className="font-black text-xl mb-6 flex items-center gap-2 text-slate-800">
              <MessageSquare size={20} className="text-primary" />
              Communication Log
            </h3>
            
            <form onSubmit={handlePostComment} className="mb-6 flex gap-2 border border-black/10 p-2 rounded-2xl bg-gray-50 focus-within:ring-2 focus-within:ring-primary transition-all">
               <button type="button" className="p-3 text-black/40 hover:text-black hover:bg-black/5 rounded-xl transition-colors">
                 <Paperclip size={18} />
               </button>
               <input 
                 type="text" 
                 placeholder="관리 메모 또는 학부모 알림..." 
                 className="flex-1 bg-transparent border-none outline-none font-medium px-2 text-sm text-black placeholder:text-black/30"
                 value={comment}
                 onChange={e => setComment(e.target.value)}
               />
               <button type="submit" className="p-3 bg-primary text-white rounded-xl shadow-md hover:bg-primary-hover transition-colors">
                 <Send size={18} />
               </button>
            </form>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {posts.map(post => (
                <div key={post.id} className="p-5 bg-gray-50/50 rounded-2xl border border-black/5">
                  <p className="text-sm font-bold text-black mb-2 leading-relaxed">{post.text}</p>
                  {post.file && (
                    <div className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-black/10 rounded-xl text-xs font-bold text-primary cursor-pointer hover:bg-primary/5 transition-colors">
                      <FileIcon size={14} />
                      {post.file}
                    </div>
                  )}
                  <p className="text-[10px] font-black text-black/20 text-right mt-3 uppercase">{post.date}</p>
                </div>
              ))}
              {posts.length === 0 && (
                 <div className="py-10 text-center opacity-20 italic font-bold">기록된 메모가 없습니다.</div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <section className="bg-white rounded-[40px] border border-black/5 shadow-sm p-8 md:p-10">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 border-b border-black/5 pb-8">
              <h2 className="text-2xl font-black text-black flex items-center gap-3">
                <Calendar className="text-primary" size={26} />
                {t.dashboard.studentProfile?.attendanceHistory || "전체 출결 활동 내역"}
              </h2>
              <div className="flex items-center gap-3 bg-gray-100 p-1.5 rounded-2xl">
                 {['7days', '30days', '90days'].map(filt => (
                    <button 
                       key={filt}
                       onClick={() => setTimeFilter(filt)}
                       className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${timeFilter === filt ? 'bg-white text-primary shadow-sm' : 'text-black/40 hover:text-black/60'}`}
                    >
                       {filt === '7days' ? '7일' : filt === '30days' ? '30일' : filt === '90days' ? '3개월' : filt}
                    </button>
                 ))}
              </div>
            </header>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-black/30 text-[10px] font-black uppercase tracking-widest border-b border-black/5">
                    <th className="px-6 py-4">{t.dashboard.studentProfile?.date || "Date"}</th>
                    <th className="px-6 py-4">{t.dashboard.studentProfile?.checkIn || "Check-in"}</th>
                    <th className="px-6 py-4">{t.dashboard.studentProfile?.checkOut || "Check-out"}</th>
                    <th className="px-6 py-4">{t.dashboard.studentProfile?.status || "Status"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {activities.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-24 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-black/5">
                           <Clock className="text-black/10" size={24} />
                        </div>
                        <p className="text-black/30 font-bold italic tracking-tight">
                           {t.dashboard.studentProfile?.noHistory || "출결 활동 기록이 없습니다."}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    activities.map((act) => (
                      <tr key={act.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-6 py-6 font-black text-black text-sm">{act.date}</td>
                        <td className="px-6 py-6">
                          {act.checkIn !== "-" ? (
                            <div className="flex flex-col">
                              <span className="font-black text-black text-base flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> {act.checkIn}
                              </span>
                              <span className="text-[10px] font-black text-black/30 uppercase mt-1 tracking-wider">{act.checkedInBy}</span>
                            </div>
                          ) : <span className="text-black/10 font-black">-</span>}
                        </td>
                        <td className="px-6 py-6">
                          {act.checkOut !== "-" ? (
                            <div className="flex flex-col">
                              <span className="font-black text-black text-base flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> {act.checkOut}
                              </span>
                              <span className="text-[10px] font-black text-black/30 uppercase mt-1 tracking-wider group-hover:text-primary transition-colors">{act.checkedOutBy}</span>
                            </div>
                          ) : <span className="text-black/10 font-black">-</span>}
                        </td>
                        <td className="px-6 py-6">
                          {act.status === "present" ? (
                            <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm shadow-emerald-500/5">
                              <CheckCircle2 size={14} />
                              {t.dashboard.studentProfile?.present || "Present"}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100">
                              {t.dashboard.studentProfile?.absent || "Absent"}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {activities.length > 0 && (
               <div className="mt-10 pt-8 border-t border-black/5 flex justify-center">
                  <button className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-black/60 font-black text-xs rounded-2xl transition-all shadow-sm">
                     로그 데이터 더 불러오기
                  </button>
               </div>
            )}
          </section>
        </div>
      </div>

      {/* Dynamic QR Modal */}
      <AnimatePresence>
        {showQrModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               onClick={() => setShowQrModal(false)}
               className="absolute inset-0 bg-black/60 backdrop-blur-xl"
            />
            <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 20 }}
               className="relative bg-white w-full max-w-sm rounded-[40px] overflow-hidden shadow-2xl"
            >
               <div className="p-8 text-center bg-gradient-to-b from-indigo-50 to-white">
                  <div className="w-16 h-16 bg-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-4 text-indigo-600">
                    <QrCode size={32} />
                  </div>
                  <h3 className="text-xl font-black text-black">Student Security Pass</h3>
                  <p className="text-black/40 font-bold text-xs uppercase tracking-widest mt-1">학부모 휴대폰에 표시되는 동일한 화면입니다</p>
               </div>
               
               <div className="px-8 pb-10 flex flex-col items-center">
                  <div className="bg-white p-6 rounded-[32px] border-2 border-indigo-100 shadow-inner mb-2 flex flex-col items-center gap-4">
                    <QRCodeSVG 
                      value={`kgp:${student.id}:${dailySeed}`}
                      size={180}
                      level="H"
                      includeMargin={true}
                    />
                    <div className="w-full h-px bg-black/5"></div>
                    <Barcode 
                      value={student.barcodeId || student.id} 
                      width={1.2}
                      height={40}
                      fontSize={10}
                    />
                  </div>
                  
                  <p className="text-[9px] font-bold text-indigo-600 mb-6 uppercase tracking-tighter flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <ShieldCheck size={10} /> 
                      당일 보안 패스 (Admin Preview)
                    </span>
                    <span className="text-black/10">|</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </p>
                  
                  <div className="w-full bg-slate-50 p-5 rounded-2xl mb-8 flex items-center gap-4">
                     <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-black/20">
                        <User size={24} />
                     </div>
                     <div className="text-left">
                        <p className="text-[10px] font-black text-black/50 uppercase">Student Name</p>
                        <p className="font-black text-black">{student.name}</p>
                     </div>
                  </div>

                  <button 
                    onClick={() => setShowQrModal(false)}
                    className="w-full py-4 bg-black text-white font-black rounded-2xl hover:opacity-80 transition-all active:scale-95 shadow-xl"
                  >
                    확인 완료
                  </button>
               </div>
               
               <div className="bg-indigo-600 py-3 text-center">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center justify-center gap-2">
                    <ShieldCheck size={12} /> Secure Gateway Protocol v1.5
                  </p>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
