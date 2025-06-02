import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

// Helper function to format relative time
const getRelativeTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}mo ago`;
  }
  
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears}y ago`;
};

// Helper function to reformat comments
const reformatComments = (noteText: string) => {
  // Split the note into lines
  const lines = noteText.split('\n');
  
  // Process each line
  return lines.map(line => {
    // Check if this is a comment line (contains commented: and 📅)
    if (line.includes('commented:') && line.includes('📅')) {
      // Extract the comment and timestamp
      const commentMatch = line.match(/(.*?) commented: (.*?) 📅 (.*)/);
      if (commentMatch) {
        const [_, author, comment, timestamp] = commentMatch;
        // Get relative time
        const relativeTime = getRelativeTime(timestamp);
        // Return the reformatted comment
        return `${author} commented: ${comment} • ${relativeTime}`;
      }
    }
    // Return the line unchanged if it's not a comment
    return line;
  }).join('\n');
};

// This will store your credentials once you've added them
let credentials: any = null;
try {
  if (process.env.GOOGLE_SHEETS_CREDENTIALS) {
    credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS);
  } else if (process.env.GOOGLE_SHEETS_CREDENTIALS_BASE64) {
    // Alternative: decode from base64
    const decodedCredentials = Buffer.from(process.env.GOOGLE_SHEETS_CREDENTIALS_BASE64, 'base64').toString('utf-8');
    credentials = JSON.parse(decodedCredentials);
  } else {
    credentials = null;
  }
} catch (error) {
  console.error('Error parsing Google Sheets credentials:', error);
  console.log('Credentials string length:', process.env.GOOGLE_SHEETS_CREDENTIALS?.length || 0);
  console.log('First 100 chars:', process.env.GOOGLE_SHEETS_CREDENTIALS?.substring(0, 100) || 'N/A');
  credentials = null;
}

const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || '';

// Mock data for when credentials are not available
const mockNotes = [
  {
    Driver: "Kyle Larson",
    "Note Taker": "Scott Speed", 
    Note: "Great performance today, very smooth driving",
    Timestamp: new Date().toISOString(),
    Tags: "performance,smooth"
  },
  {
    Driver: "Alex Bowman",
    "Note Taker": "Josh Wise",
    Note: "Need to work on turn entry, but exit speed is excellent",
    Timestamp: new Date(Date.now() - 3600000).toISOString(),
    Tags: "technical,improvement"
  }
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // If no credentials, use mock data
  if (!credentials || !spreadsheetId) {
    console.warn('Google Sheets credentials not configured, using mock data');
    
    if (req.method === 'GET') {
      return res.status(200).json(mockNotes);
    }
    
    if (req.method === 'POST') {
      return res.status(200).json({ message: 'Note saved (mock mode)' });
    }
    
    if (req.method === 'PUT') {
      return res.status(200).json({ message: 'Comment added (mock mode)' });
    }
    
    return res.status(405).json({ message: 'Method not allowed' });
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
        range: 'Sheet1!A:F', // Updated to include Type column
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
          // If this is the Note column, reformat any comments
          if (header === 'Note' && row[index]) {
            obj[header] = reformatComments(row[index]);
          } else {
            obj[header] = row[index] || '';
          }
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
        new Date(note.timestamp).toLocaleString('en-US', {
          timeZone: 'America/New_York',
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          hour12: true
        }),
        note.type || 'Note', // Default to 'Note' if not specified
        note.tags ? note.tags.join(', ') : ''
      ]);
      
      // Append data to the spreadsheet
      const response = await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Sheet1!A:F', // Updated to include Type column
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values,
        },
      });

      return res.status(200).json({ 
        message: 'Notes saved to Google Sheets',
        updatedRows: response.data.updates?.updatedRows || 0
      });

    } else if (req.method === 'PUT') {
      // Update existing note with reply
      const { originalNote, replyText, replyAuthor } = req.body;
      
      if (!originalNote || !replyText || !replyAuthor) {
        return res.status(400).json({ message: 'Missing required fields for reply' });
      }

      // First, get all data to find the row to update
      const getResponse = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Sheet1!A:F', // Updated to include Type column
      });

      const rows = getResponse.data.values || [];
      if (rows.length === 0) {
        return res.status(404).json({ message: 'No data found' });
      }

      // Find the row that matches the original note
      const headers = rows[0];
      let rowIndex = -1;
      
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row[0] === originalNote.Driver && 
            row[1] === originalNote['Note Taker'] && 
            row[2] === originalNote.Note &&
            row[3] === originalNote.Timestamp) {
          rowIndex = i + 1; // +1 because sheets are 1-indexed
          break;
        }
      }

      if (rowIndex === -1) {
        return res.status(404).json({ message: 'Original note not found' });
      }

      // Append the reply to the existing note with relative time
      const now = new Date();
      const updatedNote = `${originalNote.Note}\n\n${replyAuthor} commented: ${replyText} • just now`;
      
      // Update the specific cell
      const updateResponse = await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `Sheet1!C${rowIndex}`, // Column C is the Note column
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[updatedNote]],
        },
      });

      return res.status(200).json({ 
        message: 'Reply added to original note',
        updatedCells: updateResponse.data.updatedCells || 0
      });

    } else if (req.method === 'DELETE') {
      // Delete a note
      const { note } = req.body;
      
      if (!note) {
        return res.status(400).json({ message: 'No note provided for deletion' });
      }

      // First, get all data to find the row to delete
      const getResponse = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Sheet1!A:F',
      });

      const rows = getResponse.data.values || [];
      if (rows.length === 0) {
        return res.status(404).json({ message: 'No data found' });
      }

      // Find the row that matches the note
      let rowIndex = -1;
      
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row[0] === note.Driver && 
            row[1] === note['Note Taker'] && 
            row[2] === note.Note &&
            row[3] === note.Timestamp) {
          rowIndex = i + 1; // +1 because sheets are 1-indexed
          break;
        }
      }

      if (rowIndex === -1) {
        return res.status(404).json({ message: 'Note not found' });
      }

      // Delete the row
      const deleteResponse = await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [{
            deleteDimension: {
              range: {
                sheetId: 0, // Assuming Sheet1 is the first sheet
                dimension: 'ROWS',
                startIndex: rowIndex - 1, // 0-based index
                endIndex: rowIndex // exclusive
              }
            }
          }]
        }
      });

      return res.status(200).json({ 
        message: 'Note deleted successfully',
        deletedRow: rowIndex
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