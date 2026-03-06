"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
    Camera
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
        } else {
          router.push("/dashboard/admin/students");
          return;
        }

        // Fetch Activities (logs)
        const qLogs = query(
          collection(db!, "checkin_logs"),
          where("studentId", "==", id),
          orderBy("timestamp", "desc"),
          limit(30)
        );
        const logsSnap = await getDocs(qLogs);
        const logsList = logsSnap.docs.map(doc => {
          const d = doc.data();
          const date = d.timestamp?.toDate() || new Date();
          return {
            id: doc.id,
            date: date.toISOString().split('T')[0],
            checkIn: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            checkOut: d.checkOutTime ? d.checkOutTime.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-",
            status: d.status || "present",
            checkedInBy: d.type === 'manual' ? "선생님 직접 입력" : "QR 스캔",
            checkedOutBy: d.approvedBy || "-"
          } as Activity;
        });
        setActivities(logsList);

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
    <div className="flex-1 lg:ml-64 min-h-screen bg-gray-50/50 flex items-center justify-center">
       <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="font-bold text-black/40">정보를 불러오는 중...</p>
       </div>
    </div>
  );

  if (!student) return null;

  return (
    <main className="flex-1 lg:ml-64 p-6 md:p-10 lg:p-14 bg-gray-50/50 min-h-screen">
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
                <div className="flex items-center gap-1.5">
                   <span className="px-3 py-1 bg-white border border-black/10 rounded-lg text-[10px] font-black shadow-sm uppercase tracking-widest">{student.grade}</span>
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
            <h3 className="font-black text-xl mb-6 flex items-center gap-2">
              <User size={20} className="text-primary" />
              General Profile
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex justify-between border-b border-black/5 pb-3">
                <span className="text-black/40 font-bold tracking-wide uppercase text-[10px]">Unique ID</span>
                <span className="font-mono font-bold text-black bg-gray-50 px-2 py-0.5 rounded">{student.id.toUpperCase().substring(0,8)}</span>
              </li>
              <li className="flex justify-between border-b border-black/5 pb-3">
                <span className="text-black/40 font-bold tracking-wide uppercase text-[10px]">Registration</span>
                <span className="font-bold text-black">{student.createdAt?.toDate().toLocaleDateString() || "2026-01-10"}</span>
              </li>
              <li className="flex justify-between pb-1">
                <span className="text-black/40 font-bold tracking-wide uppercase text-[10px]">Institution</span>
                <span className="font-bold text-primary">{institutionId}</span>
              </li>
            </ul>
          </div>

          <div className="bg-white border border-black/5 rounded-[32px] p-8 shadow-sm">
            <h3 className="font-black text-xl mb-6 flex items-center gap-2">
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
    </main>
  );
}
