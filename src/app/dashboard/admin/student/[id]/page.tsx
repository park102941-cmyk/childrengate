import StudentDetailClient from "./StudentDetailClient";

export default async function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await params;
  return <StudentDetailClient />;
}
