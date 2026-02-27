"use client";

export const runtime = 'edge';


import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Users, Settings, Database, QrCode, Car, Calendar, Printer, HelpCircle, Share2, Check, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  const { institutionId } = useAuth();
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);

  const handleCopyInvite = () => {
    if (!institutionId) return;
    const url = `${window.location.origin}/signup?code=${institutionId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 glass border-r border-black/5 hidden lg:flex flex-col p-6 fixed h-full z-20">
        <div className="flex items-center gap-2 mb-12">
          <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden border border-black/5">
            <img src="/children_gate_logo.png" alt="Children Gate Logo" className="w-full h-full object-contain p-1.5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-black">Children Gate</span>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem href="/dashboard/admin" icon={Users} label={t.dashboard.admin.sidebar.students} active={pathname === "/dashboard/admin"} />
          <NavItem href="/dashboard/admin/dispatch" icon={Car} label={t.dashboard.admin.sidebar.dispatch || "Dispatch"} active={pathname === "/dashboard/admin/dispatch"} />
          <NavItem href="/dashboard/admin/events" icon={Calendar} label={t.dashboard.admin.sidebar.events || "Events"} active={pathname === "/dashboard/admin/events"} />
          <NavItem href="/dashboard/admin/qr" icon={QrCode} label={t.dashboard.admin.sidebar.qr} active={pathname === "/dashboard/admin/qr"} />
          <NavItem href="/dashboard/admin/sheets" icon={Database} label={t.dashboard.admin.sidebar.sheets} active={pathname === "/dashboard/admin/sheets"} />
          <NavItem href="/dashboard/admin/settings" icon={Settings} label={t.dashboard.admin.sidebar.settings} active={pathname.startsWith("/dashboard/admin/settings")} />
          <NavItem href="/dashboard/admin/guide" icon={HelpCircle} label="사용 가이드" active={pathname === "/dashboard/admin/guide"} />
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
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-slate-200 border border-black/5"></div>
            <div>
              <p className="text-sm font-bold text-black">Admin</p>
              <p className="text-xs text-black/60">admin@childrengate.io</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      {children}
    </div>
  );
}

function NavItem({ href, icon: Icon, label, active = false }: { href: string, icon: LucideIcon, label: string, active?: boolean }) {
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
