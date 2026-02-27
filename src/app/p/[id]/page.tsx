import ParentPortalWrapper from "./ParentPortalWrapper";

export default async function ParentPortalPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  return <ParentPortalWrapper institutionId={id} />;
}
