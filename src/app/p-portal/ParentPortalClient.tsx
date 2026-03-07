"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { 
  QrCode, Plus, MessageSquare, FileIcon, ChevronRight, User, 
  ShieldCheck, Check, AlertCircle, XCircle, Timer, LogIn, 
  LogOut, Edit2, Phone, Mail, Share2, Calendar, CheckCircle2,
  Trash2, ArrowRight, Clock, UserCheck, Users, Heart, Home} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db, auth } from "@/lib/firebase";
import { 
  collection, addDoc, serverTimestamp, query, where, doc, 
  getDoc, getDocs, orderBy, limit, onSnapshot, updateDoc, deleteDoc, arrayUnion
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
  teacherEmail?: string;
  barcodeId?: string;
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
  const router = useRouter();
  const redirectRef = useRef(false);
  const instId = portalId || searchParams?.get("id") || "";

  const [activeTab, setActiveTab] = useState<"home" | "messages" | "attendance" | "profile">("home");
  const [instName, setInstName] = useState("");
  const [currentInstId, setCurrentInstId] = useState(instId);
  const [allInstitutions, setAllInstitutions] = useState<{id: string, name: string}[]>([]);
  const [showInstList, setShowInstList] = useState(false);
  const [showAddChild, setShowAddChild] = useState(false);
  const [editingChildId, setEditingChildId] = useState<string | null>(null);
  const [hasDismissedInitialModal, setHasDismissedInitialModal] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
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
  const [existingClasses, setExistingClasses] = useState<string[]>([]);
  const [activePickupRequests, setActivePickupRequests] = useState<any[]>([]);
  const [showJoinInst, setShowJoinInst] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const [familyInfo, setFamilyInfo] = useState({
    fatherName: "", fatherPhone: "", fatherBirth: "",
    motherName: "", motherPhone: "", motherBirth: "",
    address: "", email: ""
  });
  
  // Pickup Requests Listener for Parent
  useEffect(() => {
    if (!currentInstId || !db) return;
    const q = query(
      collection(db, "pickup_requests"),
      where("institutionId", "==", currentInstId),
      where("status", "in", ["pending", "approved"]),
      orderBy("requestTime", "desc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setActivePickupRequests(data);
    }, (err) => {
      console.error("Parent pickup listener error:", err);
    });
    return () => unsubscribe();
  }, [currentInstId]);

  const standardGrades = [
    "PK (영유아)", "K (유치원)", 
    "E1 (초1)", "E2 (초2)", "E3 (초3)", "E4 (초4)", "E5 (초5)", "E6 (초6)",
    "M1 (중1)", "M2 (중2)", "M3 (중3)",
    "H1 (고1)", "H2 (고2)", "H3 (고3)", "기타"
  ];

  useEffect(() => {
    if (instId) {
      setCurrentInstId(instId);
    } else if (!currentInstId && allInstitutions.length > 0) {
      // If no ID in URL but we have registered institutions, pick the first one
      setCurrentInstId(allInstitutions[0].id);
    }
  }, [instId, allInstitutions.length, currentInstId]);

  // Sync currentInstId to user profile as the 'preferred' default
  useEffect(() => {
    if (user?.uid && currentInstId && db) {
      const syncPref = async () => {
        try {
          const userRef = doc(db!, "users", user.uid);
          await updateDoc(userRef, { institutionId: currentInstId });
        } catch (err) {
          console.error("Failed to sync institution preference:", err);
        }
      };
      syncPref();
    }
  }, [currentInstId, user?.uid, db]);

  useEffect(() => {
    if (authLoading || redirectRef.current) return;
    
    // Guest check
    const guestId = searchParams?.get("guestId");
    
    // If not guest and not logged in, boot to login after a safety delay
    let timer: NodeJS.Timeout;

    if (!guestId && !user) {
      timer = setTimeout(() => {
        if (!user && !authLoading && !searchParams?.get("guestId") && !redirectRef.current) {
          console.log("Parent Guard: No session found after 10s, returning to login");
          const redirectUrl = currentInstId ? `/login?type=parent&instId=${currentInstId}` : "/login?type=parent";
          redirectRef.current = true;
          router.push(redirectUrl);
        }
      }, 10000); // 10s stability delay
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [user, authLoading, searchParams, currentInstId, router]);

  const mockTeachers: Record<string, {name: string, phone: string, email: string}> = {
    "기쁨반": { name: "이지은 선생님", phone: "010-1234-5678", email: "jieun@kidsgate.com" },
    "민들레반": { name: "김태희 선생님", phone: "010-8765-4321", email: "taehee@kidsgate.com" },
    "햇살반": { name: "박보영 선생님", phone: "010-1111-2222", email: "boyoung@kidsgate.com" }
  };

  const handleCopyInvite = () => {
    const url = `${window.location.origin}/signup?code=${currentInstId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    alert("초대 링크가 복사되었습니다!");
  };

  // Fetch All Institutions parent is involved with - Real-time
  useEffect(() => {
    if (!user?.email || !db) return;
    
    // Listen to ALL student records for this parent to build the institution list
    const q = query(collection(db, "students"), where("parentEmail", "==", user.email));
    
    const unsubscribe = onSnapshot(q, async (snap) => {
      try {
        const uniqueIds = Array.from(new Set(snap.docs.map(d => d.data().institutionId))).filter(Boolean) as string[];
        
        const details = await Promise.all(uniqueIds.map(async (id) => {
          const iq = query(collection(db!, "institutions"), where("institutionId", "==", id));
          const isnap = await getDocs(iq);
          return { id, name: isnap.empty ? id : isnap.docs[0].data().name };
        }));
        
        // Ensure currentInstId is in the list if it's from URL or state
        if (currentInstId && !details.find(d => d.id === currentInstId)) {
           const iq = query(collection(db!, "institutions"), where("institutionId", "==", currentInstId));
           const isnap = await getDocs(iq);
           // Only add if it actually exists in institutions collection
           if (!isnap.empty) {
             details.push({ id: currentInstId, name: isnap.docs[0].data().name });
           }
        }

        setAllInstitutions(details);
      } catch (err) {
        console.error("Error fetching multi-inst snapshot:", err);
      }
    });
    
    return () => unsubscribe();
  }, [user?.email, currentInstId]);

  // Fetch current Institution Info
  useEffect(() => {
    if (currentInstId && db) {
      const fetchInst = async () => {
        try {
          const q = query(collection(db!, "institutions"), where("institutionId", "==", currentInstId));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            setInstName(querySnapshot.docs[0].data().name);
          }
        } catch (error) {
          console.error("Error fetching institution:", error);
        }
      };
      fetchInst();

      // Fetch existing classes for this institution
      const fetchClasses = async () => {
        try {
          const q = query(collection(db!, "students"), where("institutionId", "==", currentInstId));
          const snap = await getDocs(q);
          const classes = Array.from(new Set(snap.docs.map(d => d.data().class))).filter(Boolean) as string[];
          setExistingClasses(classes.sort());
        } catch (err) {
          console.error("Error fetching classes:", err);
        }
      };
      fetchClasses();
    }
  }, [currentInstId]);

  // Fetch Children for current institution
  // Fetch Children for current institution - Real-time
  useEffect(() => {
    const guestId = searchParams?.get("guestId");
    if (!currentInstId || !db || (!user?.email && !guestId)) return;

    const constraints = [];
    constraints.push(where("institutionId", "==", currentInstId));
    
    // Create query - Firestore OR is tricky, so we'll fetch then filter or use separate listeners.
    // Given the small number of children, fetching by instId and filtering is safer for robustness.
    const q = query(
      collection(db!, "students"), 
      where("institutionId", "==", currentInstId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Child))
        .filter(c => {
          // Filter by parent email or contact (guestId)
          if (user?.email && (c as any).parentEmail === user.email) return true;
          if (guestId && ((c as any).contact === guestId || (c as any).parentPhone === guestId)) return true;
          return false;
        });
      
      setChildren(list);
      if (list.length > 0) {
        setHasDismissedInitialModal(true);
      }
    }, (err) => {
      console.error("Children fetch error:", err);
    });

    return () => unsubscribe();
  }, [currentInstId, user?.email, searchParams]);

  // Fetch Attendance Logs - Real-time
  useEffect(() => {
    if (activeTab === "attendance" && currentInstId && db) {
      const q = query(
        collection(db!, "checkin_logs"), 
        where("institutionId", "==", currentInstId),
        orderBy("timestamp", "desc"),
        limit(50)
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Filter logs so parents only see their own children
        const myChildIds = children.map(c => c.id);
        const filteredLogs = logs.filter((log: any) => myChildIds.includes(log.studentId));
        setAttendanceLogs(filteredLogs);
      }, (err) => {
        console.error("Logs listener error:", err);
      });
      return () => unsubscribe();
    }
  }, [activeTab, currentInstId, children]);

  // Messages Listener
  useEffect(() => {
    if (!currentInstId || !db) return;
    const q = query(
      collection(db!, "messages"),
      where("institutionId", "==", currentInstId),
      orderBy("timestamp", "desc"),
      limit(20)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(d => ({
        id: d.id, ...d.data()
      })) as MessageItem[];
      setRealMessages(msgs);
    }, (err) => {
      console.error("Message listener error:", err);
    });
    return () => unsubscribe();
  }, [currentInstId]);
  // Fetch Family Info
  useEffect(() => {
    if (!user?.email || !db) return;
    const fetchProfile = async () => {
      try {
        const docRef = doc(db!, "parent_profiles", user.email!);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFamilyInfo(docSnap.data() as any);
        } else {
          setFamilyInfo(prev => ({ ...prev, email: user.email! }));
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };
    fetchProfile();
  }, [user?.email]);

  const handleToggleSelect = (id: string) => {
    setSelectedChildren(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const handleBatchDropOff = async () => {
    // Allow drop-off for any child that is NOT in "present" status, or even if they are present but parent wants to refresh check-in
    const targets = children.filter(c => (selectedChildren.length === 0 || selectedChildren.includes(c.id)));
    
    if (targets.length === 0) return alert("등교를 확인할 자녀를 먼저 선택해 주세요.");
    
    const confirmMsg = targets.length === 1 
      ? `"${targets[0].name}" 학생의 등교를 확인하시겠습니까?`
      : `선택한 ${targets.length}명의 학생들의 등교를 확인하시겠습니까?`;

    if (!confirm(confirmMsg)) return;

    try {
      setLoading(true);
      for (const child of targets) {
        // 1. Log attendance
        await addDoc(collection(db!, "checkin_logs"), {
          studentId: child.id,
          studentName: child.name,
          className: child.class,
          grade: child.grade,
          parentName: user?.displayName || user?.email || searchParams?.get("guestId") || "학부모",
          institutionId: currentInstId,
          timestamp: serverTimestamp(),
          status: "in"
        });
        
        // 2. Clear out any pending pickup requests for this child if they were "pickup_requested"
        if (child.status === "pickup_requested") {
           const q = query(
             collection(db!, "pickup_requests"),
             where("studentId", "==", child.id),
             where("status", "==", "pending")
           );
           const snap = await getDocs(q);
           for (const d of snap.docs) {
             await updateDoc(doc(db!, "pickup_requests", d.id), { 
               status: "cancelled",
               cancelledAt: serverTimestamp()
             });
           }
        }

        // 3. Update student status and record history
        await updateDoc(doc(db!, "students", child.id), { 
          status: "present",
          attendanceHistory: arrayUnion({
            timestamp: new Date(),
            type: "CHECK_IN",
            message: "부모님 직접 등교 승인",
            status: "present"
          })
        });
      }
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
          className: child.class,
          grade: child.grade,
          parentName: user?.displayName || user?.email || searchParams?.get("guestId") || "학부모",
          institutionId: currentInstId,
          status: "pending",
          requestTime: serverTimestamp()
        });
        // Record history of the request
        await updateDoc(doc(db!, "students", child.id), {
          attendanceHistory: arrayUnion({
            timestamp: new Date(),
            type: "PICKUP_REQUESTED",
            message: "부모님 하교 요청",
            status: "pending"
          })
        });
        // Remove immediate status update - teacher will confirm release
        // await updateDoc(doc(db!, "students", child.id), { status: "pickup_requested" });
      }
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
    const guestId = searchParams?.get("guestId");
    if (!newChild.name || !db || (!user?.email && !guestId)) return;

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
        parentEmail: user?.email || null,
        contact: guestId || null,
        institutionId: currentInstId,
        status: "absent" as const,
        checkIn: null,
        checkOut: null,
        createdAt: serverTimestamp()
      };

      if (editingChildId) {
        await updateDoc(doc(db, "students", editingChildId), childData);
        setChildren(prev => prev.map(c => c.id === editingChildId ? { ...c, ...childData, photo: childData.photo || undefined } as Child : c));
      } else {
        // Generate Unique Barcode ID
        const barcodeId = `kg-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
        const finalChildData = { ...childData, barcodeId };
        
        const docRef = await addDoc(collection(db, "students"), finalChildData);
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
          notes: childData.notes,
          barcodeId
        };
        setChildren(prev => [...prev, newChildEntry]);
        setShowWelcome(true);
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

  const handleJoinInstitution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim() || !db) return;
    
    setLoading(true);
    setJoinError("");
    try {
      const q = query(collection(db, "institutions"), where("institutionId", "==", joinCode.trim().toUpperCase()));
      const snap = await getDocs(q);
      
      if (snap.empty) {
        setJoinError("유효하지 않은 기관 코드입니다. 다시 확인해 주세요.");
      } else {
        const instData = snap.docs[0].data();
        setCurrentInstId(instData.institutionId);
        setInstName(instData.name);
        setShowJoinInst(false);
        setJoinCode("");
        // Immediately show add child for this new institution
        setShowAddChild(true);
      }
    } catch (err) {
      console.error("Join inst error:", err);
      setJoinError("오류가 발생했습니다.");
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

  const handleRemoveInstitution = async (id: string) => {
    if (!confirm("이 기관을 목록에서 삭제하시겠습니까? 해당 기관에 등록된 모든 자녀의 출결 정보도 볼 수 없게 됩니다.")) return;
    try {
        setLoading(true);
        const q = query(collection(db!, "students"), where("parentEmail", "==", user?.email), where("institutionId", "==", id));
        const snap = await getDocs(q);
        
        // 1. Delete all student records for this institution
        await Promise.all(snap.docs.map(d => deleteDoc(doc(db!, "students", d.id))));
        
        // 2. Update remaining institutions list logic
        const remaining = allInstitutions.filter(inst => inst.id !== id);
        
        // 3. Clear from user profile if it was the pinned/default inst
        if (user?.uid) {
           const userRef = doc(db!, "users", user.uid);
           const userSnap = await getDoc(userRef);
           if (userSnap.exists() && userSnap.data().institutionId === id) {
             // Set it to the next available one or null
             await updateDoc(userRef, { institutionId: remaining[0]?.id || null });
           }
        }

        // 4. Switch current view if we just deleted the active one
        if (currentInstId === id) {
           const nextInstId = remaining[0]?.id || "";
           setCurrentInstId(nextInstId);
           router.replace(nextInstId ? `/p-portal?id=${nextInstId}` : "/p-portal");
        }
        
        setShowInstList(false);
        alert("기관 연결이 해제되었습니다.");
    } catch (err) {
        console.error("Remove inst error:", err);
        alert("삭제 중 오류가 발생했습니다.");
    } finally {
        setLoading(false);
    }
  };

  const handleSaveFamilyInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email || !db) return;
    setLoading(true);
    try {
      await updateDoc(doc(db!, "parent_profiles", user.email!), familyInfo);
      alert("가족 정보가 저장되었습니다.");
    } catch (err) {
      // If doc doesn't exist, create it
      try {
        const { setDoc } = await import("firebase/firestore");
        await setDoc(doc(db!, "parent_profiles", user.email!), familyInfo);
        alert("가족 정보가 저장되었습니다.");
      } catch (innerErr) {
        console.error("Save profile error:", innerErr);
        alert("저장 실패");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-md mx-auto relative shadow-2xl">
      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-md font-black">
             데이터 처리 중...
          </motion.div>
        )}
      </AnimatePresence>

      <header className="bg-white px-8 py-6 sticky top-0 z-40 flex items-center justify-between border-b border-black/[0.03] backdrop-blur-xl bg-white/80">
         <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setShowInstList(true)}>
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center p-0.5 border border-black/[0.03] shadow-inner overflow-hidden">
               <img src="/children_gate_logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
               <h1 className="font-black text-lg text-black flex items-center gap-2 group-hover:text-primary transition-colors">
                  {instName || "Children Gate"}
                  <ArrowRight size={16} className="text-black/10 group-hover:text-primary rotate-90" />
               </h1>
               <span className="text-[10px] font-black text-black/30 uppercase">{currentInstId}</span>
            </div>
         </div>
         <div className="flex items-center gap-2">
            <button 
                onClick={async () => { 
                if(confirm("로그아웃 하시겠습니까?")) { 
                    try {
                    localStorage.removeItem("kg_auto_login");
                    if (auth) {
                        await auth.signOut();
                    }
                    window.location.href="/login?type=parent&logout=true"; 
                    } catch (e) {
                    window.location.href="/login?logout=true";
                    }
                } 
                }} 
                className="p-2 text-black/10 hover:text-red-500 transition-colors"
                title="Logout"
            >
                <LogOut size={20} />
            </button>
         </div>
      </header>

      {/* Institution Switcher Modal */}
      <AnimatePresence>
        {showInstList && (
           <div className="fixed inset-0 z-[50] flex items-end justify-center bg-black/40 backdrop-blur-sm p-4">
              <motion.div 
                 initial={{ y: "100%" }}
                 animate={{ y: 0 }}
                 exit={{ y: "100%" }}
                 className="bg-white w-full max-w-md rounded-t-[40px] rounded-b-[40px] p-8 pb-12 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              >
                 <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-black">기관 선택</h2>
                        <p className="text-black/30 text-xs font-bold mt-1">자녀가 소속된 기관을 관리하세요.</p>
                    </div>
                    <button onClick={() => setShowInstList(false)} className="p-3 bg-slate-50 rounded-2xl text-black/20 hover:text-black transition-all">
                        <XCircle size={24} />
                    </button>
                 </div>

                 <div className="space-y-3 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                    {allInstitutions.map(inst => (
                       <div 
                         key={inst.id} 
                         onClick={() => { setCurrentInstId(inst.id); setShowInstList(false); }}
                         className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between group ${currentInstId === inst.id ? 'border-primary bg-primary/5 shadow-xl shadow-primary/5' : 'border-black/[0.03] hover:border-black/10'}`}
                       >
                          <div className="flex items-center gap-4">
                             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${currentInstId === inst.id ? 'bg-white border-primary/20 text-primary' : 'bg-slate-50 border-black/5 text-black/20'}`}>
                                <ShieldCheck size={24} />
                             </div>
                             <div>
                                <h3 className="font-black text-black leading-tight">{inst.name}</h3>
                                <p className="text-[10px] font-black text-black/30 uppercase mt-1 tracking-widest">{inst.id}</p>
                             </div>
                          </div>
                          {currentInstId === inst.id ? (
                             <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                                <Check size={16} />
                             </div>
                          ) : (
                             <button 
                               onClick={(e) => { e.stopPropagation(); handleRemoveInstitution(inst.id); }}
                               className="p-2 opacity-0 group-hover:opacity-100 text-black/20 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                             >
                                <Trash2 size={18} />
                             </button>
                          )}
                       </div>
                    ))}

                    <button 
                        onClick={() => { setShowInstList(false); setShowJoinInst(true); }}
                        className="w-full p-6 bg-slate-50 border-2 border-dashed border-black/10 rounded-3xl flex items-center justify-center gap-3 text-black/40 font-black hover:bg-slate-100 hover:border-black/20 transition-all"
                    >
                        <Plus size={20} />
                        새로운 기관 연결하기
                    </button>
                 </div>
              </motion.div>
           </div>
        )}
      </AnimatePresence>

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
                      <div className="flex flex-col gap-0.5 mt-1">
                        {activePickupRequests.find(r => r.studentId === child.id && r.status === 'pending') ? (
                          <p className="text-[10px] font-black text-amber-500 uppercase flex items-center gap-1 animate-pulse">
                            <Clock size={10} /> 하교 승인 대기 중
                          </p>
                        ) : activePickupRequests.find(r => r.studentId === child.id && r.status === 'approved') ? (
                          <p className="text-[10px] font-black text-blue-500 uppercase flex items-center gap-1">
                            <UserCheck size={10} /> 하교 승인 완료 (준비 중)
                          </p>
                        ) : (
                          <p className={`text-[10px] font-bold ${child.status === 'present' ? 'text-emerald-500' : 'text-slate-400'}`}>
                            {child.status === 'present' ? "원내 보육 중" : child.status === 'pickup_requested' ? "하교 완료됨" : "미등교"}
                          </p>
                        )}
                      </div>
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

        {activeTab === "profile" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-4 border-2 border-primary/5">
                <Heart size={32} className="text-primary" />
              </div>
              <h2 className="text-2xl font-black text-black">가족 정보 관리</h2>
              <p className="text-sm font-bold text-black/30 mt-1">아이의 안전을 위해 정보를 정확히 입력해 주세요.</p>
            </div>

            <form onSubmit={handleSaveFamilyInfo} className="space-y-10">
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-black/5 pb-2">
                  <div className="w-8 h-8 bg-blue-500/10 rounded-xl flex items-center justify-center">
                    <User size={16} className="text-blue-500" />
                  </div>
                  <h3 className="font-black text-lg">아버지 정보</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-black/30 ml-4 uppercase tracking-widest">성명</label>
                    <input value={familyInfo.fatherName} onChange={e => setFamilyInfo({...familyInfo, fatherName: e.target.value})} placeholder="이름" className="w-full bg-slate-50 px-6 py-4 rounded-2xl outline-none font-bold text-black border-2 border-transparent focus:border-blue-500/20 focus:bg-white transition-all" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-black/30 ml-4 uppercase tracking-widest">생년월일</label>
                    <input type="date" value={familyInfo.fatherBirth} onChange={e => setFamilyInfo({...familyInfo, fatherBirth: e.target.value})} className="w-full bg-slate-50 px-6 py-4 rounded-2xl outline-none font-bold text-black border-2 border-transparent focus:border-blue-500/20 focus:bg-white transition-all" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-black/30 ml-4 uppercase tracking-widest">전화번호</label>
                  <input value={familyInfo.fatherPhone} onChange={e => setFamilyInfo({...familyInfo, fatherPhone: e.target.value})} placeholder="010-0000-0000" className="w-full bg-slate-50 px-6 py-4 rounded-2xl outline-none font-bold text-black border-2 border-transparent focus:border-blue-500/20 focus:bg-white transition-all" />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-black/5 pb-2">
                  <div className="w-8 h-8 bg-rose-500/10 rounded-xl flex items-center justify-center">
                    <User size={16} className="text-rose-500" />
                  </div>
                  <h3 className="font-black text-lg">어머니 정보</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-black/30 ml-4 uppercase tracking-widest">성명</label>
                    <input value={familyInfo.motherName} onChange={e => setFamilyInfo({...familyInfo, motherName: e.target.value})} placeholder="이름" className="w-full bg-slate-50 px-6 py-4 rounded-2xl outline-none font-bold text-black border-2 border-transparent focus:border-rose-500/20 focus:bg-white transition-all" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-black/30 ml-4 uppercase tracking-widest">생년월일</label>
                    <input type="date" value={familyInfo.motherBirth} onChange={e => setFamilyInfo({...familyInfo, motherBirth: e.target.value})} className="w-full bg-slate-50 px-6 py-4 rounded-2xl outline-none font-bold text-black border-2 border-transparent focus:border-rose-500/20 focus:bg-white transition-all" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-black/30 ml-4 uppercase tracking-widest">전화번호</label>
                  <input value={familyInfo.motherPhone} onChange={e => setFamilyInfo({...familyInfo, motherPhone: e.target.value})} placeholder="010-0000-0000" className="w-full bg-slate-50 px-6 py-4 rounded-2xl outline-none font-bold text-black border-2 border-transparent focus:border-rose-500/20 focus:bg-white transition-all" />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-black/5 pb-2">
                   <div className="w-8 h-8 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                      <Home size={16} className="text-emerald-500" />
                   </div>
                   <h3 className="font-black text-lg">공통 주소</h3>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-black/30 ml-4 uppercase tracking-widest">도로명 주소</label>
                  <input value={familyInfo.address} onChange={e => setFamilyInfo({...familyInfo, address: e.target.value})} placeholder="서울특별시 강남구..." className="w-full bg-slate-50 px-6 py-4 rounded-2xl outline-none font-bold text-black border-2 border-transparent focus:border-emerald-500/20 focus:bg-white transition-all" />
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full py-5 bg-black text-white font-black rounded-3xl shadow-xl active:scale-95 transition-all text-lg">
                가족 정보 저장하기
              </button>
            </form>
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
            <button onClick={() => setActiveTab("profile")} className={`flex-1 py-4 flex flex-col items-center gap-1 ${activeTab === "profile" ? "text-primary" : "text-black/20"}`}>
               <Users size={24} />
               <span className="text-[10px] font-black uppercase tracking-widest">Family</span>
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
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-black/30 ml-4 uppercase tracking-widest">이름</label>
                    <input required placeholder="자녀 이름" value={newChild.name} onChange={e => setNewChild({...newChild, name: e.target.value})} className="w-full bg-slate-50 px-6 py-4 rounded-2xl outline-none font-bold text-black border-2 border-transparent focus:border-black/5 focus:bg-white transition-all" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-black/30 ml-4 uppercase tracking-widest">학년</label>
                      <input 
                        list="grade-options"
                        placeholder="학년 선택 또는 입력" 
                        value={newChild.grade} 
                        onChange={e => setNewChild({...newChild, grade: e.target.value})} 
                        className="w-full bg-slate-50 px-6 py-4 rounded-2xl outline-none font-bold text-black border-2 border-transparent focus:border-black/5 focus:bg-white transition-all" 
                      />
                      <datalist id="grade-options">
                        {standardGrades.map(g => <option key={g} value={g} />)}
                      </datalist>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-black/30 ml-4 uppercase tracking-widest">반 이름</label>
                      <input 
                        list="class-options"
                        placeholder="반 선택 또는 입력" 
                        value={newChild.class} 
                        onChange={e => setNewChild({...newChild, class: e.target.value})} 
                        className="w-full bg-slate-50 px-6 py-4 rounded-2xl outline-none font-bold text-black border-2 border-transparent focus:border-black/5 focus:bg-white transition-all" 
                      />
                      <datalist id="class-options">
                        {existingClasses.map(c => <option key={c} value={c} />)}
                      </datalist>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-black/30 ml-4 uppercase tracking-widest">특이사항</label>
                    <textarea placeholder="알레르기, 주의사항 등" value={newChild.notes} onChange={e => setNewChild({...newChild, notes: e.target.value})} className="w-full bg-slate-50 px-6 py-4 rounded-2xl outline-none font-bold text-black border-2 border-transparent focus:border-black/5 focus:bg-white transition-all resize-none" rows={2} />
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowAddChild(false)} className="flex-1 py-5 bg-gray-100 text-black font-black rounded-[24px]">취소</button>
                  <button type="submit" className="flex-[2] py-5 bg-black text-white font-black rounded-[24px] shadow-xl">완료</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {showWelcome && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-md p-6">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-sm rounded-[40px] p-8 shadow-2xl relative">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/20 text-white">
                 <Check size={40} />
              </div>
              <div className="text-center mt-8 mb-6">
                <h3 className="text-2xl font-black mb-2">🎉 등록 완료!</h3>
                <p className="text-black/50 font-bold text-sm">Children Gate(CG)에 오신 것을 환영합니다.</p>
              </div>
              
              <div className="space-y-4 mb-8">
                 <div className="p-4 bg-gray-50 rounded-2xl">
                    <h4 className="font-black text-xs text-primary mb-1 tracking-widest uppercase">등교 시</h4>
                    <p className="text-xs font-bold text-black/60 leading-relaxed">아이 가방에 부착된 바코드를 학교 입구 스캐너에 보여주세요.</p>
                 </div>
                 <div className="p-4 bg-gray-50 rounded-2xl">
                    <h4 className="font-black text-xs text-orange-500 mb-1 tracking-widest uppercase">하교 시</h4>
                    <p className="text-xs font-bold text-black/60 leading-relaxed">도착 직전, 하교 요청 버튼을 눌러주세요.</p>
                 </div>
                 <div className="p-4 bg-gray-50 rounded-2xl">
                    <h4 className="font-black text-xs text-emerald-500 mb-1 tracking-widest uppercase">픽업</h4>
                    <p className="text-xs font-bold text-black/60 leading-relaxed">선생님이 확인 후 아이를 안전하게 인도해 드립니다.</p>
                 </div>
              </div>

              <button 
                onClick={() => setShowWelcome(false)}
                className="w-full py-5 bg-black text-white font-black rounded-3xl shadow-xl active:scale-95 transition-all"
              >
                시작하기
              </button>
            </motion.div>
          </div>
        )}

        {showJoinInst && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-6">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-sm rounded-[40px] p-10 shadow-2xl relative">
              <button 
                onClick={() => setShowJoinInst(false)}
                className="absolute top-6 right-6 p-2 text-black/20 hover:text-black transition-colors"
              >
                <XCircle size={24} />
              </button>
              
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                   <ShieldCheck size={32} className="text-primary" />
                </div>
                <h3 className="text-2xl font-black mb-2">기관 연결</h3>
                <p className="text-black/50 font-bold text-sm leading-relaxed">기관으로부터 안내받은<br/>6자리 코드를 입력해 주세요.</p>
              </div>

              <form onSubmit={handleJoinInstitution} className="space-y-4">
                <input 
                  type="text"
                  placeholder="예: CG-7788"
                  value={joinCode}
                  onChange={(e) => { setJoinCode(e.target.value.toUpperCase()); setJoinError(""); }}
                  className="w-full bg-slate-50 px-6 py-5 rounded-2xl outline-none font-black text-center text-2xl tracking-widest text-primary border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all placeholder:text-black/10"
                  required
                />
                
                {joinError && (
                  <p className="text-xs font-bold text-red-500 text-center flex items-center justify-center gap-1">
                    <AlertCircle size={14} /> {joinError}
                  </p>
                )}

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-black text-white font-black rounded-3xl shadow-xl active:scale-95 transition-all mt-4"
                >
                  {loading ? "확인 중..." : "기관 연결하기"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
