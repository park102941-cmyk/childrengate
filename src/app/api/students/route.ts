// Basic API for Edge compatibility
export async function GET() {
  return new Response(JSON.stringify([]), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("New student data received:", body);
    return new Response(JSON.stringify({ success: true, id: Date.now().toString() }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Error adding student:", error);
    return new Response(JSON.stringify({ error: "Failed to add student" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
