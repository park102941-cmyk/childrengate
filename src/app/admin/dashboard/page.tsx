"use client";

import { useState, useEffect } from "react";
import { 
  Building2, 
  Users, 
  DollarSign, 
  Activity, 
  ArrowUpRight, 
  ShieldCheck, 
  Search, 
  CreditCard,
  Settings,
  LogOut,
  ChevronRight,
  TrendingUp,
  LayoutDashboard
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// Mock revenue data
const revenueData = [
  { name: 'Sep', revenue: 400 },
  { name: 'Oct', revenue: 600 },
  { name: 'Nov', revenue: 850 },
  { name: 'Dec', revenue: 1100 },
  { name: 'Jan', revenue: 1400 },
  { name: 'Feb', revenue: 2100 },
];

export default function SuperAdminDashboard() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const institutions = [
    { id: "KGC-01", name: "햇살 어린이집", plan: "Pro ($19.99)", status: "Active", students: 120, joined: "2025-11-20" },
    { id: "KGC-02", name: "칠드런 게이트 유치원", plan: "Pro ($19.99)", status: "Active", students: 300, joined: "2025-12-05" },
    { id: "KGC-03", name: "늘푸른 피아노학원", plan: "Basic ($9.99)", status: "Trialing", students: 45, joined: "2026-02-15" },
    { id: "KGC-04", name: "소망 교회 주일학교", plan: "Basic ($9.99)", status: "Active", students: 80, joined: "2026-01-10" },
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white text-black font-sans flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-black/5 hidden lg:flex flex-col p-8 glass sticky top-0 h-screen z-20">
        <div className="mb-12 flex items-center gap-3">
           <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <ShieldCheck size={20} className="text-white" />
           </div>
           <div>
              <h1 className="font-black tracking-tight text-lg text-black leading-none uppercase">Systems</h1>
              <p className="text-[10px] text-black/30 tracking-widest font-black uppercase mt-1">Super Portal</p>
           </div>
        </div>
        <nav className="flex-1 space-y-2">
           <NavItem icon={LayoutDashboard} label="Global Stats" active />
           <NavItem icon={Building2} label="Institutions" />
           <NavItem icon={DollarSign} label="Subscribers" />
           <NavItem icon={Settings} label="System Core" />
        </nav>
        <div className="pt-8 border-t border-black/5">
           <button 
             onClick={() => router.push("/")}
             className="w-full flex items-center gap-3 hover:bg-red-50 text-black/40 hover:text-red-500 px-5 py-4 rounded-2xl font-black text-xs uppercase transition-all"
           >
              <LogOut size={18} /> Logout Portal
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-gray-50/30">
        <header className="px-10 py-10 flex items-center justify-between border-b border-black/5 bg-white/50 backdrop-blur-xl z-10 sticky top-0">
           <div>
              <h2 className="text-3xl font-black text-black tracking-tight flex items-center gap-4">
                 Platform Control 
                 <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100 rounded-full flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Secure Node
                 </span>
              </h2>
              <p className="text-black/30 font-bold text-sm mt-1 uppercase tracking-widest">Master Management Console v2.0</p>
           </div>
           <div className="flex items-center gap-4">
              <div className="relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={16} />
                 <input 
                   type="text"
                   placeholder="Search node..."
                   className="pl-12 pr-6 py-3.5 bg-gray-50 border border-black/5 rounded-2xl text-sm font-bold text-black placeholder:text-black/20 outline-none focus:ring-2 focus:ring-primary transition-all w-64"
                 />
              </div>
           </div>
        </header>

        <div className="p-10 space-y-10">
          {/* Stats ROW */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={Building2} label="Total Institutions" value="245" trend="+12%" color="blue" />
            <StatCard icon={Users} label="Total Parents" value="12.4k" trend="+24%" color="purple" />
            <StatCard icon={DollarSign} label="Platform revenue" value="$4,850" trend="+18%" color="emerald" />
            <StatCard icon={CreditCard} label="Active Trials" value="42" color="amber" />
          </section>

          {/* Charts Area */}
          <section className="bg-white rounded-[40px] p-10 border border-black/5 shadow-sm">
            <h3 className="font-black text-xl mb-10 uppercase tracking-widest flex items-center gap-3">
               <Activity className="text-primary" /> Growth Metrics
            </h3>
            <div className="h-96 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                     <defs>
                       <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                         <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                       </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" vertical={false} />
                     <XAxis dataKey="name" stroke="rgba(0,0,0,0.1)" tick={{fill: "rgba(0,0,0,0.3)", fontSize: 12, fontWeight: 'black'}} axisLine={false} tickLine={false} />
                     <YAxis stroke="rgba(0,0,0,0.1)" tickFormatter={(value) => `$${value}`} tick={{fill: "rgba(0,0,0,0.3)", fontSize: 12, fontWeight: 'black'}} axisLine={false} tickLine={false} />
                     <Tooltip 
                        contentStyle={{backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '24px', fontWeight: 'black', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)'}}
                        itemStyle={{color: '#2563eb'}}
                     />
                     <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={5} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
          </section>

          {/* Table Area */}
          <section className="bg-white rounded-[40px] border border-black/5 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-black/5 flex items-center justify-between">
               <h3 className="font-black text-lg uppercase tracking-tight">Institution Control List</h3>
               <button className="px-5 py-2.5 bg-black text-white rounded-xl text-xs font-black uppercase tracking-widest">Export CSV</button>
            </div>
            
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-gray-50/50 text-black/30 text-[10px] uppercase tracking-widest font-black border-b border-black/5">
                     <th className="px-8 py-6">Code ID</th>
                     <th className="px-8 py-6">Institution Name</th>
                     <th className="px-8 py-6">Plan Status</th>
                     <th className="px-8 py-6 text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-black/5">
                   {institutions.map((inst) => (
                     <tr key={inst.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-8 py-7 font-mono font-bold text-black/40">{inst.id}</td>
                        <td className="px-8 py-7 font-black text-lg">{inst.name}</td>
                        <td className="px-8 py-7 font-bold text-black/60 capitalize">
                           <span className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                              {inst.plan}
                           </span>
                        </td>
                        <td className="px-8 py-7 text-right">
                           <button className="text-[10px] font-black tracking-widest uppercase bg-primary text-white px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/10">
                             Manage Node
                           </button>
                        </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon: Icon, label, active = false }: any) {
    return (
       <button className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-sm transition-all border ${active ? 'bg-primary text-white border-primary shadow-xl shadow-primary/20' : 'text-black/40 hover:text-black hover:bg-black/5 border-transparent'}`}>
          <Icon size={20} />
          {label}
       </button>
    );
}

function StatCard({ icon: Icon, label, value, trend, color }: any) {
    const colorMap: any = {
        blue: 'bg-blue-50 text-blue-600 border-blue-100',
        purple: 'bg-purple-50 text-purple-600 border-purple-100',
        emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        amber: 'bg-amber-50 text-amber-600 border-amber-100',
    };
    return (
       <div className="bg-white rounded-[32px] p-8 border border-black/5 shadow-sm relative overflow-hidden group">
          <div className={`w-14 h-14 rounded-2xl ${colorMap[color] || colorMap.blue} flex items-center justify-center mb-8 border group-hover:-rotate-6 transition-transform`}>
             <Icon size={24} />
          </div>
          <p className="text-black/30 font-black text-[10px] uppercase tracking-widest mb-1">{label}</p>
          <div className="flex items-end gap-3">
             <span className="text-4xl font-black text-black leading-none">{value}</span>
             {trend && <span className="text-emerald-500 text-xs font-black flex items-center mb-1">{trend} <ArrowUpRight size={14} /></span>}
          </div>
       </div>
    );
}
