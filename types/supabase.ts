// Supabase Database Types
export interface Driver {
  id: string;
  name: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface NoteTaker {
  id: string;
  name: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AthleteProfile {
  id: string;
  driver_id: string;
  age?: number;
  gym_time?: string;
  crew_chief?: string;
  spotter?: string;
  phone?: string;
  email?: string;
  birthday?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  driver?: Driver;
}

export interface Note {
  id: string;
  driver_id: string;
  note_taker_id: string;
  note: string;
  type: 'Note' | 'Focus';
  tags?: string[];
  created_at: string;
  updated_at: string;
  // Joined data
  driver?: Driver;
  note_taker?: NoteTaker;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  note_id: string;
  author_id: string;
  comment: string;
  created_at: string;
  // Joined data
  note?: Note;
  author?: NoteTaker;
}

export interface Reminder {
  id: string;
  note_id: string;
  created_by: string;
  reminder_message: string;
  reminder_datetime: string;
  is_completed: boolean;
  is_dismissed: boolean;
  created_at: string;
  // Joined data
  note?: Note;
  creator?: NoteTaker;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Legacy compatibility - map to new format
export interface DriverNote {
  Driver: string;
  'Note Taker': string;
  Note: string;
  Timestamp: string;
  Type?: 'Note' | 'Focus';
  Tags?: string;
}

// Conversion helpers
export const convertNoteToLegacyFormat = (note: Note): DriverNote => ({
  Driver: note.driver?.name || '',
  'Note Taker': note.note_taker?.name || '',
  Note: note.note,
  Timestamp: note.created_at,
  Type: note.type,
  Tags: note.tags?.join(', ') || ''
});

export const convertLegacyToNote = (legacy: DriverNote, driverId: string, noteTakerId: string): Partial<Note> => ({
  driver_id: driverId,
  note_taker_id: noteTakerId,
  note: legacy.Note,
  type: legacy.Type || 'Note',
  tags: legacy.Tags ? legacy.Tags.split(',').map(tag => tag.trim()) : [],
  created_at: legacy.Timestamp
}); 