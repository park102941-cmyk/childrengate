"use client";

import { useState, useEffect } from "react";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Users, Settings, Database, QrCode, Car, Calendar, Printer, HelpCircle, Share2, Check, Activity, MessageSquare, LogOut, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  const { institutionId } = useAuth();
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [plan, setPlan] = useState<string>("basic");

  useEffect(() => {
    setMounted(true);
    if (institutionId) {
      const fetchPlan = async () => {
        const { db } = await import("@/lib/firebase");
        if (db) {
          const { query, collection, where, getDocs } = await import("firebase/firestore");
          const q = query(collection(db, "institutions"), where("institutionId", "==", institutionId));
          const snap = await getDocs(q);
          if (!snap.empty) {
            setPlan(snap.docs[0].data().plan || "basic");
          }
        }
      };
      fetchPlan();
    }
  }, [institutionId]);

  const handleCopyInvite = () => {
    if (!institutionId) return;
    const url = `${window.location.origin}/signup?code=${institutionId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!mounted) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 glass border-r border-black/5 hidden lg:flex flex-col p-6 fixed h-full z-20">
        <Link href="/" className="flex items-center gap-3 mb-12 hover:opacity-80 transition-opacity">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center overflow-hidden border border-black/5 shadow-sm">
            <img src="/children_gate_logo.png" alt="Children Gate Logo" className="w-full h-full object-contain p-0.5" />
          </div>
          <span className="font-black text-2xl tracking-tight text-black">Children Gate</span>
        </Link>

        <nav className="flex-1 space-y-8 overflow-y-auto pr-2 custom-scrollbar">
          <div className="space-y-2">
            <p className="px-4 text-[10px] font-black text-black/20 uppercase tracking-[0.2em] mb-4">운영 보드</p>
            <NavItem href="/dashboard/admin" icon={Activity} label={t.dashboard.admin.sidebar.dashboard || "통합 대시보드"} active={pathname === "/dashboard/admin"} />
            <NavItem href="/dashboard/admin/students" icon={Users} label={t.dashboard.admin.sidebar.students} active={pathname === "/dashboard/admin/students" || pathname.includes("/students/")} />
            <NavItem href="/dashboard/admin/dispatch" icon={Car} label={t.dashboard.admin.sidebar.dispatch || "등하교 관리"} active={pathname === "/dashboard/admin/dispatch"} />
          </div>

          <div className="space-y-2">
            <p className="px-4 text-[10px] font-black text-black/20 uppercase tracking-[0.2em] mb-4">소통 및 활동</p>
            <NavItem href="/dashboard/admin/events" icon={Calendar} label={t.dashboard.admin.sidebar.events || "이벤트 및 통계"} active={pathname === "/dashboard/admin/events"} />
            <NavItem href="/dashboard/admin/messages" icon={MessageSquare} label="학부모 메시지" active={pathname === "/dashboard/admin/messages"} />
          </div>

          <div className="space-y-2">
            <p className="px-4 text-[10px] font-black text-black/20 uppercase tracking-[0.2em] mb-4">데이터 및 설정</p>
            <NavItem href="/dashboard/admin/qr" icon={QrCode} label={t.dashboard.admin.sidebar.qr} active={pathname === "/dashboard/admin/qr"} />
            <NavItem href="/dashboard/admin/sheets" icon={Database} label={t.dashboard.admin.sidebar.sheets} active={pathname === "/dashboard/admin/sheets"} />
            <NavItem href="/dashboard/admin/reports" icon={Printer} label="데이터 리포트" active={pathname === "/dashboard/admin/reports"} locked={plan === 'basic'} />
            <NavItem href="/dashboard/admin/settings" icon={Settings} label={t.dashboard.admin.sidebar.settings} active={pathname.startsWith("/dashboard/admin/settings")} />
            <NavItem href="/dashboard/admin/guide" icon={HelpCircle} label="사용 가이드" active={pathname === "/dashboard/admin/guide"} />
          </div>
        </nav>

        <div className="mt-6 mb-6">
          <button 
            onClick={handleCopyInvite}
            className="w-full flex items-center justify-between px-4 py-4 rounded-2xl bg-primary/5 border border-primary/20 text-primary hover:bg-primary/10 transition-all group"
          >
            <div className="flex items-center gap-3">
              {copied ? <Check size={18} /> : <Share2 size={18} />}
              <span className="font-bold text-sm">{copied ? "복사완료!" : "학부모 초대하기"}</span>
            </div>
            {!copied && <span className="text-[10px] bg-primary/10 px-1.5 py-0.5 rounded font-black uppercase">Link</span>}
          </button>
        </div>

        <div className="mt-auto pt-6 border-t border-black/5">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 border border-black/5 flex items-center justify-center text-black/40 font-bold uppercase text-xs">
                {institutionId?.charAt(0) || "A"}
              </div>
              <div>
                <p className="text-sm font-bold text-black overflow-hidden truncate max-w-[80px]">Admin</p>
                <p className="text-[10px] text-black/40 uppercase font-black">{institutionId}</p>
              </div>
            </div>
            <button 
              onClick={async () => {
                if (window.confirm("로그아웃 하시겠습니까?")) {
                  await (await import("@/lib/firebase")).auth?.signOut();
                  window.location.href = "/login";
                }
              }}
              className="p-2 text-black/20 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      {children}
    </div>
  );
}

function NavItem({ href, icon: Icon, label, active = false, locked = false }: { href: string, icon: LucideIcon, label: string, active?: boolean, locked?: boolean }) {
  if (locked) {
    return (
      <div className="w-full flex items-center justify-between px-4 py-3 rounded-2xl opacity-40 grayscale cursor-not-allowed">
        <div className="flex items-center gap-3">
          <Icon size={20} className="text-gray-400" />
          <span className="font-bold text-gray-400">{label}</span>
        </div>
        <span className="text-[8px] font-black bg-amber-100 text-amber-600 px-1 py-0.5 rounded uppercase tracking-tighter">Pro</span>
      </div>
    );
  }
  return (
    <Link 
      href={href}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
        active ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-black/60 hover:text-black hover:bg-black/5"
      }`}
    >
      <Icon size={20} className={active ? "text-white" : "text-primary"} />
      <span className="font-bold">{label}</span>
    </Link>
  );
}
