"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { QrCode, Plus, MessageSquare, FileIcon, ChevronRight, User, ShieldCheck, Check, AlertCircle, XCircle, Timer, LogIn, LogOut, Edit2, Phone, Mail, Lock, Sparkles, TrendingUp, ImageIcon, Bot, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, where, doc, getDoc, getDocs } from "firebase/firestore";

export default function ParentPortal({ portalId }: { portalId?: string }) {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const instId = portalId || searchParams?.get("id") || "";


  const [activeTab, setActiveTab] = useState<"home" | "messages">("home");
  const [instName, setInstName] = useState("");

  const [showAddChild, setShowAddChild] = useState(false);
  const [editingChildId, setEditingChildId] = useState<string | null>(null);
  const [hasDismissedInitialModal, setHasDismissedInitialModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyInvite = () => {
    const url = `${window.location.origin}/signup?code=${instId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    alert("초대 링크가 복사되었습니다! 카톡이나 문자로 배우자 또는 가족에게 전달해 주세요.");
  };


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

  const [children, setChildren] = useState<Child[]>([]);
  const [newChild, setNewChild] = useState({ name: "", accessCode: "", birthDate: "", allergies: "", notes: "", grade: "", class: "", photo: "" });

  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);
  const [carPlate, setCarPlate] = useState("12가 3456");
  const [memo, setMemo] = useState("");

  useEffect(() => {
    const guestId = searchParams?.get("guestId");
    if (guestId && db) {
      const fetchGuest = async () => {
        const guestDoc = await getDoc(doc(db!, "guests", guestId));
        if (guestDoc.exists()) {
          const data = guestDoc.data();
          setChildren([{
            id: guestId,
            name: data.studentName,
            class: data.grade,
            status: "absent",
            checkIn: null,
            checkOut: null
          }]);
          setHasDismissedInitialModal(true);
        }
      };
      fetchGuest();
    }
  }, [searchParams, db]);

  useEffect(() => {
    if (instId && db) {
      const fetchInst = async () => {
        try {
          // 1. Try finding by institutionId field
          const q = query(collection(db!, "institutions"), where("institutionId", "==", instId));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            setInstName(querySnapshot.docs[0].data().name);
          } else {
            // 2. Fallback: Try document ID
            const instDoc = await getDoc(doc(db!, "institutions", instId));
            if (instDoc.exists()) {
              setInstName(instDoc.data().name);
            }
          }
        } catch (error) {
          console.error("Error fetching institution:", error);
        }
      };
      fetchInst();
    }
  }, [instId, db]);


  useEffect(() => {
    const isGuest = !!searchParams?.get("guestId");
    if (children.length === 0 && activeTab === "home" && !hasDismissedInitialModal && !isGuest) {
      setShowAddChild(true);
    }
  }, [children.length, activeTab, hasDismissedInitialModal, searchParams]);

  const handleToggleSelect = (id: string) => {
    if (selectedChildren.includes(id)) {
      setSelectedChildren(selectedChildren.filter(c => c !== id));
    } else {
      setSelectedChildren([...selectedChildren, id]);
    }
  };

  const handleBatchDropOff = async () => {
    // If no children selected, apply to all absent.
    const targets = selectedChildren.length > 0 
      ? children.filter(c => selectedChildren.includes(c.id) && c.status === "absent")
      : children.filter(c => c.status === "absent");
      
    if (targets.length === 0) {
      alert("현재 등교 가능한 자녀가 없습니다. 자녀를 먼저 선택해 주세요.");
      return;
    }

    if (!confirm(`${targets.map(t => t.name).join(", ")} 아이의 등교를 확인하시겠습니까? 확인 즉시 이름표가 출력됩니다.`)) {
      return;
    }

    try {
      if (!db) throw new Error("Firebase database not initialized");

      for (const child of targets) {
        // 1. Create check-in log in Firestore
        await addDoc(collection(db, "checkin_logs"), {
          studentId: child.id,
          studentName: child.name,
          className: child.class,
          parentName: "보호자",
          timestamp: serverTimestamp(),
          institutionId: instId,
          type: "qr_portal"
        });

        // 2. Trigger printing simulation
        console.log(`Printing nametag for ${child.name}...`);
      }

      setChildren(children.map(c => 
        targets.some(t => t.id === c.id) ? { ...c, status: "present", checkIn: new Date().toLocaleTimeString('ko-KR', {hour:'2-digit', minute:'2-digit'}) } : c
      ));
      setSelectedChildren([]);
      setMemo("");
      
      alert("🚀 등교 확인이 완료되었습니다! 이름표 출력을 시작합니다.");
      // In a real app, this could call a Bluetooth printer API or window.print()
    } catch (error) {
      console.error("Error confirming drop-off:", error);
      alert("처리 중 오류가 발생했습니다.");
    }
  };


  const handleBatchPickUp = async () => {
    // If no children selected, apply to all present.
    const targets = selectedChildren.length > 0
      ? children.filter(c => selectedChildren.includes(c.id) && c.status === "present")
      : children.filter(c => c.status === "present");

    if (targets.length === 0) {
      alert("현재 하교 가능한 자녀가 없습니다. 자녀를 먼저 선택해 주세요.");
      return;
    }

    if (!confirm(`${targets.map(t => t.name).join(", ")} 아이의 하교 요청을 보내시겠습니까?`)) {
      return;
    }


    try {
      if (!db) throw new Error("Firebase database not initialized");

      for (const child of targets) {
        // 1. Create real-time pickup request in Firestore
        await addDoc(collection(db, "pickup_requests"), {
          studentId: child.id,
          studentName: child.name,
          className: child.class,
          parentName: "보호자", // Could be linked to actual auth user name
          status: "pending",
          requestTime: serverTimestamp(),
          institutionId: instId,
          memo: memo,
          type: "qr_portal"
        });

        // 2. Optional: Internal reporting sync
        fetch("/api/sync-report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "DISMISSAL_REQUEST_CREATED",
            studentName: child.name,
            className: child.class,
            timestamp: new Date().toISOString()
          })
        }).catch(err => console.error("Report sync failed:", err));
      }

      setChildren(children.map(c => 
        targets.some(t => t.id === c.id) ? { ...c, status: "pickup_requested" } : c
      ));
      setSelectedChildren([]);
      setMemo("");
      alert("🚗 하교(Pick-up) 요청이 원으로 전송되었습니다!");
    } catch (error) {
      console.error("Error requesting pickup:", error);
      alert("요청 중 오류가 발생했습니다.");
    }
  };

  const handleUrgentAction = (id: string, action: "cancel" | "delay") => {
    if (action === "cancel") {
      setChildren(children.map(c => c.id === id ? { ...c, status: "present" } : c));
      alert("픽업 요청이 안전하게 취소되었습니다.");
    } else {
      alert("도착 예정 시간을 10분 지연시켰습니다. 기관에 전달되었습니다.");
    }
  };

  const messages = [
    { id: 1, text: "이번 학기부터 미술 수업에 잘 집중하고 있습니다.", date: "2026-02-20", file: null },
    { id: 2, text: "첨부된 학업 성취도 평가 결과를 확인해 주세요.", date: "2026-02-15", file: "성적표.pdf" }
  ];

  const mockTeachers: Record<string, {name: string, phone: string, email: string}> = {
    "기쁨반": { name: "이지은 선생님", phone: "010-1234-5678", email: "jieun@kidsgate.com" },
    "민들레반": { name: "김태희 선생님", phone: "010-8765-4321", email: "taehee@kidsgate.com" },
    "햇살반": { name: "박보영 선생님", phone: "010-1111-2222", email: "boyoung@kidsgate.com" }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
           setNewChild({...newChild, photo: ev.target?.result as string});
        };
        reader.readAsDataURL(file);
     }
  };

  const handleSaveChild = (e: React.FormEvent | React.MouseEvent, continueAdding = false) => {
    e.preventDefault();
    if (!newChild.name) return;
    
    const matchedTeacher = mockTeachers[newChild.class] || null;

    if (editingChildId) {
       setChildren(children.map(c => c.id === editingChildId ? {
          ...c, 
          name: newChild.name, 
          birthDate: newChild.birthDate,
          allergies: newChild.allergies,
          notes: newChild.notes,
          grade: newChild.grade,
          class: newChild.class,
          photo: newChild.photo,
          teacherName: matchedTeacher?.name,
          teacherPhone: matchedTeacher?.phone,
          teacherEmail: matchedTeacher?.email,
       } : c));
       setEditingChildId(null);
    } else {
       setChildren([...children, { 
         id: Date.now().toString(), 
         name: newChild.name, 
         grade: newChild.grade,
         class: newChild.class || "대기반", 
         photo: newChild.photo,
         status: "absent",
         checkIn: null,
         checkOut: null,
         birthDate: newChild.birthDate,
         allergies: newChild.allergies,
         notes: newChild.notes,
         teacherName: matchedTeacher?.name,
         teacherPhone: matchedTeacher?.phone,
         teacherEmail: matchedTeacher?.email,
       }]);
    }

    if (!continueAdding) {
       setShowAddChild(false);
       setHasDismissedInitialModal(true);
    }
    setEditingChildId(null);
    setNewChild({name: "", accessCode: "", birthDate: "", allergies: "", notes: "", grade: "", class: "", photo: ""});
  };

  const openEditModal = (child: Child) => {
     setNewChild({
        name: child.name,
        accessCode: "", // not editing access code for now
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
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto relative shadow-2xl">
      
      {/* App Header */}
      <header className="bg-white px-6 py-5 border-b border-black/5 sticky top-0 z-10 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden border border-black/5">
               <img src="/children_gate_logo.png" alt="Children Gate Logo" className="w-full h-full object-contain p-2" />
            </div>
            <div>
               <h1 className="font-black text-lg text-black leading-tight">{instName || "칠드런 게이트"}</h1>
               <p className="text-xs text-black/40 font-bold">{instId || "연결 중..."}</p>
            </div>

         </div>
         <div className="flex items-center gap-2">
            <button 
              onClick={handleCopyInvite}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${copied ? 'bg-emerald-50 text-emerald-500' : 'bg-gray-50 text-black/30 hover:bg-primary/10 hover:text-primary'}`}
              title="가족 초대하기"
            >
               {copied ? <Check size={18} /> : <Share2 size={18} />}
            </button>

            <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-black/50 overflow-hidden border border-black/5">
               <User size={18} />
            </button>
         </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 px-6 pt-6">
        
        {activeTab === "home" && (
          <motion.div initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} className="space-y-6">
            
            <div className="flex items-center justify-between mb-2">
               <h2 className="text-xl font-black text-black">우리아이 출결 현황</h2>
               <button 
                  onClick={() => setShowAddChild(true)}
                  className="flex items-center gap-1 text-sm font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full"
               >
                 <Plus size={16} /> 학생 추가
               </button>
            </div>

            {children.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 border border-black/5 text-center shadow-sm">
                 <div className="w-16 h-16 bg-gray-50 rounded-full mx-auto flex items-center justify-center mb-4">
                    <User className="text-black/20" size={32} />
                 </div>
                 <p className="text-black/50 font-bold mb-4">등록된 자녀가 없습니다.<br/>기관 코드로 자녀를 연결해 주세요.</p>
                 <button onClick={() => setShowAddChild(true)} className="apple-button-primary w-full justify-center">자녀 연결하기</button>
              </div>
            ) : (
               <div className="space-y-6">
                


                {/* 1. Main Control Panel (Drop Off / Pick Up) -- THIS IS THE PRIORITY UI */}
                <div className="bg-white rounded-[40px] p-6 shadow-2xl border border-primary/20 bg-gradient-to-tr from-white to-primary/5 relative overflow-hidden">
                  <div className="flex items-center gap-2 mb-4 bg-white/60 p-3 rounded-2xl border border-black/5 backdrop-blur-sm">
                    <div className="w-8 h-8 bg-black rounded-lg text-white flex items-center justify-center shrink-0">
                    </div>
                    <div className="flex-1 text-sm font-bold text-black flex items-center justify-between">
                       <span className="text-black/50 text-xs">등록 차량</span>
                       <input 
                         type="text" 
                         value={carPlate}
                         onChange={(e) => setCarPlate(e.target.value)}
                         className="font-mono bg-white px-2 py-1 rounded shadow-sm border border-black/5 text-right outline-none w-28 focus:ring-2 focus:ring-primary"
                         placeholder="차량번호"
                       />
                    </div>
                  </div>

                  <input 
                     type="text" 
                     value={memo}
                     onChange={e => setMemo(e.target.value)}
                     placeholder="선생님께 남길 메모 (예: 오늘 할머니가 데리러 가요)"
                     className="w-full text-sm font-medium border-2 border-dashed border-primary/30 px-5 py-4 rounded-2xl outline-none focus:border-primary placeholder:text-primary/40 mb-5 bg-white shadow-inner text-black"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={handleBatchDropOff}
                      className="bg-primary text-white py-6 rounded-[28px] shadow-xl shadow-primary/30 flex flex-col items-center justify-center gap-3 active:scale-95 transition-transform"
                    >
                      <LogIn size={36} />
                      <span className="font-black text-xl leading-tight text-center">등교 확인<br/><span className="text-xs opacity-70 font-semibold tracking-widest uppercase">Drop-off</span></span>
                    </button>
                    <button 
                      onClick={handleBatchPickUp}
                      className="bg-emerald-500 text-white py-6 rounded-[28px] shadow-xl shadow-emerald-500/30 flex flex-col items-center justify-center gap-3 active:scale-95 transition-transform"
                    >
                      <LogOut size={36} />
                      <span className="font-black text-xl leading-tight text-center">하교 요청<br/><span className="text-xs opacity-70 font-semibold tracking-widest uppercase">Pick-up</span></span>
                    </button>
                  </div>
                  <p className="text-center text-[10px] text-black/40 font-bold mt-4 uppercase tracking-widest">Select cards below for individual actions</p>
                </div>
                
                {/* 2. Children Cards */}
                <div className="space-y-4">
                  {children.map(child => {
                    const isSelected = selectedChildren.includes(child.id);
                    return (
                      <div 
                        key={child.id} 
                        onClick={() => handleToggleSelect(child.id)}
                        className={`bg-white rounded-[32px] p-6 border-2 transition-all relative overflow-hidden cursor-pointer active:scale-[0.98] ${isSelected ? 'border-primary shadow-lg shadow-primary/20' : 'border-black/5 shadow-sm'}`}
                      >
                         {isSelected && (
                           <div className="absolute top-4 left-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white z-10 transition-all">
                             <Check size={14} strokeWidth={4} />
                           </div>
                         )}

                         <div className="absolute top-4 right-4 z-20">
                           <button 
                             onClick={(e) => { e.stopPropagation(); openEditModal(child); }}
                             className="p-2 text-black/30 bg-gray-50 rounded-full hover:bg-gray-100 hover:text-black transition-colors"
                             title="프로필 수정"
                           >
                              <Edit2 size={14} />
                           </button>
                         </div>

                          <div className="flex items-center gap-4 mb-6 relative z-10">
                             <div className="relative group">
                               <div className={`w-14 h-14 bg-gradient-to-tr shadow-inner border border-white rounded-full flex items-center justify-center font-black text-xl overflow-hidden ${isSelected ? 'from-primary to-primary/80 text-white' : 'from-primary/20 to-primary/5 text-primary'}`}>
                                  {child.photo ? (
                                    <img src={child.photo} alt={child.name} className="w-full h-full object-cover" />
                                  ) : child.name.charAt(0)}
                               </div>
                               <button 
                                 onClick={(e) => { e.stopPropagation(); alert(`${child.name}의 QR 코드가 활성화 되었습니다. 원 스캐너에 보여주세요!`); }}
                                 className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-lg shadow-lg flex items-center justify-center text-black border border-black/5 active:scale-95 transition-transform"
                               >
                                 <QrCode size={14} />
                               </button>
                             </div>
                             <div>
                                <div className="flex items-center gap-1 mb-1 relative z-10">
                                   {child.grade && <span className="px-2 py-0.5 bg-gray-100/50 text-[10px] font-black uppercase rounded-md text-black/50">{child.grade}</span>}
                                   <span className="px-2 py-0.5 bg-gray-100 text-[10px] font-black uppercase rounded-md text-black/50">{child.class}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <h3 className="text-xl font-black text-black">{child.name}</h3>
                                  <div className={`px-2 py-1 rounded-lg flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider ${
                                    child.status === 'pickup_requested' ? 'bg-amber-100 text-amber-700' :
                                    child.status === 'present' ? 'bg-emerald-100 text-emerald-700' : 
                                    'bg-gray-100 text-black/40'}`}>
                                     {child.status === 'pickup_requested' ? "하교 중" : child.status === 'present' ? '보육 중' : '결석'}
                                  </div>
                                </div>
                             </div>
                          </div>

                          {/* Teacher Contact Section */}
                          {child.teacherName && (
                             <div className="bg-primary/5 rounded-2xl p-4 mb-4 border border-primary/10 flex items-center justify-between z-10 relative">
                               <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                    <User size={18} />
                                 </div>
                                 <div className="flex flex-col">
                                   <span className="text-xs font-bold text-primary opacity-80 uppercase tracking-widest">담임 선생님</span>
                                   <span className="text-sm font-black text-black">{child.teacherName}</span>
                                 </div>
                               </div>
                               <div className="flex items-center gap-2">
                                  <a href={`tel:${child.teacherPhone}`} onClick={e => e.stopPropagation()} className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                                    <Phone size={14} />
                                  </a>
                                  <a href={`mailto:${child.teacherEmail}`} onClick={e => e.stopPropagation()} className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                                    <Mail size={14} />
                                  </a>
                               </div>
                             </div>
                          )}

                         {/* Visual Timeline element */}
                         <div className="relative pl-6 pb-2 border-l-2 border-gray-100 ml-4 space-y-4">
                           <div className="relative">
                              <div className={`absolute -left-[29px] top-1 w-3 h-3 rounded-full ring-4 ring-white ${child.checkIn ? 'bg-primary' : 'bg-gray-200'}`}></div>
                              <p className="text-xs font-bold flex items-center gap-1.5 text-black">
                                등교 상태 <span className="font-mono text-black/40">{child.checkIn || "미등교"}</span>
                              </p>
                           </div>
                           
                           {child.status === "pickup_requested" ? (
                             <div className="relative">
                                <div className="absolute -left-[31px] top-0.5 w-4 h-4 bg-amber-400 rounded-full ring-4 ring-white animate-pulse"></div>
                                <p className="text-xs font-bold text-amber-600 flex items-center gap-1.5">하교 준비 중 <AlertCircle size={12}/></p>
                             </div>
                           ) : child.checkOut ? (
                             <div className="relative">
                                <div className="absolute -left-[29px] top-1 w-3 h-3 bg-red-400 rounded-full ring-4 ring-white"></div>
                                <p className="text-xs font-bold text-red-600 flex items-center gap-1.5">하교 완료 <span className="font-mono">{child.checkOut}</span></p>
                             </div>
                           ) : child.status === "present" ? (
                             <div className="relative">
                                <div className="absolute -left-[29px] top-1 w-3 h-3 bg-emerald-400 rounded-full ring-4 ring-white"></div>
                                <p className="text-xs font-bold text-emerald-600">원내 보육 중</p>
                             </div>
                           ) : null}
                         </div>

                         {/* Urgent Actions for Pick-up Requested */}
                         {child.status === "pickup_requested" && (
                           <div className="mt-6 flex items-center gap-2 pt-4 border-t border-black/5">
                             <button 
                               onClick={(e) => { e.stopPropagation(); handleUrgentAction(child.id, "cancel"); }}
                               className="flex-1 bg-red-50 text-red-600 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition-transform"
                             >
                               <XCircle size={16} /> 하교 취소
                             </button>
                             <button 
                               onClick={(e) => { e.stopPropagation(); handleUrgentAction(child.id, "delay"); }}
                               className="flex-1 bg-gray-100 text-black py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition-transform"
                             >
                               <Timer size={16} /> 10분 지연
                             </button>
                           </div>
                         )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
 

          </motion.div>
        )}

        {activeTab === "messages" && (
          <motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} className="space-y-6">
            <h2 className="text-xl font-black text-black mb-2">선생님 알림장</h2>
            <div className="space-y-4">
               {messages.map(msg => (
                  <div key={msg.id} className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm">
                     <div className="flex items-center justify-between mb-3 border-b border-black/5 pb-3">
                        <span className="flex items-center gap-2 text-primary font-bold text-sm">
                           <MessageSquare size={16} /> 알림
                        </span>
                        <span className="text-xs font-bold text-black/30">{msg.date}</span>
                     </div>
                     <p className="text-black font-medium leading-relaxed mb-4">{msg.text}</p>
                     
                     {msg.file && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-black/5">
                           <div className="flex items-center gap-3 overflow-hidden">
                              <div className="p-2 bg-white rounded-xl text-red-500 shadow-sm shrink-0">
                                 <FileIcon size={18} />
                              </div>
                              <span className="text-sm font-bold text-black truncate">{msg.file}</span>
                           </div>
                            <button 
                              onClick={() => alert(`${msg.file} 파일을 다운로드합니다...`)}
                              className="text-xs font-bold text-primary shrink-0 px-3 py-1.5 bg-primary/10 rounded-lg active:scale-95 transition-transform"
                            >
                              다운로드
                            </button>
                        </div>
                     )}
                  </div>
               ))}
            </div>
          </motion.div>
        )}

      </main>



      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-black/5 fixed bottom-0 w-full max-w-md pb-safe">
         <div className="flex">
            <button 
               onClick={() => setActiveTab("home")}
               className={`flex-1 py-4 flex flex-col items-center gap-1 ${activeTab === "home" ? "text-primary" : "text-black/30"}`}
            >
               <User size={24} className={activeTab === "home" ? "fill-primary/20" : ""} />
               <span className="text-[10px] font-bold">홈</span>
            </button>
            <button 
               onClick={() => setActiveTab("messages")}
               className={`flex-1 py-4 flex flex-col items-center gap-1 relative ${activeTab === "messages" ? "text-primary" : "text-black/30"}`}
            >
               <MessageSquare size={24} className={activeTab === "messages" ? "fill-primary/20" : ""} />
               <span className="text-[10px] font-bold">알림장</span>
               <div className="absolute top-3 right-1/3 w-2 h-2 bg-red-500 rounded-full border border-white"></div>
            </button>
         </div>
      </nav>

      {/* Add Child Modal */}
      <AnimatePresence>
      {showAddChild && (
         <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center p-0 sm:p-4">
            <motion.div 
               initial={{ y: "100%" }}
               animate={{ y: 0 }}
               exit={{ y: "100%" }}
               transition={{ type: "spring", damping: 25, stiffness: 200 }}
               className="bg-white w-full max-w-md rounded-t-[40px] sm:rounded-[40px] p-8 pb-12 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
                <button 
                  onClick={() => { setShowAddChild(false); setHasDismissedInitialModal(true); }}
                  className="absolute top-8 right-8 text-black/20 hover:text-black z-20"
                >
                   <XCircle size={24} />
                </button>
               <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 sm:hidden"></div>
               <h2 className="text-2xl font-black mb-2 text-black">{editingChildId ? "자녀 프로필 수정" : "자녀 프로필 입력"}</h2>
               <p className="text-black/50 font-medium mb-6">{editingChildId ? "자녀의 세부 정보를 안전하게 수정할 수 있습니다." : "안전한 돌봄을 위해 자녀의 세부 정보를 정확히 입력해 주세요."}</p>
               
               <form onSubmit={(e) => handleSaveChild(e)} className="space-y-4">
                  <div className="flex flex-col items-center mb-6">
                     <label className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-black/20 cursor-pointer overflow-hidden relative group">
                        {newChild.photo ? (
                          <img src={newChild.photo} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center text-black/30 group-hover:text-primary flex flex-col items-center">
                            <Plus size={24} />
                            <span className="text-[10px] font-bold mt-1">사진 추가</span>
                          </div>
                        )}
                        <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                     </label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-black/70 mb-2 ml-1">자녀 이름</label>
                        <input 
                          required
                          placeholder="예: 홍길동"
                          value={newChild.name}
                          onChange={e => setNewChild({...newChild, name: e.target.value})}
                          className="w-full bg-gray-50 border border-black/5 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold text-black"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-black/70 mb-2 ml-1">생년월일</label>
                        <input 
                          type="date"
                          value={newChild.birthDate}
                          onChange={e => setNewChild({...newChild, birthDate: e.target.value})}
                          className="w-full bg-gray-50 border border-black/5 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold text-black"
                        />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-bold text-black/70 mb-2 ml-1">학년 (선택)</label>
                        <input 
                           placeholder="예: 초3, 5세"
                           value={newChild.grade}
                           onChange={e => setNewChild({...newChild, grade: e.target.value})}
                           className="w-full bg-gray-50 border border-black/5 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold text-black"
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-black/70 mb-2 ml-1">반 이름 (선택)</label>
                        <input 
                           placeholder="예: 기쁨반, 민들레반"
                           value={newChild.class}
                           onChange={e => setNewChild({...newChild, class: e.target.value})}
                           className="w-full bg-gray-50 border border-black/5 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold text-black transition-all"
                        />
                        {mockTeachers[newChild.class] && (
                          <p className="text-[10px] font-bold text-primary mt-1.5 ml-1 animate-pulse">
                            ✨ {mockTeachers[newChild.class].name} 매칭됨
                          </p>
                        )}
                     </div>
                  </div>

                  <div>
                     <label className="block text-sm font-bold text-black/70 mb-2 ml-1">알레르기 정보</label>
                     <input 
                        placeholder="예: 복숭아, 땅콩, 고등어 등 (없으면 빈칸)"
                        value={newChild.allergies}
                        onChange={e => setNewChild({...newChild, allergies: e.target.value})}
                        className="w-full bg-red-50/50 border border-red-100 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-red-300 font-bold text-black placeholder:font-normal"
                     />
                  </div>

                  <div>
                     <label className="block text-sm font-bold text-black/70 mb-2 ml-1">기타 특이사항</label>
                     <textarea 
                        rows={3}
                        placeholder="건강 상태, 약 복용 등 선생님이 꼭 알아야 할 특별한 사항을 적어주세요."
                        value={newChild.notes}
                        onChange={e => setNewChild({...newChild, notes: e.target.value})}
                        className="w-full bg-gray-50 border border-black/5 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-primary font-medium text-black resize-none text-sm placeholder:text-black/30"
                     />
                  </div>
                  
                  <div className="flex flex-col gap-3 pt-4">
                     {editingChildId ? (
                       <div className="flex gap-3">
                         <button type="button" onClick={() => { setShowAddChild(false); setEditingChildId(null); }} className="flex-1 py-4 bg-gray-100 text-black font-bold rounded-2xl active:scale-95 transition-transform">취소</button>
                         <button type="submit" className="flex-1 py-4 bg-black text-white font-bold rounded-2xl shadow-xl shadow-black/30 active:scale-95 transition-transform">수정 완료</button>
                       </div>
                     ) : (
                       <div className="flex flex-col gap-3">
                         <button type="button" onClick={(e) => handleSaveChild(e, true)} className="w-full py-4 bg-primary/10 text-primary font-bold rounded-2xl active:scale-95 transition-transform border border-primary/20 hover:bg-primary hover:text-white">
                           저장하고 자녀 한 명 더 추가하기
                         </button>
                         <button type="submit" className="w-full py-4 bg-black text-white font-bold rounded-2xl shadow-xl shadow-black/30 active:scale-95 transition-transform">
                           프로필 등록 완료
                         </button>
                       </div>
                     )}
                  </div>
               </form>
            </motion.div>
         </div>
      )}
      </AnimatePresence>


    </div>
  );
}
