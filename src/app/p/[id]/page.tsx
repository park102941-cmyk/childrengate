import ParentPortalWrapper from "./ParentPortalWrapper";

// Server Component as the entry point is more robust for dynamic routes on the Edge
export default async function ParentPortalPage(props: { params: Promise<{ id: string }> }) {
  // Await params to get the ID safely on the server
  const params = await props.params;
  const { id } = params;
  
  // Pass the ID to the client-only wrapper
  return <ParentPortalWrapper institutionId={id} />;
}
