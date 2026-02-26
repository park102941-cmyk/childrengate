"use client";






import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, updateDoc, doc, Timestamp, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Clock, User, LogOut, Printer, Bell } from "lucide-react";

interface PickupRequest {
  id: string;
  studentName: string;
  className: string;
  parentName: string;
  requestTime: Timestamp;
  status: 'pending' | 'approved' | 'completed';
  type: 'manual' | 'qr';
}

import { useLanguage } from "@/context/LanguageContext";

export default function TeacherDashboard() {
  const { t } = useLanguage();
  const [requests, setRequests] = useState<PickupRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) return;

    const q = query(
      collection(db, "pickup_requests"),
      where("status", "==", "pending"),
      orderBy("requestTime", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PickupRequest[];
      setRequests(data);
      setLoading(false);
      
      // Notify if new request (Browser Notification)
      if (snapshot.docChanges().some(change => change.type === "added")) {
        new Audio("/notification.mp3").play().catch(() => {});
      }
    });

    return () => unsubscribe();
  }, []);

  const handleApprove = async (request: PickupRequest) => {
    try {
      if (!db) {
        throw new Error("Firebase database is not initialized");
      }
      // 1. Update Firestore (Real-time DB for Instant UI Update)
      await updateDoc(doc(db, "pickup_requests", request.id), {
        status: "approved",
        approvedAt: Timestamp.now()
      });

      // 2. Sync to Google Sheets (Reporting Store in Background)
      fetch("/api/sync-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "PICKUP_COMPLETED",
          studentName: request.studentName,
          className: request.className,
          parentName: request.parentName,
          timestamp: new Date().toISOString(),
          status: "APPROVED"
        })
      }).catch(err => console.error("Reporting sync failed:", err));

      console.log("Approved and Synced pickup:", request.id);
    } catch (error) {
      console.error("Error approving pickup:", error);
    }
  };

  const handlePrint = (request: PickupRequest) => {
    // Upgraded label print to match Planning Center Check-ins label style
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>CG Sticker - ${request.studentName}</title>
            <style>
              @page { size: 50mm 30mm; margin: 0; }
              body { 
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                margin: 0; 
                padding: 1.5mm;
                width: 50mm;
                height: 30mm;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                box-sizing: border-box;
                background: white;
                overflow: hidden;
              }
              .header { 
                display: flex; 
                justify-content: space-between; 
                align-items: flex-start; 
                border-bottom: 0.5pt solid #000;
                padding-bottom: 0.5mm;
              }
              .brand { font-size: 7pt; font-weight: 900; color: #000; letter-spacing: -0.2pt; }
              .class-info { font-size: 6.5pt; font-weight: bold; color: #444; }
              
              .main-content {
                flex-grow: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1mm 0;
              }
              .student-name { 
                font-size: 20pt; 
                font-weight: 900; 
                letter-spacing: -1pt; 
                line-height: 1; 
                margin: 0; 
                color: #000;
              }
              
              .footer { 
                display: flex; 
                justify-content: space-between; 
                align-items: flex-end; 
                padding-top: 0.5mm;
              }
              .time { font-size: 6pt; font-weight: bold; color: #666; }
              .barcode-placeholder { 
                font-family: monospace; 
                font-size: 6pt; 
                letter-spacing: 0.5pt;
                background: #000;
                color: #fff;
                padding: 1pt 3pt;
                border-radius: 1pt;
              }
              .barcode-visual {
                font-size: 10pt;
                letter-spacing: 2pt;
                line-height: 1;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <span class="brand">CG CHILDREN GATE</span>
              <span class="class-info">${request.className}</span>
            </div>
            
            <div class="main-content">
              <h1 class="student-name">${request.studentName}</h1>
            </div>
            
            <div class="footer">
               <span class="time">${new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span>
               <div style="text-align: right">
                 <div class="barcode-visual">|||| ||| || |||</div>
                 <div class="barcode-placeholder">${request.id.substring(0, 8).toUpperCase()}</div>
               </div>
            </div>
            <script>
              window.onload = function() { 
                setTimeout(function() {
                  window.print(); 
                  window.close(); 
                }, 300);
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-black">{t.dashboard.teacher.title}</h1>
            <p className="text-black/60 font-medium">{t.dashboard.teacher.subtitle}</p>
          </div>
          <button className="p-3 rounded-2xl bg-white border border-black/5 hover:bg-gray-100 transition-all text-black/70 shadow-sm">
            <LogOut size={20} />
          </button>
        </header>

        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={18} className="text-primary" />
            <h2 className="font-semibold">{t.dashboard.teacher.realtimeRequests} ({requests.length})</h2>
          </div>

          <AnimatePresence mode="popLayout">
            {requests.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200"
              >
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="text-gray-300" />
                </div>
                <p className="text-secondary">{t.dashboard.teacher.noRequests}</p>
              </motion.div>
            ) : (
              requests.map((request) => (
                <motion.div
                  key={request.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                      <User size={28} />
                    </div>
                    <div>
                      <span className="text-xs font-extra-bold text-primary uppercase tracking-widest">{request.className}</span>
                      <h3 className="text-xl font-bold text-black">{request.studentName}</h3>
                      <div className="flex items-center gap-3 mt-1 text-sm font-medium text-black/60">
                        <span className="flex items-center gap-1">
                          <Clock size={14} className="text-primary" />
                          {request.requestTime.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="text-black/20">•</span>
                        <span>{request.parentName} {t.dashboard.teacher.guardian}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => handlePrint(request)}
                      className="p-4 rounded-2xl bg-gray-50 text-secondary hover:bg-gray-100 transition-colors"
                      title={t.dashboard.teacher.sticker}
                    >
                      <Printer size={20} />
                    </button>
                    <button 
                      onClick={() => handleApprove(request)}
                      className="px-6 py-4 rounded-2xl bg-primary text-white font-bold hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20"
                    >
                      {t.dashboard.teacher.approve}
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
}
