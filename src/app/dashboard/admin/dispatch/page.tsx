"use client";


export const runtime = "edge";


import { useState, useMemo } from "react";
import { Search, Car, UserCheck, Clock, CheckCircle2, ChevronRight, X, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DispatchStudent {
  id: string;
  name: string;
  grade: string;
  class: string;
  parentName: string;
  status: "present" | "pickup_requested" | "released";
  requestTime?: string;
  photo?: string;
}

// Mock Data
const initialStudents: DispatchStudent[] = [
  { id: "1", name: "김민수", grade: "초1", class: "기쁨반", parentName: "김철수", status: "pickup_requested", requestTime: "14:30" },
  { id: "2", name: "이서연", grade: "초1", class: "기쁨반", parentName: "이영희", status: "present" },
  { id: "3", name: "박지훈", grade: "초2", class: "민들레반", parentName: "박동건", status: "pickup_requested", requestTime: "14:32" },
  { id: "4", name: "최유진", grade: "초2", class: "민들레반", parentName: "최수영", status: "released", requestTime: "14:15" },
  { id: "5", name: "정은우", grade: "유치부", class: "햇살반", parentName: "정지훈", status: "pickup_requested", requestTime: "14:35" },
  { id: "6", name: "강현우", grade: "유치부", class: "햇살반", parentName: "강민수", status: "present" },
];

export default function DispatchDashboard() {
  const [students, setStudents] = useState<DispatchStudent[]>(initialStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "pickup_requested" | "released">("all");

  const handleRelease = (id: string) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status: "released" } : s));
  };

  const handleCancelRelease = (id: string) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status: "pickup_requested" } : s));
  };

  const filteredStudents = useMemo(() => {
    let result = students;
    if (filter !== "all") {
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
    <main className="flex-1 lg:ml-64 p-6 md:p-10 lg:p-14 bg-gray-50 min-h-screen">
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
        <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-black/5 self-stretch md:self-auto">
          <FilterButton active={filter === "all"} onClick={() => setFilter("all")} label="전체" icon={UserCheck} count={students.length} />
          <FilterButton active={filter === "pickup_requested"} onClick={() => setFilter("pickup_requested")} label="하교 대기" icon={Clock} count={students.filter(s => s.status === 'pickup_requested').length} alert />
          <FilterButton active={filter === "released"} onClick={() => setFilter("released")} label="하교 완료" icon={CheckCircle2} count={students.filter(s => s.status === 'released').length} />
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
                        className={`p-6 flex flex-col sm:flex-row items-center justify-between gap-6 transition-colors ${student.status === 'pickup_requested' ? 'bg-orange-50/30' : 'hover:bg-gray-50'}`}
                     >
                        <div className="flex items-center gap-5 w-full sm:w-auto">
                           <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-xl border-2 shadow-sm ${
                              student.status === 'pickup_requested' ? 'bg-orange-100 text-orange-600 border-orange-200' : 
                              student.status === 'released' ? 'bg-emerald-100 text-emerald-600 border-emerald-200' : 
                              'bg-gray-100 text-gray-500 border-white'
                           }`}>
                              {student.photo ? <img src={student.photo} alt={student.name} className="w-full h-full object-cover rounded-full" /> : student.name.charAt(0)}
                           </div>
                           
                           <div>
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-xl font-black text-black">{student.name}</h3>
                                {student.status === 'pickup_requested' && (
                                   <span className="px-2.5 py-1 bg-orange-100 text-orange-700 text-[10px] font-black rounded-lg uppercase flex items-center gap-1 border border-orange-200 shadow-sm animate-pulse w-fit">
                                      <Car size={10} /> 픽업 대기중
                                   </span>
                                )}
                                {student.status === 'released' && (
                                   <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-lg uppercase flex items-center gap-1 border border-emerald-200 w-fit">
                                      <CheckCircle2 size={10} /> 하교 완료
                                   </span>
                                )}
                              </div>
                              <p className="text-sm font-bold text-black/50 flex items-center gap-2">
                                보호자: <span className="text-black">{student.parentName}</span>
                                {student.requestTime && student.status === 'pickup_requested' && (
                                   <>
                                     <span className="w-1 h-1 bg-black/20 rounded-full"></span>
                                     <span className="text-orange-600 flex items-center gap-1"><Clock size={12}/> {student.requestTime} 요청</span>
                                   </>
                                )}
                              </p>
                           </div>
                        </div>

                        <div className="flex gap-3 w-full sm:w-auto">
                           {student.status === 'pickup_requested' && (
                              <button 
                                onClick={() => handleRelease(student.id)}
                                className="flex-1 sm:flex-none px-6 py-3 bg-black text-white rounded-2xl font-black shadow-xl shadow-black/20 hover:bg-gray-800 active:scale-95 transition-all flex items-center justify-center gap-2"
                              >
                                아이 인계하기 <ChevronRight size={18} />
                              </button>
                           )}
                           {student.status === 'released' && (
                              <button 
                                onClick={() => handleCancelRelease(student.id)}
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
