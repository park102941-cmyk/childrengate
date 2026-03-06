"use client";

export const runtime = 'edge';

import dynamic from "next/dynamic";

const StudentDetailClient = dynamic(() => import("./StudentDetailClient"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center lg:ml-64">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl animate-pulse text-white">
           Loading...
        </div>
        <p className="font-bold text-black/50 tracking-tight">학생 상세 정보를 불러오는 중...</p>
      </div>
    </div>
  ),
});

export default function StudentDetailPage() {
  return <StudentDetailClient />;
}
