"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { 
  QrCode, Plus, MessageSquare, FileIcon, ChevronRight, User, 
  ShieldCheck, Check, AlertCircle, XCircle, Timer, LogIn, 
  LogOut, Edit2, Phone, Mail, Share2, Calendar, CheckCircle2 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db, auth } from "@/lib/firebase";
import { 
  collection, addDoc, serverTimestamp, query, where, doc, 
  getDoc, getDocs, orderBy, limit, onSnapshot, updateDoc
} from "firebase/firestore";

interface Child {
  id: string;
  name: string;
  grade?: string;
  class: string;
  photo?: string;
  status: "present" | "absent" | "pickup_requested";
  checkIn: string | null;
  checkOut: string | null;
  birthDate?: string;
  allergies?: string;
  notes?: string;
  teacherName?: string;
  teacherPhone?: string;
  teacherEmail?: string;
}

interface MessageItem {
  id: string;
  title: string;
  content: string;
  timestamp: any;
  type: string;
  attachmentName?: string;
  attachmentUrl?: string;
}

export default function ParentPortal({ portalId }: { portalId?: string }) {
  const { language } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const instId = portalId || searchParams?.get("id") || "";

  const [activeTab, setActiveTab] = useState<"home" | "messages" | "attendance">("home");
  const [instName, setInstName] = useState("");
  const [showAddChild, setShowAddChild] = useState(false);
  const [editingChildId, setEditingChildId] = useState<string | null>(null);
  const [hasDismissedInitialModal, setHasDismissedInitialModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [children, setChildren] = useState<Child[]>([]);
  const [newChild, setNewChild] = useState({ 
    name: "", accessCode: "", birthDate: "", allergies: "", 
    notes: "", grade: "", class: "", photo: "" 
  });
  const [attendanceLogs, setAttendanceLogs] = useState<any[]>([]);
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);
  const [memo, setMemo] = useState("");
  const [realMessages, setRealMessages] = useState<MessageItem[]>([]);

  useEffect(() => {
    if (authLoading) return;
    
    // Guest check
    const guestId = searchParams?.get("guestId");
    
    // If not guest and not logged in, boot to login after a safety delay
    if (!guestId && !user) {
      const timer = setTimeout(() => {
        if (!user && !authLoading && !searchParams?.get("guestId")) {
          console.log("Parent Guard: No session found after 4s, returning to login");
          window.location.href = "/login?type=parent";
        }
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [user, authLoading, searchParams]);

  const mockTeachers: Record<string, {name: string, phone: string, email: string}> = {
    "기쁨반": { name: "이지은 선생님", phone: "010-1234-5678", email: "jieun@kidsgate.com" },
    "민들레반": { name: "김태희 선생님", phone: "010-8765-4321", email: "taehee@kidsgate.com" },
    "햇살반": { name: "박보영 선생님", phone: "010-1111-2222", email: "boyoung@kidsgate.com" }
  };

  const handleCopyInvite = () => {
    const url = `${window.location.origin}/signup?code=${instId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    alert("초대 링크가 복사되었습니다!");
  };

  // Fetch Institution Info
  useEffect(() => {
    if (instId && db) {
      const fetchInst = async () => {
        try {
          const q = query(collection(db!, "institutions"), where("institutionId", "==", instId));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            setInstName(querySnapshot.docs[0].data().name);
          }
        } catch (error) {
          console.error("Error fetching institution:", error);
        }
      };
      fetchInst();
    }
  }, [instId]);

  // Fetch Children
  useEffect(() => {
    if (!instId || !db || !user?.email) return;

    const fetchChildren = async () => {
      try {
        const q = query(
          collection(db!, "students"), 
          where("parentEmail", "==", user.email),
          where("institutionId", "==", instId)
        );
        const snapshot = await getDocs(q);
        const childList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Child[];
        setChildren(childList);
        if (childList.length > 0) {
          setHasDismissedInitialModal(true);
        }
      } catch (error) {
        console.error("Error fetching children:", error);
      }
    };

    fetchChildren();
  }, [instId, user?.email]);

  // Fetch Attendance Logs (Client-side Sort to avoid index error)
  useEffect(() => {
    if (activeTab === "attendance" && instId && db) {
      const fetchLogs = async () => {
        try {
          const q = query(collection(db!, "checkin_logs"), where("institutionId", "==", instId));
          const snapshot = await getDocs(q);
          const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          const sorted = logs.sort((a: any, b: any) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
          setAttendanceLogs(sorted);
        } catch (error) {
          console.error("Error fetching logs:", error);
        }
      };
      fetchLogs();
    }
  }, [activeTab, instId]);

  // Messages Listener
  useEffect(() => {
    if (!instId || !db) return;
    const q = query(
      collection(db!, "messages"),
      where("institutionId", "==", instId),
      orderBy("timestamp", "desc"),
      limit(20)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(d => ({
        id: d.id, ...d.data()
      })) as MessageItem[];
      setRealMessages(msgs);
    });
    return () => unsubscribe();
  }, [instId]);

  const handleToggleSelect = (id: string) => {
    setSelectedChildren(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const handleBatchDropOff = async () => {
    const targets = children.filter(c => (selectedChildren.length === 0 || selectedChildren.includes(c.id)) && c.status === "absent");
    if (targets.length === 0) return alert("등교 가능한 자녀를 선택해 주세요.");
    
    if (!confirm(`${targets.map(t => t.name).join(", ")} 등교 승인?`)) return;

    try {
      setLoading(true);
      for (const child of targets) {
        await addDoc(collection(db!, "checkin_logs"), {
          studentId: child.id,
          studentName: child.name,
          institutionId: instId,
          timestamp: serverTimestamp(),
          status: "in"
        });
        await updateDoc(doc(db!, "students", child.id), { status: "present" });
      }
      setChildren(children.map(c => targets.some(t => t.id === c.id) ? { ...c, status: "present" } : c));
      setSelectedChildren([]);
      alert("등교 확인 완료!");
    } catch (error) {
      console.error(error);
      alert("오류 발생");
    } finally {
      setLoading(false);
    }
  };

  const handleBatchPickUp = async () => {
    const targets = children.filter(c => (selectedChildren.length === 0 || selectedChildren.includes(c.id)) && c.status === "present");
    if (targets.length === 0) return alert("하교 가능한 자녀를 선택해 주세요.");
    
    try {
      setLoading(true);
      for (const child of targets) {
        await addDoc(collection(db!, "pickup_requests"), {
          studentId: child.id,
          studentName: child.name,
          institutionId: instId,
          status: "pending",
          requestTime: serverTimestamp()
        });
        await updateDoc(doc(db!, "students", child.id), { status: "pickup_requested" });
      }
      setChildren(children.map(c => targets.some(t => t.id === c.id) ? { ...c, status: "pickup_requested" } : c));
      setSelectedChildren([]);
      alert("하교 요청 완료!");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChild = async (e: React.FormEvent, continueAdding = false) => {
    e.preventDefault();
    if (!newChild.name || !db || !user?.email) return;

    setLoading(true);
    try {
      const childData = {
        name: newChild.name,
        grade: newChild.grade,
        class: newChild.class || "대기반",
        photo: newChild.photo || null,
        birthDate: newChild.birthDate,
        allergies: newChild.allergies,
        notes: newChild.notes,
        parentEmail: user.email,
        institutionId: instId,
        status: "absent" as const,
        checkIn: null,
        checkOut: null,
        createdAt: serverTimestamp()
      };

      if (editingChildId) {
        await updateDoc(doc(db, "students", editingChildId), childData);
        setChildren(prev => prev.map(c => c.id === editingChildId ? { ...c, ...childData, photo: childData.photo || undefined } as Child : c));
      } else {
        const docRef = await addDoc(collection(db, "students"), childData);
        const newChildEntry: Child = {
          id: docRef.id,
          name: childData.name,
          grade: childData.grade,
          class: childData.class,
          photo: childData.photo || undefined,
          status: childData.status,
          checkIn: childData.checkIn,
          checkOut: childData.checkOut,
          birthDate: childData.birthDate,
          allergies: childData.allergies,
          notes: childData.notes
        };
        setChildren(prev => [...prev, newChildEntry]);
      }

      if (!continueAdding) {
        setShowAddChild(false);
        setHasDismissedInitialModal(true);
      }
      setNewChild({ name: "", accessCode: "", birthDate: "", allergies: "", notes: "", grade: "", class: "", photo: "" });
      setEditingChildId(null);
    } catch (error) {
      console.error(error);
      alert("저장 실패");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setNewChild(prev => ({ ...prev, photo: ev.target?.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const openEditModal = (child: Child) => {
    setNewChild({
      name: child.name,
      accessCode: "",
      birthDate: child.birthDate || "",
      allergies: child.allergies || "",
      notes: child.notes || "",
      grade: child.grade || "",
      class: child.class || "",
      photo: child.photo || ""
    });
    setEditingChildId(child.id);
    setShowAddChild(true);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-md mx-auto relative shadow-2xl">
      {loading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-md font-black">
          데이터 처리 중...
        </div>
      )}
      
      <header className="bg-white px-8 py-6 sticky top-0 z-40 flex items-center justify-between border-b border-black/[0.03]">
         <div className="flex items-center gap-4">
            <Link href="/" className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center p-0.5 border border-black/[0.03] shadow-inner overflow-hidden">
               <img src="/children_gate_logo.png" alt="Logo" className="w-full h-full object-contain" />
            </Link>
            <div>
               <h1 className="font-black text-lg text-black">{instName || "Children Gate"}</h1>
               <span className="text-[10px] font-black text-black/30 uppercase">{instId}</span>
            </div>
         </div>
          <button 
            onClick={async () => { 
              if(confirm("로그아웃 하시겠습니까?")) { 
                try {
                  localStorage.removeItem("kg_auto_login");
                  await auth?.signOut(); 
                  window.location.href="/login?type=parent&logout=true"; 
                } catch (e) {
                  window.location.href="/login?logout=true";
                }
              } 
            }} 
            className="p-2 text-black/20 hover:text-red-500 transition-colors"
          >
             <LogOut size={20} />
          </button>
      </header>

      <main className="flex-1 p-8 pb-32 space-y-8 overflow-y-auto">
        {activeTab === "home" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-black">자녀 목록</h2>
              <button onClick={() => setShowAddChild(true)} className="p-2 bg-primary text-white rounded-full"><Plus size={20} /></button>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {children.map(child => (
                <div key={child.id} onClick={() => handleToggleSelect(child.id)} className={`p-6 rounded-[32px] border-2 transition-all relative cursor-pointer ${selectedChildren.includes(child.id) ? 'border-primary bg-primary/5' : 'border-black/5 bg-white'}`}>
                  <button onClick={(e) => { e.stopPropagation(); openEditModal(child); }} className="absolute top-4 right-4 p-2 text-black/20 hover:text-black focus:outline-none"><Edit2 size={16} /></button>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center border border-black/5">
                      {child.photo ? <img src={child.photo} alt={child.name} className="w-full h-full object-cover" /> : <User size={32} className="text-black/10" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black bg-primary/10 text-primary px-1.5 py-0.5 rounded">{child.grade}</span>
                        <span className="text-[10px] font-black bg-gray-100 text-black/40 px-1.5 py-0.5 rounded">{child.class}</span>
                      </div>
                      <h3 className="text-xl font-black text-black">{child.name}</h3>
                      <p className={`text-[10px] font-bold mt-1 ${child.status === 'present' ? 'text-emerald-500' : 'text-slate-400'}`}>
                        {child.status === 'present' ? "원내 보육 중" : child.status === 'pickup_requested' ? "하교 진행 중" : "미등교"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {children.length === 0 && (
                <div className="text-center py-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-black/5">
                  <p className="font-black text-black/20">등록된 자녀가 없습니다</p>
                </div>
              )}
            </div>

            <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-md px-8 z-40">
              <div className="bg-black/90 backdrop-blur-xl rounded-[32px] p-4 flex gap-3 shadow-2xl border border-white/10">
                <button onClick={handleBatchDropOff} className="flex-1 py-4 bg-primary text-white font-black rounded-2xl shadow-lg active:scale-95 transition-all text-sm">등교 확인</button>
                <button onClick={handleBatchPickUp} className="flex-1 py-4 bg-emerald-500 text-white font-black rounded-2xl shadow-lg active:scale-95 transition-all text-sm">하교 요청</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "attendance" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-black">출결 리포트</h2>
            <div className="space-y-3">
              {attendanceLogs.map((log, i) => (
                <div key={i} className="flex items-center justify-between p-5 bg-white rounded-3xl border border-black/5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${log.status === 'in' ? 'bg-primary/10 text-primary' : 'bg-emerald-50 text-emerald-500'}`}>
                      {log.status === 'in' ? <LogIn size={18} /> : <LogOut size={18} />}
                    </div>
                    <div>
                      <p className="font-black text-black text-sm">{log.studentName}</p>
                      <p className="text-[10px] font-bold text-black/30">{log.status === 'in' ? '등교' : '하교'}</p>
                    </div>
                  </div>
                  <p className="text-xs font-black text-black/70">
                    {log.timestamp?.toDate ? log.timestamp.toDate().toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '방금 전'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "messages" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-black">알림장</h2>
            <div className="space-y-4">
              {realMessages.map(msg => (
                <div key={msg.id} className="p-6 bg-white rounded-[32px] border border-black/5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${msg.type === 'notice' ? 'bg-blue-50 text-blue-500' : msg.type === 'urgent' ? 'bg-red-50 text-red-500' : 'bg-primary/10 text-primary'}`}>
                      {msg.type === 'notice' ? '공지' : msg.type === 'urgent' ? '긴급' : '알림'}
                    </span>
                    <span className="text-[10px] font-bold text-black/30">{msg.timestamp?.toDate ? msg.timestamp.toDate().toLocaleDateString() : ''}</span>
                  </div>
                  <h3 className="font-black text-black mb-2">{msg.title}</h3>
                  <p className="text-sm text-black/60 leading-relaxed">{msg.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <nav className="bg-white/80 backdrop-blur-xl border-t border-black/5 fixed bottom-0 w-full max-w-md pb-safe z-50">
         <div className="flex px-4">
            <button onClick={() => setActiveTab("home")} className={`flex-1 py-4 flex flex-col items-center gap-1 ${activeTab === "home" ? "text-primary" : "text-black/20"}`}>
               <User size={24} />
               <span className="text-[10px] font-black uppercase tracking-widest">Home</span>
            </button>
            <button onClick={() => setActiveTab("attendance")} className={`flex-1 py-4 flex flex-col items-center gap-1 ${activeTab === "attendance" ? "text-primary" : "text-black/20"}`}>
               <Calendar size={24} />
               <span className="text-[10px] font-black uppercase tracking-widest">Attendance</span>
            </button>
            <button onClick={() => setActiveTab("messages")} className={`flex-1 py-4 flex flex-col items-center gap-1 ${activeTab === "messages" ? "text-primary" : "text-black/20"}`}>
               <MessageSquare size={24} />
               <span className="text-[10px] font-black uppercase tracking-widest">Inbox</span>
            </button>
         </div>
      </nav>

      <AnimatePresence>
        {showAddChild && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm p-0">
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="bg-white w-full max-w-md rounded-t-[48px] p-10 pb-16 shadow-2xl overflow-y-auto max-h-[85vh]">
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8"></div>
              <h2 className="text-3xl font-black mb-2 text-black">{editingChildId ? "정보 수정" : "아이 등록"}</h2>
              <form onSubmit={handleSaveChild} className="space-y-6">
                <div className="flex flex-col items-center">
                  <label className="w-24 h-24 rounded-full bg-slate-50 border-2 border-dashed border-black/10 flex items-center justify-center overflow-hidden cursor-pointer">
                    {newChild.photo ? <img src={newChild.photo} alt="P" className="w-full h-full object-cover" /> : <Plus size={24} className="text-black/20" />}
                    <input type="file" className="hidden" onChange={handlePhotoUpload} />
                  </label>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <input required placeholder="자녀 이름" value={newChild.name} onChange={e => setNewChild({...newChild, name: e.target.value})} className="w-full bg-slate-50 px-6 py-4 rounded-2xl outline-none font-bold" />
                  <input placeholder="학년 (PK, K, E1 등)" value={newChild.grade} onChange={e => setNewChild({...newChild, grade: e.target.value})} className="w-full bg-slate-50 px-6 py-4 rounded-2xl outline-none font-bold" />
                  <input placeholder="반 이름" value={newChild.class} onChange={e => setNewChild({...newChild, class: e.target.value})} className="w-full bg-slate-50 px-6 py-4 rounded-2xl outline-none font-bold" />
                  <textarea placeholder="특이사항 (알레르기 등)" value={newChild.notes} onChange={e => setNewChild({...newChild, notes: e.target.value})} className="w-full bg-slate-50 px-6 py-4 rounded-2xl outline-none font-bold resize-none" rows={3} />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowAddChild(false)} className="flex-1 py-5 bg-gray-100 text-black font-black rounded-[24px]">취소</button>
                  <button type="submit" className="flex-[2] py-5 bg-black text-white font-black rounded-[24px] shadow-xl">완료</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
