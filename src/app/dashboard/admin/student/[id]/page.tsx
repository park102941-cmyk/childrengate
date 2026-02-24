"use client";


export const runtime = "edge";


import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowLeft, Users, Calendar, Clock, Edit3, ShieldAlert, CheckCircle2, User, MessageSquare, Paperclip, Send, FileIcon } from "lucide-react";

interface Activity {
  id: string;
  date: string;
  checkIn: string;
  checkOut: string | null;
  status: "present" | "absent";
  checkedInBy: string;
  checkedOutBy: string | null;
}

export default function StudentProfilePage() {
  const { t } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // Mock data fetching based on ID
  const [student, setStudent] = useState<any>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [timeFilter, setTimeFilter] = useState("30days");
  const [comment, setComment] = useState("");
  const [posts, setPosts] = useState([
    { id: 1, text: "이번 학기부터 미술 수업에 잘 집중하고 있습니다.", date: "2026-02-20", file: null },
    { id: 2, text: "첨부된 학업 성취도 평가 결과를 확인해 주세요.", date: "2026-02-15", file: "성적표.pdf" }
  ]);

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment) return;
    setPosts([{ id: Date.now(), text: comment, date: new Date().toISOString().split('T')[0], file: null }, ...posts]);
    setComment("");
  };

  useEffect(() => {
    // Simulate fetching student details
    setStudent({
      id,
      name: "김지우",
      class: "민들레반",
      parent: "보호자 김영수",
      contact: "010-1234-5678",
      medical: "땅콩 알러지 (NO PEANUTS)",
      isActive: true
    });

    // Simulate fetching attendance history
    setActivities([
      { id: "1", date: "2026-03-01", checkIn: "08:52 AM", checkOut: "03:15 PM", status: "present", checkedInBy: "자가 스캔", checkedOutBy: "선생님 이지현" },
      { id: "2", date: "2026-02-28", checkIn: "08:55 AM", checkOut: "03:20 PM", status: "present", checkedInBy: "자가 스캔", checkedOutBy: "선생님 이지현" },
      { id: "3", date: "2026-02-27", checkIn: "-", checkOut: "-", status: "absent", checkedInBy: "-", checkedOutBy: "-" },
      { id: "4", date: "2026-02-26", checkIn: "09:02 AM", checkOut: "03:00 PM", status: "present", checkedInBy: "자가 스캔", checkedOutBy: "선생님 이지현" },
    ]);
  }, [id]);

  if (!student) return <div className="p-10 text-center animate-pulse">Loading profile...</div>;

  return (
    <main className="flex-1 lg:ml-64 p-6 md:p-10 lg:p-14 bg-gray-50/50">
      <header className="mb-10">
        <button 
          onClick={() => router.push('/dashboard/admin')}
          className="flex items-center gap-2 text-primary font-bold hover:underline mb-6"
        >
          <ArrowLeft size={16} />
          {t.dashboard.studentProfile?.backToList || "목록으로 돌아가기"}
        </button>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary/20 to-primary/5 flex items-center justify-center font-black text-primary text-4xl uppercase shadow-inner border border-white relative">
              {student.name.charAt(0)}
              {student.isActive && (
                <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full"></div>
              )}
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-4xl font-black tracking-tight text-black">{student.name}</h1>
                <span className="px-3 py-1 bg-white border border-black/10 rounded-lg text-xs font-black shadow-sm uppercase">{student.class}</span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-black/60 font-medium mt-2">
                <span className="flex items-center gap-1"><Users size={16} /> {student.parent}</span>
                <span className="text-black/20">•</span>
                <span className="font-mono">{student.contact}</span>
              </div>
            </div>
          </div>
          
          <button className="apple-button-secondary flex items-center gap-2">
            <Edit3 size={18} />
            {t.dashboard.studentProfile?.editProfile || "정보 수정"}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Alerts & Quick Info */}
        <div className="lg:col-span-4 space-y-6">
          {student.medical && (
            <div className="bg-red-50 border border-red-100 rounded-[32px] p-8 shadow-sm">
              <h3 className="flex items-center gap-2 text-red-600 font-bold mb-3">
                <ShieldAlert size={20} />
                {t.dashboard.studentProfile?.medicalNotes || "의료/알러지 유의사항"}
              </h3>
              <p className="text-red-900 font-black text-lg">{student.medical}</p>
            </div>
          )}

          <div className="bg-white border border-black/5 rounded-[32px] p-8 shadow-sm">
            <h3 className="font-black text-xl mb-6 flex items-center gap-2">
              <User size={20} className="text-primary" />
              General Info
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex justify-between border-b border-black/5 pb-3">
                <span className="text-black/50 font-bold tracking-wide">ID Number</span>
                <span className="font-mono font-bold text-black">{student.id.toUpperCase().substring(0,8)}</span>
              </li>
              <li className="flex justify-between border-b border-black/5 pb-3">
                <span className="text-black/50 font-bold tracking-wide">Registered</span>
                <span className="font-bold text-black">2026-01-10</span>
              </li>
            </ul>
          </div>

          <div className="bg-white border border-black/5 rounded-[32px] p-8 shadow-sm">
            <h3 className="font-black text-xl mb-6 flex items-center gap-2">
              <MessageSquare size={20} className="text-primary" />
              Comments & Files
            </h3>
            
            <form onSubmit={handlePost} className="mb-6 flex gap-2 border border-black/10 p-2 rounded-2xl bg-gray-50 focus-within:ring-2 focus-within:ring-primary transition-all">
               <button type="button" className="p-3 text-black/40 hover:text-black hover:bg-black/5 rounded-xl transition-colors">
                 <Paperclip size={18} />
               </button>
               <input 
                 type="text" 
                 placeholder="학부모에게 메시지..." 
                 className="flex-1 bg-transparent border-none outline-none font-medium px-2 text-sm text-black placeholder:text-black/30"
                 value={comment}
                 onChange={e => setComment(e.target.value)}
               />
               <button type="submit" className="p-3 bg-primary text-white rounded-xl shadow-md hover:bg-primary-hover transition-colors">
                 <Send size={18} />
               </button>
            </form>

            <div className="space-y-4">
              {posts.map(post => (
                <div key={post.id} className="p-4 bg-gray-50 rounded-2xl border border-black/5">
                  <p className="text-sm font-bold text-black mb-2">{post.text}</p>
                  {post.file && (
                    <div className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-black/10 rounded-xl text-xs font-bold text-primary cursor-pointer hover:bg-primary/5 transition-colors">
                      <FileIcon size={14} />
                      {post.file}
                    </div>
                  )}
                  <p className="text-[10px] font-bold text-black/30 text-right mt-2">{post.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Activity Stream (Check-ins Style) */}
        <div className="lg:col-span-8">
          <section className="bg-white rounded-[40px] border border-black/5 shadow-sm p-8 md:p-10">
            <header className="flex items-center justify-between mb-8 border-b border-black/5 pb-6">
              <h2 className="text-2xl font-black text-black flex items-center gap-3">
                <Calendar className="text-primary" size={24} />
                {t.dashboard.studentProfile?.attendanceHistory || "출결 활동 내역"}
              </h2>
              <select 
                value={timeFilter}
                onChange={e => setTimeFilter(e.target.value)}
                className="text-sm font-bold text-black/60 bg-gray-100 px-4 py-2 rounded-full border-none outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              >
                <option value="7days">최근 7일</option>
                <option value="30days">최근 30일 활동</option>
                <option value="90days">최근 3개월</option>
                <option value="last1year">최근 1년</option>
                <option value="all">전체 내역</option>
              </select>
            </header>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 text-black/40 text-xs font-black uppercase tracking-widest border-b border-black/5">
                    <th className="px-6 py-4">{t.dashboard.studentProfile?.date || "날짜"}</th>
                    <th className="px-6 py-4">{t.dashboard.studentProfile?.checkIn || "등교"}</th>
                    <th className="px-6 py-4">{t.dashboard.studentProfile?.checkOut || "하교"}</th>
                    <th className="px-6 py-4">{t.dashboard.studentProfile?.status || "상태"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {activities.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-20 text-center text-black/30 font-bold italic">
                        {t.dashboard.studentProfile?.noHistory || "출결 기록이 없습니다."}
                      </td>
                    </tr>
                  ) : (
                    activities.map((act) => (
                      <tr key={act.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-5">
                          <span className="font-black text-black text-sm">{act.date}</span>
                        </td>
                        <td className="px-6 py-5">
                          {act.checkIn !== "-" ? (
                            <div className="flex flex-col">
                              <span className="font-bold text-black text-sm flex items-center gap-1">
                                <Clock size={12} className="text-emerald-500" /> {act.checkIn}
                              </span>
                              <span className="text-xs text-black/40 font-medium mt-1">{act.checkedInBy}</span>
                            </div>
                          ) : <span className="text-black/20">-</span>}
                        </td>
                        <td className="px-6 py-5">
                          {act.checkOut !== "-" ? (
                            <div className="flex flex-col">
                              <span className="font-bold text-black text-sm flex items-center gap-1">
                                <Clock size={12} className="text-amber-500" /> {act.checkOut}
                              </span>
                              <span className="text-xs text-black/40 font-medium mt-1">{act.checkedOutBy}</span>
                            </div>
                          ) : <span className="text-black/20">-</span>}
                        </td>
                        <td className="px-6 py-5">
                          {act.status === "present" ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold uppercase tracking-wider">
                              <CheckCircle2 size={14} />
                              {t.dashboard.studentProfile?.present || "출석"}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-500 rounded-lg text-xs font-bold uppercase tracking-wider">
                              {t.dashboard.studentProfile?.absent || "결석"}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
          </section>
        </div>
      </div>
    </main>
  );
}
