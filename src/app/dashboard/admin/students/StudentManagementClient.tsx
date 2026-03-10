"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Plus, 
  Search, 
  Download, 
  Trash2,
  ExternalLink,
  QrCode,
  Phone,
  MessageSquare,
  Mail,
  Camera
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, updateDoc, addDoc, deleteDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";

interface Student {
  id: string;
  name: string;
  grade: string;
  class: string;
  parent: string;
  contact: string;
  email?: string;
  photo?: string;
}

export default function StudentManagementClient() {
  const { t } = useLanguage();
  const { institutionId } = useAuth();
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [instName, setInstName] = useState("");
  const [instPhoto, setInstPhoto] = useState("/children_gate_logo.png");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: "", grade: "E1", class: "", parent: "", contact: "", email: "", photo: "" });

  useEffect(() => {
    if (institutionId && db) {
      const fetchInst = async () => {
        const q = query(collection(db!, "institutions"), where("institutionId", "==", institutionId));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const data = snap.docs[0].data();
          setInstName(data.name);
          if (data.photo) setInstPhoto(data.photo);
        }
      };
      fetchInst();
    }
  }, [institutionId, db]);

  useEffect(() => {
    if (!db || !institutionId) return;

    const q = query(collection(db, "students"), where("institutionId", "==", institutionId));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Student[];
      setStudents(list);
      setLoading(false);
    }, (error) => {
      console.error("Firestore listen error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [institutionId]);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.grade || !db || !institutionId) return;
    
    try {
        const barcodeId = `kg-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
        const docRef = await addDoc(collection(db, "students"), {
          ...newStudent,
          barcodeId,
          institutionId: institutionId,
          status: "absent",
          createdAt: serverTimestamp()
        });
        
        const createdStudent = { id: docRef.id, ...newStudent };
        setStudents([createdStudent, ...students]);
        setShowAddModal(false);
        setNewStudent({ name: "", grade: "E1", class: "", parent: "", contact: "", email: "", photo: "" });
        alert("학생 정보가 성공적으로 등록 되었습니다!");
    } catch (err) {
        console.error("Add student error:", err);
        alert("등록 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteStudent = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!db || !confirm("정말로 학생 정보를 삭제하시겠습니까?")) return;
    
    try {
        await deleteDoc(doc(db, "students", id));
        setStudents(students.filter(s => s.id !== id));
    } catch (err) {
        console.error("Delete error:", err);
        alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const filteredStudents = students.filter(s => 
    (s.name && s.name.includes(searchTerm)) || 
    (s.class && s.class.includes(searchTerm)) || 
    (s.grade && s.grade.includes(searchTerm))
  );

  return (
    <main className="p-6 md:p-10 lg:p-14 bg-gray-50 min-h-screen">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-3xl border border-black/5 shadow-sm w-fit">
               <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center overflow-hidden border border-black/5 shadow-inner">
                  <img src={instPhoto} alt="Inst Logo" className="w-full h-full object-contain p-1" />
               </div>
             <div>
                <h2 className="font-black text-black text-lg leading-tight">{instName || "칠드런 게이트"}</h2>
                <div className="flex items-center gap-2 mt-1">
                   <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded uppercase tracking-widest">{institutionId || "ADMIN_CODE"}</span>
                </div>
             </div>
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-black mb-1">{t.dashboard.admin.sidebar.students}</h1>
            <p className="text-black/60 font-bold text-sm">{t.dashboard.admin.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
            <button 
               onClick={() => setShowAddModal(true)}
               className="apple-button-primary flex items-center gap-2 shadow-xl shadow-primary/30"
            >
              <Plus size={18} />
              {t.dashboard.admin.addStudent}
            </button>
            <button className="apple-button-secondary flex items-center gap-2">
              <Download size={18} />
              {t.dashboard.admin.downloadExcel}
            </button>
        </div>
      </header>

      <section className="bg-white rounded-[40px] border border-black/5 shadow-2xl shadow-black/5 overflow-hidden">
        <div className="p-8 border-b border-black/5 flex flex-col sm:flex-row justify-between gap-4 bg-white/50 backdrop-blur-sm">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-black/40" size={18} />
            <input 
              type="text" 
              placeholder={t.dashboard.admin.searchPlaceholder}
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 border-none ring-1 ring-black/5 focus:ring-2 focus:ring-primary transition-all outline-none font-medium text-black"
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
              <tr className="bg-gray-50/50 text-black/60 text-xs font-black uppercase tracking-widest">
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
                  <td colSpan={4} className="px-8 py-20 text-center text-black/30 font-bold italic">등록된 학생이 없습니다.</td>
                </tr>
              ) : filteredStudents.map(student => (
                <tr 
                  key={student.id} 
                  onClick={() => router.push(`/dashboard/admin/students/${student.id}`)}
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
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-black tracking-widest border border-primary/5">{student.grade}</span>
                      <span className="px-3 py-1 bg-gray-100 text-black/50 rounded-lg text-[10px] font-black tracking-widest border border-black/5 uppercase">{student.class}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                     <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                           <Users size={14} className="text-black/30" />
                           <span className="text-black font-bold text-sm">{student.parent}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 ml-5">
                           <span className="text-xs text-black/40 font-mono italic">{student.contact}</span>
                        </div>
                     </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                     <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); alert("이름표 출력을 시작합니다."); }}
                          className="px-4 py-2 bg-white border border-primary/20 hover:bg-primary/5 rounded-xl text-primary text-xs font-black transition-all shadow-sm flex items-center gap-2"
                        >
                           <QrCode size={14} />
                           이름표 출력
                        </button>
                        <button 
                           onClick={(e) => handleDeleteStudent(e, student.id)}
                           className="p-2 bg-white border border-black/5 hover:bg-red-50 rounded-xl text-black/20 hover:text-red-500 transition-all"
                        >
                           <Trash2 size={16} />
                        </button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">학년 선택</label>
                  <select 
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none ring-1 ring-black/5 focus:ring-2 focus:ring-primary outline-none text-black appearance-none"
                    value={newStudent.grade}
                    onChange={e => setNewStudent({...newStudent, grade: e.target.value})}
                  >
                     <optgroup label="초등학교 (Elementary)">
                        <option value="E1">초등 1학년 (E1)</option>
                        <option value="E2">초등 2학년 (E2)</option>
                        <option value="E3">초등 3학년 (E3)</option>
                        <option value="E4">초등 4학년 (E4)</option>
                        <option value="E5">초등 5학년 (E5)</option>
                     </optgroup>
                     <optgroup label="중학교 (Middle)">
                        <option value="M6">중등 1학년 (M6)</option>
                        <option value="M7">중등 2학년 (M7)</option>
                        <option value="M8">중등 3학년 (M8)</option>
                     </optgroup>
                     <optgroup label="고등학교 (High)">
                        <option value="H9">고등 1학년 (H9)</option>
                        <option value="H10">고등 2학년 (H10)</option>
                        <option value="H11">고등 3학년 (H11)</option>
                        <option value="H12">고등 4학년 (H12)</option>
                     </optgroup>
                     <optgroup label="기타 (Preschool/Other)">
                        <option value="PRE">미취학/영유아</option>
                        <option value="ETC">기타</option>
                     </optgroup>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">반 이름 (선택)</label>
                  <input 
                    placeholder="예: 민들레반"
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none ring-1 ring-black/5 focus:ring-2 focus:ring-primary outline-none text-black"
                    value={newStudent.class}
                    onChange={e => setNewStudent({...newStudent, class: e.target.value})}
                  />
                </div>
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
