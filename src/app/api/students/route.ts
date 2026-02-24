export const runtime = "edge";



import { NextResponse } from 'next/server';
import { getSheetData, appendSheetData } from '@/lib/googleSheets';

export async function GET() {
  try {
    // In a real scenario, we'd fetch from a specific sheet range
    // const data = await getSheetData('Students!A2:E100');
    
    // Mock data for demonstration
    const mockStudents = [
      { id: '1', name: '홍길동', class: '기쁨반', parent: '홍민수', contact: '010-1234-5678' },
      { id: '2', name: '김지현', class: '사랑반', parent: '김영희', contact: '010-2345-6789' },
      { id: '3', name: '이준호', class: '기쁨반', parent: '이철수', contact: '010-3456-7890' },
    ];
    
    return NextResponse.json(mockStudents);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const student = await req.json();
    
    // In a real scenario:
    // await appendSheetData('Students!A:E', [[student.id, student.name, student.class, student.parent, student.contact]]);
    
    console.log('Appended to Google Sheets:', student);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add student' }, { status: 500 });
  }
}
