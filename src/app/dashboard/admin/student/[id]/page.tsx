"use client";

import dynamic from "next/dynamic";

const StudentDetailClient = dynamic(() => import("./StudentDetailClient"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
});

export default function StudentDetailPage() {
  return <StudentDetailClient />;
}
