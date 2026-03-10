"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Users, Settings, Database, QrCode, Car, Calendar, 
  Printer, HelpCircle, Share2, Check, Activity, 
  MessageSquare, LogOut, Globe, Menu, X, type LucideIcon 
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { t, language, setLanguage } = useLanguage();
  const { institutionId, user } = useAuth();
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [plan, setPlan] = useState<string>("basic");
  const [instName, setInstName] = useState<string>("Children Gate");
  const [instPhoto, setInstPhoto] = useState<string>("/children_gate_logo.png");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (institutionId) {
      const fetchInstData = async () => {
        const { db } = await import("@/lib/firebase");
        if (db) {
          const { query, collection, where, getDocs } = await import("firebase/firestore");
          const q = query(collection(db, "institutions"), where("institutionId", "==", institutionId));
          const snap = await getDocs(q);
          if (!snap.empty) {
            const data = snap.docs[0].data();
            setPlan(data.plan || "basic");
            setInstName(data.name || "Children Gate");
            if (data.photo) setInstPhoto(data.photo);
          }
        }
      };
      fetchInstData();
    }
  }, [institutionId]);

  const handleCopyInvite = () => {
    if (!institutionId) return;
    const url = `${window.location.origin}/signup?code=${institutionId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = async () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      try {
        const { auth } = await import("@/lib/firebase");
        localStorage.removeItem("kg_auto_login");
        if (auth) {
          await auth.signOut();
        }
        window.location.href = "/login?type=institution&logout=true";
      } catch (err) {
        console.error("Logout failed:", err);
        window.location.href = "/login?logout=true";
      }
    }
  };

  if (!mounted) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-x-hidden">
      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`w-64 glass border-r border-black/5 flex flex-col p-6 fixed h-full z-50 transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:flex'}`}>
        <div className="flex items-center justify-between mb-10">
          <Link href="/dashboard/admin" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center overflow-hidden border border-black/5 shadow-sm">
              <img src={instPhoto} alt="Logo" className="w-full h-full object-contain p-0.5" />
            </div>
            <div className="flex flex-col min-w-0">
               <span className="font-black text-lg tracking-tight text-black truncate">{instName}</span>
               <span className="text-[10px] font-black text-primary uppercase tracking-widest">{plan} Member</span>
            </div>
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 text-black/20 hover:text-black transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Language Switcher in Sidebar */}
        <div className="flex bg-black/5 p-1 rounded-xl mb-8">
           <button 
             onClick={() => setLanguage("ko")} 
             className={`flex-1 py-1.5 rounded-lg text-[10px] font-black transition-all ${language === 'ko' ? 'bg-white text-black shadow-sm' : 'text-black/40 hover:text-black'}`}
           >
             KO
           </button>
           <button 
             onClick={() => setLanguage("en")} 
             className={`flex-1 py-1.5 rounded-lg text-[10px] font-black transition-all ${language === 'en' ? 'bg-white text-black shadow-sm' : 'text-black/40 hover:text-black'}`}
           >
             EN
           </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
          <div className="space-y-1">
            <p className="px-4 text-[9px] font-black text-black/20 uppercase tracking-[0.2em] mb-3">운영 보드</p>
            <NavItem href="/dashboard/admin" icon={Activity} label={t.dashboard.admin.sidebar.dashboard || "통합 대시보드"} active={pathname === "/dashboard/admin"} onClose={() => setIsSidebarOpen(false)} />
            <NavItem href="/dashboard/admin/students" icon={Users} label={t.dashboard.admin.sidebar.students} active={pathname === "/dashboard/admin/students" || pathname.includes("/students/")} onClose={() => setIsSidebarOpen(false)} />
            <NavItem href="/dashboard/admin/dispatch" icon={Car} label={t.dashboard.admin.sidebar.dispatch || "등하교 관리"} active={pathname === "/dashboard/admin/dispatch"} onClose={() => setIsSidebarOpen(false)} />
          </div>

          <div className="space-y-1">
            <p className="px-4 text-[9px] font-black text-black/20 uppercase tracking-[0.2em] mb-3">소통 및 활동</p>
            <NavItem href="/dashboard/admin/calendar" icon={Calendar} label="스마트 캘린더" active={pathname === "/dashboard/admin/calendar"} onClose={() => setIsSidebarOpen(false)} />
            <NavItem href="/dashboard/admin/events" icon={Activity} label={t.dashboard.admin.sidebar.events || "이벤트 및 통계"} active={pathname === "/dashboard/admin/events"} onClose={() => setIsSidebarOpen(false)} />
            <NavItem href="/dashboard/admin/messages" icon={MessageSquare} label="학부모 메시지" active={pathname === "/dashboard/admin/messages"} onClose={() => setIsSidebarOpen(false)} />
          </div>

          <div className="space-y-1">
            <p className="px-4 text-[9px] font-black text-black/20 uppercase tracking-[0.2em] mb-3">데이터 및 설정</p>
            <NavItem href="/dashboard/admin/qr" icon={QrCode} label={t.dashboard.admin.sidebar.qr} active={pathname === "/dashboard/admin/qr"} onClose={() => setIsSidebarOpen(false)} />
            <NavItem href="/dashboard/admin/sheets" icon={Database} label={t.dashboard.admin.sidebar.sheets} active={pathname === "/dashboard/admin/sheets"} onClose={() => setIsSidebarOpen(false)} />
            <NavItem href="/dashboard/admin/reports" icon={Printer} label="데이터 리포트" active={pathname === "/dashboard/admin/reports"} locked={plan === 'basic'} onClose={() => setIsSidebarOpen(false)} />
            <NavItem href="/dashboard/admin/settings" icon={Settings} label={t.dashboard.admin.sidebar.settings} active={pathname.startsWith("/dashboard/admin/settings")} onClose={() => setIsSidebarOpen(false)} />
            <NavItem href="/dashboard/admin/guide" icon={HelpCircle} label="사용 가이드" active={pathname === "/dashboard/admin/guide"} onClose={() => setIsSidebarOpen(false)} />
          </div>
        </nav>

        <div className="mt-6 mb-6">
          <button 
            onClick={handleCopyInvite}
            className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl bg-primary/5 border border-primary/20 text-primary hover:bg-primary/10 transition-all group"
          >
            <div className="flex items-center gap-3">
              {copied ? <Check size={16} /> : <Share2 size={16} />}
              <span className="font-bold text-xs">{copied ? "복사완료!" : "학부모 초대하기"}</span>
            </div>
            {!copied && <span className="text-[9px] bg-primary/10 px-1.5 py-0.5 rounded font-black uppercase">Link</span>}
          </button>
        </div>

        <div className="mt-auto pt-6 border-t border-black/5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-100 border border-black/5 flex items-center justify-center text-black/40 font-bold uppercase text-[10px] overflow-hidden">
                {user?.photoURL ? <img src={user.photoURL} className="w-full h-full object-cover" /> : (institutionId?.charAt(0) || "A")}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-black truncate max-w-[80px] leading-tight">Admin</p>
                <p className="text-[9px] text-black/40 uppercase font-black truncate max-w-[80px]">{institutionId}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-black/20 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-black/5 z-30 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-black/60 hover:text-black transition-colors"
          >
            <Menu size={24} />
          </button>
          <Link href="/dashboard/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-black/5">
              <img src={instPhoto} alt="Logo" className="w-full h-full object-contain p-0.5" />
            </div>
            <span className="font-black text-sm tracking-tight text-black truncate max-w-[150px]">{instName}</span>
          </Link>
        </div>
        <button 
          onClick={handleLogout}
          className="p-2 text-black/20 hover:text-red-500 transition-all"
        >
          <LogOut size={18} />
        </button>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 pt-16 lg:pt-0">
        {children}
      </div>
    </div>
  );
}

function NavItem({ href, icon: Icon, label, active = false, locked = false, onClose }: { href: string, icon: LucideIcon, label: string, active?: boolean, locked?: boolean, onClose?: () => void }) {
  if (locked) {
    return (
      <div className="w-full flex items-center justify-between px-4 py-3 rounded-xl opacity-40 grayscale cursor-not-allowed">
        <div className="flex items-center gap-3">
          <Icon size={18} className="text-gray-400" />
          <span className="font-bold text-xs text-gray-400">{label}</span>
        </div>
        <span className="text-[7px] font-black bg-amber-100 text-amber-600 px-1 py-0.5 rounded uppercase tracking-tighter">Pro</span>
      </div>
    );
  }
  return (
    <Link 
      href={href}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        active ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-black/60 hover:text-black hover:bg-black/5"
      }`}
      onClick={() => {
        if (onClose) onClose();
      }}
    >
      <Icon size={18} className={active ? "text-white" : "text-primary"} />
      <span className="font-bold text-xs">{label}</span>
    </Link>
  );
}
