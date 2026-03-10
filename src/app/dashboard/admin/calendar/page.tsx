"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  MapPin, 
  AlertCircle 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

interface SchoolEvent {
  id: string;
  title: string;
  type: string;
  date: string;
  startTime: string;
  endTime: string;
  target?: string;
  description?: string;
  color: string;
  isUrgent: boolean;
  location?: string;
}

export default function CalendarPage() {
  const { institutionId } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db || !institutionId) return;

    const q = query(
      collection(db, "events"),
      where("institutionId", "==", institutionId),
      orderBy("date", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SchoolEvent[];
      setEvents(data);
      setLoading(false);
    }, (err) => {
      console.error("Firestore error:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [institutionId]);

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    // Padding for previous month
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, date: null });
    }
    // Current month days
    for (let i = 1; i <= totalDays; i++) {
        const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        days.push({ day: i, date: fullDate });
    }
    return days;
  }, [currentDate]);

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  const getEventsForDate = (date: string) => {
    return events.filter(e => e.date === date);
  };

  return (
    <main className="p-6 md:p-10 lg:p-14 bg-gray-50 min-h-screen">
      <header className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-black flex items-center gap-3">
            스마트 캘린더
            <CalendarIcon className="text-primary" size={32} />
          </h1>
          <p className="text-black/50 font-bold mt-2">기관의 모든 일정과 행사를 한눈에 관리하세요.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-black/5">
              <button 
                onClick={prevMonth}
                className="p-3 hover:bg-gray-50 rounded-xl text-black/40 hover:text-black transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="px-6 flex items-center font-black text-black">
                {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
              </div>
              <button 
                onClick={nextMonth}
                className="p-3 hover:bg-gray-50 rounded-xl text-black/40 hover:text-black transition-all"
              >
                <ChevronRight size={20} />
              </button>
           </div>
           {/* Add direct navigation to Create Event (link to events page modal) */}
           <button 
             onClick={() => window.location.href = '/dashboard/admin/events'}
             className="apple-button-primary bg-black text-white px-8 h-14 flex items-center gap-2 shadow-xl shadow-black/10 border-none rounded-2xl"
           >
             <Plus size={18} strokeWidth={3} />
             일정 생성
           </button>
        </div>
      </header>

      <div className="bg-white rounded-[40px] border border-black/5 shadow-2xl shadow-black/5 overflow-hidden">
        {/* Calendar Header Days */}
        <div className="grid grid-cols-7 border-b border-black/5 bg-gray-50/50">
          {["일", "월", "화", "수", "목", "금", "토"].map((d, i) => (
            <div key={d} className={`py-4 text-center text-[10px] font-black uppercase tracking-widest ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-black/30'}`}>
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 min-h-[600px]">
          {daysInMonth.map((dayObj, i) => {
            const dateEvents = dayObj.date ? getEventsForDate(dayObj.date) : [];
            const isToday = dayObj.date === new Date().toISOString().split('T')[0];
            
            return (
              <div 
                key={i} 
                className={`border-r border-b border-black/5 p-3 flex flex-col gap-2 transition-colors hover:bg-gray-50/30 group relative ${dayObj.day === null ? 'bg-gray-50/20' : ''}`}
              >
                {dayObj.day !== null && (
                  <>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-black ${isToday ? 'bg-primary text-white w-7 h-7 rounded-full flex items-center justify-center shadow-lg shadow-primary/30' : (i % 7 === 0 ? 'text-red-500/60' : i % 7 === 6 ? 'text-blue-500/60' : 'text-black/40')}`}>
                        {dayObj.day}
                      </span>
                      {dateEvents.some(e => e.isUrgent) && (
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      )}
                    </div>
                    
                    <div className="space-y-1 overflow-y-auto max-h-[120px] custom-scrollbar scrollbar-hide">
                      {dateEvents.map(event => (
                        <div 
                          key={event.id}
                          className={`${event.color || 'bg-primary'} text-white rounded-lg p-2 text-[10px] font-black leading-tight shadow-sm cursor-pointer hover:scale-[1.02] active:scale-95 transition-all truncate`}
                          title={event.title}
                        >
                          {event.title}
                        </div>
                      ))}
                    </div>
                    
                    {/* Hover indicator for adding event */}
                    <button 
                      onClick={() => window.location.href = `/dashboard/admin/events?date=${dayObj.date}`}
                      className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/5 p-1 rounded-md text-black/20 hover:text-primary"
                    >
                      <Plus size={14} />
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <h3 className="text-2xl font-black text-black mb-8 flex items-center gap-2">
                다가오는 일정 (Upcoming)
                <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">{events.length}</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {events.filter(e => new Date(e.date) >= new Date()).slice(0, 4).map(event => (
                    <div key={event.id} className="bg-white p-6 rounded-[32px] border border-black/5 shadow-sm flex items-start gap-4">
                        <div className={`w-3 h-12 rounded-full ${event.color || 'bg-primary'}`} />
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-black text-black/20 uppercase tracking-widest">{event.date}</span>
                                {event.isUrgent && <AlertCircle size={14} className="text-red-500" />}
                            </div>
                            <h4 className="font-black text-black mb-2">{event.title}</h4>
                            <div className="flex items-center gap-3 text-[10px] font-bold text-black/40">
                                <span className="flex items-center gap-1"><Clock size={12} /> {event.startTime}</span>
                                {event.location && <span className="flex items-center gap-1"><MapPin size={12} /> {event.location}</span>}
                            </div>
                        </div>
                    </div>
                ))}
                {events.length === 0 && (
                    <div className="col-span-2 py-10 text-center bg-white rounded-[32px] border border-dashed border-black/10 text-black/20 font-bold">
                        등록된 일정이 없습니다.
                    </div>
                )}
            </div>
        </div>
        
        <div className="bg-black text-white p-10 rounded-[48px] shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[300px]">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/20 rounded-full -ml-16 -mb-16 blur-2xl" />
            
            <div className="relative z-10">
                <CalendarIcon className="text-primary mb-6" size={40} />
                <h3 className="text-3xl font-black mb-4 leading-tight">스마트 일정 관리팁</h3>
                <p className="text-white/60 font-medium text-sm leading-relaxed">
                    반복 일정을 생성하면 매번 등하교 알림을 수동으로 보낼 필요가 없습니다. 
                    부모님 앱에서 자동으로 공유되는 스마트 캘린더를 활용해 보세요.
                </p>
            </div>
            
            <button 
                onClick={() => window.location.href = '/dashboard/admin/events'}
                className="relative z-10 w-full py-4 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-all group"
            >
                관리 대시보드 바로가기
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
      </div>
    </main>
  );
}
