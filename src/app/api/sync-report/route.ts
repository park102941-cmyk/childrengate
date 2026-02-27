// Basic API for Edge compatibility
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("[Sync Report]", body.type, body);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Error syncing report:", error);
    return new Response(JSON.stringify({ error: "Failed to sync report" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
