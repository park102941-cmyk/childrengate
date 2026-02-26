"use client";

import dynamic from "next/dynamic";

// Disable SSR entirely for this page to avoid Edge Runtime / Firebase SDK conflicts
const ParentPortalClient = dynamic(() => import("./ParentPortalClient"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <p className="font-bold text-black/50">칠드런 게이트 로딩 중...</p>
      </div>
    </div>
  ),
});

export default function ParentPortalPage() {
  return <ParentPortalClient />;
}
