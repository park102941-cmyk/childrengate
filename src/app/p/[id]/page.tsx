"use client";

import { use, useEffect, useState } from "react";
import ParentPortalWrapper from "./ParentPortalWrapper";

export default function ParentPortalPage({ params }: { params: Promise<{ id: string }> }) {
  // We use "use" to unwrap params in a client component - standard Next 15
  const resolvedParams = use(params);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Return a very light server-renderable shell, and mount the real portal only on client
  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <ParentPortalWrapper institutionId={resolvedParams.id} />;
}
