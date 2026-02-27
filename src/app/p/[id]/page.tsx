"use client";

import { use } from "react";
import ParentPortalWrapper from "./ParentPortalWrapper";

// NOTE: In Next.js 15, params is a Promise in Client/Server components.
export default function ParentPortalPage({ params }: { params: Promise<{ id: string }> }) {
  // We don't actually need id here as the client component uses useParams(),
  // but we "use" it to satisfy the Next.js 15 pattern which might prevent SSR issues.
  use(params);
  
  return <ParentPortalWrapper />;
}
