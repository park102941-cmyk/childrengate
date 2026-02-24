"use client";






import { useState, useEffect } from "react";
import { Database, CheckCircle, RefreshCcw, DownloadCloud, ExternalLink, AlertTriangle, Play, FileSpreadsheet } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function SheetsIntegrationPage() {
  const { t } = useLanguage();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [sheetId, setSheetId] = useState(process.env.NEXT_PUBLIC_SHEET_ID || "1IOnA7wUoBf_eUCOuBqU6U9RzDNoD6e6_0_S8mOfY8I8");
  const [lastSync, setLastSync] = useState("오늘 오전 10:24");
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "error" | "checking">("checking");
  
  // Mock recent data pulled from sheets
  const recentLogs = [
    { time: "2026-02-22 09:12:05", type: "REQUEST", student: "김지우", parent: "김민수", status: "PENDING" },
    { time: "2026-02-22 09:05:22", type: "PICKUP", student: "오재민", parent: "이서연", status: "COMPLETED" },
    { time: "2026-02-22 08:50:11", type: "REQUEST", student: "이준서", parent: "박하늘", status: "APPROVED" },
  ];

  useEffect(() => {
    // Simulate connection check
    setTimeout(() => {
      setConnectionStatus("connected");
    }, 1500);
  }, [sheetId]);

  const handleSyncData = () => {
    setIsSyncing(true);
    // Simulate API call for batch sync
    setTimeout(() => {
      setIsSyncing(false);
      setLastSync(new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }));
      alert("데이터 동기화가 완료되었습니다.");
    }, 2000);
  };

  const handlePullData = () => {
    setIsPulling(true);
    // Simulate API pull
    setTimeout(() => {
       setIsPulling(false);
       alert("구글 시트의 최신 데이터를 화면에 반영했습니다.");
    }, 2000);
  };

  return (
    <main className="flex-1 lg:ml-64 p-6 md:p-10 lg:p-14">
      <header className="mb-10">
        <h1 className="text-4xl font-black tracking-tight text-black mb-1">{t.dashboard.sheets?.title || "구글 시트 연동"}</h1>
        <p className="text-black/50 font-semibold">{t.dashboard.sheets?.subtitle || "앱 데이터를 구글 시트와 실시간으로 동기화합니다."}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         {/* Configuration & Status */}
         <div className="lg:col-span-5 space-y-10">
            <section className="bg-white rounded-[40px] border border-black/5 shadow-2xl shadow-black/5 p-10 relative overflow-hidden">
               {/* Decorative background element */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

               <div className="flex items-center gap-4 mb-8 relative z-10">
                  <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-lg ${
                     connectionStatus === "connected" ? "bg-emerald-50 text-emerald-500 shadow-emerald-500/20" : 
                     connectionStatus === "error" ? "bg-red-50 text-red-500 shadow-red-500/20" : 
                     "bg-amber-50 text-amber-500 shadow-amber-500/20 animate-pulse"
                  }`}>
                     <FileSpreadsheet size={32} />
                  </div>
                  <div>
                     <h2 className="text-xl font-black">Connection Status</h2>
                     <div className="flex items-center gap-2 mt-1">
                        {connectionStatus === "connected" ? (
                           <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                              <CheckCircle size={14} /> {t.dashboard.sheets?.connected || "연동 완료"}
                           </span>
                        ) : connectionStatus === "error" ? (
                           <span className="flex items-center gap-1.5 text-sm font-bold text-red-600 bg-red-50 px-3 py-1 rounded-lg">
                              <AlertTriangle size={14} /> Failed to Connect
                           </span>
                        ) : (
                           <span className="flex items-center gap-1.5 text-sm font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-lg">
                              <RefreshCcw size={14} className="animate-spin" /> Checking...
                           </span>
                        )}
                     </div>
                  </div>
               </div>

               <div className="space-y-6 relative z-10">
                  <div>
                     <label className="block text-xs font-black text-black/40 uppercase tracking-widest mb-2">Google Spreadsheet ID</label>
                     <input 
                        type="text" 
                        value={sheetId}
                        onChange={(e) => setSheetId(e.target.value)}
                        placeholder={t.dashboard.sheets?.sheetIdPlaceholder || "구글 시트 ID를 입력하세요"}
                        className="w-full bg-gray-50 border border-black/5 rounded-2xl p-4 font-mono text-sm text-black focus:ring-2 focus:ring-primary outline-none transition-all"
                     />
                  </div>
                  <button className="apple-button-secondary w-full flex items-center justify-center gap-2 bg-black text-white hover:bg-black/80">
                     {t.dashboard.sheets?.saveConfig || "설정 저장"}
                  </button>

                  <a 
                     href={`https://docs.google.com/spreadsheets/d/${sheetId}`} 
                     target="_blank"
                     className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-white border border-black/5 hover:bg-gray-50 font-black text-sm text-black transition-colors"
                  >
                     {t.dashboard.sheets?.openSheet || "시트 직접 열기"}
                     <ExternalLink size={16} className="text-black/40" />
                  </a>
               </div>
            </section>

            <section className="bg-slate-900 rounded-[40px] shadow-2xl shadow-primary/20 p-10 text-white">
               <h3 className="font-black text-xl mb-2 flex items-center gap-2">
                  <Database className="text-primary" />
                  Manual Sync Tools
               </h3>
               <p className="text-white/40 text-sm font-bold mb-8">
                  {t.dashboard.sheets?.lastSync || "마지막 동기화"}: <span className="text-white/80">{lastSync}</span>
               </p>

               <div className="space-y-4">
                  <button 
                     onClick={handleSyncData}
                     disabled={isSyncing}
                     className="w-full apple-button-primary bg-primary border-none text-white shadow-lg shadow-primary/30 flex items-center justify-between group"
                  >
                     <span className="flex items-center gap-3">
                        {isSyncing ? <RefreshCcw size={20} className="animate-spin" /> : <Play size={20} fill="currentColor" />}
                        {t.dashboard.sheets?.syncData || "모든 기록 푸시"}
                     </span>
                     <span className="text-xs font-black bg-white/20 px-3 py-1 rounded-lg group-hover:bg-white/30 transition-colors">App → Sheet</span>
                  </button>

                  <button 
                     onClick={handlePullData}
                     disabled={isPulling}
                     className="w-full apple-button-secondary border-white/20 text-white hover:bg-white/10 flex items-center justify-between group"
                  >
                     <span className="flex items-center gap-3">
                        {isPulling ? <RefreshCcw size={20} className="animate-spin" /> : <DownloadCloud size={20} />}
                        {t.dashboard.sheets?.pullData || "최신 데이터 불러오기"}
                     </span>
                     <span className="text-xs font-black bg-white/10 px-3 py-1 rounded-lg group-hover:bg-white/20 transition-colors">Sheet → App</span>
                  </button>
               </div>
            </section>
         </div>

         {/* Sheet Preview */}
         <div className="lg:col-span-7 space-y-10">
            <section className="bg-white rounded-[40px] border border-black/5 shadow-sm overflow-hidden h-full flex flex-col">
               <div className="p-8 border-b border-black/5 bg-gray-50/50 flex items-center justify-between">
                  <div>
                     <h3 className="font-black text-lg">최근 연동 로그 (Preview)</h3>
                     <p className="text-xs font-bold text-black/40 mt-1">시트 내용 중 최근 10개 행을 표시합니다.</p>
                  </div>
                  <button className="p-3 bg-white rounded-xl shadow-sm border border-black/5 hover:bg-gray-50 text-black/40 hover:text-black transition-colors">
                     <RefreshCcw size={16} />
                  </button>
               </div>
               
               <div className="flex-1 overflow-x-auto p-8">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="text-black/30 text-[10px] font-black uppercase tracking-widest border-b border-black/5">
                           <th className="pb-4 pr-6">Timestamp</th>
                           <th className="pb-4 pr-6">Type</th>
                           <th className="pb-4 pr-6">Student</th>
                           <th className="pb-4 pr-6">Parent</th>
                           <th className="pb-4 text-right">Status</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-black/5">
                        {recentLogs.map((log, idx) => (
                           <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                              <td className="py-5 pr-6 font-mono text-xs font-bold text-black/60">{log.time}</td>
                              <td className="py-5 pr-6">
                                 <span className={`px-2 py-1 rounded-md text-[10px] font-black ${
                                    log.type === 'REQUEST' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-purple-50 text-purple-600 border border-purple-100'
                                 }`}>
                                    {log.type}
                                 </span>
                              </td>
                              <td className="py-5 pr-6 font-bold text-black">{log.student}</td>
                              <td className="py-5 pr-6 text-sm text-black/60 font-medium">{log.parent}</td>
                              <td className="py-5 text-right">
                                 <span className={`px-3 py-1 rounded-xl text-xs font-black ${
                                    log.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' : 
                                    log.status === 'APPROVED' ? 'bg-amber-50 text-amber-600' : 
                                    'bg-gray-100 text-gray-500'
                                 }`}>
                                    {log.status}
                                 </span>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
                  <div className="mt-8 flex justify-center">
                     <button className="text-sm font-black text-black/30 hover:text-primary transition-colors">
                        Load More Logs...
                     </button>
                  </div>
               </div>
            </section>
         </div>
      </div>
    </main>
  );
}
