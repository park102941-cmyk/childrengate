import { NextResponse } from "next/server";

// export const runtime = 'edge';

// This endpoint receives sync events from parent and teacher dashboards
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("[Sync Report]", body.type, body);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error syncing report:", error);
    return NextResponse.json(
      { error: "Failed to sync report" },
      { status: 500 }
    );
  }
}
