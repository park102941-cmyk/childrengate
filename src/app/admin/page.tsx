"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuperAdminRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the professional login with institution tab pre-pushed if possible
    // For now, just a clean redirect to the main login
    router.replace("/login?type=institution");
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white text-center">
      <div className="w-full max-w-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="font-bold text-white/50 tracking-widest uppercase">Initializing Secure Portal...</p>
      </div>
    </div>
  );
}
