import StudentDetailClient from "./StudentDetailClient";

export default async function StudentDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  
  // Directly mounting the client component is fine because StudentDetailClient is already a "use client" component
  // but if we want to be extra safe, we could use a wrapper with dynamic ssr: false.
  // For now, let's keep it simple and correct for Next 15.
  return <StudentDetailClient />;
}
