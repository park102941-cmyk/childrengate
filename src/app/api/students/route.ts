// Minimal API for Cloudflare compatibility
export const runtime = 'edge';

export async function GET() {
  const data = JSON.stringify([]);
  return new Response(data, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store'
    }
  });
}
