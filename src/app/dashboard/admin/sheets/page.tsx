"use client";

import { useState, useEffect } from "react";
import { Database, RefreshCcw, ExternalLink, Play, FileSpreadsheet } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function SheetsIntegrationPage() {
  const { t } = useLanguage();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
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

  const handleCreateSheet = () => {
    setIsCreating(true);
    setTimeout(() => {
      setIsCreating(false);
      const newId = "1" + Math.random().toString(36).substring(2, 22);
      setSheetId(newId);
      alert("새로운 구글 시트 양식(Template)이 생성되었습니다!\n\nID: " + newId + "\n\n이제 가이드에 따라 Apps Script 설정을 완료해 주세요.");
    }, 2500);
  };

  const handlePullData = () => {
    setIsPulling(true);
    setTimeout(() => {
       setIsPulling(false);
       alert("구글 시트의 최신 데이터를 화면에 반영했습니다.");
    }, 2000);
  };

  const gasTemplate = `function onEdit(e) {
  // Kids Gate Real-time Sync Template
  var sheet = e.source.getActiveSheet();
  var range = e.range;
  // This code would handle data sync between Sheet and Firebase
}`;

  return (
    <main className="flex-1 lg:ml-64 p-6 md:p-10 lg:p-14 bg-gray-50/30 min-h-screen font-sans">
      <header className="mb-10">
        <h1 className="text-4xl font-black tracking-tight text-black mb-1">구글 시트 연동</h1>
        <p className="text-black/50 font-semibold">기관의 모든 데이터를 구글 시트와 실시간으로 동기화합니다.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         <div className="lg:col-span-5 space-y-10">
            {/* Connection Config */}
            <section className="bg-white rounded-[40px] border border-black/5 shadow-2xl shadow-black/5 p-10 relative overflow-hidden">
               <div className="flex items-center gap-4 mb-8">
                  <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-lg ${
                     connectionStatus === "connected" ? "bg-emerald-50 text-emerald-500 shadow-emerald-500/20" : "bg-amber-50 text-amber-500"
                  }`}>
                     <FileSpreadsheet size={32} />
                  </div>
                  <div>
                     <h2 className="text-xl font-black">연동 시스템 상태</h2>
                     <span className="text-sm font-bold text-emerald-600">활성화됨</span>
                  </div>
               </div>

               <div className="space-y-6">
                  <div>
                     <label className="block text-xs font-black text-black/40 uppercase tracking-widest mb-2">Google Spreadsheet ID</label>
                     <input 
                        type="text" 
                        value={sheetId}
                        onChange={(e) => setSheetId(e.target.value)}
                        className="w-full bg-gray-50 border border-black/5 rounded-2xl p-4 font-mono text-sm"
                     />
                  </div>

                  <button 
                     onClick={handleCreateSheet}
                     disabled={isCreating}
                     className="w-full flex items-center justify-center gap-3 p-5 rounded-[24px] bg-emerald-500 text-white hover:bg-emerald-600 font-black text-sm transition-all shadow-xl shadow-emerald-500/20"
                  >
                     {isCreating ? <RefreshCcw size={16} className="animate-spin" /> : <FileSpreadsheet size={18} />}
                     전용 구글 시트 양식 생성하기
                  </button>

                  <a 
                     href={`https://docs.google.com/spreadsheets/d/${sheetId}`} 
                     target="_blank"
                     className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-white border border-black/5 font-black text-sm text-black"
                  >
                     시트 열기 <ExternalLink size={16} />
                  </a>
               </div>
            </section>

            {/* GAS Guide */}
            <section className="bg-slate-900 rounded-[40px] p-10 text-white">
               <h3 className="font-black text-xl mb-4 flex items-center gap-2">
                  <Database className="text-primary" />
                  자동 동기화 설정 가이드
               </h3>
               <div className="space-y-4 text-sm text-white/50">
                  <p>1. 시트 메뉴 <b>'확장 프로그램 &gt; Apps Script'</b> 클릭</p>
                  <pre className="bg-white/5 p-4 rounded-xl font-mono text-[10px] text-primary overflow-x-auto">
                     {gasTemplate}
                  </pre>
                  <p>2. 위 코드를 붙여넣고 권한 승인을 완료하세요.</p>
               </div>
            </section>
         </div>

         {/* Right Sidebar: Sync Tools & Preview */}
         <div className="lg:col-span-7 space-y-10">
            <section className="bg-white rounded-[40px] border border-black/5 shadow-sm overflow-hidden">
               <div className="p-8 border-b border-black/5 bg-gray-50/50 flex items-center justify-between">
                  <h3 className="font-black text-lg">최근 데이터 동기화 로그 (Preview)</h3>
                  <button onClick={handlePullData} className="p-2 hover:bg-white rounded-lg transition-colors">
                     <RefreshCcw size={16} className={isPulling ? "animate-spin" : ""} />
                  </button>
               </div>
               <div className="p-8 overflow-x-auto">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="text-black/30 text-[10px] font-black uppercase tracking-widest border-b border-black/5">
                           <th className="pb-4">TIMESTAMP</th>
                           <th className="pb-4">TYPE</th>
                           <th className="pb-4">STUDENT</th>
                           <th className="pb-4 text-right">STATUS</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-black/5">
                        {recentLogs.map((log, idx) => (
                           <tr key={idx} className="hover:bg-gray-50">
                              <td className="py-5 font-mono text-xs text-black/60">{log.time}</td>
                              <td className="py-5">
                                 <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-[10px] font-black">{log.type}</span>
                              </td>
                              <td className="py-5 font-bold">{log.student}</td>
                              <td className="py-5 text-right font-black text-xs text-emerald-500">{log.status}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </section>

            <section className="bg-slate-900 rounded-[40px] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6">
               <div>
                  <h3 className="font-black text-xl mb-1 flex items-center gap-2">
                     <Play size={20} className="text-primary" fill="currentColor" />
                     전체 강제 동기화
                  </h3>
                  <p className="text-white/40 text-sm font-bold">마지막 동기화: {lastSync}</p>
               </div>
               <button 
                  onClick={handleSyncData}
                  disabled={isSyncing}
                  className="bg-primary text-white px-8 py-5 rounded-3xl font-black shadow-xl shadow-primary/30 flex items-center gap-2 active:scale-95 transition-all"
               >
                  {isSyncing ? <RefreshCcw className="animate-spin" /> : <RefreshCcw />}
                  지금 모든 기록 푸시 (App → Sheet)
               </button>
            </section>
         </div>
      </div>
    </main>
  );
}
