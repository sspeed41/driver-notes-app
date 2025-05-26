import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

// This will store your credentials once you've added them
const credentials = process.env.GOOGLE_SHEETS_CREDENTIALS 
  ? JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS) 
  : null;
const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!credentials || !spreadsheetId) {
    return res.status(500).json({ 
      message: 'Google Sheets credentials or spreadsheet ID not configured',
      setup: true
    });
  }

  try {
    // Auth with Google
    const auth = await google.auth.getClient({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    if (req.method === 'GET') {
      // Fetch data from Google Sheets
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Sheet1!A:E', // Adjust this if you want a different sheet or range
      });

      const rows = response.data.values || [];
      
      if (rows.length === 0) {
        return res.status(200).json([]);
      }

      // Convert rows to objects (assuming first row is headers)
      const headers = rows[0];
      const data = rows.slice(1).map(row => {
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header] = row[index] || '';
        });
        return obj;
      });

      return res.status(200).json(data);

    } else if (req.method === 'POST') {
      // Save data to Google Sheets
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

    } else {
      return res.status(405).json({ message: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Google Sheets API error:', error);
    return res.status(500).json({ 
      message: 'Error with Google Sheets API',
      error: error instanceof Error ? error.message : String(error)
    });
  }
} 