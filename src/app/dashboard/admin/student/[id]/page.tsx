"use client";

import { use } from "react";
import StudentDetailClient from "./StudentDetailClient";

export default function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  use(params);
  return <StudentDetailClient />;
}
