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
            <title>Sticker Print - ${request.studentName}</title>
            <style>
              @page { size: 3.5in 1.125in; margin: 0; }
              body { 
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
                margin: 0; 
                padding: 0;
                width: 3.5in;
                height: 1.125in;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                box-sizing: border-box;
                padding: 0.1in;
              }
              .header { display: flex; justify-content: space-between; align-items: flex-start; }
              .class-name { font-size: 10pt; font-weight: bold; text-transform: uppercase; color: #000; }
              .security-code { font-size: 14pt; font-weight: 900; background: #000; color: #fff; padding: 2px 6px; border-radius: 4px; }
              .main-name { font-size: 26pt; font-weight: 900; letter-spacing: -1px; line-height: 1; margin: 0; text-align: left; }
              .footer { display: flex; justify-content: space-between; align-items: flex-end; font-size: 8pt; color: #333; }
              .medical { background: #000; color: #fff; padding: 2px 4px; font-weight: bold; border-radius: 2px; }
              .barcode-placeholder { font-family: 'Courier New', Courier, monospace; letter-spacing: 2px; }
            </style>
          </head>
          <body>
            <div class="header">
              <span class="class-name">${request.className}</span>
              <span class="security-code">${Math.random().toString(36).substring(2, 6).toUpperCase()}</span>
            </div>
            
            <h1 class="main-name">${request.studentName}</h1>
            
            <div class="footer">
               <span>
                 <span class="medical">NO PEANUTS</span>
                 &nbsp; ${request.parentName}
               </span>
               <span class="barcode-placeholder">||||| ||||||| |</span>
            </div>
            <script>
              window.onload = function() { 
                setTimeout(function() {
                  window.print(); 
                  window.close(); 
                }, 200);
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
