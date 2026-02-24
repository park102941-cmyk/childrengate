export const runtime = "edge";



import { NextResponse } from 'next/server';
import { appendSheetData } from '@/lib/googleSheets';
import { format } from 'date-fns';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { 
      type, // 'REQUEST' or 'PICKUP'
      studentName, 
      className, 
      parentName, 
      timestamp,
      status 
    } = data;

    // Prepare row for Google Sheets (Reporting)
    // Format: Timestamp | Type | Student | Class | Parent | Status
    const row = [
      format(new Date(timestamp), 'yyyy-MM-dd HH:mm:ss'),
      type,
      studentName,
      className,
      parentName,
      status
    ];

    // Append to 'Log' sheet or default sheet
    // Assumes the sheet has columns defined
    await appendSheetData('Sheet1!A:F', [row]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Sheet Sync Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to sync to reporting sheet' }, { status: 500 });
  }
}
