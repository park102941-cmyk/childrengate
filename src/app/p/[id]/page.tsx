"use client";

import dynamic from "next/dynamic";

// Force absolute client-side rendering to bypass all Edge Runtime SSR issues
const ParentPortalClient = dynamic(() => import("./ParentPortalClient"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
});

export default function Page() {
  // We no longer need to pass institutionId from params as ParentPortalClient 
  // uses useParams() internally which is safe in a client component.
  return <ParentPortalClient />;
}
