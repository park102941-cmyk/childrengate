"use client";






import { useState } from "react";
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
  LogOut
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

  const institutions = [
    { id: "KGC-01", name: "햇살 어린이집", plan: "Pro ($19.99)", status: "Active", students: 120, joined: "2025-11-20" },
    { id: "KGC-02", name: "칠드런 게이트 유치원", plan: "Pro ($19.99)", status: "Active", students: 300, joined: "2025-12-05" },
    { id: "KGC-03", name: "늘푸른 피아노학원", plan: "Basic ($9.99)", status: "Trialing", students: 45, joined: "2026-02-15" },
    { id: "KGC-04", name: "소망 교회 주일학교", plan: "Basic ($9.99)", status: "Active", students: 80, joined: "2026-01-10" },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 hidden lg:flex flex-col">
        <div className="p-8 border-b border-white/10 flex items-center gap-3">
           <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
              <ShieldCheck size={20} className="text-primary" />
           </div>
           <div>
              <h1 className="font-black tracking-widest text-sm uppercase">Children Gate</h1>
              <p className="text-[10px] text-white/50 tracking-widest font-bold uppercase">Super Admin</p>
           </div>
        </div>
        <nav className="flex-1 p-6 space-y-2">
           <button className="w-full flex items-center gap-3 bg-white/10 text-white px-4 py-3 rounded-2xl font-bold transition-all border border-white/5">
              <Activity size={18} className="text-primary" /> Dashboard
           </button>
           <button className="w-full flex items-center gap-3 hover:bg-white/5 text-white/50 hover:text-white px-4 py-3 rounded-2xl font-bold transition-all">
              <Building2 size={18} /> Institutions
           </button>
           <button className="w-full flex items-center gap-3 hover:bg-white/5 text-white/50 hover:text-white px-4 py-3 rounded-2xl font-bold transition-all">
              <DollarSign size={18} /> Billing & Revenue
           </button>
           <button className="w-full flex items-center gap-3 hover:bg-white/5 text-white/50 hover:text-white px-4 py-3 rounded-2xl font-bold transition-all">
              <Settings size={18} /> System Settings
           </button>
        </nav>
        <div className="p-6 border-t border-white/10">
           <button 
             onClick={() => router.push("/admin")}
             className="w-full flex items-center gap-3 hover:bg-red-500/10 text-white/50 hover:text-red-400 px-4 py-3 rounded-2xl font-bold transition-all"
           >
              <LogOut size={18} /> Logout
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
        <header className="px-10 py-8 border-b border-white/10 flex items-center justify-between sticky top-0 bg-slate-900/50 backdrop-blur-xl z-10">
           <h2 className="text-2xl font-black uppercase tracking-widest">Platform Overview</h2>
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full border border-white/5">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="text-xs font-bold uppercase tracking-widest text-white/70">Systems Normal</span>
              </div>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 space-y-10">
          {/* Stats ROW */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-800/50 rounded-3xl p-6 border border-white/10 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform"><Building2 size={80} /></div>
               <p className="text-white/40 font-bold text-xs uppercase tracking-widest mb-1">Total Institutions</p>
               <div className="flex items-end gap-3">
                  <span className="text-4xl font-black">245</span>
                  <span className="text-emerald-400 text-sm font-bold flex items-center"><ArrowUpRight size={14} /> 12%</span>
               </div>
            </div>
            <div className="bg-slate-800/50 rounded-3xl p-6 border border-white/10 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform"><Users size={80} /></div>
               <p className="text-white/40 font-bold text-xs uppercase tracking-widest mb-1">Total Parents (MAU)</p>
               <div className="flex items-end gap-3">
                  <span className="text-4xl font-black">12.4k</span>
                  <span className="text-emerald-400 text-sm font-bold flex items-center"><ArrowUpRight size={14} /> 24%</span>
               </div>
            </div>
            <div className="bg-slate-800/50 rounded-3xl p-6 border border-white/10 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform"><DollarSign size={80} /></div>
               <p className="text-white/40 font-bold text-xs uppercase tracking-widest mb-1">MRR (Monthly Revenue)</p>
               <div className="flex items-end gap-3">
                  <span className="text-4xl font-black">$4,850</span>
                  <span className="text-emerald-400 text-sm font-bold flex items-center"><ArrowUpRight size={14} /> 18%</span>
               </div>
            </div>
            <div className="bg-slate-800/50 rounded-3xl p-6 border border-white/10 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform"><CreditCard size={80} /></div>
               <p className="text-white/40 font-bold text-xs uppercase tracking-widest mb-1">Active Trials</p>
               <div className="flex items-end gap-3">
                  <span className="text-4xl font-black text-amber-500">42</span>
               </div>
            </div>
          </section>

          {/* Charts Area */}
          <section className="bg-slate-800/30 rounded-[40px] p-8 border border-white/5">
            <h3 className="font-black text-xl mb-6 uppercase tracking-widest flex items-center gap-3">
               <Activity className="text-primary" /> Revenue Growth
            </h3>
            <div className="h-80 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                     <defs>
                       <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8}/>
                         <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                       </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                     <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{fill: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                     <YAxis stroke="rgba(255,255,255,0.3)" tickFormatter={(value) => `$${value}`} tick={{fill: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                     <Tooltip 
                       contentStyle={{backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontWeight: 'bold'}}
                       itemStyle={{color: '#818cf8'}}
                     />
                     <Area type="monotone" dataKey="revenue" stroke="#818cf8" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
          </section>

          {/* Table Area */}
          <section className="bg-slate-800/30 rounded-[40px] border border-white/5 overflow-hidden">
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-slate-800/50">
               <h3 className="font-black text-lg uppercase tracking-widest">Institutions Control</h3>
               <div className="relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                 <input 
                   type="text"
                   placeholder="Search Institutions..."
                   className="pl-12 pr-6 py-3 bg-slate-900 border border-white/10 rounded-full text-sm font-bold text-white placeholder:text-white/30 outline-none focus:border-primary transition-all w-64 focus:w-80"
                   value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                 />
               </div>
            </div>
            
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-slate-900/50 text-white/40 text-[10px] uppercase tracking-widest font-black">
                     <th className="px-8 py-5">Code ID</th>
                     <th className="px-8 py-5">Institution Name</th>
                     <th className="px-8 py-5">Plan</th>
                     <th className="px-8 py-5">Students</th>
                     <th className="px-8 py-5">Status</th>
                     <th className="px-8 py-5 text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                   {institutions.filter(i => i.name.includes(searchTerm) || i.id.includes(searchTerm)).map((inst) => (
                     <tr key={inst.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-8 py-6 font-mono text-white/50">{inst.id}</td>
                        <td className="px-8 py-6 font-black">{inst.name}</td>
                        <td className="px-8 py-6 font-bold text-white/70">{inst.plan}</td>
                        <td className="px-8 py-6 font-bold text-white/70">{inst.students}</td>
                        <td className="px-8 py-6">
                           <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest border rounded-full ${inst.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                              {inst.status}
                           </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <button className="text-[10px] font-black tracking-widest uppercase bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all border border-white/5">
                             Manage
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
