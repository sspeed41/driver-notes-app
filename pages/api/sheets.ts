import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

// This will store your credentials once you've added them
const credentials = process.env.GOOGLE_SHEETS_CREDENTIALS 
  ? JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS) 
  : null;
const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (!credentials || !spreadsheetId) {
    return res.status(500).json({ 
      message: 'Google Sheets credentials or spreadsheet ID not configured',
      setup: true
    });
  }

  try {
    const { notes } = req.body;
    
    if (!notes || !Array.isArray(notes) || notes.length === 0) {
      return res.status(400).json({ message: 'No valid notes provided' });
    }

    // Format data for Sheets
    const values = notes.map(note => [
      note.driver,
      note.noteTaker,
      note.note,
      new Date(note.timestamp).toLocaleString(),
      note.tags ? note.tags.join(', ') : ''
    ]);

    // Auth with Google and append data
    const auth = await google.auth.getClient({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    // Append data to the spreadsheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:E', // Adjust this if you want a different sheet or range
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    return res.status(200).json({ 
      message: 'Notes saved to Google Sheets',
      updatedRows: response.data.updates?.updatedRows || 0
    });
  } catch (error) {
    console.error('Google Sheets API error:', error);
    return res.status(500).json({ 
      message: 'Error saving to Google Sheets',
      error: error instanceof Error ? error.message : String(error)
    });
  }
} 