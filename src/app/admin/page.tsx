"use client";






import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowRight, Lock } from "lucide-react";

export default function SuperAdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "123456") {
      router.push("/admin/dashboard");
    } else {
      setError("비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white text-center">
      <div className="w-full max-w-sm">
        <div className="bg-slate-800 rounded-3xl p-10 shadow-2xl border border-white/10">
          <div className="flex justify-center mb-6 text-primary">
             <ShieldCheck size={50} />
          </div>
          <h1 className="text-2xl font-black tracking-widest text-white mb-2 uppercase">Systems Control</h1>
          <p className="text-white/40 font-bold text-sm mb-8 tracking-widest uppercase">Super Admin Portal</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative text-left">
              <label className="text-xs font-bold text-white/50 mb-2 block uppercase tracking-widest">Authentication Key</label>
              <div className="flex items-center bg-slate-900 border border-white/5 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary transition-all">
                 <Lock size={16} className="text-white/30 mr-3 shrink-0" />
                 <input 
                   type="password"
                   placeholder="Enter master password"
                   className="w-full bg-transparent border-none outline-none text-white font-mono tracking-widest placeholder:text-white/20"
                   value={password}
                   onChange={e => setPassword(e.target.value)}
                   autoFocus
                 />
              </div>
            </div>

            {error && (
               <p className="text-red-400 font-bold text-sm">{error}</p>
            )}

            <button type="submit" className="w-full py-4 bg-primary text-white font-black hover:bg-primary/80 transition-all rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 tracking-widest">
               ACCESS <ArrowRight size={16} />
            </button>
          </form>
        </div>
        <p className="mt-8 text-xs font-bold text-white/20 tracking-widest uppercase flex items-center justify-center gap-2">
           <ShieldCheck size={12} /> Children Gate Super Admin
        </p>
      </div>
    </div>
  );
}
