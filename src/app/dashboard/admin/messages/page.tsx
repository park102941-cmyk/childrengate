"use client";

import { useState, useEffect } from "react";
import {
  MessageSquare,
  Send,
  Users,
  Search,
  Check,
  CheckCircle2,
  Clock,
  Plus,
  X,
  Paperclip,
  Image as ImageIcon,
  Bell,
  ChevronRight,
  Filter,
  Megaphone,
  UserCheck,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy, onSnapshot, Timestamp } from "firebase/firestore";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "@/context/AuthContext";

interface Message {
  id: string;
  title: string;
  content: string;
  sender: string;
  target: "all" | "class" | "individual";
  targetClass?: string;
  targetParentId?: string;
  targetParentName?: string;
  timestamp: any;
  type: "notice" | "message" | "urgent";
  read: boolean;
  attachmentName?: string;
  attachmentUrl?: string;
}

export default function MessagesPage() {
  const { institutionId } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [showCompose, setShowCompose] = useState(false);
  const [filter, setFilter] = useState<"all" | "notice" | "message" | "urgent">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const [newMessage, setNewMessage] = useState({
    title: "",
    content: "",
    target: "all" as "all" | "class" | "individual",
    targetClass: "",
    targetParentName: "",
    type: "notice" as "notice" | "message" | "urgent",
    attachmentName: "",
    attachmentUrl: "",
  });

  // Listen to messages in real-time
  useEffect(() => {
    if (!db || !institutionId) return;

    const q = query(
      collection(db, "messages"),
      where("institutionId", "==", institutionId),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(msgs);
    }, (error) => {
      console.error("Messages listener error:", error);
    });

    return () => unsubscribe();
  }, [institutionId]);

  const handleSendMessage = async () => {
    if (!newMessage.title || !newMessage.content) {
      alert("제목과 내용을 입력해 주세요.");
      return;
    }

    if (!db || !institutionId) {
      alert("Firebase가 초기화되지 않았습니다.");
      return;
    }

    setSending(true);
    try {
      await addDoc(collection(db, "messages"), {
        title: newMessage.title,
        content: newMessage.content,
        sender: "기관 관리자",
        target: newMessage.target,
        targetClass: newMessage.targetClass || null,
        targetParentName: newMessage.targetParentName || null,
        type: newMessage.type,
        attachmentName: newMessage.attachmentName || null,
        attachmentUrl: newMessage.attachmentUrl || null,
        institutionId: institutionId,
        timestamp: serverTimestamp(),
        read: false,
      });

      setSentSuccess(true);
      setTimeout(() => {
        setSentSuccess(false);
        setShowCompose(false);
        setNewMessage({
          title: "",
          content: "",
          target: "all",
          targetClass: "",
          targetParentName: "",
          type: "notice",
          attachmentName: "",
          attachmentUrl: "",
        });
      }, 1500);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("메시지 전송 중 오류가 발생했습니다.");
    } finally {
      setSending(false);
    }
  };

  const filteredMessages = messages.filter(msg => {
    const matchFilter = filter === "all" || msg.type === filter;
    const matchSearch = searchTerm === "" || 
      msg.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      msg.content?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchFilter && matchSearch;
  });

  const typeConfig = {
    notice: { label: "공지사항", icon: Megaphone, color: "bg-blue-500", bgColor: "bg-blue-50", textColor: "text-blue-600", borderColor: "border-blue-100" },
    message: { label: "메시지", icon: MessageSquare, color: "bg-primary", bgColor: "bg-primary/10", textColor: "text-primary", borderColor: "border-primary/20" },
    urgent: { label: "긴급", icon: AlertCircle, color: "bg-red-500", bgColor: "bg-red-50", textColor: "text-red-600", borderColor: "border-red-100" },
  };

  const targetLabels: Record<string, string> = {
    all: "전체 학부모",
    class: "특정 반",
    individual: "개별 학부모"
  };

  return (
    <main className="flex-1 lg:ml-64 p-6 md:p-10 lg:p-14 bg-gray-50 min-h-screen">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-black mb-1 flex items-center gap-3">
            학부모 메시지
            <MessageSquare className="text-primary" size={28} />
          </h1>
          <p className="text-black/50 font-semibold mt-2">학부모님들께 공지사항, 메시지, 긴급 알림을 전송합니다.</p>
        </div>
        <button
          onClick={() => setShowCompose(true)}
          className="apple-button-primary flex items-center gap-2 shadow-xl shadow-primary/30"
        >
          <Plus size={18} strokeWidth={3} />
          새 메시지 작성
        </button>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-[32px] p-8 border border-black/5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-black text-black/40 uppercase tracking-widest">총 발송</p>
            <div className="p-3 bg-primary/10 rounded-2xl">
              <Send size={20} className="text-primary" />
            </div>
          </div>
          <h3 className="text-4xl font-black text-black">{messages.length}</h3>
        </div>
        <div className="bg-white rounded-[32px] p-8 border border-black/5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-black text-black/40 uppercase tracking-widest">공지사항</p>
            <div className="p-3 bg-blue-50 rounded-2xl">
              <Megaphone size={20} className="text-blue-500" />
            </div>
          </div>
          <h3 className="text-4xl font-black text-black">
            {messages.filter(m => m.type === "notice").length}
          </h3>
        </div>
        <div className="bg-white rounded-[32px] p-8 border border-black/5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-black text-black/40 uppercase tracking-widest">긴급 알림</p>
            <div className="p-3 bg-red-50 rounded-2xl">
              <AlertCircle size={20} className="text-red-500" />
            </div>
          </div>
          <h3 className="text-4xl font-black text-black">
            {messages.filter(m => m.type === "urgent").length}
          </h3>
        </div>
      </section>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-black/5">
          {(["all", "notice", "message", "urgent"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                filter === f
                  ? "bg-black text-white shadow-md shadow-black/20"
                  : "text-black/50 hover:bg-black/5 hover:text-black"
              }`}
            >
              {f === "all" ? "전체" : typeConfig[f].label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-auto min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" size={18} />
          <input
            type="text"
            placeholder="메시지 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-black/5 rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold text-black transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Messages List */}
      <section className="bg-white rounded-[40px] border border-black/5 shadow-2xl shadow-black/5 overflow-hidden">
        <div className="divide-y divide-black/5">
          {filteredMessages.length === 0 ? (
            <div className="p-20 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <MessageSquare className="text-black/20" size={40} />
              </div>
              <h3 className="text-xl font-black text-black mb-2">발송된 메시지가 없습니다</h3>
              <p className="text-black/40 font-bold mb-6">새 메시지를 작성하여 학부모님들께 전송해 보세요.</p>
              <button
                onClick={() => setShowCompose(true)}
                className="px-6 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20"
              >
                첫 메시지 보내기
              </button>
            </div>
          ) : (
            filteredMessages.map((msg) => {
              const config = typeConfig[msg.type] || typeConfig.message;
              const Icon = config.icon;
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-start gap-5">
                    <div className={`w-12 h-12 rounded-2xl ${config.bgColor} flex items-center justify-center shrink-0`}>
                      <Icon size={22} className={config.textColor} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${config.bgColor} ${config.textColor} border ${config.borderColor}`}>
                          {config.label}
                        </span>
                        <span className="px-2 py-0.5 bg-gray-100 text-black/40 rounded-md text-[10px] font-black">
                          {targetLabels[msg.target] || msg.target}
                          {msg.targetClass && ` · ${msg.targetClass}`}
                        </span>
                      </div>
                      <h3 className="font-black text-black text-lg group-hover:text-primary transition-colors truncate">
                        {msg.title}
                      </h3>
                      <p className="text-sm font-medium text-black/40 line-clamp-2 mt-1">{msg.content}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-[10px] font-bold text-black/30 flex items-center gap-1">
                          <Clock size={10} />
                          {msg.timestamp?.toDate ? msg.timestamp.toDate().toLocaleString("ko-KR", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          }) : "방금 전"}
                        </span>
                        {msg.attachmentName && (
                          <span className="text-[10px] font-bold text-primary flex items-center gap-1">
                            <Paperclip size={10} />
                            {msg.attachmentName}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-black/10 group-hover:text-primary transition-colors mt-4 shrink-0" />
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </section>

      {/* Compose Modal */}
      <AnimatePresence>
        {showCompose && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[48px] p-12 shadow-[0_32px_128px_rgba(0,0,0,0.2)] relative my-8"
            >
              {sentSuccess ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6"
                  >
                    <CheckCircle2 size={48} className="text-emerald-500" />
                  </motion.div>
                  <h3 className="text-2xl font-black text-black mb-2">메시지 전송 완료!</h3>
                  <p className="text-black/40 font-bold">학부모님들께 성공적으로 전달되었습니다.</p>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setShowCompose(false)}
                    className="absolute top-10 right-10 w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-black/20 hover:text-black hover:bg-gray-100 transition-all"
                  >
                    <X size={20} />
                  </button>

                  <div className="mb-10">
                    <h2 className="text-4xl font-black text-black mb-2">새 메시지 작성</h2>
                    <p className="text-black/40 font-bold">학부모님들께 전달할 메시지를 작성해 주세요.</p>
                  </div>

                  <div className="space-y-8">
                    {/* Message Type */}
                    <div>
                      <label className="block text-xs font-black text-black/30 uppercase tracking-[0.2em] mb-3 ml-2">메시지 유형</label>
                      <div className="flex gap-3">
                        {(["notice", "message", "urgent"] as const).map((type) => {
                          const config = typeConfig[type];
                          const Icon = config.icon;
                          return (
                            <button
                              key={type}
                              onClick={() => setNewMessage({ ...newMessage, type })}
                              className={`flex-1 py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 border-2 ${
                                newMessage.type === type
                                  ? `${config.bgColor} ${config.textColor} ${config.borderColor}`
                                  : "bg-gray-50 text-black/30 border-transparent"
                              }`}
                            >
                              <Icon size={16} />
                              {config.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Target */}
                    <div>
                      <label className="block text-xs font-black text-black/30 uppercase tracking-[0.2em] mb-3 ml-2">수신 대상</label>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setNewMessage({ ...newMessage, target: "all" })}
                          className={`flex-1 py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 border-2 ${
                            newMessage.target === "all"
                              ? "bg-black text-white border-black"
                              : "bg-gray-50 text-black/30 border-transparent"
                          }`}
                        >
                          <Users size={16} />
                          전체 학부모
                        </button>
                        <button
                          onClick={() => setNewMessage({ ...newMessage, target: "class" })}
                          className={`flex-1 py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 border-2 ${
                            newMessage.target === "class"
                              ? "bg-black text-white border-black"
                              : "bg-gray-50 text-black/30 border-transparent"
                          }`}
                        >
                          <UserCheck size={16} />
                          특정 반
                        </button>
                        <button
                          onClick={() => setNewMessage({ ...newMessage, target: "individual" })}
                          className={`flex-1 py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 border-2 ${
                            newMessage.target === "individual"
                              ? "bg-black text-white border-black"
                              : "bg-gray-50 text-black/30 border-transparent"
                          }`}
                        >
                          <UserCheck size={16} />
                          개별
                        </button>
                      </div>

                      {newMessage.target === "class" && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4">
                          <input
                            type="text"
                            placeholder="반 이름 (예: 기쁨반, 민들레반)"
                            value={newMessage.targetClass}
                            onChange={(e) => setNewMessage({ ...newMessage, targetClass: e.target.value })}
                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none font-bold text-black focus:border-primary focus:bg-white transition-all"
                          />
                        </motion.div>
                      )}

                      {newMessage.target === "individual" && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4">
                          <input
                            type="text"
                            placeholder="학부모 이름 검색"
                            value={newMessage.targetParentName}
                            onChange={(e) => setNewMessage({ ...newMessage, targetParentName: e.target.value })}
                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none font-bold text-black focus:border-primary focus:bg-white transition-all"
                          />
                        </motion.div>
                      )}
                    </div>

                    {/* Title */}
                    <div>
                      <label className="block text-xs font-black text-black/30 uppercase tracking-[0.2em] mb-3 ml-2">제목</label>
                      <input
                        type="text"
                        placeholder="메시지 제목을 입력하세요"
                        value={newMessage.title}
                        onChange={(e) => setNewMessage({ ...newMessage, title: e.target.value })}
                        className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent rounded-3xl outline-none font-black text-black focus:border-primary focus:bg-white transition-all shadow-inner text-lg"
                      />
                    </div>

                    {/* Content */}
                    <div>
                      <label className="block text-xs font-black text-black/30 uppercase tracking-[0.2em] mb-3 ml-2">내용</label>
                      <textarea
                        rows={5}
                        placeholder="학부모님들께 전달할 내용을 작성해 주세요..."
                        value={newMessage.content}
                        onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                        className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent rounded-3xl outline-none font-bold text-black focus:border-primary focus:bg-white transition-all shadow-inner resize-none"
                      />
                    </div>

                    {/* Attachment */}
                    <div className="flex flex-col gap-3">
                      <label className="block text-xs font-black text-black/30 uppercase tracking-[0.2em] ml-2">첨부파일</label>
                      <div className="flex items-center gap-4">
                        <label className="cursor-pointer flex items-center gap-2 px-5 py-3 bg-gray-50 rounded-2xl text-black/40 font-bold text-sm hover:bg-gray-100 transition-all border border-black/5">
                          <Paperclip size={16} />
                          {newMessage.attachmentName ? "파일 변경" : "파일 선택 (PDF, 이미지 등)"}
                          <input 
                            type="file" 
                            className="hidden" 
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file || !storage || !institutionId) return;
                              setSending(true);
                              try {
                                const storageRef = ref(storage, `attachments/${institutionId}/${Date.now()}_${file.name}`);
                                await uploadBytes(storageRef, file);
                                const url = await getDownloadURL(storageRef);
                                setNewMessage({ ...newMessage, attachmentName: file.name, attachmentUrl: url });
                              } catch (err) {
                                console.error("Upload error:", err);
                                alert("파일 업로드에 실패했습니다.");
                              } finally {
                                setSending(false);
                              }
                            }} 
                          />
                        </label>
                        {newMessage.attachmentName && (
                          <div className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-xl border border-primary/10">
                            <span className="text-sm font-bold text-primary truncate max-w-[200px]">{newMessage.attachmentName}</span>
                            <button
                              onClick={() => setNewMessage({ ...newMessage, attachmentName: "", attachmentUrl: "" })}
                              className="text-primary/40 hover:text-red-500 transition-colors"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-6 pt-6">
                      <button
                        onClick={() => setShowCompose(false)}
                        className="flex-1 py-6 bg-gray-100 text-black font-black rounded-3xl transition-all hover:bg-gray-200 active:scale-95"
                      >
                        취소
                      </button>
                      <button
                        onClick={handleSendMessage}
                        disabled={sending}
                        className="flex-[3] py-6 bg-black text-white font-black rounded-3xl shadow-2xl shadow-black/20 transition-all hover:bg-gray-900 active:scale-95 flex items-center justify-center gap-3"
                      >
                        {sending ? (
                          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : (
                          <>
                            <Send size={20} />
                            메시지 전송하기
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
