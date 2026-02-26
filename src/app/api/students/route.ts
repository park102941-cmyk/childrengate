import { NextResponse } from "next/server";

export const runtime = 'edge';


// NOTE: This endpoint serves the admin student list.
// Currently returns an empty array (students are managed client-side via Firestore realtime).
// To populate with real data, integrate Firebase Admin SDK here.
export async function GET() {
  try {
    // TODO: Fetch from Firestore using Firebase Admin SDK
    // For now, return empty array to prevent 404 error
    // The admin dashboard will show "No students found" until students are added via the UI
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
    // TODO: Add student to Firestore using Firebase Admin SDK
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
