"use client";

export const runtime = 'edge';







import { useState, useEffect } from "react";
import { 
  Users, 
  Settings, 
  Database, 
  Plus, 
  Search, 
  Download, 
  Trash2,
  ExternalLink,
  QrCode,
  Bell,
  Cake,
  Activity,
  ArrowUpRight,
  CreditCard,
  Phone,
  MessageSquare,
  Mail,
  type LucideIcon
} from "lucide-react";

interface Student {
  id: string;
  name: string;
  class: string;
  parent: string;
  contact: string;
  email?: string;
  photo?: string;
}

import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const { t } = useLanguage();
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: "", class: "", parent: "", contact: "", email: "", photo: "" });

  // Handle Add Student
  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.class) return;
    
    // Simulate API Add
    const createdStudent = {
      ...newStudent,
      id: Math.random().toString(36).substring(7)
    };
    
    setStudents([createdStudent, ...students]);
    setShowAddModal(false);
    setNewStudent({ name: "", class: "", parent: "", contact: "", email: "", photo: "" });
  };

  const handleDeleteStudent = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // prevent row click routing
    if (confirm("정말로 학생 정보를 삭제하시겠습니까?")) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  // Mock data for new widgets
  const recentActivities = [
    { id: 1, user: "김지우", action: "등교 확인", time: "2분 전", icon: Activity },
    { id: 2, user: "이준서", action: "하교 요청", time: "5분 전", icon: Bell },
    { id: 3, user: "박서현", action: "스티커 출력", time: "12분 전", icon: QrCode },
  ];

  const upcomingBirthdays = [
    { id: 1, name: "최하은", date: "내일", age: "5세" },
    { id: 2, name: "강민호", date: "3월 2일", age: "6세" },
  ];

  useEffect(() => {
    fetch("/api/students")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setStudents(data);
        setLoading(false);
      });
  }, []);

  const filteredStudents = students.filter(s => 
    s.name.includes(searchTerm) || s.class.includes(searchTerm)
  );

  return (
    <main className="flex-1 lg:ml-64 p-6 md:p-10 lg:p-14">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-black mb-1 flex items-center gap-3">
             {t.dashboard.admin.title}
             <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full tracking-widest uppercase">Admin / Staff Portal</span>
          </h1>
          <p className="text-black/50 font-semibold">{t.dashboard.admin.subtitle}</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <button className="apple-button-secondary flex items-center gap-2">
              <Download size={18} />
              {t.dashboard.admin.downloadExcel}
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="apple-button-primary flex items-center gap-2 shadow-xl shadow-primary/30"
            >
              <Plus size={18} />
              {t.dashboard.admin.addStudent}
            </button>
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-black/10 bg-gray-100 flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary transition-all shadow-sm">
             <span className="text-black/30 text-xs font-black">LOGO</span>
          </div>
        </div>
      </header>

      {/* Trial / Subscription Banner */}
      <div className="bg-amber-50 rounded-3xl p-6 border-2 border-amber-200 shadow-md mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-amber-400"></div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
             <CreditCard className="text-amber-600" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black text-amber-900 leading-tight mb-1">2주간의 무료 체험이 곧 종료됩니다.</h3>
            <p className="text-amber-700/80 text-sm font-bold">Children Gate 시스템을 계속 활용하시려면 요금제를 결제해 주세요.</p>
          </div>
        </div>
        <button 
           className="w-full md:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl shadow-xl shadow-amber-500/20 active:scale-95 transition-all text-sm whitespace-nowrap"
           onClick={() => alert("Stripe 결제 모듈 연동 예정 창")}
        >
           Stripe로 결제하기 (월 $9.99~)
        </button>
      </div>

      {/* Top Workflow Stats (Planning Center Style) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          label={t.dashboard.admin?.totalStudents || "Total Students"} 
          value={students.length.toString()} 
          color="bg-primary/10"
          textColor="text-primary"
          trend="+12%"
        />
        <StatCard 
          label={t.dashboard.admin?.todayCheckin || "Check-ins Today"} 
          value="42" 
          color="bg-emerald-50"
          textColor="text-emerald-600"
          trend="+5"
        />
        <StatCard 
          label={t.dashboard.admin?.todayCheckout || "Pickups Today"} 
          value="18" 
          color="bg-amber-50"
          textColor="text-amber-600"
          trend="Ongoing"
        />
        <StatCard 
          label={"Pending Requests"} 
          value="3" 
          color="bg-red-50"
          textColor="text-red-500"
          alert={true}
        />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Table Column */}
        <div className="lg:col-span-8 space-y-10">
          <section className="bg-white rounded-[40px] border border-black/5 shadow-2xl shadow-black/5 overflow-hidden">
            <div className="p-8 border-b border-black/5 flex flex-col sm:flex-row justify-between gap-4 bg-white/50 backdrop-blur-sm">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-black/30" size={18} />
                <input 
                  type="text" 
                  placeholder={t.dashboard.admin.searchPlaceholder}
                  className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 border-none ring-1 ring-black/5 focus:ring-2 focus:ring-primary transition-all outline-none font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center">
                <a 
                  href={`https://docs.google.com/spreadsheets/d/${process.env.NEXT_PUBLIC_SHEET_ID}`} 
                  target="_blank"
                  className="px-5 py-2.5 text-sm font-bold text-primary hover:bg-primary/5 rounded-2xl flex items-center gap-2 transition-all border border-primary/10"
                >
                  <ExternalLink size={16} />
                  {t.dashboard.admin.openSheet}
                </a>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 text-black/40 text-xs font-black uppercase tracking-widest">
                    <th className="px-8 py-5 border-b border-black/5 font-black">{t.dashboard.admin.table.name}</th>
                    <th className="px-8 py-5 border-b border-black/5 font-black">{t.dashboard.admin.table.class}</th>
                    <th className="px-8 py-5 border-b border-black/5 font-black">{t.dashboard.admin.table.parent}</th>
                    <th className="px-8 py-5 border-b border-black/5 font-black text-right">{t.dashboard.admin.table.action}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {loading ? (
                    [1,2,3,4].map(i => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={4} className="px-8 py-10"><div className="h-4 bg-gray-100 rounded-full w-full"></div></td>
                      </tr>
                    ))
                  ) : filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center text-black/30 font-bold italic">No students found.</td>
                    </tr>
                  ) : filteredStudents.map(student => (
                    <tr 
                      key={student.id} 
                      onClick={() => router.push(`/dashboard/admin/student/${student.id}`)}
                      className="hover:bg-gray-50 transition-colors group cursor-pointer"
                    >
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary/20 to-primary/5 flex items-center justify-center font-black text-primary text-lg uppercase shadow-inner border border-white overflow-hidden">
                               {student.photo ? (
                                 <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
                               ) : student.name.charAt(0)}
                            </div>
                            <div className="flex flex-col">
                               <span className="font-black text-black text-lg group-hover:text-primary transition-colors">{student.name}</span>
                               <div className="flex items-center gap-2 mt-1">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                  <span className="text-[10px] font-bold text-black/40 uppercase tracking-wider">Active</span>
                               </div>
                            </div>
                         </div>
                      </td>
                      <td className="px-8 py-6 uppercase">
                        <span className="px-4 py-1.5 bg-white text-black rounded-xl text-xs font-black tracking-tight border border-black/10 shadow-sm">{student.class}</span>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                               <Users size={14} className="text-black/30" />
                               <span className="text-black font-bold text-sm">{student.parent}</span>
                            </div>
                            <div className="flex items-center gap-3 mt-1 ml-5">
                               <span className="text-xs text-black/40 font-mono italic">{student.contact}</span>
                               <div className="flex items-center gap-1.5 border-l border-black/10 pl-3">
                                  <a href={`tel:${student.contact}`} onClick={e => e.stopPropagation()} className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"><Phone size={10} /></a>
                                  <a href={`sms:${student.contact}`} onClick={e => e.stopPropagation()} className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-black/50 hover:bg-black hover:text-white transition-colors"><MessageSquare size={10} /></a>
                                  <a href={`mailto:${student.email || 'parent@example.com'}`} onClick={e => e.stopPropagation()} className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-black/50 hover:bg-black hover:text-white transition-colors"><Mail size={10} /></a>
                               </div>
                            </div>
                         </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                         <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-3 bg-white border border-black/5 hover:bg-gray-100 rounded-2xl text-black/40 hover:text-black transition-all shadow-sm" title="Print Nametag Label">
                               <QrCode size={18} />
                            </button>
                            <button 
                               onClick={(e) => handleDeleteStudent(e, student.id)}
                               className="p-3 bg-white border border-black/5 hover:bg-red-50 rounded-2xl text-black/40 hover:text-red-500 transition-all shadow-sm"
                            >
                               <Trash2 size={18} />
                            </button>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Widgets Column */}
        <div className="lg:col-span-4 space-y-10">
          {/* Recent Activity Widget */}
          <section className="bg-white rounded-[40px] border border-black/5 shadow-sm p-8">
             <div className="flex items-center justify-between mb-8">
                <h3 className="font-black text-xl flex items-center gap-2">
                   <Activity className="text-primary" size={24} />
                   {t.dashboard.admin.widgets.recentActivity}
                </h3>
                <button className="text-xs font-black text-primary hover:underline">{t.dashboard.admin.widgets.viewAll}</button>
             </div>
             <div className="space-y-6">
                {recentActivities.map(act => (
                   <div key={act.id} className="flex items-center gap-4 group cursor-pointer">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-black/5 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                         <act.icon size={20} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                         <p className="text-sm font-black text-black truncate">{act.user}</p>
                         <p className="text-xs text-black/40 font-bold">{act.action}</p>
                      </div>
                      <span className="text-[10px] font-black text-black/30 uppercase">{act.time}</span>
                   </div>
                ))}
             </div>
          </section>

          {/* Upcoming Birthdays Widget */}
          <section className="bg-white rounded-[40px] border border-black/5 shadow-sm p-8">
             <div className="flex items-center justify-between mb-8">
                <h3 className="font-black text-xl flex items-center gap-2">
                   <Cake className="text-pink-500" size={24} />
                   {t.dashboard.admin.widgets.upcomingBirthdays}
                </h3>
             </div>
             <div className="space-y-6">
                {upcomingBirthdays.map(b => (
                   <div key={b.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-500 text-lg font-black">
                            {b.name.charAt(0)}
                         </div>
                         <div>
                            <p className="text-sm font-black text-black">{b.name}</p>
                            <p className="text-xs text-black/40 font-bold">{b.age}</p>
                         </div>
                      </div>
                      <span className="text-xs font-black px-3 py-1 bg-pink-50 text-pink-500 rounded-lg">{b.date}</span>
                   </div>
                ))}
             </div>
          </section>
        </div>
      </div>

       {/* Add Student Modal */}
       {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl relative">
            <h2 className="text-2xl font-black mb-6">학생 추가</h2>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">학생 이름</label>
                <input 
                  autoFocus
                  required
                  placeholder="예: 홍길동"
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none ring-1 ring-black/5 focus:ring-2 focus:ring-primary outline-none text-black"
                  value={newStudent.name}
                  onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">소속 반</label>
                <input 
                  required
                  placeholder="예: 민들레반"
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none ring-1 ring-black/5 focus:ring-2 focus:ring-primary outline-none text-black"
                  value={newStudent.class}
                  onChange={e => setNewStudent({...newStudent, class: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">학부모 성함</label>
                <input 
                  required
                  placeholder="예: 홍민수"
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none ring-1 ring-black/5 focus:ring-2 focus:ring-primary outline-none text-black"
                  value={newStudent.parent}
                  onChange={e => setNewStudent({...newStudent, parent: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">연락처</label>
                <input 
                  placeholder="예: 010-1234-5678"
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none ring-1 ring-black/5 focus:ring-2 focus:ring-primary outline-none text-black"
                  value={newStudent.contact}
                  onChange={e => setNewStudent({...newStudent, contact: e.target.value})}
                />
              </div>
              
              <div className="flex items-center gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-black font-bold rounded-2xl transition-all"
                >
                  취소
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl shadow-xl shadow-primary/20 transition-all"
                >
                  추가하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}

function StatCard({ label, value, color, textColor, trend, alert }: { label: string, value: string, color: string, textColor?: string, trend?: string, alert?: boolean }) {
  return (
    <div className={`bg-white p-8 rounded-[40px] border ${alert ? 'border-red-200 shadow-red-500/10' : 'border-black/5'} shadow-sm hover:shadow-2xl hover:shadow-black/5 transition-all group relative overflow-hidden`}>
      {alert && <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>}
      <div className="flex items-center justify-between mb-4">
         <p className="text-black/50 text-sm font-black uppercase tracking-widest">{label}</p>
         {trend && (
            <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${trend.includes('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
               {trend}
            </span>
         )}
      </div>
      <div className="flex items-center justify-between">
        <h3 className={`text-5xl font-black tracking-tighter transition-colors ${textColor || 'text-black group-hover:text-primary'}`}>{value}</h3>
        <div className={`w-3 h-12 rounded-full ${color} transition-all`}></div>
      </div>
    </div>
  );
}
