"use client";


export const runtime = "edge";


import { useState, useMemo } from "react";
import { 
  Calendar, 
  Users, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  Clock, 
  XCircle,
  BarChart3,
  ChevronRight,
  Plus,
  X,
  BellRing,
  UserCheck,
  Check,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AttendanceRecord {
  id: string;
  name: string;
  grade: string;
  class: string;
  status: "present" | "late" | "absent";
  time?: string;
  date: string;
}

interface SchoolEvent {
  id: string;
  title: string;
  type: string;
  date: string;
  startTime: string;
  endTime: string;
  target?: string;
  description?: string;
  isRecurring: boolean;
  recurringType?: "daily" | "weekly";
  recurringDays?: string[];
  reminderMinutes?: number;
  requiresRSVP: boolean;
  rsvpCount?: number;
  color: string;
  isUrgent: boolean;
  location?: string;
}

const mockAttendance: AttendanceRecord[] = [
  { id: "1", name: "김민수", grade: "초1", class: "기쁨반", status: "present", time: "09:00", date: "2026-02-23" },
  { id: "2", name: "이서연", grade: "초1", class: "기쁨반", status: "late", time: "09:15", date: "2026-02-23" },
  { id: "3", name: "박지훈", grade: "초2", class: "민들레반", status: "absent", date: "2026-02-23" },
  { id: "4", name: "최유진", grade: "초2", class: "민들레반", status: "present", time: "08:55", date: "2026-02-23" },
  { id: "5", name: "정은우", grade: "유치부", class: "햇살반", status: "present", time: "09:05", date: "2026-02-23" },
  { id: "6", name: "강현우", grade: "유치부", class: "햇살반", status: "late", time: "09:30", date: "2026-02-23" },
];

export default function EventsStatsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [gradeFilter, setGradeFilter] = useState("전체");
  const [classFilter, setClassFilter] = useState("전체");

  const grades = ["전체", "유치부", "초1", "초2", "초3"];
  const classes = ["전체", "기쁨반", "민들레반", "햇살반"];

  const [events, setEvents] = useState<SchoolEvent[]>([
    { id: "e1", title: "어린이날 행사", type: "행사", date: "2026-05-05", startTime: "10:00", endTime: "15:00", target: "전체", isRecurring: false, requiresRSVP: true, rsvpCount: 45, color: "bg-blue-500", isUrgent: false },
    { id: "e2", title: "매주 월요일 큐티", type: "일상", date: "2026-02-23", startTime: "08:30", endTime: "09:00", target: "전체", isRecurring: true, recurringType: "weekly", recurringDays: ["월"], requiresRSVP: false, color: "bg-emerald-500", isUrgent: false },
    { id: "e3", title: "긴급 안전 교육", type: "교육", date: "2026-02-24", startTime: "13:00", endTime: "14:00", target: "전체", isRecurring: false, requiresRSVP: false, color: "bg-red-500", isUrgent: true },
  ]);

  const [showEventModal, setShowEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState<Omit<SchoolEvent, "id">>({
    title: "",
    type: "행사",
    date: new Date().toISOString().split('T')[0],
    startTime: "09:00",
    endTime: "10:00",
    target: "전체",
    description: "",
    isRecurring: false,
    recurringType: "daily",
    recurringDays: [],
    reminderMinutes: 30,
    requiresRSVP: false,
    color: "bg-primary",
    isUrgent: false,
    location: ""
  });

  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const dayOptions = ["월", "화", "수", "목", "금", "토", "일"];

  const handleAddEvent = () => {
    if (!newEvent.title) return;
    setEvents([...events, { ...newEvent, id: Date.now().toString(), recurringDays: selectedDays }]);
    setShowEventModal(false);
    setNewEvent({
      title: "",
      type: "행사",
      date: new Date().toISOString().split('T')[0],
      startTime: "09:00",
      endTime: "10:00",
      target: "전체",
      description: "",
      isRecurring: false,
      recurringType: "daily",
      recurringDays: [],
      reminderMinutes: 30,
      requiresRSVP: false,
      color: "bg-primary",
      isUrgent: false
    });
    setSelectedDays([]);
  };

  const filteredRecords = useMemo(() => {
    return mockAttendance.filter(record => {
      const matchSearch = record.name.includes(searchTerm) || record.class.includes(searchTerm);
      const matchGrade = gradeFilter === "전체" || record.grade === gradeFilter;
      const matchClass = classFilter === "전체" || record.class === classFilter;
      return matchSearch && matchGrade && matchClass;
    });
  }, [searchTerm, gradeFilter, classFilter]);

  const stats = useMemo(() => {
    const present = filteredRecords.filter(r => r.status === "present").length;
    const late = filteredRecords.filter(r => r.status === "late").length;
    const absent = filteredRecords.filter(r => r.status === "absent").length;
    const total = filteredRecords.length;
    
    return {
      present,
      late,
      absent,
      total,
      attendanceRate: total > 0 ? Math.round(((present + late) / total) * 100) : 0
    };
  }, [filteredRecords]);

  return (
    <main className="flex-1 lg:ml-64 p-6 md:p-10 lg:p-14 bg-gray-50 min-h-screen">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-black mb-1 flex items-center gap-3">
             이벤트 및 통계
             <BarChart3 className="text-primary" size={28} />
          </h1>
          <p className="text-black/50 font-semibold mt-2">아이들의 실시간 출석, 지각, 결석 통계를 분석합니다.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-black/5">
             <button className="px-5 py-2.5 bg-black text-white rounded-xl font-bold text-sm shadow-lg shadow-black/20">일간</button>
             <button className="px-5 py-2.5 text-black/40 hover:text-black font-bold text-sm transition-all">주간</button>
             <button className="px-5 py-2.5 text-black/40 hover:text-black font-bold text-sm transition-all">월간</button>
          </div>
          <button 
            onClick={() => setShowEventModal(true)}
            className="apple-button-primary flex items-center gap-2 shadow-xl shadow-primary/30"
          >
            <Plus size={18} strokeWidth={3} />
            이벤트 생성
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatSummaryCard 
          label="총원" 
          value={stats.total.toString()} 
          icon={Users} 
          color="bg-blue-500" 
        />
        <StatSummaryCard 
          label="출석" 
          value={stats.present.toString()} 
          icon={CheckCircle2} 
          color="bg-emerald-500" 
          trend="+2"
          trendUp={true}
        />
        <StatSummaryCard 
          label="지각" 
          value={stats.late.toString()} 
          icon={Clock} 
          color="bg-amber-500" 
          trend="+1"
          trendUp={false}
        />
        <StatSummaryCard 
          label="결석" 
          value={stats.absent.toString()} 
          icon={XCircle} 
          color="bg-red-500" 
          trend="-1"
          trendUp={true}
        />
      </section>

      {/* Filters Container */}
      <section className="bg-white rounded-[40px] border border-black/5 shadow-2xl shadow-black/5 p-8 mb-10">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-black/30" size={18} />
            <input 
              type="text" 
              placeholder="학생 이름으로 검색..."
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 border-none ring-1 ring-black/5 focus:ring-2 focus:ring-primary transition-all outline-none font-medium text-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-black text-black/40 uppercase tracking-widest flex items-center gap-2">
                <Filter size={14} /> 학년
              </span>
              <select 
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="bg-gray-50 border-none ring-1 ring-black/5 rounded-2xl px-6 py-4 font-bold text-sm focus:ring-2 focus:ring-primary outline-none appearance-none cursor-pointer pr-10 relative"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5em' }}
              >
                {grades.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-black text-black/40 uppercase tracking-widest flex items-center gap-2">
                <Filter size={14} /> 반
              </span>
              <select 
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="bg-gray-50 border-none ring-1 ring-black/5 rounded-2xl px-6 py-4 font-bold text-sm focus:ring-2 focus:ring-primary outline-none appearance-none cursor-pointer pr-10 relative"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5em' }}
              >
                {classes.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Attendance Table */}
      <section className="bg-white rounded-[40px] border border-black/5 shadow-2xl shadow-black/5 overflow-hidden">
        <div className="p-8 border-b border-black/5 flex items-center justify-between bg-white text-black">
          <h2 className="text-xl font-black">출석 체크 내역</h2>
          <span className="text-sm font-bold text-black/40 italic">2026년 2월 23일 (월) 기준</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-black/40 text-xs font-black uppercase tracking-widest">
                <th className="px-8 py-5 border-b border-black/5">이름</th>
                <th className="px-8 py-5 border-b border-black/5">학년</th>
                <th className="px-8 py-5 border-b border-black/5">반</th>
                <th className="px-8 py-5 border-b border-black/5">상태</th>
                <th className="px-8 py-5 border-b border-black/5">출석 시간</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-black/30 font-bold italic">기록이 없습니다.</td>
                </tr>
              ) : filteredRecords.map(record => (
                <tr key={record.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                        {record.name.charAt(0)}
                      </div>
                      <span className="font-black text-black group-hover:text-primary transition-colors">{record.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-bold text-black/60">{record.grade}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-gray-100 text-black rounded-lg text-xs font-black border border-black/5">{record.class}</span>
                  </td>
                  <td className="px-8 py-6">
                    <StatusBadge status={record.status} />
                  </td>
                  <td className="px-8 py-6 text-sm font-mono italic text-black/40">
                    {record.time || "--:--"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Events List */}
      <section className="mt-12">
        <div className="flex items-center justify-between mb-8 px-2">
          <h2 className="text-2xl font-black text-black">등록된 이벤트 및 일정</h2>
          <div className="flex gap-2">
            <span className="flex items-center gap-1.5 text-xs font-bold text-black/40 bg-white px-3 py-1 rounded-full border border-black/5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> 반복
            </span>
            <span className="flex items-center gap-1.5 text-xs font-bold text-black/40 bg-white px-3 py-1 rounded-full border border-black/5">
              <span className="w-2 h-2 rounded-full bg-red-500"></span> 긴급
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <motion.div 
              key={event.id}
              whileHover={{ y: -5 }}
              className={`bg-white rounded-[32px] p-8 border-2 transition-all relative overflow-hidden flex flex-col h-full ${event.isUrgent ? 'border-red-500/20 bg-red-50/10' : 'border-black/5 shadow-sm'}`}
            >
              <div className={`absolute top-0 left-0 w-2 h-full ${event.color}`}></div>
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-2">
                   <span className="px-3 py-1 bg-black/5 text-black/60 rounded-full text-[10px] font-black uppercase tracking-wider">{event.type}</span>
                   {event.isRecurring && (
                     <span className="px-3 py-1 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                       <Clock size={10} strokeWidth={3} /> {event.recurringType === 'daily' ? '매일' : `매주 ${event.recurringDays?.join(',')}`}
                     </span>
                   )}
                </div>
                {event.isUrgent && (
                  <span className="flex items-center gap-1 text-red-600 font-black text-[10px] bg-red-100 px-2 py-1 rounded-lg animate-pulse">
                     긴급
                  </span>
                )}
                {!event.isRecurring && <span className="text-xs font-bold text-black/30 bg-gray-50 px-2 py-1 rounded-lg">{event.date}</span>}
              </div>

              <div className="flex-1">
                <h3 className="text-2xl font-black text-black mb-3 leading-tight">{event.title}</h3>
                <p className="text-sm font-medium text-black/40 mb-6 line-clamp-2">{event.description || "상세 설명이 없습니다."}</p>
              </div>

              <div className="space-y-4 pt-6 mt-auto border-t border-black/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-black/60">
                    <Clock size={18} className="text-primary" />
                    {event.startTime} - {event.endTime}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-black/40">
                    <Users size={16} />
                    {event.target}
                  </div>
                </div>

                {event.requiresRSVP && (
                  <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-2xl border border-blue-100">
                    <span className="text-xs font-black text-blue-600">참여자 현황</span>
                    <span className="text-sm font-black text-blue-700">{event.rsvpCount || 0}명 신청</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Event Creation Modal */}
      <AnimatePresence>
        {showEventModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[48px] p-12 shadow-[0_32px_128px_rgba(0,0,0,0.2)] relative my-8"
            >
              <button 
                onClick={() => setShowEventModal(false)}
                className="absolute top-10 right-10 w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-black/20 hover:text-black hover:bg-gray-100 transition-all"
              >
                <X size={20} />
              </button>

              <div className="mb-10">
                <h2 className="text-4xl font-black text-black mb-2">프리미엄 일정 생성</h2>
                <p className="text-black/40 font-bold">기관의 소중한 일정을 스마트하게 관리하세요.</p>
              </div>

              <div className="space-y-10">
                {/* 1. Title & Urgent Toggle */}
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <label className="block text-xs font-black text-black/30 uppercase tracking-[0.2em] mb-3 ml-2">이벤트 제목</label>
                    <input 
                      type="text" 
                      placeholder="학부모 교육 대축제"
                      value={newEvent.title}
                      onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                      className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent rounded-3xl outline-none font-black text-black focus:border-primary focus:bg-white transition-all shadow-inner text-lg"
                    />
                  </div>
                  <div className="flex items-end pb-1 px-4">
                     <button 
                        onClick={() => setNewEvent({...newEvent, isUrgent: !newEvent.isUrgent})}
                        className={`px-6 py-5 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all ${newEvent.isUrgent ? 'bg-red-500 text-white shadow-lg shadow-red-200' : 'bg-gray-100 text-black/30'}`}
                     >
                       <AlertCircle size={18} /> 긴급공지
                     </button>
                  </div>
                </div>

                {/* 2. Recurrence Logic (Important) */}
                <div className="bg-gray-50 rounded-[32px] p-8 border border-black/5">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Clock className="text-primary" />
                      <h3 className="font-black text-lg">반복 일정 설정</h3>
                    </div>
                    <Toggle active={newEvent.isRecurring} onClick={() => setNewEvent({...newEvent, isRecurring: !newEvent.isRecurring})} />
                  </div>

                  {newEvent.isRecurring && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-6 pt-4 border-t border-black/10">
                      <div className="flex gap-4">
                        {['daily', 'weekly'].map(type => (
                          <button 
                            key={type}
                            onClick={() => setNewEvent({...newEvent, recurringType: type as any})}
                            className={`flex-1 py-4 rounded-xl font-black text-sm transition-all ${newEvent.recurringType === type ? 'bg-black text-white' : 'bg-white text-black/40'}`}
                          >
                            {type === 'daily' ? '매일 반복' : '매주 반복'}
                          </button>
                        ))}
                      </div>
                      {newEvent.recurringType === 'weekly' && (
                        <div className="flex flex-wrap gap-2">
                          {dayOptions.map(day => (
                            <button 
                              key={day}
                              onClick={() => setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day])}
                              className={`w-12 h-12 rounded-xl border flex items-center justify-center font-black text-sm transition-all ${selectedDays.includes(day) ? 'bg-primary border-primary text-white' : 'bg-white border-black/5 text-black/30'}`}
                            >
                              {day}
                            </button>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                  {!newEvent.isRecurring && (
                    <div className="pt-4">
                      <input 
                        type="date" 
                        value={newEvent.date}
                        onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                        className="w-full px-6 py-4 bg-white border border-black/5 rounded-2xl outline-none font-bold text-black"
                      />
                    </div>
                  )}
                </div>

                {/* 3. Innovative Ideas 1-5 Implementation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Idea 1: Smart Reminders */}
                  <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                    <div className="flex items-center gap-2 mb-4">
                      <BellRing size={18} className="text-blue-500" />
                      <span className="font-black text-xs text-blue-600 uppercase tracking-widest">자동 알림 시스템</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input 
                        type="number" 
                        value={newEvent.reminderMinutes}
                        onChange={e => setNewEvent({...newEvent, reminderMinutes: parseInt(e.target.value)})}
                        className="w-20 px-3 py-2 bg-white rounded-xl outline-none font-bold text-blue-700" 
                      />
                      <span className="text-sm font-bold text-blue-600">분 전 Push 발송</span>
                    </div>
                  </div>
 
                   {/* Idea 5: Location Venue */}
                  <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100">
                    <div className="flex items-center gap-2 mb-4">
                      <Search size={18} className="text-amber-500" />
                      <span className="font-black text-xs text-amber-600 uppercase tracking-widest">장소 고정</span>
                    </div>
                    <input 
                      type="text" 
                      placeholder="행사장소 입력 (예: 5층 홀)"
                      value={newEvent.location}
                      onChange={e => setNewEvent({...newEvent, location: e.target.value})}
                      className="w-full px-3 py-2 bg-white rounded-xl outline-none font-bold text-amber-700 placeholder:text-amber-200"
                    />
                  </div>

                  {/* Idea 2: RSVP Toggle */}
                  <button 
                    onClick={() => setNewEvent({...newEvent, requiresRSVP: !newEvent.requiresRSVP})}
                    className={`p-6 rounded-3xl border transition-all text-left flex items-center justify-between ${newEvent.requiresRSVP ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-black/5'}`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <UserCheck size={18} className={newEvent.requiresRSVP ? 'text-emerald-500' : 'text-black/30'} />
                        <span className={`font-black text-xs uppercase tracking-widest ${newEvent.requiresRSVP ? 'text-emerald-600' : 'text-black/30'}`}>참여 확인 신청</span>
                      </div>
                      <p className={`text-[10px] font-bold ${newEvent.requiresRSVP ? 'text-emerald-500/60' : 'text-black/20'}`}>학부모 앱에서 참석 여부를 수집합니다.</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${newEvent.requiresRSVP ? 'bg-emerald-500 text-white' : 'border-2 border-black/5'}`}>
                      {newEvent.requiresRSVP && <Check size={14} strokeWidth={4} />}
                    </div>
                  </button>
                </div>

                {/* 4. Color & Category Selection (Idea 3) */}
                <div className="flex flex-wrap items-center gap-4">
                   <span className="text-xs font-black text-black/30 uppercase tracking-widest mr-2">캘린더 컬러</span>
                   {['bg-primary', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-indigo-500', 'bg-rose-500'].map(c => (
                     <button 
                        key={c}
                        onClick={() => setNewEvent({...newEvent, color: c})}
                        className={`w-10 h-10 rounded-full ${c} ${newEvent.color === c ? 'ring-4 ring-offset-4 ring-black ring-opacity-10' : ''} transition-all`}
                     ></button>
                   ))}
                </div>

                <div className="flex gap-6 pt-10">
                  <button 
                    onClick={() => setShowEventModal(false)}
                    className="flex-1 py-6 bg-gray-100 text-black font-black rounded-3xl transition-all hover:bg-gray-200 active:scale-95"
                  >
                    나중에 만들기
                  </button>
                  <button 
                    onClick={handleAddEvent}
                    className="flex-3 py-6 bg-black text-white font-black rounded-3xl shadow-2xl shadow-black/20 transition-all hover:bg-gray-900 active:scale-95"
                  >
                    이벤트 발행하기
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

function Toggle({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${active ? 'bg-emerald-500' : 'bg-gray-200'}`}
    >
      <div className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${active ? 'translate-x-6' : ''}`}></div>
    </button>
  );
}

function StatSummaryCard({ label, value, icon: Icon, color, trend, trendUp }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-[32px] p-8 border border-black/5 shadow-sm relative overflow-hidden group"
    >
      <div className={`absolute top-0 left-0 w-2 h-full ${color}`}></div>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-black text-black/40 uppercase tracking-widest mb-2 group-hover:text-black transition-colors">{label}</p>
          <h3 className="text-4xl font-black text-black">{value}</h3>
          {(trend) && (
            <div className={`flex items-center gap-1 mt-2 ${trendUp ? 'text-emerald-500' : 'text-red-500'}`}>
              {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              <span className="text-xs font-black">{trend}</span>
              <span className="text-[10px] text-black/30 font-bold ml-1">vs yesterday</span>
            </div>
          )}
        </div>
        <div className={`p-4 rounded-2xl ${color} bg-opacity-10 text-white shadow-inner`}>
          <Icon size={24} className={`${color.replace('bg-', 'text-')}`} />
        </div>
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: "present" | "late" | "absent" }) {
  const configs = {
    present: { label: "출석", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    late: { label: "지각", color: "bg-amber-100 text-amber-700 border-amber-200" },
    absent: { label: "결석", color: "bg-red-100 text-red-700 border-red-200" },
  };
  
  const config = configs[status];
  
  return (
    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight border shadow-sm ${config.color}`}>
      {config.label}
    </span>
  );
}
