// Mock implementation for Edge compatibility
// To use real Google Sheets on Edge, use the REST API with fetch instead of 'googleapis'

export async function getGoogleSheetsClient() {
  console.log('Google Sheets Client (Mocked for Edge)');
  return null;
}

export async function getSheetData(range: string) {
  console.log('Get Sheet Data (Mocked):', range);
  return [];
}

export async function updateSheetData(range: string, values: unknown[][]) {
  console.log('Update Sheet Data (Mocked):', range, values);
}

export async function appendSheetData(range: string, values: unknown[][]) {
  console.log('Append Sheet Data (Mocked):', range, values);
}
