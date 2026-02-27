import { NextResponse } from "next/server";

// export const runtime = 'edge';

// NOTE: This endpoint serves the admin student list.
export async function GET() {
  try {
    return NextResponse.json([]);
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("New student data received:", body);
    return NextResponse.json({ success: true, id: Date.now().toString() });
  } catch (error) {
    console.error("Error adding student:", error);
    return NextResponse.json(
      { error: "Failed to add student" },
      { status: 500 }
    );
  }
}
