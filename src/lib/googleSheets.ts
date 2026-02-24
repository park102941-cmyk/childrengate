import { google } from 'googleapis';

export async function getGoogleSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}

export async function getSheetData(range: string) {
  const sheets = await getGoogleSheetsClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID,
    range,
  });
  return response.data.values;
}

export async function updateSheetData(range: string, values: unknown[][]) {
  const sheets = await getGoogleSheetsClient();
  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID,
    range,
    valueInputOption: 'RAW',
    requestBody: { values },
  });
}

export async function appendSheetData(range: string, values: unknown[][]) {
  const sheets = await getGoogleSheetsClient();
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID,
    range,
    valueInputOption: 'RAW',
    requestBody: { values },
  });
}
