"use client";

import { use } from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-10 text-black">
      <h1 className="text-4xl font-black mb-4">Parent Portal Debug</h1>
      <p className="text-xl">Institution ID: <span className="text-primary font-bold">{id}</span></p>
      <div className="mt-10 p-6 bg-white rounded-3xl shadow-xl">
        <p>If you see this, the dynamic routing is working.</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-black text-white rounded-full font-bold"
        >
          Reload
        </button>
      </div>
    </div>
  );
}
