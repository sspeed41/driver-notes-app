import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(`📡 Supabase API called: ${req.method} ${req.url}`);

  try {
    if (req.method === 'GET') {
      // Fetch all notes with their relationships
      const { data: notes, error } = await supabaseAdmin
        .from('notes')
        .select(`
          *,
          drivers(name),
          note_takers(name),
          comments(
            id,
            comment,
            created_at,
            note_takers(name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching notes:', error);
        return res.status(500).json({ error: 'Failed to fetch notes' });
      }

      // Transform data to match the Google Sheets format that the frontend expects
      const transformedNotes = notes?.map(note => ({
        Driver: note.drivers?.name || '',
        'Note Taker': note.note_takers?.name || '',
        Note: note.note || '',
        Timestamp: note.created_at,
        Type: note.type || 'Note',
        Tags: note.tags?.join(',') || '',
        // Include comment count for UI purposes
        _commentCount: note.comments?.length || 0,
        _originalId: note.id
      })) || [];

      console.log(`✅ Fetched ${transformedNotes.length} notes from Supabase`);
      return res.status(200).json(transformedNotes);

    } else if (req.method === 'POST') {
      // Create new note
      const { notes: notesToSave } = req.body;
      
      if (!notesToSave || !Array.isArray(notesToSave)) {
        return res.status(400).json({ error: 'Invalid notes data' });
      }

      const results = [];

      for (const noteData of notesToSave) {
        // Find driver and note taker
        const { data: drivers } = await supabaseAdmin
          .from('drivers')
          .select('id, name')
          .eq('name', noteData.driver)
          .single();

        const { data: noteTakers } = await supabaseAdmin
          .from('note_takers')
          .select('id, name')
          .eq('name', noteData.noteTaker)
          .single();

        if (!drivers || !noteTakers) {
          console.error('❌ Driver or note taker not found:', noteData.driver, noteData.noteTaker);
          continue;
        }

                 // Parse tags
         const tags = Array.isArray(noteData.tags) ? noteData.tags : 
                      typeof noteData.tags === 'string' ? noteData.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [];

        // Insert note
        const { data: newNote, error } = await supabaseAdmin
          .from('notes')
          .insert({
            driver_id: drivers.id,
            note_taker_id: noteTakers.id,
            note: noteData.note,
            type: noteData.type || 'Note',
            tags,
            created_at: noteData.timestamp || new Date().toISOString()
          })
          .select()
          .single();

        if (error) {
          console.error('❌ Error saving note:', error);
          return res.status(500).json({ error: 'Failed to save note' });
        }

        results.push(newNote);
      }

      console.log(`✅ Saved ${results.length} notes to Supabase`);
      return res.status(200).json({ message: 'Notes saved successfully', count: results.length });

    } else if (req.method === 'PUT') {
      // Add comment to existing note
      const { originalNote, replyText, replyAuthor } = req.body;

      if (!originalNote || !replyText || !replyAuthor) {
        return res.status(400).json({ error: 'Missing required fields for comment' });
      }

      // Find the note by matching driver, note taker, and approximate timestamp
      const { data: notes } = await supabaseAdmin
        .from('notes')
        .select(`
          *,
          drivers(name),
          note_takers(name)
        `)
        .eq('drivers.name', originalNote.Driver);

      // Find the most likely matching note
      const matchingNote = notes?.find(note => 
        note.drivers?.name === originalNote.Driver &&
        note.note_takers?.name === originalNote['Note Taker'] &&
        note.note === originalNote.Note
      );

      if (!matchingNote) {
        return res.status(404).json({ error: 'Original note not found' });
      }

      // Find the comment author
      const { data: commentAuthor } = await supabaseAdmin
        .from('note_takers')
        .select('id, name')
        .eq('name', replyAuthor)
        .single();

      if (!commentAuthor) {
        return res.status(404).json({ error: 'Comment author not found' });
      }

      // Add comment
      const { error } = await supabaseAdmin
        .from('comments')
        .insert({
          note_id: matchingNote.id,
          author_id: commentAuthor.id,
          comment: replyText,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('❌ Error adding comment:', error);
        return res.status(500).json({ error: 'Failed to add comment' });
      }

      console.log('✅ Comment added successfully');
      return res.status(200).json({ message: 'Comment added successfully' });

    } else if (req.method === 'DELETE') {
      // Delete note (placeholder for future implementation)
      return res.status(405).json({ message: 'Delete functionality not implemented yet' });
    } else {
      return res.status(405).json({ message: 'Method not allowed' });
    }

  } catch (error) {
    console.error('💥 Supabase API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 