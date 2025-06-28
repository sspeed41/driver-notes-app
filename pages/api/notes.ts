import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

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
  const lines = noteText.split('\n');
  
  return lines.map(line => {
    if (line.includes('commented:')) {
      let commentMatch = null;
      
      // Pattern 1: 💬 Author commented: Comment 📅 timestamp
      commentMatch = line.match(/💬 (.*?) commented: (.*?) 📅 (.*)/);
      if (commentMatch) {
        const [_, author, comment, timestamp] = commentMatch;
        const relativeTime = getRelativeTime(timestamp);
        return `${author} commented: ${comment} • ${relativeTime}`;
      }
      
      // Pattern 2: 💬 Author commented: Comment • timestamp
      commentMatch = line.match(/💬 (.*?) commented: (.*?) • (.*)/);
      if (commentMatch) {
        const [_, author, comment, timestamp] = commentMatch;
        if (timestamp.includes('ago') || timestamp === 'just now') {
          return `${author} commented: ${comment} • ${timestamp}`;
        } else {
          const relativeTime = getRelativeTime(timestamp);
          return `${author} commented: ${comment} • ${relativeTime}`;
        }
      }
      
      // Pattern 3: Author commented: Comment 📅 timestamp
      commentMatch = line.match(/(.*?) commented: (.*?) 📅 (.*)/);
      if (commentMatch) {
        const [_, author, comment, timestamp] = commentMatch;
        const relativeTime = getRelativeTime(timestamp);
        return `${author} commented: ${comment} • ${relativeTime}`;
      }
      
      // Pattern 4: Author commented: Comment • timestamp
      commentMatch = line.match(/(.*?) commented: (.*?) • (.*)/);
      if (commentMatch) {
        const [_, author, comment, timestamp] = commentMatch;
        if (timestamp.includes('ago') || timestamp === 'just now') {
          return line;
        } else {
          const relativeTime = getRelativeTime(timestamp);
          return `${author} commented: ${comment} • ${relativeTime}`;
        }
      }
    }
    
    return line;
  }).join('\n');
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      // Fetch all notes from Supabase
      const { data: notes, error } = await supabase
        .from('driver_notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notes:', error);
        return res.status(500).json({ error: 'Failed to fetch notes' });
      }

      // Transform data to match the expected format
      const transformedNotes = notes?.map(note => ({
        Driver: note.driver,
        'Note Taker': note.note_taker,
        Note: reformatComments(note.note),
        Timestamp: note.created_at,
        Type: note.type || 'Note',
        Tags: note.tags || ''
      })) || [];

      return res.status(200).json(transformedNotes);
    }

    if (req.method === 'POST') {
      const { driver, noteTaker, note, timestamp, type, tags } = req.body;

      if (!driver || !noteTaker || !note || !timestamp) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Insert new note into Supabase
      const { data, error } = await supabase
        .from('driver_notes')
        .insert({
          driver,
          note_taker: noteTaker,
          note,
          timestamp,
          type: type || 'Note',
          tags: tags || null
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating note:', error);
        return res.status(500).json({ error: 'Failed to create note' });
      }

      return res.status(201).json({ 
        message: 'Note created successfully',
        note: data
      });
    }

    if (req.method === 'PUT') {
      // Handle comment updates
      const { noteId, updatedNote } = req.body;

      if (!noteId || !updatedNote) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Update note in Supabase
      const { error } = await supabase
        .from('driver_notes')
        .update({ 
          note: updatedNote,
          timestamp: new Date().toLocaleString() // Update timestamp when adding comments
        })
        .eq('id', noteId);

      if (error) {
        console.error('Error updating note:', error);
        return res.status(500).json({ error: 'Failed to update note' });
      }

      return res.status(200).json({ message: 'Note updated successfully' });
    }

    if (req.method === 'DELETE') {
      const { noteId } = req.body;

      if (!noteId) {
        return res.status(400).json({ error: 'Missing note ID' });
      }

      // Delete note from Supabase
      const { error } = await supabase
        .from('driver_notes')
        .delete()
        .eq('id', noteId);

      if (error) {
        console.error('Error deleting note:', error);
        return res.status(500).json({ error: 'Failed to delete note' });
      }

      return res.status(200).json({ message: 'Note deleted successfully' });
    }

    return res.status(405).json({ message: 'Method not allowed' });

  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 