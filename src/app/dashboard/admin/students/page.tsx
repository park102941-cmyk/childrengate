"use client";

import dynamic from "next/dynamic";

const StudentManagementClient = dynamic(() => import("./StudentManagementClient"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl animate-pulse">
           <div className="w-8 h-8 bg-white/20 rounded-full"></div>
        </div>
        <p className="font-bold text-black/50">학생 데이터를 불러오는 중입니다...</p>
      </div>
    </div>
  ),
});

export default function StudentManagementPage() {
  return <StudentManagementClient />;
}
